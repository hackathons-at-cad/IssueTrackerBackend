let mysql = require('mysql');
let nodemailer = require('nodemailer');

//bc9cf0fc99f68b:fef42acf@us-cdbr-east-02.cleardb.com/heroku_213f9eefb18f399?reconnect=true

const connection = mysql.createConnection({
  host: 'us-cdbr-east-02.cleardb.com',
  password: 'fef42acf',
  user: 'bc9cf0fc99f68b',
  database: 'heroku_213f9eefb18f399',
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
