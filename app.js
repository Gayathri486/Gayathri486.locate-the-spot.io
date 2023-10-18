//import all the packages
var express=require("express");
var cors=require("cors");
var bodyparser=require("body-parser");
var mongodb=require("mongodb");
var jwtsimple=require("jwt-simple");
//create an object of express
var app=express();
app.use(cors());//enabling cors to express for cross domain calls from browser
app.use(bodyparser.json());//configuring bodyparser to express to convert client submitted data into json
//declare variable
var port=5000;
var secretkey="vnrvjiet";
var mongodburl="mongodb://localhost:27017";
//create mongodb client to communicate with mongodb server
var mongoclient=mongodb.MongoClient;//MongoClient is same as mongo.exe in express
//writting express restapi methods
app.post("/register",(req,res)=>{
   //connect to mongodb using mongoclient
   mongoclient.connect(mongodburl,(err,dc)=>{
       //para err will receive an error object,if connection is failed
       //para dc will receive database connection,if connection is success
       if(err) throw err; //terminating node server app
       let db=dc.db("angularbatch");
       db.collection("usersinfo").find({username:req.body.username}).toArray((err,users)=>{
           if(users.length==0)
           {//username available for registration
            db.collection("usersinfo").insertOne({username:req.body.username,password:req.body.password},(err,user)=>{});
             //it will insert rec into usersinfo table
             res.send({register:"success"});
           }
           else
           res.send({register:"fail"});
       });//close toarray
         });//close connect
});//closing post

app.post("/login",(req,res)=>{
    mongoclient.connect(mongodburl,(err,dc)=>{
        if(err) throw err;
        let db=dc.db("angularbatch");
        db.collection("usersinfo").find({username:req.body.username,password:req.body.password}).toArray((err,users)=>{
            if(users.length==0)
             res.send({login:"fail"});
             else
             {//authetication is success,so generate jwttoken
               let token=jwtsimple.encode({username:req.body.username},secretkey);
               res.send({login:"success",jwttoken:token});
             }
        });
    });
});
//writting secured methods
app.get("/tutorials",(req,res)=>{
  try{
    var uinfo=jwtsimple.decode(req.headers.token,secretkey);
    //req.headers.token will provide jwt token[header.body.signature]
    //decode method will hash header+body of jwttoken using secretkey to produce signature,this signature will be verified with signature comes with jwttoken,if it is matching body content of jwt token will be decoded into json object[{username:..}] and will be assigned to uinfo variable,otherwise expection will be thrown
    res.send({tutorials:"tutorials info"});
  }
  catch(ex)
  {
    res.send({tutorials:"not authorized"});
  }
});
app.get("/books",(req,res)=>{
  try{
    var uinfo=jwtsimple.decode(req.headers.token,secretkey);
    //req.headers.token will provide jwt token[header.body.signature]
    //decode method will hash header+body of jwttoken using secretkey to produce signature,this signature will be verified with signature comes with jwttoken,if it is matching body content of jwt token will be decoded into json object[{username:..}] and will be assigned to uinfo variable,otherwise expection will be thrown
    res.send({books:"books info"});
  }
  catch(ex)
  {
    res.send({books:"not authorized"});
  }
});
// new methods added for vnrvjiet locate the spot
app.post("/addfaculty",(req,res)=>{
  //connect to mongodb using mongoclient
  mongoclient.connect(mongodburl,(err,dc)=>{
      //para err will receive an error object,if connection is failed
      //para dc will receive database connection,if connection is success
      if(err) throw err; //terminating node server app
      let db=dc.db("angularbatch");
        db.collection("facultyinfo").insertOne({facname:req.body.facname,deptname:req.body.deptname,roomno:req.body.roomno,mobileno:req.body.mobileno, key:req.body.key},(err,user)=>{
           if(err)
           res.send({addfaculty:"fail"});
           else
           res.send({addfaculty:"success"});

        });
                 });//close connect
});//closing post

app.post("/searchroom",(req,res)=>{
  //connect to mongodb using mongoclient
  mongoclient.connect(mongodburl,(err,dc)=>{
      //para err will receive an error object,if connection is failed
      //para dc will receive database connection,if connection is success
      if(err) throw err; //terminating node server app
      let db=dc.db("angularbatch");
      db.collection("facultyinfo").find({facname:req.body.facname,deptname:req.body.deptname}).toArray((err,facinfo)=>{
        if(facinfo.length==0)
         res.send({searchroom:"fail"});
         else
         {
           res.send({searchroom:"success",roomno:facinfo[0].roomno,mobileno:facinfo[0].mobileno,key:facinfo[0].key});
         }
    });
  });
});
//hosting restapi methods with the port 5000

app.listen(port,(err)=>{
  if(err) throw err;
  console.log("node server hosting express restapi methods with the port 9900");
});





















