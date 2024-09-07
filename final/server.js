// server.js
const MongoClient = require('mongodb-legacy').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url); //Creates mongo client
const dbname = 'user-info'; //Database needed access to



// load the things we need
var express = require('express');
var session = require('express-session'); //npm install express-session
var bodyParser = require('body-parser'); //npm install body-parser
const { Console, profile } = require('console');
const app = express();
//Socket IO
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(session({ secret: 'example' }));    //Tells express sessions are being used

app.use(express.static("public")); //Defines public "static" folder

app.use(bodyParser.urlencoded({     //Tells express we want to read POSTED forms
    extended: true
}));

app.set('view engine', 'ejs');  // set the view engine to ejs

http.listen(8080, function(){
    console.log('HTTP listening on *:8080');
});

var db;
//run the connect method.
connectDB();
async function connectDB() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    db = client.db(dbname);
    // app.listen(8080);
    // console.log('8080 is the magic port');
    
};
// use res.render to load up an ejs view file
// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});
// dashboard page
app.get('/dashboard', function(req, res) {
    if(!req.session.loggedin){res.redirect('/');return;}

    //Gets current user
    var currentuser = req.session.currentuser;

    //Gets current users profile pic
    db.collection('users').findOne({"login.username":currentuser}, function (err, userpic){
        if(err) throw err;

        var ppic = userpic.picture; 
        var postSort = { "published": -1 };
        //Getting all User posts
        db.collection('posts').find().sort(postSort).toArray(function(err, result){
            if (err) throw err;
            
            res.render('pages/dashboard', {
                posts: result,
                profilepic: ppic,
                user: currentuser
            })
        });
    });  
});

// weather page
app.get('/weather', function(req, res) {
    if(!req.session.loggedin){res.redirect('/');return;}
    
    //Gets current user
    var currentuser = req.session.currentuser;
   
    //Gets current users profile pic
    db.collection('users').findOne({"login.username":currentuser}, function (err, userpic){
        if(err) throw err;

        var ppic = userpic.picture; 


    res.render('pages/weather', {
        profilepic: ppic,
        user: currentuser
    })
})
});

// Settings page
app.get('/settings', function(req, res) {
    if(!req.session.loggedin){res.redirect('/');return;}
    //Gets current user
    var currentuser = req.session.currentuser;
   
    //Gets current users profile pic
    db.collection('users').findOne({"login.username":currentuser}, function (err, userDetails){
        if(err) throw err;

        var ppic = userDetails.picture;
        var userEmail = userDetails.email;
        var userid = userDetails._id;

        res.render('pages/settings', {
            profilepic: ppic,
            email: userEmail,
            id: userid,
            user: currentuser
        })
    });
});

// profile page
app.get('/profile', function(req, res) {
    if(!req.session.loggedin){res.redirect('/');return;}

    //Gets current user
    var currentuser = req.session.currentuser;

    //Gets current users profile pic
    db.collection('users').findOne({"login.username":currentuser}, function (err, userpic){
        if(err) throw err;

        var ppic = userpic.picture; 
        var background = userpic.background;
        var userid = userpic._id;
        var postSort = { "published": -1 };
        //Gets current users posts
        db.collection('posts').find({"Author": currentuser}).sort(postSort).toArray(function(err, result){
            if (err) throw err;


            
                res.render('pages/profile', {
                    user: currentuser,
                    posts: result,
                    profilepic: ppic,
                    backgroundPic: background,
                    userNo: userid,
                    postnum: result.length  //counts users posts
                })
            
        });
    });
    
});

//chat page
app.get('/chat', function(req, res){
    if(!req.session.loggedin){res.redirect('/');return;} 

    //Gets current user
    var currentuser = req.session.currentuser;

    //Gets current users profile pic
    db.collection('users').findOne({"login.username":currentuser}, function (err, userpic){
        if(err) throw err;

        var ppic = userpic.picture; 

        res.render('pages/chat', {
            profilepic: ppic,
            user: currentuser
        })
    });
});
// CHAT SYSTEM
io.on('connection', function(socket){
        console.log('a user connected to the chat system');
        socket.on('disconnect', function () {
        console.log('user disconnected from the chat system');
    });
            
    socket.on('chat message', function (chatusername, msg){       
        /*console.log(msg, chatusername)
        console.log('server')*/
        io.emit('chat message', chatusername, msg);
    });
});

// LOGS OUT USER
app.get('/logout', function(req, res) {
    req.session.loggedin = false;
    req.session.destroy();
    res.redirect('/');
});

// Updates the users username in the settings page
 app.post('/updateUsername', function(req, res) {
    var query = { "login.username": req.session.currentuser};
    var newvalues = { $set: {"login.username": req.body.updateUsername}};
    db.collection('users').updateOne(query,newvalues, function(err, result) {
    if (err) throw err;
        res.redirect('/');
    });
});

// Updates the users profile picture in the settings page
app.post('/updateProfilePic', function(req, res) {
    var query = { "login.username": req.session.currentuser};
    var newvalues = { $set: {"picture": req.body.updatePPic}};
    db.collection('users').updateOne(query,newvalues, function(err, result) {
    if (err) throw err;
        res.redirect('/settings');
    });
});

// Updates the users background picture in the settings page
app.post('/updateBackgroundPic', function(req, res) {
    var query = { "login.username": req.session.currentuser};
    var newvalues = { $set: {"background": req.body.updateBackground}};
    db.collection('users').updateOne(query,newvalues, function(err, result) {
    if (err) throw err;
        res.redirect('/settings');
    });
});

// Routes to other users profile pages
app.get('/user/:username', function(req, res){
    var username = req.params.username;
    var currentuser = req.session.currentuser;

    //Gets current users profile pic
    db.collection('users').findOne({"login.username":currentuser}, function (err, userpic){
        if(err) throw err;
        var navPic = userpic.picture; 

        db.collection('users').findOne({"login.username": username}, function(err, result){
            if(err) throw err;
            var ppic = result.picture; 
            var profileBackground = result.background;

            db.collection('posts').find({"Author": username}).toArray(function(err, result){
                if (err) throw err;

                res.render('pages/user', {
                    user: username,
                    ppic: ppic,
                    posts: result,
                    profilepic: navPic,
                    bpic: profileBackground
                })
            });    
        });
    });
 });

    

app.post('/addPost', function(req, res){
    //data needs stored
    const isoDate = new Date();
    const ISO = isoDate.toISOString();
    var currentuser = req.session.currentuser;
    db.collection('users').findOne({"login.username":currentuser}, function (err, authPic){
        if(err) throw err;
        var authorPic = authPic.picture;
            
        var datatostore = {
            "title":req.body.title,
            "category":req.body.category,
            "headerImg":req.body.headerImg,
            "description":req.body.description,
            "authorPic": authorPic,
            "Author":req.session.currentuser,
            "authorURL": "/user/" + req.session.currentuser,
            "published":ISO.slice(0 , 19) // Cuts out unwanted date information
        }
        db.collection('posts').insertOne(datatostore, function(err, result){
            if (err) throw err;
                console.log("saved to database");
                //when complete redirect back to index
                res.redirect('/dashboard');
        });
    });  
});

app.post('/dologin', function(req, res){
    //console.log(JSON.stringify(req.body));

    //Gets variables from the login form
    var uname = req.body.uname;
    var pword = req.body.psw;

    //Looks through database for user
    db.collection('users').findOne({"login.username":uname}, function (err, result){
        if (err) throw err;

        //If no result returns to index page
        if (!result){res.redirect('/');
            console.log("No username result");
        return}

        //Checks if password is same as database        //If it is then sends out current username
        if(result.login.password == pword){ req.session.loggedin = true; req.session.currentuser = uname; res.redirect('/dashboard') }
        else{
            res.redirect('/')
        }
    });
});

app.post('/dosignup', function(req, res){

    //Example of what data needs stored
    var datatostore = {
        "email":req.body.email,
        "login":{"username":req.body.uname, "password":req.body.psw},
        "picture":req.body.picture,
        "background":"https://www.solidbackgrounds.com/images/1920x1080/1920x1080-battleship-grey-solid-color-background.jpg"
    }

    var uname = req.body.uname;

    //Searches database to check if username already exists
    db.collection('users').findOne({"login.username":uname}, function (err, result){
        if (err) throw err;
            //If doesn't exist create new user
        if(!result){
            db.collection('users').insertOne(datatostore, function(err, result){
                if (err) throw err;
                    console.log("saved to database");
                //when complete redirect back to index
                res.redirect('/');
            })
        }
        else {
            console.log("User already exists")
            res.redirect('/')
        }
    });
});