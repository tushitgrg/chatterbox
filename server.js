var express=require("express");
const { v4: uuidv4 } = require('uuid');

let app=express();
app.listen(2001,function()
{
    console.log("Server Started   :-)");
})

app.get("/",function(req,resp){


    resp.sendFile(__dirname+"/public/lobby.html");
    
    
    })

    app.get("/meeting",function(req,resp){


        resp.sendFile(__dirname+"/public/room.html");
        
        
        })

app.use(express.static("public"));

app.use(express.urlencoded("true"));