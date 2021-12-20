const express = require('express'),
    cookieParser = require('cookie-parser'),
    log = require('morgan'),
    path = require('path'),
    cors = require('cors'),
    multer = require('multer'),
    upload = multer(),
    app = express(),

    PORT = process.env.PORT || 3000,
    NODE_ENV = process.env.NODE_ENV || 'development';

app.set('port', PORT);
app.set('env', NODE_ENV);

app.use(cors());
app.use(log('tiny'));

// parse application/json
app.use(express.json());

// parse raw text
app.use(express.text());

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// parse multipart/form-data
app.use(upload.array()); 
app.use(express.static('public'));

app.use(cookieParser());

const fetch = require('node-fetch');

//uvoz modula s definiranom funkcionalnosti ruta
const homeRouter = require('./routes/index.routes');
const datatableRouter = require('./routes/datatable.routes');
const fetchRouter = require('./routes/fetch.routes');
const championsRouter = require('./routes/champions.route');
const openapiRouter = require('./routes/openapi.routes');

//middleware - predlošci (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));


//definicija ruta
app.use('/', homeRouter);
app.use('/datatable', datatableRouter);
app.use('/fetch', fetchRouter);
app.use('/champions', championsRouter);
app.use('/openapi', openapiRouter);


//pokretanje poslužitelja na portu 3000
app.listen(3000);
