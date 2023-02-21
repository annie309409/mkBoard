const express = require('express');
const router = express.Router();
const sqlInput = require('../modules/sqlInsert');
const sqlRep = require('../modules/Replay');

router.get('/list',async (req,res)=>{
    let board = new sqlInput().selector().then(async result => {
        return await result;
    });
    if(req.session.userid){
        await res.render('board/list',{title:'게시판 입니다.',board:await board});
    }else{
        res.redirect(303,'/');
    }
});

router.get('/view',async (req,res)=>{
    let brno = req.query.brno;
    let board =  new sqlInput().selectOne(brno).then(async result=>{
        return await result;
    });
    //리플불러오기
    let re = new sqlRep().selectOne(brno).then(async res =>{
        return await res;
    });
    //페이징 처리
    if(req.session.userid){
        res.render('board/view',{title:'페이지타이틀',board:await board,re:await re});
    }else{
        res.redirect(303,'/');
    }
});

router.get('/del',async (req,res)=>{
    if(req.session.userid){
        let brno = req.query.brno;
        new sqlInput().delete(brno);
        res.redirect('/board/list');
    }
});

router.get('/write',(req,res)=>{
    if(req.session.userid){
        res.render('board/write',{title:'글을 써 주세요.'});
    }
});

router.post('/write',async (req,res)=>{
    new sqlInput(req.body.title,req.body.newid,req.body.viewnote).inserter();
    res.redirect('/board/list');
});

router.get('/modify',(req,res)=>{
    if(req.session.userid){
        let {title,note,brno,writer}= req.query;     
        let board = {
            title: title,
            note: note,
            brno:brno,
            writer:writer,
        }
        res.render('board/modify',{title:'수정페이지',board: board});
        }
});

router.post('/modify',(req,res)=>{
    if(req.session.userid){
        let {title,viewnote,brno}= req.body;
        new sqlInput().updates(brno,title,viewnote);
        res.redirect(`/board/view?brno=${brno}`);
    }
});

router.get('/addrep',async(req,res)=>{
    let {brno,wt,nt} = req.query;
    if(req.session.userid){
        new sqlRep().insert(brno,nt,wt);
    }
    res.redirect(303,`/board/view?brno=${brno}`);
});
module.exports =  router;