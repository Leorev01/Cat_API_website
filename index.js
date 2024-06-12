import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

//create variables for express and port location
const app = express();
const port = 3000;

//create variable for standard api url
const API_URL = "https://cataas.com";

//bodyparser
app.use(bodyParser.urlencoded({extended:true}));

//static files
app.use(express.static("public"));

//set index.ejs as default url
app.get("/", (req,res) => {
    res.render("index.ejs", {
        image: ""
    });
});

//return random cat image
app.get("/randomImage", async (req,res) => {
    try{
        const result = await axios.get(API_URL+"/cat?json=true");
        res.render("index.ejs", {
            image : API_URL+"/cat/"+result.data._id
        });

    }catch(error){
        console.log("Error: "+error);
        res.status(500);
    }
    

});

//return a random cat gif
app.get("/randomGif", async (req,res) => {
    try{
        const result = await axios.get(API_URL+"/cat/gif");
        res.render("index.ejs", {
            image: API_URL+"/cat/"+result.data._id
        })
    }
    catch(error){
        console.log("Error: "+error);
        res.status(500);
    }
});

//return a random cat image with selected text
app.get("/catTalk", async (req,res) => {
    try{
        const text = req.query.text;
        console.log(text);
        const result = await axios.get(API_URL+"/cat/says/"+text);
        res.render("index.ejs", {
            image: API_URL+"/cat/says/"+text
        })
    }
    catch(error){
        res.render("index.ejs", {
            error: "Please enter some text"
        });
        console.log("Error: User did not input text");
        res.status(500);
    }
});

//return a random cat image with selected tag
app.get("/catTag", async (req,res) => {
    try{
        const tag = req.query.tag;
        console.log(tag);
        const result = await axios.get(API_URL+"/cat/"+tag);
        res.render("index.ejs", {
            image: API_URL+"/cat/"+tag
        });
    }
    catch(error){
        const tag = req.query.tag;
        switch(tag){
            case "":
                res.render("index.ejs", {
                    error: "Please enter some text"
                });
                break;
            default:
                res.render("index.ejs", {
                    error: "Tag does not exist, please try another"
                });  
        }
        console.log("Error: User did not input tag");
        res.status(500);
    }
    
});

//return 404 error not found for any other page
app.use((req, res) => {
    req.url = req.url.replace("404");
    res.render("404.ejs");
  });


//create localhost location
app.listen(port, ()=>{
    console.log("Listening on port "+port);
});