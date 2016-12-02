//express
var express=require('express');

//init express
var app=express();

//for templates
var bind = require('bind');

//manages sessions
var session = require('express-session')

//use sessions
app.use(session({ 
	//required, used to prevent tampering
	secret: 'string for the hash', 
	//set time of validity of cookies
	cookie: { maxAge: 60000 }
}));

//pg
const pg = require('pg');
const connectionString = process.env.DATABASE_URL;

const client = new pg.Client(connectionString);
client.connect();

/**
 * @brief Quando viene richiesta /db.
 * @return la query.
 */
app.get('/db',function(req,res){
     var query = client.query('SELECT * FROM prova');
    query.on('row', function(row) {
      res.send('Cognome: '+ row.cognome + ' | id: '+ row.id);
    });
});

//for POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//listen in a specific port
app.set('port', (process.env.PORT || 5000));

//mount middlewear (allow to show static files)
app.use('/public',express.static(__dirname+'/public'));

/**
 * @brief Appena apri l'applicazione
 * @return la pagina di login.
 */
app.post('/',function (req,res) {
    
        res.redirect('public/tpl/login.html');
});

/**
 * @brief log out page
 * @return a page with notification that user is logged out, or a page which says that the user is already logged out.
 */
app.get('/logout', function(request, response) 
{
	var text = "";
	
	//check if the session exists
	if (request.session.user_id !=null) 
	{    	
		request.session.user_id = null;
  	}
	else
	{
		text = 'You are already logged out';
	}
	
	//write response
    res.redirect('public/tpl/login.html');
});

//app start listening
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));

});

