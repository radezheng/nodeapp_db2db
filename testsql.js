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
       insertData('test2', 'A')
           readData();
    }   
});

function readData(){
    conn.query('SELECT * FROM tblTodo', 
        function (err, results, fields) {
            if (err) throw err;
            else console.log('Selected ' + results.length + ' row(s).');
            //for (i = 0; i < results.length; i++) {
                console.log('Row: ' + JSON.stringify(results));
            //}
            console.log('Done.');
        })
   conn.end(
       function (err) { 
            if (err) throw err;
            else  console.log('Closing connection.') 
    });
};

function insertData(item, status){
    conn.query('INSERT INTO tblTodo (item, status) VALUES (?, ?);', [item, status], 
    function (err, results, fields) {
        if (err) throw err;
    else console.log('Inserted ' + results.affectedRows + ' row(s).');
})

}