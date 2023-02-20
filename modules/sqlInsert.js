const express = require('express');
const router = express.Router();
const oracledb = require('../modules/Oracle');

let sql = {
    'input' :`insert into testBoard(brno, title, writer, note) values (brno.nextval,:1,:2,:3)`,
    'select':`select brno,title, writer, note,hits, to_char(regdate,'YYYY-MM-DD') regdate from testBoard order by brno desc`,
    'selectOne' : `select brno,title, writer, note,hits, to_char(regdate,'YYYY-MM-DD HH:MI:SS') regdate from testBoard where brno = :1 `,
    'UpdateHits' : 'UPDATE TESTBOARD SET HITS = HITS+1 WHERE BRNO =:1',
    'Delete' : 'DELETE FROM TESTBOARD  WHERE BRNO =:1',
    'Updates':`UPDATE TESTBOARD SET title=:1, note=:2,REGDATE= SYSTIMESTAMP WHERE BRNO =:3`,
}
class sqlinsert{
    constructor( title, writer, note,hits) {
        this.title = title;
        this.writer =  writer;
        this.note = note;
        this.hits = hits;
    }
    async inserter(){
        let conn = null;
        let params = [this.title,this.writer,this.note];
        try{
            conn = await oracledb.makeConn();
            await conn.execute(sql.input,params);
            await conn.commit();
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
    }

    async selector(){
        let conn = null;
        let result = null;
        let dts = [];

        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.select,[],oracledb.options);
            let rs =  await result.resultSet;
            let row = null;
            while((row = await rs.getRow())){
               
                let dt1 = new sqlinsert(row.TITLE,row.WRITER,row.NOTE,row.HITS);
                dt1.brno = row.BRNO;
                dt1.regdate = row.REGDATE;
                dts.push(dt1);
            }
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }

    async selectOne(brno){
        let conn = null;
        let result = null;
        let dts = [];
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.selectOne,[brno],oracledb.options);
            let rs =  await result.resultSet;
            let row = null;
            await conn.execute(sql.UpdateHits,[brno]);
            await conn.commit();
            while((row = await rs.getRow())){
                let dt1 = new sqlinsert(row.TITLE,row.WRITER,row.NOTE,row.HITS+1);
                dt1.brno = row.BRNO;
                dt1.regdate = row.REGDATE;
                dts.push(dt1);
            }

        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }

    async delete(brno){
        let conn = null;
        let result = null;
        let dts = [];
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.Delete,[brno]);
            await conn.commit();
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }
    
    async updates(brno,title,note){
        let conn = null;
        let result = null;
        let dts = [];
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.Updates,[title,note,brno]);
            await conn.commit();
            
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }
    
}

module.exports =sqlinsert;