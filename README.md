# Count me up

Count me up is a cross-browser compatible extension, which aims to provide an intuitive and clean interface for word and character counting.

# Features:

-   Quick view on right click
-   Auto update on text selection
-   Multiple types of view: in side menu, in popup or in the extension
-   Dark theme
-   Supports 52 languages(all available languages)

# Instructions

## For quick view:

Select text -> right click

## To open one of the views:

Click the extension icon or select text -> right click -> click on the extensions entry

## To close the side menus:

Click the X in the corner or press the middle click (the wheel) on the web-page

# Available for

Chromium based browsers(Chrome, Edge, Vivaldi, Brave, etc):

-   https://chrome.google.com/webstore/detail/count-me-up-word-and-char/gniejkbdlpcgfmgmfbnldfjmijmklacl
-   https://chrome.google.com/webstore/detail/count-me-up-lite-word-and/pdefblacohipeefbmebhalgjickekjnp

Firefox:

-   https://addons.mozilla.org/en-US/firefox/addon/count-me-up-word-counter/
-   https://addons.mozilla.org/en-US/firefox/addon/count-me-up-lite-word-counter/

Opera:

-   https://addons.opera.com/en/extensions/details/count-me-up-word-and-character-counter/
-   https://addons.opera.com/en/extensions/details/count-me-up-lite-word-and-character-counter/

# Important

Most of the translations are automated.
For any wrong translation, any bugs found or feature request please send me an email or open a ticket on Github.
You can find them in the "More information" section.
Extension implemented with Vanilla JS powered by Typescript.

# Developer features

For anyone that desires to use this repository as an example it features the following:

-   A translation extractor for HTML and Typescript/Javascript files and translation generator based on the extracted sequences with google's api.
-   A fully set-up webpack environment with typescript transpilation, css generation and shrinking.
-   Web extension locales
-   Cross browser compatibility
-   Small size (40kb) sources - the translations weight more than the extension.
-   Programmatic approach to updating sources, strings, etc
-   Message passing between multiple components and abstractions to make it more readable
-   Taking advantage of const enums to replace various hard-coded strings
-   Dark theme
-   Multiple view and multiple view selection - on context menu click the user can view the extension in - side-view, new window or in the extension pop-up
-   User menu - and settings save

# Setup and build instructions

## Requirements

-   NodeJs
-   A compatible browser - Chrome, Firefox, Opera, Brave, Edge, Vivaldi, etc
-   A text editor

## Setup

-   Run `npm install` in the root folder which contains `package.json`

## Build

-   For the full version:
    -   `npm run build` or `npm run watch`
-   For the lite version:
    -   `npm run build-lite` or `npm run watch-lite`

## Extras

To extract the translations you need to input your google api key and project id in the `translate.js` and then run `npm extract` or `npm extract-lite`. This command will automatically find all the translatable strings in the .ts files and convert them from camel case to human text and translate them. It will also generate the translation files. The recognition pattern for translatable strings is `"_`.

For example `"_wordCounter"`
