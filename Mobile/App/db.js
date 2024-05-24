const mariadb = require('mariadb');
const PORT = 3000;

//마리아 db설정
const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'yuhwan',
    password: '0000',
    connectionLimit: 5,
    database: 'campuslife',
});

//전체 게시판에서 전체 게시글을 가져오는 쿼리
async function getGeneralPosts() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check " 
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 0 AND post.inform_check =0 "
            + "ORDER BY post.date DESC"
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학과 게시판에서 전체 게시글을 가져오는 쿼리
async function getDepartmentPosts() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check " 
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 1 AND post.inform_check =0 "
            + "ORDER BY post.date DESC"
        );
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
//로그인할때(유저 PK값 가져오기)
async function getuserpk(user_id, user_passwd) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const rows = await conn.query(`SELECT user.user_id, 
        user.student_id, user.friend_code, 
        user.point, user.admin_check, 
        user.profilePhoto,
        user.id,
        student.name, student.campus_id, 
        student.department_id, student.email, 
        student.grade,
        student.birth,
        student.currentstatus
        FROM 
        user 
        LEFT JOIN 
        student ON user.student_id = student.student_id
        WHERE
        user.id = ? AND user.passwd = ?`, [user_id, user_passwd]);
        
        return rows;
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

// 과목의 정보를 가져오는 쿼리
async function getlecturelist() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT lecture_id, professor.name AS professor_name, credit, lecture_name, lecture_room, lecture_time, week 
            FROM lecture
            JOIN professor ON lecture.professor_id = professor.professor_id
            LIMIT 5;
        `);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function get_event_objcet(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT * FROM event_object WHERE campus_id = ?
        `, [campus_id]);
        return rows;

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}
//바코드 최댓값 가져오기
async function getBarcordMaxNum() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT MAX(code_num) AS max_code_num FROM event_object;
        `)
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//상품 등록하기
async function PostItem(campus_id, name, price, code_num, using_time, image_num, sell_check, explain) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const query = "INSERT INTO event_object (campus_id, name, price, code_num, using_time, image_num, sell_check, `explain`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        // 쿼리 실행
        const result = await conn.query(query, [campus_id, name, price, code_num, using_time, image_num, sell_check, explain]);
        console.log('Data inserted successfully:', result);
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//상품 편집하기
async function UpdateItem(name, newname, price, using_time, image_num, sell_check, explain) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "UPDATE event_object SET" 
                        + " name = ?, price = ?, using_time = ?, image_num = ?, sell_check = ?, `explain` = ? WHERE NAME = ?"
        const result = await conn.query(query, [newname, price, using_time, image_num, sell_check, explain, name]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//상품 삭제하기
async function DeleteItem(name, deltenum) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "DELETE FROM event_object "
                     + "WHERE name = ? "
                     + "LIMIT ?"
        const result = await conn.query(query, [name, deltenum]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//유저삭제
async function DeleteUser(user_pk) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "DELETE FROM user "
                     + "WHERE user_id = ?"
        const result = await conn.query(query, [user_pk]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//학과 이름가져오기
async function get_department_name(department_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "SELECT department.name FROM department WHERE department_id = ?"
        const result = await conn.query(query, [department_name]);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function get_university_name(university_name) {
    let conn;

    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "SELECT campus.name FROM campus WHERE campus_id = ?"
        const result = await conn.query(query, [university_name]);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//계정 삭제하기
async function DeleteUser(user_pk) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "DELETE FROM user "
                     + "WHERE user_id = ?"
        const result = await conn.query(query, [user_pk]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
        alert(data.message);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}


//계정 업데이트
async function Updateaccount(email, grade, currentstatus, student_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "UPDATE student SET" 
                        + " email = ?, grade = ?, currentstatus = ? WHERE student_id = ?"
        const result = await conn.query(query, [email, grade, currentstatus, student_id]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//이미지 경로 수정
async function UpdateImg(profilePhoto, user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "UPDATE user SET profilePhoto = ? WHERE user_id = ?"
        const result = await conn.query(query, [profilePhoto, user_id]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//이미지 경로 삭제
async function DeleteImg(profilePhoto) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = "DELETE FROM user "
                     + "WHERE profilePhoto = ? "
        const result = await conn.query(query, [profilePhoto]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}
//유저가 소유한 포스터 가져오기
async function get_user_have_posts(user_pk) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "SELECT * FROM user_have_post WHERE user_id = ?"
        const result = await conn.query(query, [user_pk]);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//책갈피 추가하기
async function add_book_mark(user_id, post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "INSERT INTO user_have_post (user_id, post_id) VALUES (?, ?)"
        const result = await conn.query(query, [user_id, post_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//책갈피 삭제하기
async function delete_book_mark(user_id, post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "DELETE FROM user_have_post WHERE user_id = ? AND post_id = ?"
        const result = await conn.query(query, [user_id, post_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//디테일 포스트의 정보를 서버에서 가져오는 함수
async function get_post_detail(post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const rows = await conn.query("SELECT "
            +"student.name AS student_name, department.name AS department_name,"
            +"post.date, post.title,"
            +"post.`contents`, post.`like`,"
            +"post.`view`, user.profilePhoto "
            +"FROM "
            +"student "
            +"LEFT JOIN "
            +"user ON student.student_id = user.student_id "
            +"LEFT JOIN "
            +"department ON department.department_id = student.department_id "
            +"LEFT JOIN post ON post.user_id = user.user_id "
            +"WHERE post.post_id = ?", post_id)
        //console.log(rows);
        return rows;
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//댓글 리스트 가져오기
async function getComment(post_ida) {
    console.log(post_ida);
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const query = `
            SELECT 
                comment.comment_id, comment.contents, comment.date, comment.\`like\`,
                student.name AS student_name, department.name AS department_name, 
                user.id, post.post_id
            FROM 
                user
                LEFT JOIN student ON user.student_id = student.student_id
                LEFT JOIN department ON student.department_id = department.department_id
                LEFT JOIN comment ON comment.user_id = user.user_id
                LEFT JOIN post ON comment.post_id = post.post_id
            WHERE 
                post.post_id = ?`;

        const rows = await conn.query(query, [post_ida]);
        //console.log(rows);
        return rows;
        
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}


//모듈화를 시키지 않으면, server.js 파일에서 함수를 가져오지 못함.
module.exports = {
    getGeneralPosts,
    getDepartmentPosts,
    gethotpostdata,
    getdeparmentpostdata,
    getschoolpostdata,
    insertDataIntoDB,
    getuserpk,
    getlecturelist,
    get_event_objcet,
    getBarcordMaxNum,
    PostItem,
    UpdateItem,
    DeleteItem,
    get_department_name,
    get_university_name,
    DeleteUser,
    Updateaccount,
    UpdateImg,
    DeleteImg,
    get_user_have_posts,
    add_book_mark,
    delete_book_mark,
    get_post_detail,
    getComment,
    //getstudentInfo
};