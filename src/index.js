require('dotenv').config();
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

const signupValidatorRules = {
  firstname: 'required|string',
  lastname: 'required|string',
  password: 'required',
  email: 'required|email',
  content: 'string',
};

const loginValidatorRules = {
  email: 'required|email',
  password: 'required|string',
};

let payload = {
  error: [],
  result: [],
  user: {},
  auth: '',
};

function setToken(user) {
  return jwt.sign(user, process.env.SCRETSTRING, { expiresIn: '30m' });
}

// function currentdatetime() {
//   return new Date().toLocaleString();
// }
// ========== ENDPOINTS

// SIGN UP
app.post('/api/signup', function (request, response) {
  const signupDetails = request?.body;
  let validDatails = new Validator(signupDetails, signupValidatorRules);

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
            if (selectResult) {
              response.status(201);
            }
          });
        }
      }
    );
  }
});

// LOGIN
app.post('/api/login', function (request, response) {
  let loginDetails = request?.body;
  let validLogin = new Validator(loginDetails, loginValidatorRules);
  let { email, password } = loginDetails;

  let selectQuery = `select userid, firstname, lastname, email, datejoined from issuetrackerdb.users where email=? and password=?`;

  if (validLogin.fails()) return response.status(500).json(validLogin.errors);
  if (validLogin.passes()) {
    connection.query(selectQuery, [email, password], function (error, result) {
      if (error) return response.status(404);
      if (result) {
        const { userid, firstname, lastname, email, datejoined } = result[0];
        let token = setToken({
          userid,
          firstname,
          lastname,
          email,
          datejoined,
        });
        payload = { ...payload, auth: token, user: { firstname, lastname } };
        return response.status(200).json(payload);
      }
    });
  }
});

app.listen(PORT, () => console.log('listening on port'));
