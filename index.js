//express
var express=require('express');

//init express
var app=express();

//for templates
var bind = require('bind');

//for URL
//var url = require('url');

//for POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//listen in a specific port
app.set('port', (process.env.PORT || 5000));

//mount middlewear (allow to show static files)
app.use('/pubblic',express.static(__dirname+'/pubblic'));



//app start listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});