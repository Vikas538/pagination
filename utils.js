var fs = require("fs");
var parse = require("csv-parser");

var csvData = [],
  str;

var csvReader = () => {
  fs.createReadStream("D:/Lrnjs/projects/assignment/current.csv")
    .pipe(parse({ delimiter: ":" }))
    .on("data", function (csvrow) {
      csvData.push(csvrow);
    })
    .on("end", function () {
      let n = csvData.length;
      console.log(n);
      console.log(csvData[0]);
      str =
        "INSERT INTO movies (Title ,Year ,Dir , Link, audio, Num_ber,Sektor ,Märkus) VALUES ";

      for (let i = 0; i < n; i++) {
        str +=
          `('${"" + csvData[i].Title}','${"" + csvData[i].Yr}','${
            "" + csvData[i].Dir
          }','${"" + csvData[i].Link}','${
            "" + csvData[i]["audio"]
          }','${ csvData[i].Number}','${"" + csvData[i].Sektor}','${"" + csvData[i]["Märkus"]}')` + ",";
      }
      console.log(str);
    });
};

csvReader();
module.exports = csvReader;
