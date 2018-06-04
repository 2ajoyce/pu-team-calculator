import fs = require('fs');

export function ReadJson(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err)
            cb(err)
        else
            cb(null, JSON.parse(data.toString()))
    });
}

export function ReadCsv(path, cb) {
    fs.readFile(path, (err, data) => {
        if (err)
            cb(err)
        else
            cb(null, processCsv(data.toString()))
    });

    function processCsv(allText): Array<string> {
        var allTextLines = allText.split(/\r\n|\n/);
        var headers = allTextLines[0].split(',');
        var lines = [];
    
        for (var i=1; i<allTextLines.length; i++) {
            var data = allTextLines[i].split(',');
            if (data.length == headers.length) {
    
                var tarr = [];
                for (var j=0; j<headers.length; j++) {
                    tarr.push(headers[j]+":"+data[j]);
                }
                lines.push(tarr);
            }
        }
        return lines;
    }
}