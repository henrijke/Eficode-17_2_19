const fetch = require('node-fetch');
/*
const apiFetch = (address,body, method)=>{
    return new Promise ((resolve,reject) => {
        fetch(address,method)
            .then(data => {
                console.log(data);
                data.json()
            })
            .then((resp)=>{
                    console.log(resp);
                    resolve(resp);
                })
            .catch( (err) =>{
            console.log(err);
            reject(err);
        } )
    })
};
const fetchData = ()=>{
    return apiFetch(`https://opendata.hopefully.works/api/events`,{
        method: 'GET',
        headers:{
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoiamFwYW5paGVucmlAZ21haWwuY29tIiwiaWF0IjoxNTQ5OTMyMjkyfQ.tL3UyWO1XF4m9AA9ytxKNKIv-mCLHj9kgKODSfGR7Zs",
            "Content-Type": "application/json"
        },
    }).then(data =>{
        //writeFile(data);
        console.log(data);
        return data;
    });
};

fetchData();
*/
fetch(`https://opendata.hopefully.works/api/events`,{
    method: 'GET',
    headers:{
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDYsImVtYWlsIjoiamFwYW5paGVucmlAZ21haWwuY29tIiwiaWF0IjoxNTQ5OTMyMjkyfQ.tL3UyWO1XF4m9AA9ytxKNKIv-mCLHj9kgKODSfGR7Zs",
        "Content-Type": "application/json"
    }})
    .then(data => {
        console.log(data);
        data.json()
            .then((resp)=>{
            console.log(resp);
            })
    })
    .catch( (err) =>{
        console.log(err);
        reject(err);
    });