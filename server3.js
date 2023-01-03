const body = require('body-parser');
const express = require('express');


const app3 = express();
// Parse the request body as JSON

app3.use(body.json());

const handler = serverNum => (req, res) => {
  console.log(`server ${serverNum}`, req.method, req.url, req.body);
  res.send(`Hello from server ${serverNum}!`);
};

// Only handle GET and POST requests

app3.get('*', handler(3)).post('*', handler(3));


app3.listen(5002);