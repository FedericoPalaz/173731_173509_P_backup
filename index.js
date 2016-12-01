//express
var express=require('express');

//init express
var app=express();

//for templates
var bind = require('bind');

//for URL
//var url = require('url');


//pg
var pg = require('pg');


pg.defaults.ssl = true;
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT * FROM prova;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});

//connessione al database
app.get('/db', function (request, response) {
    client.connect();
  const query = client.query('CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
    query.on('end', () => { client.end(); });
});




//for POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//listen in a specific port
app.set('port', (process.env.PORT || 5000));

//mount middlewear (allow to show static files)
app.use('/public',express.static(__dirname+'/public'));

app.get('/',function (req,res) {
    
        res.redirect('public/tpl/login.html');
});

//app start listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

});

