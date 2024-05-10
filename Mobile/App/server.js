const express = require("express");
const app = express();
const PORT = 3000;
const mariadb = require('mariadb');
const { getGeneralPosts,
        getDepartmentPosts,
        gethotpostdata, 
        getdeparmentpostdata, 
        getschoolpostdata, 
        insertDataIntoDB,
        getuserpk } = require('./db.js'); // db 파일에서 함수 가져오기
app.use(express.json());


const pool = mariadb.createPool({
  host: '14.6.152.64',
  port: 3306,
  user: 'root',
  password: '1214',
  connectionLimit: 5,
  database: 'campuslife',
});


//메인페이지에 핫 게시글 데이터를 가져온다.
app.get('/MainPagehotPost', async (req, res) => {
    try {
       // console.log("인기 페이지로 http로 잘 전송됨")
        const rows = await gethotpostdata();
        const processedData = rows.map(item => ({
            post_id: item.post_id,
            title: item.title,
            view: item.view,
            like : item.like,
        }));
        res.json(processedData);
      //  console.log("성공적으로 데이터 보냄");
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//메인페이지에 학과 게시글 데이터를 가져온다.
app.get('/MainPagedepartmentPost', async (req, res) => {
    try {
       // console.log("학과 페이지로 http로 잘 전송됨")
        const rows = await getdeparmentpostdata();
        const processedData = rows.map(item => ({
            post_id: item.post_id,
            title: item.title,
            view: item.view,
        }));
        res.json(processedData);
        console.log("성공적으로 데이터 보냄");
    } catch (error) {
       // console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//메인페이지에 전체 게시글 데이터를 가져온다.
app.get('/MainPageSchoolPost', async (req, res) => {
    try {
        //console.log("스쿨페이지로 http로 잘 전송됨")
        const rows = await getschoolpostdata();
        const processedData = rows.map(item => ({
            post_id: item.post_id,
            title: item.title,
            view: item.view,
        }));
        res.json(processedData);
       // console.log("성공적으로 데이터 보냄");
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//게시글을 작성하여 데이터베이스에 넣는다.
app.post('/post', async (req, res) => {
    const { post_id, user_id, department_check, inform_check, title, contents, data, view, like } = req.body;
    insertDataIntoDB(post_id, user_id, department_check, inform_check, title, contents, view, like);
    res.json({ message: 'Data received successfully', receivedData: { post_id, user_id, department_check, inform_check, title, contents, data, view, like } });
  });

//아이디와 비밀번호를 받고 유저 pk값을 가져온다.
app.post('/get_user_data', async(req, res) => {
  const {user_id, user_pass} = req.body;
  const rows = await getuserpk(user_id, user_pass);
  
  const userData = {
    user_pk: rows[0].user_id,
    student_pk: rows[0].student_id,
    friend_code: rows[0].friend_code,
    admin_check: rows[0].admin_check,
    name: rows[0].name,
    campus_pk: rows[0].campus_id,
    department_pk: rows[0].department_id,
    email: rows[0].email,
    grade: rows[0].grade,
    point: rows[0].point,
  };
  
  res.json(userData);
})


//게시글화면에서 전체 게시글을 가져온다.
app.get('/generalpost', async (req, res) => {
    try {
        const rows = await getGeneralPosts();
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

app.get('/departmentpost', async (req, res) => {
  try {
      const rows = await getDepartmentPosts();
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

//회원가입
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
  
//로그인
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

  
//서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

