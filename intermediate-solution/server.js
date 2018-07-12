const express = require('express');
const multer = require('multer');

const upload = multer();
const app = express();

// This serves static files from the specified directory
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('AMP-Access-Control-Allow-Source-Origin', 'http://localhost:8081');
  res.append('Access-Control-Expose-Headers', ['AMP-Access-Control-Allow-Source-Origin']);
  res.append('Content-Type', 'application/json');
  next();
});

app.post('/submit-form', upload.array(), (req, res) => {
  res.send(JSON.stringify(req.body));
});

const server = app.listen(8081, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
