/*

Simple Way to display/edit a two dimensional array

Usage:

    var data = [['a','b','c'],['d','e','f']];
    var grid = new DataGrid('gridid',{
        data : [<DATA-ARRAY]>,          //Data array
        onCommit : function(d) {        //Run this function on commit
            var j = JSON.stringify(d);
            console.log(j);
        },
        header : true                  //Is first row the header? (default is false)
    })

    document.body.appendChild(grid);

The second argument is the function to execute when the "Save" button is clicked.  The function accepts the data array as an argument.  (Optional)

Stylesheets may be used to add style to the <tr> and <td> HTML tags along with the following classes:

    grid-container - parent container of table
    grid-table - table
    grid-datarow - table rows
    grid-datacell - table row cell
    grid-datadisp - non-editable data display
    grid-dataedit - data editing input field

*/
class DataGrid extends Array {
    constructor(id,options) {
        super();
        if (Object.keys(options).indexOf('data') > -1) {
            if (this.validData(options.data)) {
                options.data.forEach(r => {
                    this.push(r);
                });

                this.rows = this.length;
                this.cols = this[0].length;

                this.id = id;

                this.onCommit = (Object.keys(options).indexOf('onCommit') > -1) ? options.onCommit : function(d) { };

                this.headerRow = (Object.keys(options).indexOf('header') > -1) ? options.header : false;

                var view = this.buildGrid();

                return this.populateGrid(view);
            }
        }
    }

    buildGrid() {
        var tableDisp = document.createElement('div');
        tableDisp.setAttribute('class','grid-container');

        var saveBtn = document.createElement('button');
        saveBtn.innerText = "Save";
        saveBtn.addEventListener('click',this.updateData.bind(this),false);
        tableDisp.appendChild(saveBtn);

        var exportBtn = document.createElement('button');
        exportBtn.innerText = 'Export CSV';
        exportBtn.addEventListener('click',this.exportCsv.bind(this),false);
        tableDisp.appendChild(exportBtn);

        var filterTxt = document.createElement('input');
        filterTxt.type = 'text';
        filterTxt.id = this.id + '_searchtext';
        filterTxt.value = "Type filter text here";
        filterTxt.style.color = "#888888";
        filterTxt.onclick = function() {
            if (filterTxt.value == "Type filter text here") {
                filterTxt.value = "";
                filterTxt.style.color = "#000000";
            }
        };
        filterTxt.onblur = function() {
            if (filterTxt.value == "") {
                filterTxt.value = "Type filter text here";
                filterTxt.style.color = "#888888";
            }
        };
        filterTxt.onkeyup = (e) => {
            var searchText = filterTxt.value;

            this.runFilter(searchText)

            document.getElementById('recordcountdisp').innerText = (searchText == "") ? "" : "Showing " + filteredRecords.length.toString() + " records";

            if (searchText.length  > 0) {
                const newParams = new URLSearchParams({ search: searchText });
                window.history.pushState({}, "", "?" + newParams.toString());
            }
            else {
                window.history.pushState({}, "", "?");
            }

        };
        tableDisp.appendChild(filterTxt);

        var recordCount = document.createElement('span');
        recordCount.id = 'recordcountdisp';
        recordCount.style.marginLeft = "50px";
        tableDisp.appendChild(recordCount);

        var dataTable = document.createElement('table');
        dataTable.setAttribute('class','grid-table');

        this.forEach((row,rowIdx) => {
            var dataRow = document.createElement('tr');
            dataRow.setAttribute('class','grid-datarow');

            row.forEach((cell,cellIdx) => {
                var cellType = (rowIdx == 0 && this.headerRow) ? 'th' : 'td';
                var dataCell = document.createElement(cellType);
                dataCell.setAttribute('class','grid-datacell');

                var disp = document.createElement('span');
                disp.setAttribute('class','grid-datadisp');
                disp.id = 'datadisp_' + rowIdx.toString() + '_' + cellIdx.toString();
                disp.style.display = 'inline';
                if (cellType == 'td') {
                    dataCell.ondblclick = function() {
                        var cellId = disp.id.replace(/^datadisp/,'dataedit');
                        disp.style.display = 'none';
                        var cell = document.getElementById(cellId);
                        cell.style.display = 'inline';
                        cell.value = disp.innerText;
                        cell.focus();
                        cell.select();
                    };
                }
                dataCell.appendChild(disp);

                if (cellType == 'td') {
                    var edit = document.createElement('input');
                    edit.type = 'text';
                    edit.setAttribute('class','grid-dataedit');
                    edit.id = 'dataedit_' + rowIdx.toString() + '_' + cellIdx.toString();
                    edit.style.display = 'none';
                    edit.onkeyup = function(e) {
                        if (e.code == 'Enter') {
                            var dispId = this.id.replace(/^dataedit/,'datadisp');
                            this.style.display = 'none';
                            var disp = document.getElementById(dispId);
                            disp.style.display = 'inline';
                            disp.innerText = this.value;
                        }
                        else if (e.code == 'Escape') {
                            var dispId = this.id.replace(/^dataedit/,'datadisp');
                            this.style.display = 'none';
                            var disp = document.getElementById(dispId);
                            disp.style.display = 'inline';
                        }
                    };
                    dataCell.appendChild(edit);
                }

                dataRow.appendChild(dataCell);
            });

            dataTable.appendChild(dataRow);
        });

        tableDisp.appendChild(dataTable);

        return tableDisp;
    }

    runFilter(searchText) {
        [...(document.body.querySelectorAll('.grid-datarow'))].forEach(e => {
            e.style.display = 'none';
        });

        document.body.querySelectorAll('.grid-datarow')[0].style.display = 'table-row';

        var filteredRecords = [...(document.body.querySelector('.grid-table').querySelectorAll('.grid-datarow'))].filter(e => {
            var re = new RegExp(searchText,'i');
            return e.innerText.toString().match(re);
        });

        filteredRecords.forEach(e => {
            e.style.display = 'table-row';
        });
    }

    exportCsv() {
        var csvText = this.map(row => {
            return row.map(cell => {
                return '"' + cell + '"'
            }).join(',');
        });

        var blob = new Blob([csvText], { type : 'text/csv' });

        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "gridview.csv";
        link.click();
    }

    updateData() {
        this.forEach((row,rowIdx) => {
            row.forEach((cell,cellIdx) => {
                var cellId = 'datadisp_' + rowIdx.toString() + '_' + cellIdx.toString();
                this[rowIdx][cellIdx] = document.getElementById(cellId).innerText;
            });
        });

        this.onCommit(this);
    }

    populateGrid(dataView) {
        this.forEach((row,rowIdx) => {
            row.forEach((cell,cellIdx) => {
                var dispId = 'datadisp_' + rowIdx.toString() + '_' + cellIdx.toString();
                dataView.querySelector('#' + dispId).innerText = cell.toString();
            });
        });

        location.search.toString().replace(/^\?/,'').split('&').forEach(pair => {
            var kv = pair.split('=');
            if (kv[0] == 'search' && kv.length == 2) {
                document.getElementById(this.id + '_searchtext').value = decodeURIComponent(kv[1]);
            }
        });

        return dataView;
    }

    validData(d) {
        var valid = true;
        var numCols = -1;

        if (typeof d == 'object') {
            for (var i = 0; i < d.length; i++) {
                if (typeof d[i] != 'object') {
                    valid = false;
                    console.log("Invalid Type")
                    break;
                }

                //Validate column count
                if (i == 0) {
                    numCols = d[i].length;
                }
                else {
                    if (d[i].length != numCols) {
                        valid = false;
                        console.log("Invalid row Length (" + i.toString() + ")");
                        break;
                    }
                }
            }
        }
        else {
            valid = false;
        }

        return valid;
    }
}
