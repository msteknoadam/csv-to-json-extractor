# CSV to JSON Extractor

This script basically lets you extract specific column from a CSV file to a JSON array file where every row is a seperate element in the main array inside the JSON file.

## Installation

You will need npm and yarn installed on your PC first for this script to run. After you install them, run the following commands in the directory where script is located in to prepare the environment required for the script to run.

    npm i -g typescript
    yarn

## Usage

Simply run the following command inside the script directory. (Replace "\" at the end of each line with "^" when using CMD or with "`" when using PowerShell)

    npx cross-env \
        CSV=<relative path to CSV file> \
        COLUMN=<name of the column to extract> \
        SEPERATOR=<optional: used CSV seperator, defaults to comma ','> \
        IS_JSON=<optional: determines whether the column should be parsed by JSON parser or not. only enter "true" or "false", defaults to "false"> \
        npx ts-node ./run.ts
