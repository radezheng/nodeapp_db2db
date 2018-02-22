//import { request } from 'http';
var mysql = require("mysql2");
var config =
{
    host: process.env.dbhost,
    user: process.env.dbuser,
    password: process.env.dbpassword,
    database: 'db2db',
    port: 3306,
    ssl: true
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) { 
    if (err) { 
        console.log(process.env.dbhost, "!!! Cannot connect !!! Error:");
        throw err;
    }
    else
    {
       console.log("Connection established.");
         //  queryDatabase();
    }   
});


function getTodos(res) {
    conn.query('SELECT * FROM tblTodo', 
        function (err, results, fields) {
            if (err) {
                console.log(err);
            }
            else {
            console.log('Selected ' + results.length + ' row(s).');
            res.send(JSON.stringify(results));
            /*
            for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results[i]));
            }
            */
            console.log('Done.');
            }
        })
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);
    });

    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        var request = new Request("insert into tblTodo(item, status) values(@item, @status)" , function(err,rowcount, rows) {  
            if (err) {  
                console.log(err);
            }else{
                getTodos(res);
            }
        });  

        request.addParameter('item',TYPES.NVarChar, req.body.text);
        request.addParameter('status',TYPES.VarChar, 'new');
            
        connection.execSql(request);

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        
        var request = new Request("delete from tblTodo where _id=@mid" , function(err,rowcount, rows) {  
            if (err) {  
                console.log(err);
            }else{
                getTodos(res);
            }
        });  

        request.addParameter('mid',TYPES.Int, req.params.todo_id);
            
        connection.execSql(request);
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
