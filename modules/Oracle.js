const oracledb = require('oracledb');
const dbconfig = require('./dbconfig');

const Oracle ={
    initConn: async ()=>{
        oracledb.initOracleClient({libDir:'C:/Java/instantclient_19_18'});
    },
    makeConn : async () => {
        try{
            return await oracledb.getConnection(dbconfig);
        }catch (e) {
            console.log(e);
        }
    },
    closeConn : async (conn) => {
        if(conn){
            try{
                await conn.close();
            }catch (e){
                console.log(e);
            }
        }
    }
}

module.exports = Oracle;