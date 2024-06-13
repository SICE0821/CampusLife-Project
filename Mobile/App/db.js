const mariadb = require('mariadb');
const PORT = 3000;

//마리아 db설정
const pool = mariadb.createPool({
    host: '14.6.152.64',
    port: 3306,
    user: 'dohyun',
    password: '0000',
    connectionLimit: 5,
    database: 'campuslife',
});


//학교 공지사항에서 전체 게시글 가져오는 쿼리
async function getNoticePosts(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.campus_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 0 AND post.inform_check = 1 AND student.campus_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [campus_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 공지사항에서 학과 게시글 가져오는 쿼리
async function getNoticeDepartmentPosts(department_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
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
            + "post.department_check = 1 AND post.inform_check = 1 AND student.department_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [department_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 게시판에서 핫 게시물을 가져오는 쿼리
async function getNoticeHotPosts(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection(campus_id);
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.campus_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 0 AND post.inform_check = 1 AND post.`like` >= 30 AND student.campus_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [campus_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 게시판에서 핫 게시물을 가져오는 쿼리
async function getNoticeDepartmentHotPosts(department_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.department_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 1 AND post.inform_check = 1 AND post.`like` >= 30 AND student.department_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [department_id]);
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
async function getNoticeDepartmentBookmarkPosts(user_id, department_id) {
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
            AND student.department_id = ?
        GROUP BY 
            post.post_id
        ORDER BY 
            COUNT(user_have_post.post_id) DESC;`
        );
        const rows = await conn.query(query, [user_id, department_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//전체 게시판에서 전체 게시글을 가져오는 쿼리
async function getGeneralPosts(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.campus_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 0 AND post.inform_check =0 AND student.campus_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [campus_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//전체 게시판에서 전체 게시글을 가져오는 쿼리
async function getMyPostData(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.campus_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "user.user_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [user_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//전체 게시판에서 핫 게시물을 가져오는 쿼리
async function getHotPosts(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.campus_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 0 AND post.inform_check =0 AND post.`like` >= 30 AND student.campus_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [campus_id]);
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
async function getDepartmentPosts(department_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.department_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 1 AND post.inform_check =0 AND student.department_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [department_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학과 게시판에서 핫 게시물을 가져오는 쿼리
async function getdepartmentHotPosts(department_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
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
            + "post.department_check = 1 AND post.inform_check = 0 AND post.`like` >= 30 AND student.department_id = ? "
            + "ORDER BY post.date DESC"
        );
        const rows = await conn.query(query, [department_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

// 게시판에서 책갈피한 게시물을 가져오는 쿼리
async function getdepartmentBookmarkPosts(user_id, department_id) {
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
            AND student.department_id = ?
        GROUP BY 
            post.post_id
        ORDER BY 
            COUNT(user_have_post.post_id) DESC;`
        );
        const rows = await conn.query(query, [user_id, department_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//메인 화면에서 핫 게시글을 가져오는 쿼리
async function gethotpostdata(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            "SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.campus_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 0 AND post.inform_check =0 AND post.`like` >= 30 AND student.campus_id = ? "
            + "ORDER BY post.date DESC "
            + "LIMIT 5"
        );
        const rows = await conn.query(query, [campus_id])
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//메인 화면에서 학과 게시글을 가져오는 쿼리
async function getdeparmentpostdata(department_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = ("SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check "
        + "FROM "
        + "post "
        + "LEFT JOIN "
        + "user "
        + "ON post.user_id = user.user_id "
        + "LEFT JOIN "
        + "student "
        + "ON user.student_id = student.student_id "
        + "WHERE "
        + "post.department_check = 1 AND post.inform_check = 1 AND student.department_id = ? "
        + "ORDER BY post.date DESC "
        + "LIMIT 5")
        const rows = await conn.query(query, [department_id])
        ;
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//메인 화면에서 학교 게시글을 가져오는 쿼리
async function getschoolpostdata(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection(campus_id);
        const query = ("SELECT post.post_id, post.title, post.contents, post.date, post.view, post.`like`, student.name, user.admin_check, student.campus_id "
            + "FROM "
            + "post "
            + "LEFT JOIN "
            + "user "
            + "ON post.user_id = user.user_id "
            + "LEFT JOIN "
            + "student "
            + "ON user.student_id = student.student_id "
            + "WHERE "
            + "post.department_check = 0 AND post.inform_check = 1 AND student.campus_id = ? "
            + "ORDER BY post.date DESC "
            + "LIMIT 5")
        const rows = await conn.query(query, [campus_id])
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
        const rows = await conn.query(`
            SELECT user.user_id, 
                user.student_id, user.friend_code, 
                user.point, user.admin_check, 
                user.profilePhoto,
                user.id,
                user.title,
                student.name, student.campus_id, 
                student.department_id, student.email, 
                student.grade,
                student.birth,
                student.currentstatus,
                student.student_semester,
                department_have_object.college
            FROM 
                user 
            LEFT JOIN 
                student ON user.student_id = student.student_id
            LEFT JOIN
                department_have_object ON student.campus_id = department_have_object.campus_id
                AND student.department_id = department_have_object.department_id
            WHERE
                user.id = ? AND user.passwd = ?
        `, [user_id, user_passwd]);

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
                lecture.division,
                lecture_have_object.nonattendance, 
                lecture_have_object.attendance, 
                lecture_have_object.tardy, 
                lecture_have_object.absent,
                lecture_have_object.weeknum,
                lecture_have_object.lecture_grade,
                lecture_have_object.lecture_semester,
                lecture_have_object.lecture_credit,
                lecture_have_object.lecture_grades
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
//과목 업데이트 
async function Updatelecture(student_id, lecture_id, nonattendance, attendance, tardy, absent, weeknum) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 업데이트 쿼리 작성
        const query = `
            UPDATE lecture_have_object 
            SET 
                nonattendance = ?, 
                attendance = ?, 
                tardy = ?, 
                absent = ?,
                weeknum = ?
            WHERE student_id = ? AND lecture_id = ?
        `;
        const result = await conn.query(query, [nonattendance, attendance, tardy, absent, weeknum, student_id, lecture_id]);
        // 쿼리 실행
        console.log('Data updated successfully:', result);
    } catch (err) {
        console.error('Error updating data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function get_event_objcet(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT * FROM event_object WHERE campus_id = ? AND sell_check = 0`
            , [campus_id]);
        return rows;

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function admin_get_event_objcet(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT * FROM event_object WHERE campus_id = ?`
            , [campus_id]);
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
            + "post.date, post.title, "
            + "post.`contents`, post.`like`,"
            + "post.`view`, user.profilePhoto, post.post_id, post.user_id "
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
        const query =
            `SELECT 
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
        const query =
            `SELECT 
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

async function Get_One_Event_Item(item_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT *
            FROM event_object eo
            WHERE eo.object_id = (
                SELECT MIN(eo2.object_id)
                FROM event_object eo2
                WHERE eo2.name = ? AND eo2.sell_check = 0
            );`
        );
        const rows = await conn.query(query, [item_name]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
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

//로그인할때(유저 PK값 가져오기)
async function getyourpoint(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        // 데이터 삽입 쿼리 작성
        const rows = await conn.query(
            'SELECT user.point FROM user WHERE user_id = ?', [user_id]);
        console.log(rows);
        return rows;
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function update_user_point(user_pk, price) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 'UPDATE user SET point = point - ? WHERE user_id = ?'
        const result = await conn.query(query, [price, user_pk]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function update_object(object_pk) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `UPDATE event_object
        SET sell_check = 1
        WHERE object_id = ?`
        const result = await conn.query(query, [object_pk]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function insert_user_have_object(user_id, object_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO student_have_object (user_id, object_id, using_check, using_date)
        VALUES (?, ?, 0, DEFAULT);`
        await conn.query(query, [user_id, object_id]);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function getUserHaveCoupon(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT 
            eo.object_id,
            eo.name,
            eo.price,
            eo.code_num,
            eo.using_time,
            eo.image_num,
            eo.sell_check,
            eo.explain,
            sho.buy_date,
            sho.using_check,
            sho.using_date
        FROM 
            event_object eo
        JOIN 
            student_have_object sho ON eo.object_id = sho.object_id
        WHERE 
            sho.user_id = ?`
        );
        const rows = await conn.query(query, [user_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//학교 pk값을 통해 캠퍼스이름 스터디룸이름 가져오기
async function getCampus(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT study_room.study_room_id, study_room.study_room_name, study_room.campus_place, study_room.image
            FROM study_room
            JOIN campus ON study_room.campus_id = campus.campus_id
            WHERE study_room.campus_id = ?
        `;
        const rows = await conn.query(query, [campus_id]);
        console.log(rows);
        return rows;
    } catch (err) {
        console.error('Error fetching data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function insert_student_study_room(student , study_room, study_room_date, study_room_time) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO study_room_have_object (student, study_room, study_room_date, study_room_time)
        VALUES (?, ?, ?, ?);`
        await conn.query(query, [student, study_room, study_room_date, study_room_time]);
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function get_student_study_room(student) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
        SELECT
            study_room_have_object.student,
            study_room.study_room_name,
            study_room.image,
            study_room_have_object.study_room_date,
            study_room_have_object.study_room_time
        FROM
            study_room_have_object
            INNER JOIN study_room ON study_room_have_object.study_room = study_room.study_room_id
        WHERE
            study_room_have_object.student = ?;
        `;
        const rows = await conn.query(query, [student]);
        return rows;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function get_studyroom_date() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `SELECT study_room.study_room_name, study_room_have_object.study_room_date, study_room_have_object.study_room_time
        FROM study_room_have_object
        JOIN study_room ON study_room_have_object.study_room = study_room.study_room_id;`
        const rows = await conn.query(query);
        return rows;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

// 알람 전체 이리내
async function get_aram_data(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT 
            aram.aram_id,
            aram.user_id,
            aram.target_id,
            aram.title,
            aram.target_type,
            aram.time,
            post_comment.post_id AS post_comment_id,
            post_comment.title AS post_comment_title,
            hot_post.post_id AS hot_post_id,
            hot_post.title AS hot_post_title,
            school_notice.post_id AS school_notice_id,
            school_notice.title AS school_notice_title,
            department_notice.post_id AS department_notice_id,
            department_notice.title AS department_notice_title,
            my_post_like.post_id AS my_post_like_id,
            my_post_like.title AS my_post_like_title,
            new_event.event_id AS new_event_id,
            new_event.name AS new_event_name,
            friend_code.friend_code_id AS friend_code_id,
            friend_code.my_name AS friend_code_my_name
        FROM
            aram
        LEFT JOIN
            post AS post_comment ON aram.target_type = 'my_post_comment' AND aram.target_id = post_comment.post_id
        LEFT JOIN
            post AS hot_post ON aram.target_type = 'hot_post' AND aram.target_id = hot_post.post_id
        LEFT JOIN
            post AS school_notice ON aram.target_type = 'school_notice' AND aram.target_id = school_notice.post_id
        LEFT JOIN
            post AS department_notice ON aram.target_type = 'department_notice' AND aram.target_id = department_notice.post_id
        LEFT JOIN
            post AS my_post_like ON aram.target_type = 'my_post_like' AND aram.target_id = my_post_like.post_id
        LEFT JOIN
            event AS new_event ON aram.target_type = 'new_event' AND aram.target_id = new_event.event_id
        LEFT JOIN
            user_friend_code AS friend_code ON aram.target_type = 'friend_code' AND aram.target_id = friend_code.friend_code_id
        WHERE
            aram.user_id = ?
        ORDER BY
            aram.time DESC;`
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
async function get_one_post(post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
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
            + "post.post_id = ?"
        );
        const rows = await conn.query(query, [post_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function addCommentAram(user_id, target_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO aram (user_id, target_id, title, target_type) VALUES (?, ?, "게시물에 답글이 달렸습니다!", "my_post_comment");`
        await conn.query(query, [user_id, target_id]);
        console.log("해당 포스터의 당사자에게 댓글을 달아서 알람을 보냄");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function addHotAram(user_id, target_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO aram (user_id, target_id, title, target_type) VALUES (?, ?, "오늘의 HOT 게시물입니다!", "hot_post");`
        await conn.query(query, [user_id, target_id]);
        console.log("해당 포스터의 당사자에게 댓글을 달아서 알람을 보냄");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function allUser_id() {
    let conn;
    try {
      conn = await pool.getConnection();
      const userIds = await conn.query('SELECT user_id FROM user');
      return userIds
    } catch (err) {
      console.error(err);
    } finally {
      if (conn) conn.release();
    }
  }

  async function addLikeAram(user_id, target_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO aram (user_id, target_id, title, target_type) VALUES (?, ?, "내 게시물에 좋아요를 눌러줬습니다!", "my_post_like");`
        await conn.query(query, [user_id, target_id]);
        console.log("해당 포스터의 당사자에게 좋아요를 눌러서 알람을 보냄");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function getAppAttendanceDate(user_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT * FROM app_attendance WHERE user_id = ?`
        );
        const rows = await conn.query(query, [user_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function addAppAttendanceDate(user_id, date) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `INSERT INTO app_attendance (user_id, date, attendance_check) VALUES (?, ?, 1);`
        );
        const rows = await conn.query(query, [user_id, date]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}


async function update_user_point_2(user_id, point) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 'UPDATE user SET point = point + ? WHERE user_id = ?'
        const result = await conn.query(query, [point, user_id]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function get_invite_num(friend_code) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT * FROM user_friend_code friend_code WHERE friend_code = ?`
        );
        const rows = await conn.query(query, [friend_code]);
        return rows;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function allUser_friend_code(user_id) {
    let conn;
    try {
      conn = await pool.getConnection();
      const query = (
        'SELECT friend_code FROM user_friend_code WHERE user_id = ?'
        );
      const user_friend_code = await conn.query(query, [user_id]);
      return user_friend_code
    } catch (err) {
      console.error(err);
    } finally {
      if (conn) conn.release();
    }
  }

  async function addFriend_Code(user_id, friend_code, user_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `INSERT INTO user_friend_code (user_id, friend_code, my_name) VALUES (?, ?, ?);`
        );
        const rows = await conn.query(query, [user_id, friend_code, user_name]);
        return true;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function Friend_code_User_id(friend_code) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT user_id FROM user WHERE friend_code = ?`
        );
        const rows = await conn.query(query, [friend_code]);
        return rows
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function allUser_Friend_code2() {
    let conn;
    try {
      conn = await pool.getConnection();
      const userallfriendcode = await conn.query('SELECT friend_code FROM user');
      return userallfriendcode
    } catch (err) {
      console.error(err);
    } finally {
      if (conn) conn.release();
    }
  }

async function last_friendCode_Info(user_pk) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
            `SELECT * FROM user_friend_code WHERE user_id = ?`
        );
        const rows = await conn.query(query, [user_pk]);
        const lastRow = rows[rows.length - 1];
        return lastRow;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function addFriendCodeAram(user_pk, friend_code_id, my_name) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO aram (user_id, target_id, title, target_type) VALUES (?, ?, "친구가 초대코드를 입력하셨니다!", "friend_code");`
        await conn.query(query, [user_pk, friend_code_id, my_name]);
        console.log("알람 보내기 성공");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function user_update_point_3(user_id, point) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 'UPDATE user SET point = point + ? WHERE user_id = ?'
        const result = await conn.query(query, [point, user_id]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//메인화면에서 이벤트 데이터 전부 불러와
async function Get_Event_Data(campus_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
           `SELECT * FROM event WHERE EVENT.campus_id = ?`
        );
        const row = await conn.query(query, [campus_id]);
        return row;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//메인화면에서 이벤트 사진
async function Get_Event_Photos(event_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
           `SELECT event_photo.event_photo FROM event_photo WHERE event_photo.event_id = ?`
        );
        const row = await conn.query(query, [event_id]);
        console.log(row);
        return row;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function send_user_event_info(user_id, event_id, content) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO user_send_event (user_id, event_id, time, content) VALUES (?, ?, DEFAULT, ?);`
        await conn.query(query, [user_id, event_id, content]);
        console.log("입력 성공");
        return true;
    } catch (err) {
        console.log(err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function select_user_event_info() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            SELECT user_send_event.user_id, user_send_event.event_id, user_send_event.user_send_event FROM user_send_event
        `;
        const row = await conn.query(query);
        console.log(row);
        return row;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

async function user_send_photo(user_id, event_id, fileNameWithoutExtension) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO user_send_event_photo (event_id, user_id, event_photo) VALUES (?, ?, ?);`
        await conn.query(query, [event_id, user_id, fileNameWithoutExtension]);
        console.log("사진 넣기 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//스터디룸 삭제
async function delete_studyroom(student, study_room_name, study_room_date, study_room_time) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            DELETE FROM study_room_have_object 
            WHERE student = ? 
            AND study_room = (
                SELECT study_room_id FROM study_room WHERE study_room_name = ? LIMIT 1
            )
            AND study_room_date = ? 
            AND study_room_time = ?;
        `;
        const result = await conn.query(query, [student, study_room_name, study_room_date, study_room_time]);
        return true;
    } catch (err) {
        console.error('Error deleting data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function deleteMyPostData(post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "DELETE FROM post WHERE post_id = ?"
        const result = await conn.query(query, [post_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function deleteMyaram(aram_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "DELETE FROM aram WHERE aram_id = ?"
        const result = await conn.query(query, [aram_id]);
        return true;
    } catch (err) {
        console.error('Error updating data:', err);
        return false;
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//메인화면에서 이벤트 사진
async function is_user_post_like(user_id, post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = (
           `SELECT * FROM is_user_post_like WHERE post_id = ? AND user_id = ?`
        );
        const row = await conn.query(query, [post_id, user_id]);
        console.log(row);
        return row.length === 0; // row가 비어 있으면 true, 비어 있지 않으면 false
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}


async function put_user_post_like(user_id, post_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `INSERT INTO is_user_post_like (user_id, post_id) VALUES (?, ?);`
        await conn.query(query, [user_id, post_id]);
        console.log("값 넣기 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function RegistorItem(campus_id, name, price, using_time, image_num, explian, count) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `CALL example_while(?, ?, ?, ?, ?, ?, ?);`
        await conn.query(query, [campus_id, name, price, using_time, image_num, explian, count]);
        console.log("값 넣기 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//수량은 변화하지 않고 DB의 아이템 정보만 변경한다.
async function ChangeItemInfo(origin_name, name, price, using_time, image_num, explian) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = 
        `UPDATE event_object
         SET name = ?, 
             price = ?,
             using_time = ?,
             image_num = ?,
             \`explain\` = ? 
         WHERE name = ? `
        await conn.query(query, [name, price, using_time, image_num, explian, origin_name]);
        console.log("값 넣기 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

async function ChangeItemInfoANDCountUp(origin_name, campus_id, name, price, using_time, image_num, explian, count) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `CALL Change_AND_Insert_Item(?, ?, ?, ?, ?, ?, ?, ?);`
        await conn.query(query, [origin_name, campus_id, name, price, using_time, image_num, explian, count]);
        console.log("값 넣기 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//수량이 감소하고 DB의 아이템 정보를 변경한다.
async function ChangeItemInfoANDCountDown(origin_name, campus_id, name, price, using_time, image_num, explian, count) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `CALL Change_And_Delete_Items(?, ?, ?, ?, ?, ?, ?, ?);`
        await conn.query(query, [origin_name, campus_id, name, price, using_time, image_num, explian, count]);
        console.log("값 넣기 성공");
    } catch (err) {
        console.error('Error inserting data:', err);
    } finally {
        if (conn) conn.release(); // 연결 해제
    }
}

//현재 남은 제고의 아이템 수를 얻기위함
async function getRestItemCount(campus_id, name) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT * FROM event_object WHERE campus_id = ? AND name = ? AND sell_check = 0`
            , [campus_id, name]);
        return rows;

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
    }
}

//현재 팔린 제고의 수량을 파악하기 위함
async function getSellItemCount(campus_id, name) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query(
            `SELECT * FROM event_object WHERE campus_id = ? AND name = ? AND sell_check = 1`
            , [campus_id, name]);
        return rows;

    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end();
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
    update_user_point,
    Get_One_Event_Item,
    update_object,
    insert_user_have_object,
    getUserHaveCoupon,
    getyourpoint,
    update_user_point,
    Updatelecture,
    getCampus,
    insert_student_study_room,
    get_student_study_room,
    get_studyroom_date,
    get_aram_data,
    get_one_post,
    addCommentAram,
    addHotAram,
    allUser_id,
    addLikeAram,
    getAppAttendanceDate,
    addAppAttendanceDate,
    update_user_point_2,
    get_invite_num,
    allUser_friend_code,
    addFriend_Code,
    allUser_Friend_code2,
    Friend_code_User_id,
    last_friendCode_Info,
    addFriendCodeAram,
    user_update_point_3,
    Get_Event_Data,
    Get_Event_Photos,
    send_user_event_info,
    user_send_photo,
    delete_studyroom,
    select_user_event_info,
    getMyPostData,
    deleteMyPostData,
    deleteMyaram,
    is_user_post_like,
    put_user_post_like,
    admin_get_event_objcet,
    RegistorItem,
    ChangeItemInfo,
    ChangeItemInfoANDCountUp,
    ChangeItemInfoANDCountDown,
    getRestItemCount,
    getSellItemCount
};