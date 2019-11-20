const express = require('express');
const app = express();

app.use(express.static(__dirname+"/globe"));
// app.use(express.static(__dirname+"/public/dist/public"));


app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.listen(8000, ()=> {
    console.log("listening on port 8000")
})