// Database connection details
const Pool = require('pg').Pool;

const pool = new Pool({
    host: "localhost",
    user: "postgres",
    port: 5432,
    password: "root_user",
    database: "postgres"
});

// pool object exported for use with queries
module.exports = pool;