const Pool = require("pg").Pool;


const pool = new Pool({
    user:"postgres",
    password:"levirdev1",
    host: "localhost",
    port: 5432,
    database: "dbteste"
}) 

module.exports = pool;