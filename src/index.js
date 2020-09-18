let express = require('express');
let cors = require('cors');
let jwt = require('jsonwebtoken');
let mysql = require('mysql');
let Validator = require('validatorjs');

const app = express();
app.use([express.json(), cors()]);

// ======== UTILITIES
const PORT = process.env.PORT || 4000;

const connection = mysql.createConnection({
  host: 'localhost',
  password: '',
  user: 'root',
  database: 'issuetrackerdb',
});

const validatorRules = {
  firstname: 'required|string',
  lastname: 'required|string',
  password: 'required',
  email: 'required|email',
  content: 'string',
};

// function currentdatetime() {
//   return new Date().toLocaleString();
// }
// ========== ENDPOINTS

app.post('/api/signup', function (request, response) {
  const signupDetails = request?.body;
  let validDatails = new Validator(signupDetails, validatorRules);

  if (validDatails.fails())
    return response.status(500).send(validDatails.errors);

  if (validDatails.passes()) {
    const { firstname, lastname, email, password } = signupDetails;

    let insertQuery = `insert into issuetrackerdb.users(firstname, lastname, datejoined, email, password) values(?, ?, now(), ?, ?)`;
    let selectQuery = `select userid, firstname, lastname, email, datejoined from issuetrackerdb.users where userid=?`;
    connection.query(
      insertQuery,
      [firstname, lastname, email, password],
      function (error, insertResult, field) {
        if (error) return response.status(500).json(error.message);
        if (insertResult) {
          connection.query(selectQuery, [insertResult?.insertId], function (
            error,
            selectResult
          ) {
            if (error) return response.status(500).json(error.message);
            if (selectResult) response.status(201).json(selectResult);
          });
        }
      }
    );
  }
});

app.listen(PORT, () => console.log('listening on port'));
