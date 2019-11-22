const express = require('express');
const app = express();

app.use(express.static(__dirname+"/globe"));
// app.use(express.static(__dirname+"/public/dist/public"));


app.use(express.urlencoded({extended: true}));
app.use(express.json());


const server = app.listen(8000, ()=> {
    console.log("listening on port 8000")
});

const io = require('socket.io')(server);
const axios = require('axios');
const fs = require('fs');

io.on('connection',(socket) =>{
    console.log("connected");
    
    setInterval(getEQData,60000);
    
    function getEQData(){
        console.log("hello ");
        long_lat = [];
        axios.get("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson")
        .then(response =>{
            let local_data = response['data']['features'];
            //console.log(local_data);
            tempObj = [];
            for (let i = 0;i <local_data.length; i++){

                tempObj.push(local_data[i].geometry['coordinates'][1]);
                tempObj.push(local_data[i].geometry['coordinates'][0]);
                // We divide the magnitude by 10 to get a number between 0 and 1
                tempObj.push(local_data[i]['properties'].mag/10);
            }
            long_lat.push("long_lat");
            long_lat.push(tempObj);
            var jsonObj = [];
            jsonObj.push(long_lat);
            // console.log("----------")
            //console.log(jsonObj);
            var jsonData = JSON.stringify(jsonObj);
            console.log(jsonData);
            // console.log("************");
            fs.writeFile("./globe/earth_quakes.json",jsonData,'utf8',function(err){
                if (err){
                    console.log("error in writing the json");
                }
                else {
                    console.log("Written into json")
                    socket.emit('new_eq_data',{num_of_eqs:local_data.length});
                }
            })
            
            
        }).catch(error =>{
            console.log(eror);
        })
    }
})