//file to write the queries in
let Database = require('better-sqlite3');
let db = new Database('test.db');

let result = db.prepare('SELECT * FROM test ORDER BY id').all();
console.log(result);
