let mysql = require('mysql');

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

const companyValidatorRules = {
  companyName: 'required|string',
  category: 'string',
};

let payload = {
  error: [],
  result: [],
  user: {},
  auth: '',
};

module.exports = {
  payload,
  companyValidatorRules,
  loginValidatorRules,
  signupValidatorRules,
  connection,
};
