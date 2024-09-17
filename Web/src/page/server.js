const express= require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const mariadb = require('mariadb');

const fs = require('fs');
const data = fs.readFileSync('./src/page/database.json');
const conf = JSON.parse(data);

const pool = mariadb.createPool({
    host:conf.host,
    user:conf.user,
    password:conf.password,
    port:conf.port,
    database:conf.database,
    multipleStatements: true,
})

app.get('/ProfInfo', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1 as test");
        conn.release();  // 연결을 풀에 반환
        res.send({ success: true, rows });
    } catch (err) {
        console.error("DB 연결 오류:", err);
        res.status(500).send({ success: false, message: "DB 연결 실패" });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});

