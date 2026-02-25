const mysql = require('mysql2/promise')

const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    waitForConnections: true,
    connectionLimit: 100,
    queueLimit: 100
})

pool.on('connection', (conn) => {
    conn.query('SET SESSION group_concat_max_len = 100000')
})

module.exports = pool;
