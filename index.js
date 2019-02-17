'use strict';
// Node doesn't have fetch as a default
const fetch = require('node-fetch');
const fs = require('fs');
const express = require('express');

const app = express();

app.get('/',(req,res)=>{

});

const curDate= new Date();
const callHourly = (task)=>{
    setInterval(task,1000*60*60);
};

const apiFetch = (address,body, method)=>{
    return new Promise ((resolve,reject) => {
        fetch(address,method)
            .then(data => data.json()
                .then((resp)=>{
                    console.log(resp);
                    resolve(resp);
                })
            ).catch( (err) =>{
            console.log(err);
            reject(err);
        } )
    })
};
const writeFile=(data)=>{
    fs.writeFile('./data/accessToken.json',JSON.stringify(data),(err,data)=>{
        if(err) console.log(err);
        console.log(data);
    });
};
/*
apiFetch(`https://opendata.hopefully.works/api/signup`,{
    email: "japaniHenri@gmail.com",
    password: "PuhdasPajatso&Kyllikki"
},{
    method: 'POST',
    body: JSON.stringify(body),
    headers:{
        'Content-Type': 'application/json'
    },
}).then(data =>{
    writeFile(data);
});*/
apiFetch(`https://opendata.hopefully.works/api/events`,{
    email: "japaniHenri@gmail.com",
    password: "PuhdasPajatso&Kyllikki"
},{
    method: 'POST',
    body: JSON.stringify(body),
    headers:{
        'Content-Type': 'application/json'
    },
    authorization: "Bearer"
}).then(data =>{
    writeFile(data);
});
