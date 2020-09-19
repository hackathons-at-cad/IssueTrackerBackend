require('dotenv').config();
let express = require('express');
let cors = require('cors');
let jwt = require('jsonwebtoken');
let Validator = require('validatorjs');
let {
  payload,
  companyValidatorRules,
  loginValidatorRules,
  signupValidatorRules,
  connection,
  issueValidatorRules,
} = require('./classes/utility');

const app = express();
app.use([express.json(), cors()]);

// ======== UTILITIES
const PORT = process.env.PORT || 4000;

function setToken(user) {
  return jwt.sign(user, process.env.SCRETSTRING, { expiresIn: '30m' });
}

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
            if (selectResult) return response.sendStatus(201);
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

// COMPANY

app.get('/api/company', middleWare, function (request, response) {
  let selectQuery = `select * from issuetrackerdb.companies`;
  connection.query(selectQuery, function (error, result) {
    if (error)
      return response.status(500).json({ ...payload, error: error.message });
    if (result) {
      return response.status(200).json({ ...payload, result: result });
    }
  });
});

app.post('/api/company', middleWare, function (request, response) {
  let { verifiedUser, company } = request?.body;
  let validCompany = new Validator(company, companyValidatorRules);

  if (validCompany.fails())
    return response
      .status(500)
      .json({ ...payload, error: validCompany.errors });
  if (validCompany.passes()) {
    let insertCompany = `insert into issuetrackerdb.companies(name, category, createdby, datecreated) values(?, ?, ?, now())`;
    connection.query(
      insertCompany,
      [company.companyName, company.category, verifiedUser.userid],
      function (companyError, companyResult) {
        if (companyError) return response.status(500).json(payload);
        if (companyResult) {
          let { insertId } = companyResult;
          if (insertUserandCompany(verifiedUser.userid, insertId))
            return response.sendStatus(201);
          else return response.sendStatus(500);
        }
      }
    );
  }
});

// ISSUES

app.post('/api/issues', middleWare, function (request, response) {
  let { verifiedUser, issue } = request?.body;
  let { title, content, status } = issue;
  let { userid } = verifiedUser;
  let validateIssue = new Validator(issue, issueValidatorRules);
  if (validateIssue.fails())
    return response
      .status(403)
      .json({ ...payload, error: validateIssue.errors });

  let insertIssue = `insert into issuetrackerdb.issues(title, datecreated, companyid, content, status) values(?, now(), ?, ?, ?)`;

  if (validateIssue.passes()) {
    connection.query(insertIssue, [title, userid, content, status], function (
      error,
      result
    ) {
      if (error)
        return response.status(500).json({ ...payload, error: error.message });
      if (result) return response.sendStatus(201);
    });
  }
});

app.get('/api/issues', middleWare, function (request, response) {
  let selectQuery = `select * from issuetrackerdb.issues where company`;
});

app.put('/api/issues', middleWare, function (request, response) {});

function middleWare(request, response, next) {
  let { auth, company } = request.body;

  if (!auth) return response.sendStatus(403);
  if (auth) {
    let verify = jwt.verify(auth, process.env.SCRETSTRING);

    if (!company) {
      let queryDetails = `
      SELECT * FROM issuetrackerdb.userandcompany 
      join issuetrackerdb.users 
      on issuetrackerdb.userandcompany.userid=userandcompanyid
      join issuetrackerdb.companies 
      on issuetrackerdb.userandcompany.companyid=issuetrackerdb.companies.companyid where issuetrackerdb.userandcompany.userid=?
        `;
      console.log(verify.userid);
      connection.query(queryDetails, [verify.userid], function (error, result) {
        if (error)
          return response
            .status(500)
            .json({ ...payload, error: error.message });

        if (result[0]) {
          let company = ({
            userid,
            companyid,
            firstname,
            lastname,
            datejoined,
            email,
            name: companyName,
            category,
            createdby,
          } = result[0]);

          request.body.verifiedUser = company;
          next();
        }
      });
    } else {
      request.body.verifiedUser = verify;
      next();
    }
  } else return response.sendStatus(403);
}

async function insertUserandCompany(userid, companyid) {
  let insertUserAndCompany = `insert into issuetrackerdb.userandcompany(userid, companyid) values(?, ?)`;
  connection.query(insertUserAndCompany, [userid, companyid], function (
    userCompanyError,
    userCompanyResult
  ) {
    if (userCompanyError) return false;
    if (userCompanyResult) return true;
  });
}

app.listen(PORT, () => console.log('listening on port'));
