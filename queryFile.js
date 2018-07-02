//file to write the queries in, Task 5 Queries
let Database = require('better-sqlite3');
let db = new Database('test.db');
let moment = require('moment');
//let result = db.prepare('SELECT * FROM test ORDER BY id').all();
//let result = db.prepare('SELECT subreddit FROM Reddit').all();
/*let result = db.prepare('SELECT COUNT(*) FROM Comment').all(); */
//console.log(result);
/*let result = db.prepare('SELECT author FROM Comment LIMIT 40').all();
console.log(result);*/
console.log("startar tiden");
startTime = new Date().getTime();

// 1.How many comments have a specific user posted? FUNKAR KLAR!!!
/*let result1 = db.prepare('SELECT COUNT(*) FROM Comment WHERE author is "wbeavis"').all();
console.log(result1);*/

// 2. How many comments does a specific subreddit get per day? FUNKAR KLAR!!!
/*let result2 = db.prepare('SELECT COUNT(*) FROM Comment LEFT JOIN Reddit ON Comment.subreddit_id = Reddit.subreddit_id WHERE Reddit.subreddit="reddit.com" AND DATE(Comment.created_utc, "unixepoch")="2011-07-01"').all();
console.log(result2);*/

// 3. How many comments include the world "lol"? FUNKAR KLAR!!!
/*let result3 = db.prepare('SELECT COUNT(*) FROM Comment WHERE body like "lol"').all();
console.log(result3);*/

// 4. Users that commented on a specific link has also posted to which subreddit? VET EJ OM DEN FUNKAR!
/*let result4 = db.prepare('SELECT author, subreddit, link_id FROM Comment, Reddit WHERE Comment.link_id="t3_id1nc"').all();
console.log(result4);*/

// 5. Which users have the highest and lowest combined scores? (combined as the sum of all scores) FUNKAR KLAR!!!
/*let result5 = db.prepare('SELECT author, MAX(total_score) AS total_score FROM (SELECT author, SUM(score) AS total_score FROM Comment GROUP BY author) UNION SELECT author, MIN(total_score) AS total_score FROM (SELECT author, SUM(score) AS total_score FROM Comment GROUP BY author)').all();
console.log(result5);*/

// 6. Which subreddits have the highest and lowest scored comments? FUNKAR KLAR!!!
let result6a = db.prepare('SELECT Subreddit, MAX(total_score) AS MaxScore FROM (SELECT SUM(Comment.score) AS total_score, Reddit.subreddit AS Subreddit FROM Comment LEFT JOIN Reddit ON (Reddit.subreddit_id = Comment.subreddit_id) GROUP BY Comment.subreddit_id)').all();
console.log(result6a);
let result6 = db.prepare('SELECT Subreddit, MAX(total_score) AS total_score FROM (SELECT SUM(Comment.score) AS total_score, Reddit.subreddit AS Subreddit FROM Comment LEFT JOIN Reddit ON (Reddit.subreddit_id = Comment.subreddit_id) GROUP BY Comment.subreddit_id) UNION SELECT Subreddit, MIN(total_score) AS total_score FROM (SELECT SUM(Comment.score) AS total_score, Reddit.subreddit AS Subreddit FROM Comment LEFT JOIN Reddit ON (Reddit.subreddit_id = Comment.subreddit_id) GROUP BY Comment.subreddit_id)').all();
console.log(result);
/*let result6 = db.prepare('SELECT Subreddit, MAX(total_score) AS Score FROM (SELECT SUM(Comment.score) AS total_score, Reddit.subreddit AS Subreddit FROM Comment LEFT JOIN Reddit ON (Reddit.subreddit_id = Comment.subreddit_id) GROUP BY Comment.subreddit_id) UNION SELECT Subreddit, MIN(total_score) AS Score FROM (SELECT SUM(Comment.score) AS total_score, Reddit.subreddit AS Subreddit FROM Comment LEFT JOIN Reddit ON (Reddit.subreddit_id = Comment.subreddit_id) GROUP BY Comment.subreddit_id)').all();*/
/*let result6 = db.prepare('SELECT Subreddit, MAX(total_score) FROM (SELECT SUM(Comment.score) AS total_score, Reddit.subreddit AS Subreddit FROM Comment LEFT JOIN Reddit ON (Reddit.subreddit_id = Comment.subreddit_id) GROUP BY Comment.subreddit_id)').all();
console.log(result6);*/

// 7. Given a specific user, list all the users he or she has potentially interacted with (i.e everyone who has commented on a link that the specific user has commented on) FUNKAR KLAR!!!
/*let result7 = db.prepare('SELECT author FROM Comment WHERE link_id=(SELECT link_id FROM Comment WHERE author="0keanos")').all();
console.log(result7);*/

// 8. Which users has only posted to a single subreddit? FUNKAR KLAR!!!
/*let result8 = db.prepare('SELECT author FROM (SELECT author FROM Comment GROUP BY author HAVING COUNT(*) = 1) AS ONLY_ONCE').all();
console.log(result8);*/


// Create index-table with author from Comment and subreddit from Reddit
/*let index1 = db.prepare('CREATE INDEX index_author ON Comment(author)');
index1.run();*/
/*let remove = db.prepare('DROP INDEX index_author');
remove.run(); */

/*let index5 = db.prepare('CREATE INDEX index_score ON Comment(score)');
index5.run();*/
/*let remove = db.prepare('DROP INDEX index_score');
remove.run(); */
/*let index4 = db.prepare('CREATE INDEX index_commentLinkID ON Comment(link_id)');
index4.run();*/
/*let remove = db.prepare('DROP INDEX index_commentLinkID');
remove.run();*/
/*let index3 = db.prepare('CREATE INDEX index_commentRedditID ON Comment(subreddit_id)');
index3.run();*/
/*let remove = db.prepare('DROP INDEX index_commentRedditID');
remove.run();*/
/*let index2 = db.prepare('CREATE UNIQUE INDEX index_subreddit ON Reddit(subreddit_id, subreddit)');
index2.run();*/
/*let index6 = db.prepare('CREATE INDEX index_authorScore ON Comment(author, score)');
index6.run();*/
/*let index7 = db.prepare('CREATE INDEX index_subRedditIDScore ON Comment(subreddit_id, score)');
index7.run();*/
/*let index8 = db.prepare('CREATE INDEX index_autorLinkID ON Comment(author, link_id)');
index8.run();*/
/*let index9 = db.prepare('CREATE INDEX index_autorSubredditID ON Comment(author, subreddit_id)');
index9.run();*/


let endTime = new Date().getTime();
let duration = endTime - startTime;
let hours = Math.floor((duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
let minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
let seconds = Math.floor((duration % (1000 * 60)) / 1000);

console.log("Time spent answering the query: " + hours + ":" + minutes + ":" + seconds);
