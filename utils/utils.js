const fs = require("fs");
const parse = require("csv-parser");
const csvData = [];

const csvReader = () => {
  fs.createReadStream("D:/Lrnjs/projects/assignment/current.csv")
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      csvData.push(csvrow);
    })
    .on("end", function () {
      let totalNoOfRecords = csvData.length;
      let insertQuery =
        "INSERT INTO movies (Title ,Year ,Dir , Link, audio, Num_ber,Sektor ,Märkus) VALUES ";

      //   for (let i = 0; i < n; i++) {
      //     str +=
      //       `('${"" + csvData[i].Title}','${"" + csvData[i].Yr}','${
      //         "" + csvData[i].Dir
      //       }','${"" + csvData[i].Link}','${
      //         "" + csvData[i]["audio"]
      //       }','${ csvData[i].Number}','${"" + csvData[i].Sektor}','${"" + csvData[i]["Märkus"]}')` + ",";
      //   }

      for (const movie of csvData) {
        insertQuery +=
          `('${"" + movie.Title}','${"" + movie.Yr}','${"" + movie.Dir}','${
            "" + movie.Link
          }','${"" + movie["audio"]}','${movie.Number}','${
            "" + movie.Sektor
          }','${"" + movie["Märkus"]}')` + ",";
      }
    });
};

csvReader();
module.exports = csvReader;
