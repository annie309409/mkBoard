const express = require('express');
const router = express.Router();
const oracledb = require('../modules/Oracle');

class sqlinsert{
    sqlInput =`insert into testBoard(brno, title, writer, note) values (brno.nextval,:1,:2,:3)`;
    options = {
        resultSet: true,
        outFormat: oracledb.OUT_FORMAT_OBJECT
    }

    sqlSelect=`select * from testBoard`;
    constructor( title, writer, note) {
        this.title = title;
        this.writer =  writer;
        this.note = note;
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
            await oracledb.closeConn();
        }
    }

    async selector(){
        let conn = null;
        try{
            conn = await oracledb.makeConn();
            let result = await conn.execute(this.sqlSelect,[],this.options);
            let dt = await result.resultSet;
            let row = '';
            console.log(dt);
            // let rs = await result.rows;
            let dtFn  = [];
            while ((row = await dt.getRow())){
                let bd = new sqlinsert(row[1],row[2],row[3]);
                bd.brno = row[0];
                bd.regdate = row[4];
                dtFn.push(bd);
            }
            return dtFn;
            console.log(dtFn);
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn();
        }
    }
}

module.exports =sqlinsert;