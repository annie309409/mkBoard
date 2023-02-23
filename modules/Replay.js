const express = require('express');
const router = express.Router();
const oracledb = require('../modules/Oracle');

let sql = {
    'select':`SELECT rep.*, to_char(regdate,'YYYY-MM-DD HH:MI:SS') regdate2 FROM rep WHERE bno =:1`,
    'insertRep':`INSERT INTO rep (reno,bno,note,writer) VALUES (reno.nextval,:1,:2,:3)`,
    'delete':``,
    'update':``,
}

class rep{
    constructor(reno,bno,note,writer,likes){
        this.reno = reno;
        this.bno = bno;
        this.note = note;
        this.writer = writer;
        this.likes = likes;
    }
    async selectOne(brno){
        let conn = null;
        let result = null;
        let dts = [];
        let row=null;
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.select,[brno],oracledb.options);
            let rs =  await result.resultSet;
            while((row = await rs.getRow())){
                let dt1 = new rep(row.RENO,row.BNO,row.NOTE,row.WRITER,row.LIKES);
                dt1.regdate = row.REGDATE2;
                dts.push(dt1);
            }
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }
    async insert(brno,note,writer){
        let conn = null;
        let result = null;
        let params = [brno,note,writer];
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.insertRep,params);
            await conn.commit();
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
    }
}

module.exports = rep;