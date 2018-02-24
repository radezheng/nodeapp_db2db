//import { request } from 'http';
var mysql = require("mysql2");
var genericPool = require("generic-pool");
var config =
{
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: 'db2db',
    port: 3306
};

const PoolDB = genericPool.createPool({
    create : function(callback) {
        var connection = mysql.createConnection(config);
        connection.on('error', function(err) {
            // Report the error. connection.end will be called after, which will
            // remove the connection from the pool.
            console.log('Unhandled MySQL error occurred.', err);
            
        });
        connection.on('end', function() {
            // Only call pool.destroy in schenario #2 from above.
            if (!connection._removedFromPool) {
                // Note that the connection is already ended so that we don't try to
                // end it again in the destroy function.
                connection._poolDoesNotNeedToEnd = true;

                console.log('Connection ended for reason other than pool timeout. Pruning from the pool.');
                PoolDB.destroy(connection);
            }
        });
        
        connection.connect(function(err){
            console.log('mysql connect error:', err);
        });
        return connection;
        
    },
    destroy : (connection) =>{ connection.end()},
    validate : (connection) => {
        return new Promise(function(resolve, reject){
            if(!connection)  resolve(false);
            connection.query(`SELECT 1`,[],function (err, results, fields) {
                console.log('validating--');
            if (err){resolve(false)} resolve(true);
        
        })
    })
    }
}, {
    max : 5,
    min : 1,
    testOnBorrow : true
});

//const conn = new mysql.createConnection(config);

//------Event hub init ------------
var EventHubClient = require('azure-event-hubs').Client;

var connectionString = process.env.hubconn;
var eventHubPath = 'hub01';

var client = EventHubClient.fromConnectionString(connectionString, eventHubPath);



var sendEvent = function (eventBody) {
        msg = eventBody;
        console.log('Sending Event: ' + msg);
        client.createSender()
        .then(function(sender){
            sender.send(msg);
        });
           //client.close();
  
};


client.open()
.then(function() {
    sender = client.createSender();
  })
  .catch(printError);

  var printError = function (err) {
    console.error(err.message);
  };

// conn.connect(
//     function (err) { 
//     if (err) { 
//         console.log(process.env.dbhost, "!!! Cannot connect !!! Error:");
//         throw err;
//     }
//     else
//     {
//        console.log("Connection established.");
//          //  queryDatabase();
//     }   
// });

var MyGroup = process.env.GROUPID;

function getTodos(res) {
    PoolDB.acquire().then(function(conn){
    conn.query('SELECT * FROM tblTodo where status=\'A\'', 
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
            console.log('Selected ' + results.length + ' row(s).');
            PoolDB.release(conn);
            res.send(JSON.stringify(results));
            /*
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            */
            console.log('Done.');
            }
        })
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    app.get('/api/env', function (req, res) {
        // use mongoose to get all todos in the database
       res.send({group:process.env.GROUPID, dbhost:process.env.dbhost});
    });
    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {
        var eventBody = {}
        eventBody.id = MyGroup + Date.now();
        eventBody.item = req.body.text;
        eventBody.status = 'A';
        eventBody.action = "Add";
        eventBody.from = MyGroup
        PoolDB.acquire().then(function(conn){
        conn.query('INSERT INTO tblTodo (id, item, status) VALUES (?, ?, ?);', 
                [eventBody.id, eventBody.item, eventBody.status], 
            function (err, results, fields) {
                if (err){
                    console.log(err);
                    PoolDB.release(conn);
                    res.send("Error");
                } 
                else {
                    console.log('Inserted ' + results.affectedRows + ' row(s).');
                    sendEvent(eventBody);
                    PoolDB.release(conn);
                    getTodos(res);
                }
        })         
        });
    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        var eventBody = {}
        eventBody.id = req.params.todo_id;
        eventBody.action = "Delete";
        eventBody.status = 'D';
        eventBody.from = MyGroup;
        PoolDB.acquire().then(function(conn){
        conn.query('update tblTodo set status=? where id=?', 
                [  eventBody.status, eventBody.id], 
            function (err, results, fields) {
                if (err){
                    console.log(err);
                    PoolDB.release(conn);
                    res.send("Error");
                } 
                else {
                    console.log('updated ' + results.affectedRows + ' row(s).');
                    sendEvent(eventBody);
                    PoolDB.release(conn);
                    getTodos(res);
                }
        })       
    });  

   });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
