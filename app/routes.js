//import { request } from 'http';

var Connection = require('tedious').Connection;  

var config = {  
    userName: 'myadmin',  
    password: 'Azurep@ssw0rd',  
    server: 'demoserver4rade.database.windows.net',  
    // If you are on Microsoft Azure, you need this:  
    options: {encrypt: true, database: 'mydemodb', rowCollectionOnRequestCompletion:true}  
};  
var Request = require('tedious').Request;  
var TYPES = require('tedious').TYPES;  

var connection = new Connection(config);  
connection.on('connect', function(err) {  
    if(err){
        console.log(err);
    } else{
        console.log("DB Connected");  
    }
});  
function getTodos(res) {
    request = new Request("SELECT * from tblTodo for json path", function(err,rowcount, rows) {  
        if (err) {  
            console.log(err);
        }else{
            
            if(rowcount > 0){
                console.log('return:' , rowcount, rows[0][0].value);
                res.send(rows[0][0].value);
            }else{
                res.send([]);
            }
        }
    });  
        
        connection.execSql(request); 
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
