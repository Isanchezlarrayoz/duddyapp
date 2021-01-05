var express = require('express');
var app = express();
var favicon = require('serve-favicon');
var path = require('path');
var bodyParser = require('body-parser');


app.get('/', function(req, res) {
    //  res.redirect('/trainers');
    res.send("ok");
});



module.exports = app;