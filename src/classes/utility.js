let mysql = require('mysql');
let nodemailer = require('nodemailer');

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

const issueValidatorRules = {
  content: 'required|string',
  title: 'required|string',
  status: 'required|string',
};

let payload = {
  error: [],
  result: [],
  user: {},
  auth: '',
};

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    sender: '',
  },
});

module.exports = {
  payload,
  companyValidatorRules,
  loginValidatorRules,
  signupValidatorRules,
  connection,
  issueValidatorRules,
};
