var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session"); //session
const cors = require("cors");
require("dotenv").config();

const logMiddleware = require('./middlewares/logsMiddlewares.js'); //log

const {connectToMongoDb} = require("./config/db");
//gemini
const fetch = require('node-fetch');
global.fetch = fetch;
global.Headers = fetch.Headers;
global.Request = fetch.Request;
global.Response = fetch.Response;
 
require("dotenv").config();

const http = require('http');

var indexRouter = require('./routes/indexRouter');
var usersRouter = require('./routes/usersRouter');
var rendezvousRouter = require('./routes/rendezvousRouter');
var dossiermedicalRouter = require('./routes/dossiermedicalRouter');
var dispinibiliteRouter = require('./routes/dispinibiliteRouter');
var medecinRouter = require('./routes/medecinRouter');
var patientRouter = require('./routes/patientRouter');
var geminiRouter = require('./routes/geminiRouter');
var commentRouter = require('./routes/commentRouter');



var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(logMiddleware)  //log

app.use(cors({
  origin:"http://localhost:3000",
  methods:"GET,POST,PUT,Delete",
}))

app.use(session({   //config session
  secret: "net secret pfe",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: {secure: false},
    maxAge: 24*60*60,
  },  
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dispinibiliteRouter', dispinibiliteRouter);
app.use('/rendezvousRouter', rendezvousRouter);
app.use('/dossiermedicalRouter', dossiermedicalRouter);
app.use('/api/medecins', medecinRouter);
app.use('/api/patient', patientRouter);
app.use("/gemini", geminiRouter);
app.use("/comment", commentRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err.message })
});


const server = http.createServer(app);

server.listen(process.env.port, () => {
  connectToMongoDb(),
  console.log("app is running on port 5000");
});
