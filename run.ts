import * as path from "path";
import * as fs from "fs";
import csv from "csv-parser";

/** Relative path to the CSV file to load */
const csvRelativePath = process.env.CSV;
/** Name of the column to extract rows as elements inside a JSON array */
const columnName = process.env.COLUMN;
/** OPTIONAL: Optional parameter to specify the seperator used in the CSV file if it is something other than comma (",") */
const csvSeperator = process.env.SEPERATOR || ",";
/** OPTIONAL: Optional parameter that determines whether the column should be parsed by JSON parser or not. */
const shouldBeJSONParsed = JSON.parse(process.env.IS_JSON || "false");

const usageText =
	"Usage: npx cross-env CSV=<relative path to CSV file> COLUMN=<name of the column to extract> SEPERATOR=<optional: used CSV seperator, defaults to comma ','> npx ts-node ./run.ts";
if (!csvRelativePath) {
	throw Error(`CSV Relative path is not defined. ${usageText}`);
}
if (!columnName) {
	throw Error(`Column name that contains the JSON data to be extracted is not defined. ${usageText}`);
}
if (typeof shouldBeJSONParsed !== "boolean") {
	throw Error(`Unknown IS_JSON value: ${shouldBeJSONParsed}\nShould be either true or false only.`);
}

const csvPath = path.join(__dirname, csvRelativePath);
if (!fs.existsSync(csvPath)) {
	throw Error(`Couldn't find CSV file at specified path: ${csvPath}`);
}

const rows: unknown[] = [];
const resultFile = new Date().getTime().toString() + ".json";
fs.createReadStream(csvPath)
	.pipe(csv({ separator: csvSeperator }))
	.on("data", (row: Record<string, unknown>) => {
		try {
			if (columnName in row) {
				if (shouldBeJSONParsed) rows.push(JSON.parse(row[columnName] as string));
				else rows.push(row[columnName]);
			}
		} catch (e) {
			console.error(e);
			console.error("Errored row: ", row);
		}
	})
	.on("end", () => {
		console.log(`Successfully read ${rows.length} rows. Now saving the result to '${resultFile}'`);
		try {
			fs.writeFileSync(path.join(__dirname, `${resultFile}`), JSON.stringify(rows, null, 4));
			console.log(`Successfully saved the result to '${resultFile}'`);
			process.exit(0);
		} catch (e) {
			console.error(`Couldn't save results to '${resultFile}', error ->`, e);
			process.exit(-1);
		}
	});
