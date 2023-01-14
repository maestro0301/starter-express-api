let mysql = require("mysql");
// let connection = mysql.createPool({
//   host: "sql11.freesqldatabase.com",
//   user: "sql11590416",
//   password: "vwXRGrNYr4",
//   database: "sql11590416",
// });
let connection = mysql.createPool({
  host: "sql571.main-hosting.eu",
  user: "u768972843_contactsclone",
  password: "D9Kv@LerMv*",
  database: "u768972843_contactsclone",
});

module.exports = {
  connection,
};
