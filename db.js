const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  post:process.env.MYSQLPORT
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});

module.exports = db;



// const mysql = require('mysql2');

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Siva@4259',
//   database: 'bookdb'
// });

// db.connect(err => {
//   if (err) throw err;
//   console.log(' Connected to MySQL');
// });

// module.exports = db;
