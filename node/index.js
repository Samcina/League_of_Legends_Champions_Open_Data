var http = require('http');
const fetch = require('node-fetch');
var express = require('express');
var app = express();
const path = require('path');

//uvoz modula s definiranom funkcionalnosti ruta
const homeRouter = require('./routes/index.routes');
const datatableRouter = require('./routes/datatable.routes');
const fetchRouter = require('./routes/fetch.routes');

//middleware - predlošci (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));

//middleware - dekodiranje parametara
app.use(express.urlencoded({ extended: true }));


//definicija ruta
app.use('/', homeRouter);
app.use('/datatable', datatableRouter);
app.use('/fetch', fetchRouter);


//pokretanje poslužitelja na portu 3000
app.listen(3000);
