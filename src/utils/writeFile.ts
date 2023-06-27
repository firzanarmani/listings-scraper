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

export default writeJSONToFile;
