const Pool = require("pg").Pool;

const pool = new Pool({
  user: "ratinder",
  host: "localhost",
  port: 5432,
  database: "tasksdatabase",
});

module.exports = pool;
