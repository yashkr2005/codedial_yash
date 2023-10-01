const express=require('express');
const cookieParser=require('cookie-parser');
const bodyParser=require('body-parser');

//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');

const router = require('./routes/index');
const sassMiddleware=require('node-sass-middleware');
const app=express();
const port=8000;

const db=require('./config/mongoose');
const expressLayouts=require('express-ejs-layouts');
// const MongoStore=require('connect-mongo')(session);
const MongoStore=require('connect-mongo');
const { default: mongoose } = require('mongoose');

const flash=require('connect-flash');
const customMware=require('./config/middleware');


// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');


app.use(sassMiddleware({
    src:'./assests/scss',
    dest:'./assests/css',
    debug:true,
    outputStyle:'extended',
    prefix:'/css'
}))

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressLayouts);
app.use('/uploads',express.static(__dirname+'/uploads'));
//extract styles and scripts from subpages to layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);
app.use(express.static('./assests'));


//setup of view engine
app.set('view engine','ejs');
app.set('views','./views');

//mongo store is used to store the session cookie in the db
app.use(session({
    name: 'codeial',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store:  MongoStore.create({
        mongoUrl: 'mongodb://localhost/codeial_development' ,
        autoRemove:'disabled',
    },
    function(err)
    {
        console.log(err||'connect-mongodb setup ok');
    }
    )
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);
// use express router
app.use('/', require('./routes'));

app.listen(port,function(err){
    if(err)
    {
        // console.log('Error',err);//same as down another way of writing
        console.log(`Error : ${err}`);
    }
    console.log(`Server is running on port : ${port}`);
});
