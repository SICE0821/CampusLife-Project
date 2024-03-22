const express = require("express");
const app = express();
const mariadb = require('mariadb');
const PORT = 3000;

app.use(express.json());

//데이터 베이스 정보.
const pool = mariadb.createPool({
    host: '14.6.152.64',
    port: 3306,
    user: 'yuhwan',
    password: '0000',
    connectionLimit: 5,
    database: 'campuslife',
});

/*
async function getDataFromTable() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('USE test');  //데이터 베이스 이름
        const rows = await conn.query('SELECT * FROM test1 ORDER BY write_pk DESC'); //쿼리 
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}
*/

async function getDataFormTable() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query('SELECT post_id, user_id, title, contents, date, view, `like` FROM post WHERE department_check = 0 AND inform_check = 0');
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}
async function gethotpostdata() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT post_id, title, view, \`like\`
            FROM post 
            WHERE department_check = 0 AND inform_check = 0 
            ORDER BY \`like\` DESC 
            LIMIT 5
        `);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

app.get('/MainPagehotPost', async (req, res) => {
    try {
        console.log("인기 페이지로 http로 잘 전송됨")
        const rows = await gethotpostdata();
        const processedData = rows.map(item => ({
            post_id: item.post_id,
            title: item.title,
            view: item.view,
            like : item.like,
        }));
        res.json(processedData);
        console.log("성공적으로 데이터 보냄");
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getdeparmentpostdata() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT post_id, title, view 
            FROM post 
            WHERE department_check = 1 AND inform_check = 1 
            ORDER BY post_id DESC 
            LIMIT 5
        `);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

app.get('/MainPagedepartmentPost', async (req, res) => {
    try {
        console.log("학과 페이지로 http로 잘 전송됨")
        const rows = await getdeparmentpostdata();
        const processedData = rows.map(item => ({
            post_id: item.post_id,
            title: item.title,
            view: item.view,
        }));
        res.json(processedData);
        console.log("성공적으로 데이터 보냄");
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


async function getschoolpostdata() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT post_id, title, view 
            FROM post 
            WHERE department_check = 0 AND inform_check = 1 
            ORDER BY post_id DESC 
            LIMIT 5
        `);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

app.get('/MainPageSchoolPost', async (req, res) => {
    try {
        console.log("스쿨페이지로 http로 잘 전송됨")
        const rows = await getschoolpostdata();
        const processedData = rows.map(item => ({
            post_id: item.post_id,
            title: item.title,
            view: item.view,
        }));
        res.json(processedData);
        console.log("성공적으로 데이터 보냄");
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function insertDataIntoDB(post_id, user_id, department_check, inform_check, title, contents, view, like) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const query = `INSERT INTO post (post_id, user_id, department_check, inform_check, title, contents, date, view, \`like\`) 
               VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?)`;
        // 쿼리 실행
        const result = await conn.query(query, [post_id, user_id, department_check, inform_check, title, contents, view, like]);
        console.log('Data inserted successfully:', result);
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function checkConnection() {
    let conn;
    try {
        conn = await pool.getConnection();
        console.log('Successfully connected to MariaDB');
    } catch (err) {
        console.error('Error connecting to MariaDB:', err);
    } finally {
        if (conn) conn.end();
    }
}

app.post('/post', async (req, res) => {
    // POST 요청의 본문에서 데이터 추출
    const { post_id, user_id, department_check, inform_check, title, contents, data, view, like } = req.body;
    insertDataIntoDB(post_id, user_id, department_check, inform_check, title, contents, view, like);
    res.json({ message: 'Data received successfully', receivedData: { post_id, user_id, department_check, inform_check, title, contents, data, view, like } });
  });
  

//게시판 전체 글 가져오기.
app.get('/AllCommunity', async (req, res) => {
    try {
        console.log("커뮤니티 http로 잘 전송됨")
        const rows = await getDataFormTable();
        const processedData = rows.map(item => ({
            id: item.post_id,
            title: item.title,
            writer: item.user_id,
            time: item.date,
            watch: item.view,
            like: item.like
        }));
        res.json(processedData);
        console.log("성공적으로 데이터 보냄");
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/register', async (req, res) => {
    const { studentId, username, userpass, friendCode } = req.body;
  
    const conn = await pool.getConnection();
    try {
      await conn.query('INSERT INTO user (student_id, id, passwd, friend_code, point, admin_check) VALUES (?, ?, ?, ?, 0, 0)', [studentId, username, userpass, friendCode]);
      res.send('User registered successfully');
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).send('Error registering user');
    } finally {
      if (conn) conn.release();
    }
  });
  
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    const conn = await pool.getConnection();
    try {
      const result = await conn.query('SELECT * FROM user WHERE id = ? AND passwd = ?', [username, password]);
      if (result.length > 0) {
        res.send('success');
      } else {
        res.send('failure');
      }
    } catch (error) {
      console.error('로그인 오류:', error);
      res.status(500).send('로그인 오류');
    } finally {
      if (conn) conn.release();
    }
  });


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

checkConnection();