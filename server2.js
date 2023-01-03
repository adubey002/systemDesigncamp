const body = require('body-parser');
const express = require('express');


const app2 = express();

// Parse the request body as JSON

app2.use(body.json());


const handler = serverNum => (req, res) => {
  console.log(`server ${serverNum}`, req.method, req.url, req.body);
  res.send(`Hello from server ${serverNum}!`);
};

// Only handle GET and POST requests

app2.get('*', handler(2)).post('*', handler(2));



app2.listen(5001);
