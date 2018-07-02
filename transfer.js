"use strict";

// Fetching the file contet and converting it to javascript objects, and add them to the db. Written with inspiration from: https://stackoverflow.com/questions/16010915/parsing-huge-logfiles-in-node-js-read-in-line-by-line
// & https://www.npmjs.com/package/better-sqlite3

console.log("start");

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

    // Create a temparary array to store the values in to check that it is not duplicates (used to create the Redmine table)
    let temp = [];
    let start = true;
    let add = true;

    let transaction2Pre = db.prepare("DROP TABLE CommentSmall");
    transaction2Pre.run();

    // Create the database table Reddit WITHOUT CONSTRAINS
    /*let transaction1Pre = db.prepare("DROP TABLE Reddit");
    transaction1Pre.run();
    let transaction1 = db.prepare("CREATE TABLE Reddit (subreddit_id text, subreddit text)");
    transaction1.run();*/


    let counter =0;
    let startTime;


    // Create the database table Reddit WITH CONSTRAINS
    /*let transaction1Pre = db.prepare("DROP TABLE Reddit");
    transaction1Pre.run();*/
    /*let transaction1 = db.prepare("CREATE TABLE RedditSmall (subreddit_id text primary key, subreddit text NOT NULL)");
    transaction1.run();*/

    // Create the database table Comment WITHOUT CONSTRAINS
    /*let transaction2Pre = db.prepare("DROP TABLE Comment");
    transaction2Pre.run();
    let transaction2 = db.prepare("CREATE TABLE Comment (id text, parent_id text, link_id text, name text, author text, body text, subreddit_id text, score int, created_utc int)");
    transaction2.run();
    let transaction2Post = db.prepare("pragma foreign_keys = ON");
    transaction2Post.run();*/

    // Create the database table Comment WITH CONSTRAINS
    /*let transaction2Pre = db.prepare("DROP TABLE Comment");
    transaction2Pre.run();*/
    let transaction2 = db.prepare("CREATE TABLE CommentSmall (id text primary key, parent_id text, link_id text, name text, author text NOT NULL, body text NOT NULL, subreddit_id text NOT NULL, score int, created_utc int, foreign key (subreddit_id) references RedditSmall (subreddit_id))");
    transaction2.run();
    let transaction2Post = db.prepare("pragma foreign_keys = ON");
    transaction2Post.run();


    // Create variables for the different transactions states
    let begin = db.prepare('BEGIN');
    let commit = db.prepare('COMMIT');
    let rollback = db.prepare('ROLLBACK');

    console.log("begin with the rl");

    // Read each line of the file
    rl.on('line',(line) => {

        jsonObject = JSON.parse(line);
        add = true;

        //Written with inspiration from: https://github.com/JoshuaWise/better-sqlite3/wiki/API, https://github.com/JoshuaWise/better-sqlite3/issues/49

        // Create an array element with the attributes and a counter to count the lines of the file
        //arr[counter] = new Data(jsonObject["id"], jsonObject["parent_id"], jsonObject["link_id"], jsonObject["name"], jsonObject["author"], jsonObject["body"], jsonObject["subreddit_id"], jsonObject["subreddit"], jsonObject["score"], jsonObject["created_utc"]);
        //arr[counter] = new Data(jsonObject["subreddit_id"], jsonObject["subreddit"]);

        // Create the database table Reddit WITH CONSTRAINS
        if(start === true) {
          console.log("startar tiden");
          begin.run();
          startTime = new Date().getTime();
        /*  let transaction = db.prepare('INSERT INTO RedditSmall (subreddit_id, subreddit) VALUES (?, ?)');
          transaction.run(jsonObject["subreddit_id"], jsonObject["subreddit"]);
          temp.push(new Data(jsonObject["subreddit_id"]));*/
          start = false;

        }

    /*    for(let i=0;i<temp.length;i++) {
          if(temp[i].subreddit_id === jsonObject["subreddit_id"]) {

            add = false;
            i = temp.length;
          }
        }
        if(add === true){
          let transaction = db.prepare('INSERT INTO RedditSmall (subreddit_id, subreddit) VALUES (?, ?)');
          transaction.run(jsonObject["subreddit_id"], jsonObject["subreddit"]);
          temp.push(new Data(jsonObject["subreddit_id"]));

        }

        // Insert data into database table Reddit
      /*  let transaction = db.prepare('INSERT INTO Reddit (subreddit_id, subreddit) VALUES (?, ?)');
        transaction.run(jsonObject["subreddit_id"], jsonObject["subreddit"]);*/

        // Insert data into database table Comment
        let transaction = db.prepare('INSERT INTO CommentSmall (id, parent_id, link_id, name, author, body, subreddit_id, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        transaction.run(jsonObject["id"], jsonObject["parent_id"], jsonObject["link_id"], jsonObject["name"], jsonObject["author"], jsonObject["body"], jsonObject["subreddit_id"], jsonObject["score"], jsonObject["created_utc"]);

        counter ++;
        //console.log("Adding element to the array: " + arr.length);
        //console.log(counter);
        //console.log("längden av arrayen: " + temp.length)

        // In the end of the file add the data to the db, RC_2007-10 150429 rader, RC_2011-07 10557466 rader
        if(counter === 150429){
          console.log("längden av arrayen inne i counter: " + temp.length)
          console.log(counter);
          try{

             // Adding all of the transactions to the database
            commit.run();
            console.log("commitat");

          } finally {


            // Time tracking, written with inspiration from: https://www.w3schools.com/howto/howto_js_countdown.asp
            let endTime = new Date().getTime();
            let duration = endTime - startTime;

            let hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((duration % (1000 * 60)) / 1000);

            console.log("Time spent performing the database transcations: " + hours + ":" + minutes + ":" + seconds);

             // If we can't add the transaction then we perform a rollback
            if (db.inTransaction) rollback.run();

          }

        }

      });
