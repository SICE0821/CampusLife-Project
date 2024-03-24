const mariadb = require('mariadb');
const PORT = 3000;

//마리아 db설정
 const pool = mariadb.createPool({
    host: '14.6.152.64',
    port: 3306,
    user: 'yuhwan',
    password: '0000',
    connectionLimit: 5,
    database: 'campuslife',
});

//게시글 화면에서 전체 게시글을 가져오는 쿼리
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

//메인 화면에서 핫 게시글을 가져오는 쿼리
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

//메인 화면에서 학과 게시글을 가져오는 쿼리
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

//메인 화면에서 학교 게시글을 가져오는 쿼리
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

//작성한 게시글을 넣는 쿼리
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

//모듈화를 시키지 않으면, server.js 파일에서 함수를 가져오지 못함.
module.exports = {
    getDataFormTable,
    gethotpostdata,
    getdeparmentpostdata,
    getschoolpostdata,
    insertDataIntoDB
  };