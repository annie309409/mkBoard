const express = require('express');
const router = express.Router();
const member = require('../modules/member');

router.get('/',async (req,res)=>{    
    res.render('member/login',{title:'로그인해주세요'});
});
router.post('/',async (req,res)=>{    
    let uid = req.body.userid;
    let upw= req.body.userpw;
    let pageView='/';
    let rs = new member().select(uid,upw).then(res=>res);
    if(await rs>=1){
        pageView='/board/list';
        req.session.userid = uid;
    }
    res.redirect(303,pageView);

});

router.get('/out',async (req,res)=>{    
    let pageView='/';
    req.session.destroy(()=> req.session);
    res.redirect(303,pageView);

});

module.exports =  router;