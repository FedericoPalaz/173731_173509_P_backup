//express
var express=require('express');

//for templates
var bind = require('bind');

//pg
const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://dbSW:password@localhost:5432/dbSW';


function login(req,res) {
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
    
}

exports.login=login;