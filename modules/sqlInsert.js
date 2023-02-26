const express = require('express');
const router = express.Router();
const oracledb = require('../modules/Oracle');
let ppg = 15;

let sql = {
    'input' :`insert into testBoard(brno, title, writer, note) values (brno.nextval,:1,:2,:3)`,
    'select':`SELECT brno,title, writer, note,hits, to_char(regdate,'YYYY-MM-DD') regdate ,rowno, b.cnt recnt  FROM (SELECT t.*, row_number() over (order by brno desc) rowno FROM TESTBOARD t `,
    'selectWhere':` WHERE rowno BETWEEN :1 AND :2 order by rowno`,
    'selectOne' : `select brno,title, writer, note,hits, to_char(regdate,'YYYY-MM-DD HH:MI:SS') regdate from testBoard where brno = :1 `,
    'UpdateHits' : 'UPDATE TESTBOARD SET HITS = HITS+1 WHERE BRNO =:1',
    'Delete' : 'DELETE FROM TESTBOARD  WHERE BRNO =:1',
    'Updates':`UPDATE TESTBOARD SET title=:1, note=:2,REGDATE= SYSTIMESTAMP WHERE BRNO =:3`,
    'totlaCnt' :`select count(brno) brno from testBoard`,
    'cntRe':` ) a LEFT JOIN (SELECT bno,count(reno) cnt FROM rep GROUP BY bno) b
    on a.brno = b.bno `,
}

//동적쿼리 생성
const makeWhere = (ftype, fkey) => {
    let where = ` where title = '${fkey}' `;
    if (ftype == 'writer') where = ` where writer = '${fkey}' `
    else if (ftype == 'contents') where = `  where note like '%${fkey}%'  `
    return where;
};

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

    async selector(stnum, ftype, fkey){
        let conn = null;
        let result = null;
        let params = [stnum, (stnum + ppg)-1];
        let dts = [];
        let tt = await this.total();
        let where = '';
        if (fkey !== undefined) where = makeWhere(ftype, fkey);

        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.select+where+sql.cntRe+sql.selectWhere,params,oracledb.options);
            let rs =  await result.resultSet;
            let row = null;
            while((row = await rs.getRow())){
                let dt1 = new sqlinsert(row.TITLE,row.WRITER,row.NOTE,row.HITS);
                dt1.brno = row.BRNO;
                dt1.brno2 =  await tt--;
                dt1.regdate = row.REGDATE;
                dt1.reply = (row.RECNT===null)?0:row.RECNT;
                dts.push(dt1);
            }
        }catch (e){
            console.log(e);
        }finally {
            await oracledb.closeConn(conn);
        }
        return await dts;
    }

    async total(ftype, fkey){
        let conn = null;
        let result = null;
        let dts = -1;
        let where = '';
        if (fkey !== undefined) where = makeWhere(ftype, fkey);
        try{
            conn = await oracledb.makeConn();
            result = await conn.execute(sql.totlaCnt+where,[],oracledb.options);
            let rs =  await result.resultSet;
            let row = null;
            while((row = await rs.getRow())){
              dts = row.BRNO;
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