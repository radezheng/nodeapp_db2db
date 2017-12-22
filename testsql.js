var Connection = require('tedious').Connection;  
    var config = {  
        userName: 'myadmin',  
        password: 'Azurep@ssw0rd',  
        server: 'demoserver4rade.database.windows.net',  
        // If you are on Microsoft Azure, you need this:  
        options: {encrypt: true, database: 'mydemodb',
            rowCollectionOnRequestCompletion:true} 
    };  
    var connection = new Connection(config); 
    
    connection.on('connect', function(err) {  
        // If no error, then good to proceed. 
        if(err){
            console.log(err);
        } else{
            console.log("Connected");  
            executeStatement();  
        }
        
    });  

    var Request = require('tedious').Request;  
    var TYPES = require('tedious').TYPES;  

    function executeStatement() {  
        request = new Request("select * from tbltodo for json path", function(err,rowcount, rows) {  
        if (err) {  
            console.log(err);
        }else{
            console.log('return:' , rowcount, rows[0][0].value);
        }  
        }
    );

        connection.execSql(request);  
    }