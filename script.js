//This import redis and fileSystem
const Redis = require('ioredis');
const XLSX = require("xlsx");

//create new redis instance and connect to it
const fs = require('fs');
const redis = new Redis({
    host: 'redis-15631.c266.us-east-1-3.ec2.cloud.redislabs.com',
    port: 15631,
    password: 'sx0Uo0jzGl4h0oX2Oq6bP2jFYoYrlkpp'
});

//Check for connection error, if error occur print it if not print connected 
redis.on('error', function(error){
    console.log('Error is ' + error);
    //process.exit();
});
redis.on('ready', function(error){
    console.log('connected');
   // process.exit();
});

//initialize redis database with one record
let squirrels = {squirrel:[

]};

/**
 * Stringify turns js object into json data 
 * The second argument is to filter which value the json should show from the object
 * The third argument describes spacing between each line in the json it goes from 0-10  
 */
//jsonString will be global here and updated based on different function call later on!
let jsonString = JSON.stringify(squirrels, null, 2);
//This function add new object to squirrel array
function appendObject(areaName1, AreaId1, color1, location1, aboveGroundFeet1, SpecificLocation1, activities1, HumanInteraction1){
    let newUser =  {
    areaName : areaName1,
    AreaId : AreaId1,
    color : color1,
    location : location1,
    aboveGroundFeet : aboveGroundFeet1,
    SpecificLocation : SpecificLocation1,
    activities : activities1,
    HumanInteraction : HumanInteraction1
    }
    squirrels.squirrel.push(newUser);
}
    //read through excel file and add each row to database
    const workbook = XLSX.readFile("base.xlsx");
    let object;
    for(let sheetName of workbook.SheetNames){
        object = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    }
    for(let i = 0; i < object.length; i++){
        appendObject(object[i].AREA_NAME, object[i].AREA_ID, object[i].COLOR, object[i].LOCATION, object[i].ABOVE_GROUND_FEET, object[i].SPECIFIC_LOCATION, object[i].ACTIVITIES, object[i].HUMAN_INTERACTION);
    }
    //jsonString = JSON.stringify(squirrels, null, 2);
    jsonString = JSON.stringify(squirrels, null, 2);
    redis.set("SQUIRRELS",jsonString);
function POST(areaName1, AreaId1, color1, location1, aboveGroundFeet1, SpecificLocation1, activities1, HumanInteraction1){
    appendObject(areaName1, AreaId1, color1, location1, aboveGroundFeet1, SpecificLocation1, activities1, HumanInteraction1);
    //jsonString = JSON.stringify(squirrels, null, 2);
    jsonString = JSON.stringify(squirrels);
    redis.set("SQUIRRELS",jsonString);
}

//This function get whole database in json format then print it to the console
function GET(){
    /**
     * we use async function because a request is being made and the function has to wait for the request to complete to return a value
     * if async is not used the function might return null because the function returns faster than the request 
     */
    async function userData (){
        let response = await redis.get("SQUIRRELS");
        console.log(response);
        return response;
    }
    // A ".then" should always be used because the request is a one way trip we use then to check id the request was fulfilled
    userData()
    .then(function(result){
        console.log(result);
    });
}
//This function will delete the entire database
function DEL (){
    redis.DEL("SQUIRRELS");
}
console.log(squirrels.squirrel[0].color)
console.log(squirrels.squirrel[8])
