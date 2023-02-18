const express = require('express');
const router = express.Router();
const oracledb = require('../modules/Oracle');
class sqlinsert{
    sqlInput =`insert into testBoard(brno, title, writer, note) values (brno.nextval,:1,:2,:3)`;
    sqlSelect=`select brno,title, writer, note,hits, to_char(regdate,'YYYY-MM-DD') regdate from testBoard order by brno desc`;
    selectOnesql = `select brno,title, writer, note,hits, to_char(regdate,'YYYY-MM-DD HH:MI:SS') regdate from testBoard where brno = :1 `
    sqlUpdateHits = 'UPDATE TESTBOARD SET HITS = :1 WHERE BRNO =:2';
    sqlDelete = 'DELETE FROM TESTBOARD  WHERE BRNO =:1';
    sqlUpdates=`UPDATE TESTBOARD SET title=:1, note=:2,REGDATE= SYSTIMESTAMP WHERE BRNO =:3`;
    options = {
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT
    }

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
            await conn.execute(this.sqlInput,params);
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
            result = await conn.execute(this.sqlSelect,[],this.options);
            let rs =  await result.resultSet;
            let row = null;
            while((row = await rs.getRow())){
                let dt1 = new sqlinsert(row[1],row[2],row[3],row[4]);
                dt1.brno = row[0];
                dt1.regdate = row[5];
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
            result = await conn.execute(this.selectOnesql,[brno],this.options);
            let rs =  await result.resultSet;
            let row = null;
            while((row = await rs.getRow())){
                let dt1 = new sqlinsert(row[1],row[2],row[3],row[4]);
                dt1.brno = row[0];
                dt1.regdate = row[5];
                dts.push(dt1);
            }

        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }
    async updateHits(brno,hits){
        let conn = null;
        let result = null;
        let dts = [];
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(this.sqlUpdateHits,[parseInt(hits)+1,brno]);
            await conn.commit();
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
            result = await conn.execute(this.sqlDelete,[brno]);
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
            result = await conn.execute(this.sqlUpdates,[title,note,brno]);
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