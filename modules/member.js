const express = require('express');
const router = express.Router();
const oracledb = require('../modules/Oracle');

let sql = {
    'select':`SELECT count(USERID) cnt FROM "MEMBER" WHERE USERID =:1 AND PASSWD = :2`,
    'insert':``,
    'delete':``,
    'update':``,
}

class member{
    constructor(mno,userid,passwd,name,email,regdate){
        this.mno = mno;
        this.userid =  userid;
        this.passwd= passwd;
        this.name = name;
        this.email = email;
        this.regdate = regdate;
    }
    async select(uid,pwd){
        let conn = null;
        let result = null;
        let dts = 0;
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.select,[uid,pwd],oracledb.options);
            let rs =  await result.resultSet;
            let row = null;
            while((row = await rs.getRow())){
                dts= row.CNT;
            }

        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }
}

module.exports = member;