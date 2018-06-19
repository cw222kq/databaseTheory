"use strict";

// Fetching the file contet and converting it to javascript objects, and add them to the db. Written with inspiration from: https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
// & https://www.npmjs.com/package/better-sqlite3

let Data = require("./Data");
let fs = require('fs'),
    readline = require('readline'),
    stream = require('stream');

// Import the SQLite3, create the database connection and store it in a variable
let Database = require('better-sqlite3');
let db = new Database('test.db');

// Create the variables required to create a read stream to process each line for a big file
let instream = fs.createReadStream('RC_2007-10');
let outstream = new stream;
outstream.readable = true;
outstream.writable = true;

// Create the read line interface that's require for running a read stream
let rl = readline.createInterface({
    input: instream,
    output: outstream,
    terminal: false
});

// Create variable to store the json information
let jsonObject;

// Create the array and the counter for the JSON elements
let arr = [];
let counter = 0;

// Create the database table
// kommenterat bort nu let transaction1 = db.prepare("CREATE TABLE test (id text, parent_id text, link_id text, name text, author text, body text, subreddit_id text, subreddit text, score int, created_utc int)");
//transaction1.run();
let transaction1 = db.prepare("CREATE TABLE User (id text primary key, author text)");
transaction1.run();

// Create variables for the different transactions states
let begin = db.prepare('BEGIN');
let commit = db.prepare('COMMIT');
let rollback = db.prepare('ROLLBACK');

// Read each line of the file
rl.on('line',(line) => {

    jsonObject = JSON.parse(line);


    //Written with inspiration from: https://github.com/JoshuaWise/better-sqlite3/wiki/API, https://github.com/JoshuaWise/better-sqlite3/issues/49

    // Create an array element with the attributes and a counter to count the lines of the file
    arr [counter] = new Data(jsonObject["id"], jsonObject["parent_id"], jsonObject["link_id"], jsonObject["name"], jsonObject["author"], jsonObject["body"], jsonObject["subreddit_id"], jsonObject["subreddit"], jsonObject["score"], jsonObject["created_utc"]);
    counter ++;
    console.log("Adding element to the array: " + arr.length);

    // When we reach max elements for the first file
    if(arr.length === 150429) {

      // Start the batch transaction with BEGIN
      begin.run();

      // Log the start
      console.log("börjar dataöverföringen till db");

      // Loop through all of the elements in the array
      for(let i=0;i<arr.length;i++){

        // Debug logging
        console.log("i = " + i + " for-loopen");

        // Create a new transaction to add to the batch transation
        //kommenterat bort nu let transaction = db.prepare('INSERT INTO test (id, parent_id, link_id, name, author, body, subreddit_id, subreddit, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        //transaction.run(arr[i].id, arr[i].parent_id, arr[i].link_id, arr[i].name, arr[i].author, arr[i].body, arr[i].subreddit_id, arr[i].subreddit, arr[i].score, arr[i].created_utc[i]);
        let transaction = db.prepare('INSERT INTO User (id, author) VALUES (?, ?)');
        transaction.run(arr[i].id, arr[i].author);


      }

      // Try to commit batch transaction

      try{

        // Adding all of the transactions to the database
        commit.run();

      } finally {

        // If we can't add the transaction then we perform a rollback
        if (db.inTransaction) rollback.run();

      }
    }
  });
