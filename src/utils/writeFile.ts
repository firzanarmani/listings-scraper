import fs from "fs";

// Ensure that 'data' is stringified beforehand
const writeJSONToFile = (data: string, fileName: string) => {
  fs.writeFile(`./${fileName}.json`, data, (err) => {
    if (err) {
      console.log("Error when writing file - ", err);
    } else {
      console.log("Successfully written file");
    }
  });
};

export const JsonifyToFile = (data: any, fileName: string) => {
  writeJSONToFile(JSON.stringify(data, null, 2), fileName);
};
