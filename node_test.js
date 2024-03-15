const mariadb = require('mariadb');

//내 데이터 베이스 정보 입력
const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '1234',
    connectionLimit: 5
});

//Connection 확인,
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


async function getDataFromTable() {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query('USE test');  //데이터 베이스 이름
        const rows = await conn.query('SELECT * FROM test1'); //쿼리 
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

getDataFromTable()
    .then(rows => {
        console.log('Data retrieved:', rows);
    })
    .catch(err => {
        console.error('Error retrieving data:', err);
    });

