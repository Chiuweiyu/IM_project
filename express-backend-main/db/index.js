const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.RDS_PORT,
  // host     : 'localhost',
  // user     : 'postgres',
  // password : 'postgres',
  // database : 'IM_test',
  // port     : 5432
});

async function query(text, params) {
  try {
    // console.log("start query ");
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    // console.log("executed query ", { text, duration, rows: res.rowCount });
    return res;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  query,
};
