const express = require('express');
const app = express();
const path = require('path');
const logger = require('morgan');
const {engine}= require('express-handlebars');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3007;

const indexRouter = require('./route/index');
const oracledb = require('./modules/Oracle');

oracledb.initConn();

//미들웨어
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.json());
app.engine('hbs',engine({
    extname: '.hbs',
    defaultLayout : 'layout',
    helpers: {
        section: function(name, options) {
            if(!this._sections) this._sections = {}
            this._sections[name] = options.fn(this)
            return null
        },
    },
}))
app.set('views',path.join(__dirname,'views'));
app.set('view engine','hbs');


//기본 라우팅
app.use(express.static(path.join(__dirname,'static')));

//정상요청 라우팅
app.use('/',indexRouter);

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
    console.log('서버가 실행됐습니다. 종료 하려면 ctrl+v');
});


app.use(logger('div'));