let express = require('express');
let cors = require('cors');
let jwt = require('jsonwebtoken');

const app = express();
app.use([express.json(), cors()]);

app.post('/api/signup', function (request, response) {
  console.log(request.body);
  response.sendStatus(200);
});

app.listen(4000, () => console.log('listening on port'));
