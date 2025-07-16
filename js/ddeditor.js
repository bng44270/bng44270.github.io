/*

Requires datadef.js

Simple UI for interacting wtih DataDef objects

Usage:

    var editor = new DataDefEditor('<EDITOR_ID>',{
        fields : <SCHEMA-OBJECT>,
        data : <DATA-OBJECT>,
        onLoad : <LOAD-FUNCTION>
        onCommit : <COMMIT-FUNCTION>
    });

    document.body.appendChild(editor);

<EDITOR-ID> - ID of DOM container of the editor
<SCHEMA-OBJECT> - Schema object (same as DataDef)
<DATA-OBJECT> - Data to pre-populate in object (same as DataDef) - optional
<LOAD-FUNCTION> - function to exeute when the editor interface loads (requires 1 argument representing the DataDef object) - optional
<COMMIT-FUNCTION> - function to exeute when the "Commit" button is clicked (requires 1 arguments representing the DataDef object - optional


Example:

    var editor = new DataDefEditor('mydataedit',{
        fields : {
            name : DataDef.StringType,
            age : DataDef.NumberType,
            active : DataDef.BooleanType
        },
        data : [
            { name : "Bob", age : 34, active : true},
            { name : "Jim", age : 54, active : false}
        ],

        //Save data in DataDef object to Local Storage
        onCommit : function(d) {
            localStorage['datastorage'] = JSON.stringify(d);
        },

        //Load data into DataDef object from Local Storage
        onLoad : function(d) {
            var localStorageExists = Object.keys(localStorage).indexOf('datastorage') > -1;

            if (localStorageExists) {
                JSON.parse(localStorage['datastorage']).forEach(row => {
                    d.insert(row);
                });
            }
        }
    })
*/

class DataDefEditor extends DataDef {
    constructor(id,options) {
        if (Object.keys(options).indexOf('fields') > -1) {
            if (Object.keys(options).indexOf('data') > -1) {
                super(options.fields,options.data);
            }
            else {
                super(options.fields);
            }

            this.onCommit = (Object.keys(options).indexOf('onCommit') > -1) ? options.onCommit : function(d) { };

            this.onLoad = (Object.keys(options).indexOf('onLoad') > -1) ? options.onLoad : function() { };

            this.TABLEID = id + '_datatable';
            this.SCHEMAEDITID = id + '_schemaedit';

            this.container = document.createElement('div');
            this.container.id = id;

            this.onLoad(this);

            this.buildUI();

            return this.container;
        }
    }

    buildUI() {
        var addButton = document.createElement('button');
        addButton.innerText = "Add record";
        addButton.addEventListener('click',this.addRecord.bind(this),false);

        this.container.appendChild(addButton);

        var commitButton = document.createElement('button');
        commitButton.innerText = 'Save';
        commitButton.addEventListener('click',this.commit.bind(this),false);

        this.container.appendChild(commitButton);

        var exportBtn = document.createElement('button');
        exportBtn.innerText = "Export JSON";
        exportBtn.addEventListener('click',this.exportJson.bind(this),false);

        this.container.appendChild(exportBtn);

        var editSchemaBtn = document.createElement('button');
        editSchemaBtn.innerText = "Edit Schema";
        editSchemaBtn.addEventListener('click',this.showSchemaEditor.bind(this),false);

        this.container.appendChild(editSchemaBtn);

        var schemaEditorPane = document.createElement('div');
        schemaEditorPane.id = this.SCHEMAEDITID;
        schemaEditorPane.style.display = 'none';

        var schemaEditor = this.buildSchemaEditor();
        schemaEditorPane.appendChild(schemaEditor );

        this.container.appendChild(schemaEditorPane);

        var table = document.createElement('table');
        table.id = this.TABLEID;

        this.buildTableContents().forEach(row => {
            table.appendChild(row);
        });

        this.container.appendChild(table);
    }

    showSchemaEditor() {
        document.getElementById(this.SCHEMAEDITID).style.display = 'block';
    }

    buildSchemaEditor() {
        var schemaContainer = document.createElement('div');

        var fieldListContainer = document.createElement('div');

        Object.keys(this.SCHEMA).forEach(field => {
            var thisFieldContainer = this.addSchemaField(field,true);
            fieldListContainer.appendChild(thisFieldContainer);
        });

        schemaContainer.appendChild(fieldListContainer);

        var addSchemaFieldBtn = document.createElement('button');
        addSchemaFieldBtn.innerText = "Add Field";
        addSchemaFieldBtn.onclick = () => {
            var fieldContainer = this.addSchemaField("New Field",false);
            fieldListContainer.appendChild(fieldContainer);
        };

        schemaContainer.appendChild(addSchemaFieldBtn);

        var updateBtn = document.createElement('button');
        updateBtn.innerText = "Close";
        updateBtn.onclick = () => {
            document.getElementById(this.SCHEMAEDITID).style.display = 'none';

            var table = document.getElementById(this.TABLEID);

            while (table.firstChild) {
                table.removeChild(table.firstChild);
            }

            this.buildTableContents().forEach(row => {
                table.appendChild(row);
            });
        };

        schemaContainer.appendChild(updateBtn);

        return schemaContainer;
    }

    addSchemaField(field,readOnly) {
        var fieldContainer = document.createElement('div');

        var nameId = "schemaname_" + field;
        var typeId = "schematype_" + field;

        var nameLabel = document.createElement('label');
        nameLabel.setAttribute('for', nameId);
        nameLabel.innerText = "Name";

        fieldContainer.appendChild(nameLabel);

        var nameField = document.createElement('input');
        nameField.type = "text";
        nameField.id = nameId;
        nameField.value = field;
        nameField.readOnly = (readOnly) ? true : false;

        fieldContainer.appendChild(nameField);

        var typeLabel = document.createElement('label');
        typeLabel.setAttribute('for',typeId);
        typeLabel.innerText = "Type";

        fieldContainer.appendChild(typeLabel);

        var typeField = document.createElement('select');
        typeField.id = typeId;
        typeField.disabled = (readOnly) ? true : false;

        [DataDef.StringType,DataDef.NumberType,DataDef.BooleanType].forEach(t => {
            var option = document.createElement('option');
            option.value = t;
            option.innerText = t;

            typeField.appendChild(option);
        });

        typeField.value = (Object.keys(this.SCHEMA).indexOf(field) > -1) ? this.SCHEMA[field] : DataDef.StringType;

        fieldContainer.appendChild(typeField);

        var deleteBtn = document.createElement('button');
        deleteBtn.innerText = "Delete";
        deleteBtn.onclick = () => {
            this.deleteField(field);

            fieldContainer.remove();
        };

        fieldContainer.appendChild(deleteBtn);

        if (!readOnly) {
            var saveBtn = document.createElement('button');
            saveBtn.innerText = "Save";
            saveBtn.onclick = () => {
                var fieldName = document.getElementById(nameId);
                var fieldType = document.getElementById(typeId);

                if (Object.keys(this.SCHEMA).indexOf(fieldName) == -1) {
                    this.addField(fieldName.value,fieldType.value);
                    typeField.disabled = true;
                    nameField.readOnly = true;
                    saveBtn.style.display = "none";
                }
            };

            fieldContainer.appendChild(saveBtn);
        }

        return fieldContainer;
    }

    buildTableContents() {
        var returnRows = [];

        var tableHeader = document.createElement('tr');

        Object.keys(this.SCHEMA).forEach(thisField => {
            var thisColumn = document.createElement('th');
            thisColumn.innerText = thisField;
            tableHeader.appendChild(thisColumn);
        });

        returnRows.push(tableHeader);

        this.forEach(record => {
            var newRow = this.addRow(record);

            returnRows.push(newRow);
        });

        return returnRows;
    }

    exportJson() {
        var jsonText = JSON.stringify(this);

        var blob = new Blob([jsonText],{ type : 'application/json' });

        var link = document.createElement('a');
        link.target = "_blank";
        link.href = URL.createObjectURL(blob);
        link.download = "datadef.json";
        link.click();
    }

    commit() {
        var tmpAr = [];

        var rows = Array.prototype.slice.call(document.querySelectorAll('tr.datarow'));

        rows.forEach(tableRow => {
            var dataRow = {};

            Object.keys(this.SCHEMA).forEach(thisField => {
                dataRow[thisField] = "";
            });

            Object.keys(dataRow).forEach(thisField => {
                if (this.SCHEMA[thisField] == DataDef.BooleanType) {
                    dataRow[thisField] = tableRow.querySelector('input.field_' + thisField).checked;
                }
                else if (this.SCHEMA[thisField] == DataDef.NumberType){
                    dataRow[thisField] = parseFloat(tableRow.querySelector('input.field_' + thisField).value);
                }
                else if (this.SCHEMA[thisField] == DataDef.StringType) {
                    dataRow[thisField] = tableRow.querySelector('input.field_' + thisField).value.toString();
                }
                else {
                    throw new SchemaError("Invalid field type (" + this.SCHEMA[thisField] + ")");
                }
            });

            tmpAr.push(dataRow);
        });

        this.deleteAll();
        this.bulkInsert(tmpAr);

        this.onCommit(this);
    }

    focusNewRow() {
        var firstField = document.querySelectorAll('input.field_' + Object.keys(this.SCHEMA)[0]);
        firstField[firstField.length - 1].focus();
    }

    addRow(thisRecord = false) {
        var dataRow = document.createElement('tr');
        dataRow.className = "datarow";

        if (!thisRecord) {
            thisRecord = {};

            Object.keys(this.SCHEMA).forEach(thisField => {
                if (this.SCHEMA[thisField] == DataDef.NumberType) {
                    thisRecord[thisField] = 0;
                }
                else if (this.SCHEMA[thisField] == DataDef.StringType) {
                    thisRecord[thisField] = "";
                }
                else if (this.SCHEMA[thisField] == DataDef.BooleanType) {
                    thisRecord[thisField] = false;
                }
                else {
                    throw new SchemaError("Invalid data type (" + thisField + ")");
                }
            });
        }

        Object.keys(thisRecord).forEach(thisField => {
            var dataColumn = document.createElement('td');

            var type = this.SCHEMA[thisField];
            var inputField = document.createElement('input');
            inputField.className = "field_" + thisField;

            if (type == DataDef.StringType) {
                inputField.type = 'text';
                inputField.value = thisRecord[thisField];

                inputField.addEventListener('focus',function() {
                    inputField.select();
                });
            }
            else if (type == DataDef.NumberType) {
                inputField.type = 'number';
                inputField.value = thisRecord[thisField];

                inputField.addEventListener('input', function()  {
                    if (inputField.value.toString().length == 0) {
                        inputField.value = 0;
                        inputField.select();
                    }
                });

                inputField.addEventListener('focus',function() {
                    inputField.select();
                });
            }
            else if (type == DataDef.BooleanType) {
                inputField.type = 'checkbox';
                inputField.checked = thisRecord[thisField];
            }

            dataColumn.appendChild(inputField);

            dataRow.appendChild(dataColumn);
        });

        var deleteBtn = document.createElement('button');
        deleteBtn.innerText = "X"
        deleteBtn.onclick = function() {
            dataRow.remove();
        };

        dataRow.append(deleteBtn);

        return dataRow;
    }

    addRecord() {
        var table = document.getElementById(this.TABLEID);

        var newRow = this.addRow();

        table.appendChild(newRow);

        this.focusNewRow()
    }
}
