/*
Copyright 2018 Google Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
const express = require('express');
const multer = require('multer');
const fs = require('fs');

const upload = multer();
const app = express();

app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin', ['*']);
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append('Access-Control-Allow-Headers', 'Content-Type');
  res.append('AMP-Access-Control-Allow-Source-Origin', 'https://seemly-metal.glitch.me');
  res.append('Access-Control-Expose-Headers', ['AMP-Access-Control-Allow-Source-Origin']);
  next();
});

// This serves static files from the specified directory
app.use(express.static(__dirname + '/public'));

app.get('/products/filter', (req, res) => {
  const filterType = req.query.filterType || 'all';
  const sortValue = req.query.sortValue || 'price-desc';
  const products = fs.readFileSync(__dirname + '/public/json/products.json');
  const productsJSON = JSON.parse(products);
  const filteredItems = productsJSON.items.filter(item => filterType == 'all' ? true : item.type == filterType);
  const sortedFilteredItems = filteredItems.sort((a, b) => sortValue == 'price-asc' ? a.price - b.price : b.price - a.price);
  const filteredProducts = { "items": sortedFilteredItems }
  res.send(JSON.stringify(filteredProducts));
});

app.post('/submit-form', upload.array(), (req, res) => {
  res.append('Content-Type', 'application/json');
  res.send(JSON.stringify(req.body));
});

const server = app.listen(8081, '127.0.0.1', () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
