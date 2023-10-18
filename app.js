const express = require('express');
const cookieParser = require("cookie-parser");
const session = require("express-session");
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/ssodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const oneDay = 1000 * 60 * 60 * 24;

const myusername = 'vadim';
const mypassword = 'qwerty';

let sessions;

app.use(session ({
    name: "jws",
    path: '/',
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay,
              secure:false
            },
    resave: false 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(express.static(__dirname));
app.use(cookieParser());

app.get('/', (req, res) => {
  sessions = req.session;
  if (sessions.userid) {
    res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  } else res.sendFile('./index.html', {root:__dirname})
});

app.post('/login', (req, res) => {
  if(req.body.username == myusername && req.body.password == mypassword){
    sessions = req.session;
    sessions.userid = req.body.username;
    res.redirect('/');
  } else {
    res.send('Invalid username or password');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy ((err) => {
    if (err) throw err;
    res.redirect('/');
  })
});

app.get('/burger', (req, res) => {
  sessions = req.session;
  if (sessions.userid) {
      res.redirect('https://upscience.ru/');
  } else res.sendFile('./index.html', {root:__dirname})
});

app.get('/forest', (req, res) => {
  sessions = req.session;
  if (sessions.userid) {
      res.redirect('https://les-sib-rf.ru/');
  } else res.sendFile('./index.html', {root:__dirname})
})

app.listen(PORT);
