const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',      // Your DB host
    user: 'root',           // Your DB username
    password: 'password',   // Your DB password
    database: 'my_database' // Your database name
});

module.exports = pool.promise();  // Export the pool connection with promises
