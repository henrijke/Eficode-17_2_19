'use strict';
const canvas = document.querySelector('#canvas');
const sens1 = document.querySelector('#sens1');
const sens2 = document.querySelector('#sens2');
const sens3 = document.querySelector('#sens3');
const sens4 = document.querySelector('#sens4');
const header = document.querySelector('#dateHeader');
const lowest = document.querySelector("#lowest");
const highest = document.querySelector("#highest");
const secretBack = document.querySelector('#secretBack');
const ramen = document.querySelector('#ramen');
const ramenImg = document.querySelector('#ramenImg');
const main = document.querySelector('#main');
const secretBut = document.querySelector('#secretBut');

let sensorData = {};
//takes coordinates and canvas as parameter. Draws the line
const checkY = (yCoord)=>{
    if(yCoord + 10 > canvas.height){
        return canvas.height - 20;
    }else if(yCoord -20 < 0){
        return 10;
    }
    return yCoord;
};
// checks the x coordinate so it fits to the canvas
const checkX = (xCoord) =>{
    if(xCoord +40 > canvas.width) return canvas.width-30;
    return xCoord;
};
// Flips the y coordinate
const flipY = (canvasHeight,yHeight)=>{
    return canvasHeight-yHeight;
};
const drawLine=(canvas, fromX, fromY, whereX, whereY, color)=>{
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(whereX, whereY);
    ctx.stroke();
};
// writes a text to the canvas
const drawText = (canvas,x,y,value)=>{
    const ctx = canvas.getContext("2d");
    ctx.font = "12px Arial";
    ctx.fillText(value,checkX(x)+10,checkY(y));
};
// Clears the canvas
const clearCanvas = ()=>{
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};
// Find the lowest and highest positions
const handleMinMax = (array)=>{
    const minMax={
        lowest:array[0],
        highest:array[0]
    };
    for(let ar of array){
        if(ar < minMax.lowest) minMax.lowest = ar;
        if(ar > minMax.highest) minMax.highest = ar;
    }
    return minMax;
};

// calculates the interval for y coordinate
const fitToCanvasYCoord=(array,yVar, lowest)=>{
    const yArray = [];
    for(let ar of array){
        yArray.push(flipY(canvas.height,(ar-lowest)*yVar));
    }
    return yArray;
};
// calculates the interval for x coordinate
const fitToCanvasXCoord=(array,xVar)=>{
    const xArray = [];
    for(let i=0;i< array.length;i++){
        xArray.push(xVar*i);
    }
    return xArray;
};
// loops that draw the lines, then writes the texts
const drawLines = (canvas,xArray,yArray,color, yValue)=>{
    for(let i=0;i<xArray.length;i++){
        if(xArray.length !== i+1) drawLine(canvas,xArray[i],yArray[i],xArray[i+1],yArray[i+1],color);
    }
    let skipper = 0;
    if(xArray.length > 10) skipper = Math.floor(xArray.length/10);
    for(let j=0; j<xArray.length;j++){
        if(j%skipper === 0 ) drawText(canvas,xArray[j],yArray[j],yValue[j]);
    }
};
// Helper that fits the data so it can be drawn to the canvas
const canvasHelper = (array,color)=>{
    const minMax = handleMinMax(array);
    // counting whats the interval for x coordinate
    const xInterval = Math.floor(canvas.width/array.length);
    // Need to know whats the difference between highest and lowest y
    const sum = minMax.highest - minMax.lowest;
    // setting the interval of y coordinate
    const yInterval = Math.floor(canvas.height/sum);
    const yArrays = fitToCanvasYCoord(array,yInterval,minMax.lowest);
    const xArrays = fitToCanvasXCoord(array,xInterval);
    clearCanvas();
    drawLines(canvas,xArrays,yArrays,color,array);
    highest.innerHTML = minMax.highest;
    lowest.innerHTML = minMax.lowest;
};
// take the value of the object and push it to a list, also round to one decimal
const listItems = (arrayData,valueName)=>{
    const list = [];
    for(let data of arrayData){
        list.push(Math.round(data[valueName]*10)/10);
    }
    return list;
};
// take the database data and parse it so it's easier to handle
const parseData = (data)=>{
    data.sort(compare);
    let sensorData = {
    };
    sensorData.date = data[data.length-1].date;
    sensorData.sensor1 = listItems(data,"sensor1");
    sensorData.sensor2 = listItems(data,"sensor2");
    sensorData.sensor3 = listItems(data,"sensor3");
    sensorData.sensor4 = listItems(data,"sensor4");
    return sensorData;
};
const setSensorData= (data)=>{
    sensorData = data;
};
// compare function to arrange the database data, note: you can arrange data by date from database... woops
const compare=(a,b)=>{
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    let comparison = 0;
    if(dateA > dateB) {
        comparison = 1;
    }else if(dateA < dateB) comparison = -1;
    return comparison;
};
// Shhh secret stuff
const secretHide = ()=>{
    main.classList.toggle('hidden');
    ramen.classList.toggle('hidden');
    secretBut.classList.toggle('hidden');
};
secretBut.addEventListener('click',secretHide);
secretBack.addEventListener('click',secretHide);
let ramenCounter = 1;
ramenImg.addEventListener('click',()=>{
    ramenCounter++;
    if(ramenCounter>6)ramenCounter = 1;
    ramenImg.src = `img/ramen${ramenCounter}.jpg`;
});
// Fetch the data from database
const fetchData = ()=>{
    fetch('/data').then(data =>{
            data.json().then(json =>{
                // parse the data and save it to a constant
                setSensorData(parseData(json.data));
                // Write newest time to header
                const date = new Date(sensorData.date);
                header.innerHTML = `Most recent data is from ${ new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(date)} at ${date.getHours()}:${date.getMinutes()}`;
                // Listeners for buttons
                sens1.addEventListener('click',()=>{
                    canvasHelper(sensorData.sensor1,'#70b77e');
                });
                sens2.addEventListener('click',()=>{
                    canvasHelper(sensorData.sensor2,'#e0a890');
                });
                sens3.addEventListener('click',()=>{
                    canvasHelper(sensorData.sensor3,'#ce1483');
                });
                sens4.addEventListener('click',()=>{
                    canvasHelper(sensorData.sensor4,'#065143');

                });
            })
        }).catch(err => console.log(err));
};
window.onload = fetchData();