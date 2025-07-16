/*

    CsvFile - Parse CSV file with column headers
    
    Usage:
    
        //Parse comma-delimited text
        var csv = "name,age\nbob,43\nzeke,76";
        var data = new CsvFile(csv);
        
        //Call with parameters
        var text = "name\tage\nbob\t43\nzeke\t76";
        var data = new CsvFile(csv,{
            delim : '\t',
            twodim : true
        });
        
        The the available optional parameters are:
        
            delim - specify a delimiter to separate fields (records are always delimited by newline).  Default is comma.
            twodim - will the object be represented as a two-dimentional array (true) or an array of objects (false).  Default is false
        
        //Access the name in the first record in the CSV file
        var nameValue = data[0].name;
        
        //Access the first column of the second row
        var fieldValue = data[1][0];
        
*/

class CsvFile extends Array {
    constructor(csvtext = '', options={}) {
        super();
        this.raw = csvtext;
        this.delimiter = (Object.keys(options).indexOf('delim') > -1) ? options['delim'] : ',';
        this.twodim = (Object.keys(options).indexOf('twodim') > -1) ? options['twodim'] : false;
        this.parseCsv();
    }

    set raw(txt) {
        this._raw = txt;
        this.parseCsv();
    }

    get raw() {
        return this._raw;
    }

    parseCsv() {
        var fieldNames = [];

        //Clear existing data
        this.length = 0;

        var lines = this.raw.split('\n');
        
        if (this.twodim) {
            for (var l = 0; l < lines.length; l++) {
                this.push(this.parseRow(lines[l]));
            }
        }
        else {
            if (this.raw.length > 0) {    
                for (var l = 0; l < lines.length; l++) {
                    var fields = this.parseRow(lines[l]);
    
                    if (l == 0) {
                        fieldNames = fields;
                    }
                    else {
                        var ob = {};
                        for (var f = 0; f < fields.length; f++) {
                            ob[fieldNames[f]] = fields[f];
                        }
                        this.push(ob);
                    }
                }
            }
        }
    }

    parseRow(rowText) {
        var row = [];
        var infield = false;
        var currentField = '';

        for (var i = 0; i < rowText.length; i++) {
            var char = rowText[i];

            if (char === '"') {
                if (infield && rowText[i + 1] === '"') {
                    currentField += '"';
                    i++;
                } else {
                    infield = !infield;
                }
            } else if (char === this.delimiter && !infield) {
                row.push(currentField);
                currentField = '';
            } else {
                currentField += char;
            }
        }
        row.push(currentField); // Add the last field

        return row;
    }
}
