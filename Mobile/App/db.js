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


//학교 공지사항에서 전체 게시글 가져오는 쿼리
async function getNoticePosts() {
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
            + "post.department_check = 0 AND post.inform_check = 1 "
            + "ORDER BY post.date DESC"
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 공지사항에서 학과 게시글 가져오는 쿼리
async function getNoticeDepartmentPosts() {
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
            + "post.department_check = 1 AND post.inform_check = 1 "
            + "ORDER BY post.date DESC"
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 게시판에서 핫 게시물을 가져오는 쿼리
async function getNoticeHotPosts() {
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
            + "post.department_check = 0 AND post.inform_check = 1 AND post.`like` >= 30 "
            + "ORDER BY post.date DESC"
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 게시판에서 핫 게시물을 가져오는 쿼리
async function getNoticeDepartmentHotPosts() {
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
            + "post.department_check = 1 AND post.inform_check = 1 AND post.`like` >= 30 "
            + "ORDER BY post.date DESC"
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 공지사항에서 책갈피 가져오기
async function getNoticeBookmarkPosts(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT 
            post.post_id, 
            post.title, 
            post.contents, 
            post.date, 
            post.view, 
            post.\`like\`, 
            student.name, 
            user.admin_check
        FROM 
            post
        LEFT JOIN 
            user ON post.user_id = user.user_id
        LEFT JOIN 
            student ON user.student_id = student.student_id
        LEFT JOIN 
            user_have_post ON post.post_id = user_have_post.post_id
        WHERE 
            post.department_check = 0 
            AND post.inform_check = 1 
            AND user_have_post.user_id = ?
        GROUP BY 
            post.post_id
        ORDER BY 
            COUNT(user_have_post.post_id) DESC;`
        );
        const rows = await conn.query(query, [user_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학과 공지사항에서 책갈피 가져오기
async function getNoticeDepartmentBookmarkPosts(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT 
            post.post_id, 
            post.title, 
            post.contents, 
            post.date, 
            post.view, 
            post.\`like\`, 
            student.name, 
            user.admin_check
        FROM 
            post
        LEFT JOIN 
            user ON post.user_id = user.user_id
        LEFT JOIN 
            student ON user.student_id = student.student_id
        LEFT JOIN 
            user_have_post ON post.post_id = user_have_post.post_id
        WHERE 
            post.department_check = 1 
            AND post.inform_check = 1 
            AND user_have_post.user_id = ?
        GROUP BY 
            post.post_id
        ORDER BY 
            COUNT(user_have_post.post_id) DESC;`
        );
        const rows = await conn.query(query, [user_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

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

//전체 게시판에서 핫 게시물을 가져오는 쿼리
async function getHotPosts() {
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
            + "post.department_check = 0 AND post.inform_check =0 AND post.`like` >= 30 "
            + "ORDER BY post.date DESC"
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//전체 게시판에서 책갈피한 게시물을 가져오는 쿼리
async function getBookmarkPosts(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT 
            post.post_id, 
            post.title, 
            post.contents, 
            post.date, 
            post.view, 
            post.\`like\`, 
            student.name, 
            user.admin_check
        FROM 
            post
        LEFT JOIN 
            user ON post.user_id = user.user_id
        LEFT JOIN 
            student ON user.student_id = student.student_id
        LEFT JOIN 
            user_have_post ON post.post_id = user_have_post.post_id
        WHERE 
            post.department_check = 0 
            AND post.inform_check = 0 
            AND user_have_post.user_id = ?
        GROUP BY 
            post.post_id
        ORDER BY 
            COUNT(user_have_post.post_id) DESC;`
        );
        const rows = await conn.query(query, [user_id]);
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

//학과 게시판에서 핫 게시물을 가져오는 쿼리
async function getdepartmentHotPosts() {
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
            + "post.department_check = 1 AND post.inform_check = 0 AND post.`like` >= 30 "
            + "ORDER BY post.date DESC"
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

// 게시판에서 책갈피한 게시물을 가져오는 쿼리
async function getdepartmentBookmarkPosts(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT 
            post.post_id, 
            post.title, 
            post.contents, 
            post.date, 
            post.view, 
            post.\`like\`, 
            student.name, 
            user.admin_check
        FROM 
            post
        LEFT JOIN 
            user ON post.user_id = user.user_id
        LEFT JOIN 
            student ON user.student_id = student.student_id
        LEFT JOIN 
            user_have_post ON post.post_id = user_have_post.post_id
        WHERE 
            post.department_check = 1 
            AND post.inform_check = 0 
            AND user_have_post.user_id = ?
        GROUP BY 
            post.post_id
        ORDER BY 
            COUNT(user_have_post.post_id) DESC;`
        );
        const rows = await conn.query(query, [user_id]);
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
async function getLectureList(studentId) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(`
            SELECT 
                lecture.lecture_id, 
                professor.name, 
                lecture.credit, 
                lecture.lecture_name, 
                lecture.lecture_room, 
                lecture.lecture_time, 
                lecture.week,
                lecture.semester, 
                lecture_have_object.nonattendance, 
                lecture_have_object.attendance, 
                lecture_have_object.tardy, 
                lecture_have_object.absent,
                lecture_have_object.weeknum 
            FROM 
                lecture
            JOIN 
                professor ON lecture.professor_id = professor.professor_id
            JOIN 
                lecture_have_object ON lecture.lecture_id = lecture_have_object.lecture_id
            WHERE 
                lecture_have_object.student_id = ?
        `, [studentId]);
        return rows;
    } catch (err) {
        console.error(err);
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
        //console.log(result);
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
            + "student.name AS student_name, department.name AS department_name,"
            + "post.date, post.title,"
            + "post.`contents`, post.`like`,"
            + "post.`view`, user.profilePhoto, post.post_id "
            + "FROM "
            + "student "
            + "LEFT JOIN "
            + "user ON student.student_id = user.student_id "
            + "LEFT JOIN "
            + "department ON department.department_id = student.department_id "
            + "LEFT JOIN post ON post.user_id = user.user_id "
            + "WHERE post.post_id = ?", post_id)
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
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const query = `
            SELECT 
                comment.comment_id, comment.contents, comment.date, comment.\`like\`,
                student.name AS student_name, department.name AS department_name, 
                user.id, post.post_id, user.profilePhoto
            FROM 
                user
                LEFT JOIN student ON user.student_id = student.student_id
                LEFT JOIN department ON student.department_id = department.department_id
                LEFT JOIN comment ON comment.user_id = user.user_id
                LEFT JOIN post ON comment.post_id = post.post_id
            WHERE 
                post.post_id = ? ORDER BY comment.date DESC`;

        const rows = await conn.query(query, [post_ida]);
        return rows;

    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//대댓글 가져오기
async function getReComment(comment_id) {
    console.log(comment_id);
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const query = `
        SELECT 
        recomment.recomment_id, recomment.\`contents\`, recomment.date, recomment.\`like\`,
        student.name AS student_name, department.name AS department_name, comment.comment_id,user.user_id, user.profilePhoto
        FROM
        recomment
        LEFT JOIN
        comment ON recomment.comment_id = comment.comment_id
        LEFT JOIN
        user ON user.user_id = recomment.user_id
        LEFT JOIN
        student ON student.student_id = user.student_id
        LEFT JOIN
        department ON department.department_id = student.department_id
        WHERE comment.comment_id = ?;`;

        const rows = await conn.query(query, [comment_id]);
        return rows;

    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//학교의 정보 가져오기
async function get_campus_Info() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT 
                department.department_id,
                department.name AS department_name, 
                campus.campus_id, 
                campus.name AS campus_name,
                campus_have_department.department_phone, 
                campus_have_department.department_floor, 
                campus_have_department.department_building
            FROM 
                campus_have_department
            JOIN 
                department ON campus_have_department.department_id = department.department_id
            JOIN 
                campus ON campus_have_department.campus_id = campus.campus_id;
        `;
        const result = await conn.query(query);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//학교 건물 정보 가져오기
async function get_campus_building_Info() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT 
                campus.campus_id, 
                campus_building.building_name, 
                campus_building.campus_place, 
                campus_building.latitude,
                campus_building.longitude
            FROM 
                campus_building
            JOIN 
                campus ON campus_building.campus_id = campus.campus_id;
        `;
        const result = await conn.query(query);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//학교의 정보 가져오기
async function get_campus_Info() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT 
                department.department_id,
                department.name AS department_name, 
                campus.campus_id, 
                campus.name AS campus_name,
                campus_have_department.department_phone, 
                campus_have_department.department_floor, 
                campus_have_department.department_building
            FROM 
                campus_have_department
            JOIN 
                department ON campus_have_department.department_id = department.department_id
            JOIN 
                campus ON campus_have_department.campus_id = campus.campus_id;
        `;
        const result = await conn.query(query);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//학교 건물 정보 가져오기
async function get_campus_building_Info() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT 
                campus.campus_id, 
                campus_building.building_name, 
                campus_building.campus_place, 
                campus_building.latitude,
                campus_building.longitude
            FROM 
                campus_building
            JOIN 
                campus ON campus_building.campus_id = campus.campus_id;
        `;
        const result = await conn.query(query);
        console.log(result);
        return result;
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function updateUserImg(user_pk, photopath) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const query = `UPDATE user
        SET profilePhoto = ?
        WHERE user_id = ?;`
        await conn.query(query, [photopath, user_pk]);
        console.log("업데이트 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function post_comment(post_id, user_id, contents) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO comment (post_id, user_id, contents, \`like\`)VALUES (?, ?, ?, DEFAULT);`
        await conn.query(query, [post_id, user_id, contents]);
        //console.log("댓글달기 성공!");
        return true;
    } catch (err) {
        //console.error('댓글달기 실패!:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}
//대댓글 달기
async function post_recomment(comment_id, user_id, contents) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO recomment (comment_id, user_id, contents, \`like\`)VALUES (?, ?, ?, DEFAULT);`
        await conn.query(query, [comment_id, user_id, contents]);
        console.log("대댓글달기 성공!");
        return true;
    } catch (err) {
        //console.error('대댓글달기 실패!:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function post_like_up(post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE post
        SET \`like\` = \`like\` + 1
        WHERE post_id = ?`
        const result = await conn.query(query, [post_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function comment_like_up(comment_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE comment
        SET \`like\` = \`like\` + 1
        WHERE comment_id = ?`
        const result = await conn.query(query, [comment_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}


async function recomment_like_up(recomment_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE recomment
        SET \`like\` = \`like\` + 1
        WHERE recomment_id = ?`
        const result = await conn.query(query, [recomment_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function write_post(user_id, department_check, inform_check, title, contents) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO post (user_id, department_check, inform_check, title, contents, view, \`like\` )
        VALUES (?, ?, ?, ?, ?, DEFAULT, DEFAULT);`
        await conn.query(query, [user_id, department_check, inform_check, title, contents]);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//학과 게시판에서 전체 게시글을 가져오는 쿼리
async function searchPost(search_text) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check " +
            "FROM post " +
            "LEFT JOIN user ON post.user_id = user.user_id " +
            "LEFT JOIN student ON user.student_id = student.student_id " +
            "WHERE post.contents LIKE ? OR post.title LIKE ? " +
            "ORDER BY post.date DESC;",
            [`%${search_text}%`, `%${search_text}%`]
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function view_count_up(post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE post
        SET view = view + 1
        WHERE post_id = ?`
        const result = await conn.query(query, [post_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}async function updateUserImg(user_pk, photopath) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const query = `UPDATE user
        SET profilePhoto = ?
        WHERE user_id = ?;`
        await conn.query(query, [photopath, user_pk]);
        console.log("업데이트 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function post_comment(post_id, user_id, contents) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO comment (post_id, user_id, contents, \`like\`)VALUES (?, ?, ?, DEFAULT);`
        await conn.query(query, [post_id, user_id, contents]);
        //console.log("댓글달기 성공!");
        return true;
    } catch (err) {
        //console.error('댓글달기 실패!:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}
//대댓글 달기
async function post_recomment(comment_id, user_id, contents) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO recomment (comment_id, user_id, contents, \`like\`)VALUES (?, ?, ?, DEFAULT);`
        await conn.query(query, [comment_id, user_id, contents]);
        console.log("대댓글달기 성공!");
        return true;
    } catch (err) {
        //console.error('대댓글달기 실패!:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function post_like_up(post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE post
        SET \`like\` = \`like\` + 1
        WHERE post_id = ?`
        const result = await conn.query(query, [post_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function comment_like_up(comment_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE comment
        SET \`like\` = \`like\` + 1
        WHERE comment_id = ?`
        const result = await conn.query(query, [comment_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}


async function recomment_like_up(recomment_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE recomment
        SET \`like\` = \`like\` + 1
        WHERE recomment_id = ?`
        const result = await conn.query(query, [recomment_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function write_post(user_id, department_check, inform_check, title, contents) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO post (user_id, department_check, inform_check, title, contents, view, \`like\` )
        VALUES (?, ?, ?, ?, ?, DEFAULT, DEFAULT);`
        await conn.query(query, [user_id, department_check, inform_check, title, contents]);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//학과 게시판에서 전체 게시글을 가져오는 쿼리
async function searchPost(search_text) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check " +
            "FROM post " +
            "LEFT JOIN user ON post.user_id = user.user_id " +
            "LEFT JOIN student ON user.student_id = student.student_id " +
            "WHERE post.contents LIKE ? OR post.title LIKE ? " +
            "ORDER BY post.date DESC;",
            [`%${search_text}%`, `%${search_text}%`]
        );
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function view_count_up(post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE post
        SET view = view + 1
        WHERE post_id = ?`
        const result = await conn.query(query, [post_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
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
    getLectureList,
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
    get_campus_Info,
    get_campus_building_Info,
    getReComment,
    updateUserImg,
    post_comment,
    post_recomment,
    post_like_up,
    comment_like_up,
    recomment_like_up,
    write_post,
    getHotPosts,
    getBookmarkPosts,
    getdepartmentHotPosts,
    getdepartmentBookmarkPosts,
    searchPost,
    view_count_up,
    getNoticePosts,
    getNoticeDepartmentPosts,
    getNoticeHotPosts,
    getNoticeDepartmentHotPosts,
    getNoticeBookmarkPosts,
    getNoticeDepartmentBookmarkPosts,
};