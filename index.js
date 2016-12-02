//express
var express=require('express');

//init express
var app=express();

//for templates
var bind = require('bind');

//manages sessions
var session = require('express-session')

//include dataBase Manager
var datamanager=require('./datamanager/datamanager.js');

//pg
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://dbSW:password@localhost:5432/dbSW';

//use sessions
/*
app.use(session({ 
	//required, used to prevent tampering
	secret: 'string for the hash', 
	//set time of validity of cookies
	cookie: { maxAge: 60000 }
}));
*/



//for POST
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

//listen in a specific port
app.set('port', (process.env.PORT || 5000));

//mount middlewear (allow to show static files)
app.use('/public',express.static(__dirname+'/public'));


app.use('/', function (req,res) {
    res.statusCode = 200; 
    res.redirect('public/tpl/login.html');
});

app.post('/login', function(req,res) 
{
    console.log('entrato');
    if(typeof req.body!='undefined' && req.body){
        var email=req.body.email;
        var password=rew.body.password;
        if(email!='undefined' && email!=null && password !='undefined' && password!=null){
            pg.connect(connectionString, function (err, client, done) {
                if (err) {
                    console.log("Errore Connessione DB");
                }
                client.query('SELECT password FROM users where email=$1;',[email], function (err, result) {
                    if (err) {
                        console.log("isExistsUser Select Error: "+err.message);
                    }
                    else{
                    if(result.rowCount>0){
                        res.send("Esiste");
                        if(result.rows[0].password==password)
                            console.log('loggato');
                        else
                            console.log('password sbagliato');
                    }
                    else
                        res.send("NON Esiste");
                    }
                    done();
                });
            });
        }
    }
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

