"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function ReadJson(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err)
            cb(err);
        else
            cb(null, JSON.parse(data.toString()));
    });
}
exports.ReadJson = ReadJson;
function ReadCsv(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err)
            cb(err);
        else
            cb(null, processCsv(data.toString()));
    });
    function processCsv(allText) {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];
        for (var i = 1; i < allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {
                var tarr = [];
                for (var j = 0; j < headers.length; j++) {
                    tarr.push(headers[j] + ":" + data[j]);
                }
                lines.push(tarr);
            }
        }
        return lines;
    }
}
exports.ReadCsv = ReadCsv;
//# sourceMappingURL=helpers.js.map