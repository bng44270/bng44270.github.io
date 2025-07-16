/*

  DataDef - Create a schema-enforced data structure based on the Array object

  Usage:

    // Available data types:
    //	  DataDef.StringType
    //	  DataDef.NumberType
    //	  DataDef.BooleanType

    var people = new DataDef({
      "name" : DataDef.StringType,
      "age" : DataDef.NumberType,
      "town" : DataDef.StringType
    });

    people.insert({
      name: "Bob",
      age: 30,
      town: "New York"
    });

    people.insert({
      name: "Jim",
      age: 33,
      town: "Chicago"
    });

    people.insert({
      name:"Pete",
      age:50,
      town: "Newton"
    });

    // The following insert will throw a SchemaError exception
    //      Field type mismatch (age expected number but got string)
    people.insert({
      name:"Joe",
      age:"43",
      town:"Creston"
    });

    // Query using query function (two-dimensional array of field/value pairs)
    people.query([["age",33],["age",50]])

    // RegEx may be used with both string and non-string fields
    people.query([["town",/^N/],["age",/^5[0-9]$/]])

    // Update fields
    //    First argument is the same as the query function syntax
    //    Second argument is a object containing updpate field/value pairs
    people.update([["name",/^P/]],{city : "Cincinnati"})

    // Delete records
    people.delete([["age",/^[6789][0-9]$/]]);

    // Can also query using standard Array functions (filter, map, etc.)
    people.filter(r => 10 > r['age'] % 30 >= 1);
    people.filter(r => r['town'].match(/^New/)) ;
*/

class SchemaError extends Error {
	constructor(msg) {
		super(msg);
		this.name = this.constructor.name;
	}
}

class DataError extends Error {
	constructor(msg) {
		super(msg);
		this.name = this.constructor.name;
	}
}

class DataDef extends Array{
	static get StringType() { return  'string'; }
	static get NumberType() { return 'number'; }
	static get BooleanType() { return 'boolean'; }

	constructor(fields,data) {
		super();

		this.setSchema(fields);

		if (data) this.bulkInsert(data);
	}

	setSchema(fields) {
		var fieldNames = Object.keys(fields);

		this.SCHEMA = {};

		fieldNames.forEach(f => {
			this.addField(f,fields[f]);
		});
	}

	addField(field,type) {
		var fieldExists = Object.keys(this.SCHEMA).indexOf(field) > -1;

		if (fieldExists) {
			throw new SchemaError("Field already exists (" + field + ")");
		}
		else {
			var fieldTypes = [DataDef.NumberType,DataDef.StringType,DataDef.BooleanType];

			if (fieldTypes.indexOf(type) == -1) {
				throw new SchemaError("Unknown data type (" + fields[fieldNames[i]]  + ")");
			}

			this.SCHEMA[field] = type;

			this.forEach(r => {
				if (type == DataDef.StringType) r[field] = "";
				else if (type == DataDef.NumberType) r[field] = 0;
				else if (type == DataDef.BooleanType) r[field] = false;
			});
		}
	}

	deleteField(field) {
		var fieldExists = Object.keys(this.SCHEMA).indexOf(field) > -1;

		if (fieldExists) {
			this.forEach(r => {
				delete r[field];
			});


			delete this.SCHEMA[field];
		}
		else {
			throw new SchemaError("Field does not exist (" + field + ")");
		}
	}

	bulkInsert(records) {
		records.forEach(r => {
			this.insert(r);
		});
	}

	query(queryArray) {
		return this.filter(r => {
			var match = true;

			for (var i = 0; i < queryArray.length; i++) {
				if (queryArray[i][1] instanceof RegExp) {
					if (!(r[queryArray[i][0]].toString().match(queryArray[i][1]))) {
						match = false;
						break;
					}
				}
				else {
					if (r[queryArray[i][0]] != queryArray[i][1]) {
						match = false;
						break;
					}
				}

			}

			return match;
		});
	}

	update(queryArray,updateMap) {
		this.map((r,rIdx) => {
			return {i : rIdx, record : r}
		}).filter(r => {
			var match = true;

			for (var i = 0; i < queryArray.length; i++) {
				if (queryArray[i][1] instanceof RegExp) {
					if (!(r['record'][queryArray[i][0]].toString().match(queryArray[i][1]))) {
						match = false;
						break;
					}
				}
				else {
					if (r['record'][queryArray[i][0]] != queryArray[i][1]) {
						match = false;
						break;
					}
				}

			}

			return match;
		}).forEach(r => {
			console.log(JSON.stringify(r));
			Object.keys(updateMap).forEach(f => {
				this[r['i']][f] = updateMap[f];
			});
		});
	}

	insert(record) {
		var fields = Object.keys(record);

		//Fill empty fields
		Object.keys(this.SCHEMA).filter(f => (fields.indexOf(f) == -1) ? true : false).forEach(f => {
			record[f] = null;
		});

		for (var i = 0; i < fields.length; i++) {
			if (Object.keys(this.SCHEMA).indexOf(fields[i]) == -1) {
				throw new SchemaError("Field not present in schema (" + fields[i] +")");
			}

			if (typeof(record[fields[i]]) != this.SCHEMA[fields[i]]) {
				throw new SchemaError("Field type mismatch (" + fields[i] + " expected " + this.SCHEMA[fields[i]] + " but got " + typeof(record[fields[i]]) + ")");
			}
		}

		this.push(record);
	}

	deleteAll() {
		while (this.pop()) continue;
	}

	delete(queryArray) {
		this.map((r,rIdx) => {
			return {i : rIdx, record : r}
		}).filter(r => {
			var match = true;

			for (var i = 0; i < queryArray.length; i++) {
				if (queryArray[i][1] instanceof RegExp) {
					if (!(r['record'][queryArray[i][0]].toString().match(queryArray[i][1]))) {
						match = false;
						break;
					}
				}
				else {
					if (r['record'][queryArray[i][0]] != queryArray[i][1]) {
						match = false;
						break;
					}
				}
			}

			return match;
		}).forEach(r => {
			delete this[r['i']];
		});
	}
}
