const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

const mariadb = require('mariadb');
const fs = require('fs');
const data = fs.readFileSync('./src/page/database.json');
const conf = JSON.parse(data);

const pool = mariadb.createPool({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
    multipleStatements: true,
});

app.use(cors());
app.use(express.json());

// 테스트 디비문
app.get('/test-connection', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1 as test");
        conn.release(); // 연결을 풀에 반환
        res.send({ success: true, rows });
    } catch (err) {
        console.error("DB 연결 오류:", err);
        res.status(500).send({ success: false, message: "DB 연결 실패" });
    }
});

// 교수 정보 가져오기
app.post('/CheckProfessorInfo', async (req, res) => {
    const { id, pass } = req.body;
    try {
        const conn = await pool.getConnection();
        const query = `SELECT * FROM professor WHERE professor.id = ? AND professor.pass = ?`;
        const rows = await conn.query(query, [id, pass]);
        conn.release(); // 연결을 풀에 반환

        if (rows.length === 0) {
            // 조회된 행이 없을 때
            console.log("교수 정보 없음");
            return res.status(404).json({ success: false, message: "교수 정보를 찾을 수 없습니다." });
        }

        // 교수 정보가 존재할 때
        const processedData = rows.map(item => ({
            professor_id: item.professor_id,
            campus_id: item.campus_id,
            department_id: item.department_id,
            id: item.id,
            pass: item.pass,
            name: item.name,
            professor_room: item.professor_room,
            tell_num: item.tell_num,
        }));

        console.log("교수 정보 가져오기 성공");
        res.json({ success: true, data: processedData });
    } catch (error) {
        console.error("교수 정보 가져오기 실패:", error);
        res.status(500).json({ success: false, message: "연결 실패" });
    }
});

// 교수 강의 과목 전부 가져오기
app.post('/GetProfessorLecture', async (req, res) => {
    const { professor_id } = req.body;
    try {
        const conn = await pool.getConnection();
        const query = `SELECT * FROM lecture WHERE lecture.professor_id = ?`;
        const rows = await conn.query(query, [professor_id]);
        conn.release();

        // 교수 정보가 존재할 때
        const processedData = rows.map(item => ({
            lecture_id : item.lecture_id,
            professor_id : item.professor_id,
            credit : item.credit,
            lecture_name : item.lecture_name,
            lecture_room : item.lecture_room,
            lecture_time : item.lecture_time,
            week : item.week,
            division : item.division,
            lecture_grade : item.lecture_grade,
            lecture_semester : item.lecture_semester,
            lecture_have_week : item.lecture_have_week
        }));

        console.log("교수 강의 과목 가져오기 성공");
        res.json(processedData);
    } catch (error) {
        console.error("교수 강의 과목 가져오기 실패:", error);
        res.status(500).json({ success: false, message: "연결 실패" });
    }
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});