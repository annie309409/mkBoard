const express = require('express');
const router = express.Router();
const sqlInput = require('../modules/sqlInsert');
router.get('/',async (req,res)=>{
    let brd = new sqlInput().selector().then(async result => {
        return await result;
    });
    res.render('list',{title:'게시판 입니다.',brd:brd});
});
router.get('/write',(req,res)=>{
    res.render('write',{title:'글을 써 주세요.'})
});

router.post('/write',async (req,res)=>{
    new sqlInput(req.body.title,req.body.newid,req.body.viewnote).inserter();
    res.redirect(304,'/');
});


module.exports =  router;