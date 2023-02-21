const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const {engine}= require('express-handlebars');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3007;

const indexRouter = require('./route/index');
const boardRouter = require('./route/board');
const memberRouter = require('./route/Member');
const oracledb = require('./modules/Oracle');
const session = require('express-session');
const helpers = require('./route/Helpers');


oracledb.initConn();

//핸들바
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('hbs',engine({
    extname: '.hbs',
    defaultLayout : 'layout',
    helpers: helpers,
    },
));
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');


//세션
const maxAge = 1000 * 30;
const sessionObj = {
    resave: false, saveUninitialized: false,
    secret: 'process.env.COOKIE_SECRET',
    cookie: { httpOnly: true, secure: false, },
    name: 'session-cookie',
    maxAge: maxAge
};
app.use(session(sessionObj));

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

//기본 라우팅
app.use(express.static(path.join(__dirname,'static')));

//정상요청 라우팅
app.use('/',indexRouter);
app.use('/board',boardRouter);
// app.use('/member',memberRouter);

// 에러페이지 처리
app.use((req,res)=>{
    res.status(404);
    res.send('404-페이지가 없습니다.');
});

app.use((error,req,res)=>{
    //오류메세지 출력
    console.error(error);
    res.status(500);
    res.send('500-에러입니다');
});

//서버구동
app.listen(port,()=>{
    console.log('서버가 실행됐습니다. 종료 하려면 ctrl+c');
});


app.use(logger('div'));