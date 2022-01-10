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
const refreshRouter = require('./routes/refresh.routes');
const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: '501220ce14d9e515be914cc2c3e3cf2b773ba2584ee979bcb2ba94bdfb63df27',
  baseURL: 'http://localhost:4040',
  clientID: 'y14xEbX1H0XxO1RNt6GCpYLxqmr7UOuw',
  issuerBaseURL: 'https://dev-6z5ix9mx.us.auth0.com'
};

//middleware - predlošci (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middleware - statički resursi
app.use(express.static(path.join(__dirname, 'public')));

app.use(auth(config));

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.oidc.isAuthenticated();
    next();
  });

//definicija ruta
app.use('/', homeRouter);
app.use('/datatable', datatableRouter);
app.use('/fetch', fetchRouter);
app.use('/champions', championsRouter);
app.use('/openapi', openapiRouter);
app.use('/refresh', refreshRouter);

//authentication
  
  app.get('/login/:page', (req, res) => {
    const { page } = req.params;
  
    res.oidc.login({
      returnTo: page,
    });
  });
  
  app.get('/logout/:page', (req, res) => {
    const { page } = req.params;
  
    res.oidc.logout({
      returnTo: page,
    });
  });

  app.get('/profile', (req, res) => {
    if(!res.locals.isAuthenticated) {
        res.redirect('/')
    }
    res.render('profile', {
        auth:res.locals.isAuthenticated,
        user: req.oidc.user,
    });  
  });
//pokretanje poslužitelja na portu 3000
app.listen(4040);
