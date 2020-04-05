const translate = require("@vitalets/google-translate-api");
const path = require("path");
const fs = require("fs");

// prettier-ignore
// let languageCodes = ["af","sq","am","ar","hy","az","eu","be","bn","bs","bg","ca","ceb","zh-CN","zh-TW","co","hr","cs","da","nl","en","eo","et","fi","fr","fy","gl","ka","de","el","gu","ht","ha","haw","he","hi","hmn","hu","is","ig","id","ga","it","ja","jv","kn","kk","km","ko","ku","ky","lo","la","lv","lt","lb","mk","mg","ms","ml","mt","mi","mr","mn","my","ne","no","ny","ps","fa","pl","pt","pa","ro","ru","sm","gd","sr","st","sn","sd","si","sk","sl","so","es","su","sw","sv","tl","tg","ta","te","th","tr","uk","ur","uz","vi","cy","xh","yi","yo","zu"];
let languageCodes = ["ro"]
let pathToTranslationFile = "./src/translations/template.json";
let extName = "Word counter";
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

    languageCodes.forEach((languageCode) => {
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

function parseAllFiles(files, translationObj) {
    files.forEach((element) => {
        let tempObj = parseFile(element);
        if (Object.entries(tempObj).length !== 0) {
            copyProperties(translationObj, tempObj);
        }
    });
}

function createTranslateFile(languageCode) {
    makeDirIfNotExist(`./src/_locales/`);
    makeDirIfNotExist(`./src/_locales/${languageCode}`);
    // fs.copyFileSync(pathToTranslationFile, `./src/_locale/${languageCode}/translations.json`);
    let translationFile = fs.readFileSync(pathToTranslationFile);
    let translation = JSON.parse(translationFile);

    let promiseArray = [];
    promiseArray.push(translateText(translation, "extName", extName, languageCode));
    promiseArray.push(translateText(translation, "extDescription", extDescription, languageCode));
    promiseArray.push(...updateTranslations(translation, languageCode));
    Promise.all(promiseArray).then(() => {
        writeObjectToJson(`./src/_locales/${languageCode}/messages.json`, translation, "w");
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

async function translateText(obj, element, text, languageCode) {
    let textToTranslate = camelCaseToText(text.replace("_", ""));
    obj[element] = (await translate(textToTranslate, { to: languageCode, client: "webapp" })).text;
    obj[element] = convertToMessageString(capitalizeFirstLetter(obj[element]));
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
