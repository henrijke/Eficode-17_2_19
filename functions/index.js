'use strict';
// Set the necessary test functionality
const functions = require('firebase-functions');
const firebase = require('firebase-admin');
// Node doesn't have fetch as a default
const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');
// Initialize express
const app = express();
// Using body parsing middleware. Parses incoming request bodies
const bodyParser = require('body-parser');
// Support json encoded bodies
app.use(bodyParser.json());
// Support encoded bodies
app.use(bodyParser.urlencoded({extended: true}));
// Using template engine consolidate
const engines = require('consolidate');
// Create engine
app.engine('hbs', engines.handlebars);
// Set views folder
app.set('views','./views');
// Use engine
app.set('view engine','hbs');

firebase.initializeApp(
    // Using functions helper to initialize
    functions.config().firebase
);

const db = firebase.firestore();

// Fetch data from the database
const getData = () => {
    return new Promise((resolve, reject) => {
        db.collection('data').get()
            .then((snapshot) => {
                let output = [];
                snapshot.forEach((doc) => {
                    output.push(doc.data());
                });
                resolve(output);
            }).catch((err) => {
            reject(err);
        });
    });
};

//Set new data to the database
const setData=(data) => {
    return new Promise((resolve,reject)=>{
        db.collection('data').add(data)
            .then((ref) =>{
                resolve(`New document added with ID: ${ref.id}`);
        }).catch((err)=>{
            console.log('Error adding new name', err);
            reject(err);
        });
    });
};

const callHourly = (task)=>{
    setInterval(task,1000*60*60);
};

const apiFetch = (address, method)=>{
    return new Promise ((resolve,reject) => {
        fetch(address,method)
            .then(data => data.json()
                .then((resp)=>{
                    resolve(resp);
                })
            ).catch( (err) =>{
                console.log(err);
                reject(err);
        } )
    })
};
// Write accesstoken to a json file
const writeFile=(data)=>{
    fs.writeFile('./data/accessToken.json',JSON.stringify(data),(err,data)=>{
        if(err) console.log(err);
        console.log(data);
    });
};
const fetchData = ()=>{
    apiFetch(`https://opendata.hopefully.works/api/events`,{
        method: 'GET',
        headers:{
            'Authorization': 'ACCESSTOKEN'
        },
    }).then(data =>{
        setData(data);
    })
        .catch(err=>{
            console.log(err);
        });
};

/* Käyttäjän haku
apiFetch(`https://opendata.hopefully.works/api/signup`,{
    email: "EMAIL",
    password: "PASSWORD"
},{
    method: 'POST',
    body: JSON.stringify(body),
    headers:{
        'Content-Type': 'application/json'
    },
}).then(data =>{
    writeFile(data);
});*/
fetchData();
callHourly(fetchData);

app.get('/data',(req,res)=>{
    getData().then(data =>{
        res.send({
            data: data
        });
    }).catch(err=>{
        console.log("problem with database",err);
    });
});

app.get('/',(req,res)=>{
    res.set('Cache-Control', 'public, max-age=300,s-maxage=600');
    res.render('index');
});
exports.app = functions.https.onRequest(app);