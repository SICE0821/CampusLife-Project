// server.js

const express = require('express');
const mariadb = require('mariadb');

const app = express();
const port = 3000;

const pool = mariadb.createPool({
  host: '14.6.152.64',
  user: 'dohyun',
  password: '0000',
  database: 'campuslife',
  connectionLimit: 5
});

app.use(express.json());

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


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
