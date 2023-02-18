const express = require('express');
const router = express.Router();
const sqlInput = require('../modules/sqlInsert');
const oracledb = require('../modules/Oracle');
router.get('/',async (req,res)=>{    
    let board = new sqlInput().selector().then(async result => {
        return await result;
    });
    // 보내기
    res.render('list',{title:'게시판 입니다.',board:await board});
});

router.get('/view',async (req,res)=>{
    let brno = req.query.brno;
    let hits = req.query.hits;
    let board =  new sqlInput().selectOne(brno).then(async result=>{
        return await result;
    }); 
    if(hits!=undefined){
        new sqlInput().updateHits(brno,hits);
    }
    res.render('view',{title:'페이지타이틀',board:await board});
});

router.get('/del',async (req,res)=>{
    let brno = req.query.brno;
    new sqlInput().delete(brno);
    res.redirect('/');
});

router.get('/write',(req,res)=>{
    res.render('write',{title:'글을 써 주세요.'});
});

router.post('/write',async (req,res)=>{
    new sqlInput(req.body.title,req.body.newid,req.body.viewnote).inserter();
    res.redirect('/');
});

router.get('/modify',async(req,res)=>{
    let title = req.query.title;
    let note = req.query.viewnote;
    let brno = req.query.brno;
    if(title != undefined){
        new sqlInput().updates(brno,title,note);
        res.redirect(`/view?brno=${brno}`);
    }else{
        brno2 = new String(brno);
        let board =  new sqlInput().selectOne(brno).then(async result=>{
            return await result;
        });
        res.render('modify',{title:'수정페이지',board: await board});
    }
});

module.exports =  router;