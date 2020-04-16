const GOOGLE_APPLICATION_CREDENTIALS = "[PATH to key downloaded]";
const projectId = "YOUR_PROJECT_ID";

const { Translate } = require("@google-cloud/translate").v2;
const translate = new Translate({ projectId });

const path = require("path");
const fs = require("fs");

// prettier-ignore
let automaticLanguageCodes = ["ar","am","bg","bn","ca","cs","da",,"el","es","et","fa","fi","fr","gu","he","hi","hr","hu","id","it","ja","kn","ko","lt","lv","ml","mr","ms","nl","no","pl","pt","ro","ru","sk","sl","sr","sv","sw","ta","te","th","tr","uk","vi","zh-CN","zh-TW"];

let manualLanguageCodes = ["ro", "en", "de", "pt_BR", "pt_PT"];
let pathToTranslationFile = "./src/translations/template.json";
let extName = "Word and character counter";
let fixedExtName = "Count me up - ";
let extDescription = "Word and character counter";

Array.prototype.last = function () {
    return this[this.length - 1];
};
main();

function main() {
    let files = getAllFiles("./src", [], ["html", "ts", "js"]);
    cleanTranslationTemplate();
    createTranslationTemplateFolder();

    translationObj = {};

    parseAllFiles(files, translationObj);
    writeObjectToJson(pathToTranslationFile, translationObj);

    manualLanguageCodes.forEach((languageCode) => {
        mergeTranslateTemplateWithTranslationFile(languageCode);
    });

    automaticLanguageCodes.forEach((languageCode) => {
        createTranslateFile(languageCode);
    });
}

function getAllFiles(source, filter = [], include = []) {
    let filesFound = [];
    var files = [];

    if (fs.lstatSync(source).isDirectory()) {
        files = fs.readdirSync(source);
        files.forEach(function (file) {
            var curSource = path.join(source, file);
            if (fs.lstatSync(curSource).isDirectory()) {
                filesFound.push(...getAllFiles(curSource, filter, include));
            } else {
                const extension = curSource.split(".").last();
                if (!!include) {
                    if (include.includes(extension)) {
                        filesFound.push(curSource);
                    }
                } else {
                    if (!filter.includes(extension)) {
                        filesFound.push(curSource);
                    }
                }
            }
        });
    }
    return filesFound;
}

function parseAllFiles(files, translationObj) {
    files.forEach((element) => {
        let tempObj = parseFile(element);
        if (Object.entries(tempObj).length !== 0) {
            copyProperties(translationObj, tempObj);
        }
    });
}

function parseFile(filePath) {
    const extension = filePath.split(".").last();
    const obj = {};
    lines = fs.readFileSync(filePath, "utf8");

    // if (extension === "html") {
    //     matches = lines.match(/(\b_\S+\b)/gi);
    //     if (!!matches) {
    //         matches.forEach((match) => {
    //             if (!!match) {
    //                 let namespace = match.split(".");
    //                 propertiesToObject(namespace, obj);
    //             }
    //         });
    //     }
    // }
    if (extension === "ts" || extension === "js") {
        matches = lines.match(/(\B\"_(.*?)\"\B)/gi);
        if (!!matches) {
            matches.forEach((match) => {
                if (!!match) {
                    let namespace = match.split('"').join("").split(".");
                    propertiesToObject(namespace, obj);
                }
            });
        }
    }
    return obj;
}

function propertiesToObject(namespace, obj) {
    if (namespace.length === 1) {
        obj[namespace] = "";
    } else {
        let temp = namespace.splice(0, 1)[0];
        if (!obj[temp]) {
            obj[temp] = {};
        }
        propertiesToObject(namespace, obj[temp]);
    }
}

function mergeTranslateTemplateWithTranslationFile(languageCode) {
    makeDirIfNotExist(`./src/_locales/`);
    makeDirIfNotExist(`./src/_locales/${languageCode}`);
    const localeFile = `./src/_locales/${languageCode}/messages.json`;

    let templateTranslationFile = fs.readFileSync(pathToTranslationFile);
    let templateTranslation = JSON.parse(templateTranslationFile);

    if (!fs.existsSync(localeFile)) {
        writeObjectToJson(localeFile, templateTranslation, "w");
    } else {
        let translation = JSON.parse(fs.readFileSync(localeFile));

        copyPropertiesUpdateTranslation(templateTranslation, translation);
        writeObjectToJson(localeFile, templateTranslation, "w");
    }
}

function createTranslateFile(languageCode) {
    makeDirIfNotExist(`./src/_locales/`);
    makeDirIfNotExist(`./src/_locales/${languageCode.replace("-", "_")}`);
    // fs.copyFileSync(pathToTranslationFile, `./src/_locale/${languageCode}/translations.json`);
    let templateTranslationFile = fs.readFileSync(pathToTranslationFile);
    let templateTranslation = JSON.parse(templateTranslationFile);

    let promiseArray = [];
    promiseArray.push(
        translateText(templateTranslation, "extName", extName, languageCode, fixedExtName)
    );
    promiseArray.push(
        translateText(templateTranslation, "extDescription", extDescription, languageCode)
    );
    promiseArray.push(...updateTranslations(templateTranslation, languageCode));
    Promise.all(promiseArray).then(() => {
        writeObjectToJson(
            `./src/_locales/${languageCode.replace("-", "_")}/messages.json`,
            templateTranslation,
            "w"
        );
    });
}

function updateTranslations(obj1, languageCode) {
    let promisesArray = [];
    Object.getOwnPropertyNames(obj1).forEach((element) => {
        if (Object.entries(obj1[element]).length !== 0) {
            promisesArray.push(...updateTranslations(obj1[element], languageCode));
        } else {
            promisesArray.push(translateText(obj1, element, element, languageCode));
        }
    });
    return promisesArray;
}

async function translateText(obj, element, text, languageCode, fixedText = "") {
    let textToTranslate = camelCaseToText(text.replace("_", ""));
    let [translation] = await translate.translate(textToTranslate, languageCode);
    translation = translation.trim();
    if (fixedText !== "") translation = fixedText + translation;
    obj[element] = convertToMessageString(capitalizeFirstLetter(translation.trim()));
}

function camelCaseToText(str) {
    var result = str.replace(/([A-Z])/g, " $1");
    return capitalizeFirstLetter(result);
}

function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function convertToMessageString(str) {
    return { message: str };
}

function writeObjectToJson(path, obj, flag = "a") {
    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, "", { encoding: "utf-8", flag: "wx" });
    }
    fs.writeFileSync(path, JSON.stringify(obj, null, 2), { encoding: "utf-8", flag });
}

function cleanTranslationTemplate() {
    deleteFolderRecursive("./src/translations");
}
function createTranslationTemplateFolder() {
    fs.mkdirSync("./src/translations");
}

function copyProperties(obj1, obj2) {
    Object.getOwnPropertyNames(obj2).forEach((element) => {
        if (!!obj1[element]) {
            copyProperties(obj1[element], obj2[element]);
        } else {
            obj1[element] = obj2[element];
        }
    });
}

function copyPropertiesUpdateTranslation(obj1, obj2) {
    Object.getOwnPropertyNames(obj2).forEach((element) => {
        if (obj1[element] === "" || element === "extName" || element === "extDescription") {
            obj1[element] = obj2[element];
        }
    });
    Object.getOwnPropertyNames(obj1).forEach((element) => {
        if (obj1[element] === "") {
            obj1[element] = {
                message: "",
            };
        }
    });
}

function makeDirIfNotExist(path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
}

function deleteFolderRecursive(target) {
    if (target != "" && target != "./") {
        if (fs.existsSync(target)) {
            fs.readdirSync(target).forEach(function (file, index) {
                var curPath = target + "/" + file;
                if (fs.lstatSync(curPath).isDirectory()) {
                    // recurse
                    deleteFolderRecursive(curPath);
                } else {
                    // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(target);
        }
    }
}
