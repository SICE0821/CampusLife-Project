const express = require("express");
const multer = require('multer');
const app = express();
const PORT = 3000;
const mariadb = require('mariadb');
const { getGeneralPosts,
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
        get_department_name,
        get_university_name,
        DeleteUser,
        Updateaccount,
        UpdateItem,
        DeleteItem,
        UpdateImg,
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
              } = require('./db.js'); // db 파일에서 함수 가져오기
app.use(express.json());
app.use(express.static('./App/images/'));



function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate2(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}-${hours}-${minutes}`;
}


const pool = mariadb.createPool({
  host: '14.6.152.64',
  port: 3306,
  user: 'root',
  password: '1214',
  connectionLimit: 10,
  database: 'campuslife',
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './App/images/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });


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

//바코드 최댓값 가져오기
app.get('/getMaxBarcordNum', async (req, res) => {
  try {
    const rows = await getBarcordMaxNum();
    const BarcordMaxNum = {
      barcordMaxNum : rows[0].max_code_num
    }

    res.json(BarcordMaxNum);
  }catch (error) {
    console.error("바코드 맥스넘 잘 못가져옴")
  }
})

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
    profile_photo : rows[0].profilePhoto,
    id : rows[0].id,
    name: rows[0].name,
    campus_pk: rows[0].campus_id,
    department_pk: rows[0].department_id,
    email: rows[0].email,
    grade: rows[0].grade,
    birth: formatDate(rows[0].birth),
    point: rows[0].point,
    currentstatus: rows[0].currentstatus,
    student_semester : rows[0].student_semester,
    college: rows[0].college,
  };
  res.json(userData);
})



//해당 학교의 이벤트 상품 싹 가져오기
app.post('/get_event_obj', async(req, res) => {
  const {campus_id} = req.body;
  const rows = await get_event_objcet(campus_id);
  console.log("서버 응답 잘 받음");
  
  const event_object_datas = rows.reduce((accumulator, item) => {
    const itemName = item.name;

    // 이미 해당 아이템의 인덱스를 찾은 경우
    const existingItemIndex = accumulator.findIndex(obj => obj.name === itemName);

    if (existingItemIndex !== -1) {
        // 이미 해당 아이템이 존재하는 경우 카운트 증가
        accumulator[existingItemIndex].count++;
    } else {
        // 해당 아이템이 처음 발견된 경우 새로운 객체로 추가
        accumulator.push({
            objec_id: item.object_id,
            name: itemName,
            price: item.price,
            code_num: item.code_num,
            using_time: item.using_time,
            image_num: item.image_num,
            sell_check: item.sell_check,
            explain: item.explain,
            count: 1 // 초기 카운트는 1로 설정
        });
    }

    return accumulator;
}, []);

res.json(event_object_datas);
});

//학교 전체 공지사항
app.get('/noticeschoolpost', async (req, res) => {
  try {
      const rows = await getNoticePosts();
      const processedData = rows.map(item => ({
          post_id: item.post_id,
          title: item.title,
          contents: item.contents,
          date: formatDate(item.date),
          view: item.view,
          like: item.like,
          name: item.name,
          admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//학교 학과 공지사항
app.get('/noticedepartmentpost', async (req, res) => {
  try {
      const rows = await getNoticeDepartmentPosts();
      const processedData = rows.map(item => ({
          post_id: item.post_id,
          title: item.title,
          contents: item.contents,
          date: formatDate(item.date),
          view: item.view,
          like: item.like,
          name: item.name,
          admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//학교 핫 공지사항
app.get('/NoticeHotpost', async (req, res) => {
  try {
      const rows = await getNoticeHotPosts();
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//학과 핫 공지사항
app.get('/NoticeDepartmentHotpost', async (req, res) => {
  try {
      const rows = await getNoticeDepartmentHotPosts();
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//공지사항에서 학교 북마크 게시글 가져오기
app.post('/Noticebookmark', async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  try {
      const rows = await getNoticeBookmarkPosts(user_id);
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//공지사항에서 학과 북마크 게시글 가져오기
app.post('/NoticeDepartmentbookmark', async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  try {
      const rows = await getNoticeDepartmentBookmarkPosts(user_id);
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



//게시글화면에서 전체 전체 게시글을 가져온다.
app.get('/generalpost', async (req, res) => {
    try {
        const rows = await getGeneralPosts();
        const processedData = rows.map(item => ({
            post_id: item.post_id,
            title: item.title,
            contents: item.contents,
            date: formatDate(item.date),
            view: item.view,
            like: item.like,
            name: item.name,
            admin_check: item.admin_check,
        }));
        res.json(processedData);
        console.log("성공적으로 데이터 보냄");
    } catch (error) {
        console.error(error); 
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//게시글화면에서 전체 핫 게시글을 가져온다.
app.get('/Hotpost', async (req, res) => {
  try {
      const rows = await getHotPosts();
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//게시글화면에서 전체 북마크 게시글을 가져온다.
app.post('/bookmark', async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  try {
      const rows = await getBookmarkPosts(user_id);
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//게시글화면에서 학과 전체 게시글을 가져온다
app.get('/departmentpost', async (req, res) => {
  try {
      const rows = await getDepartmentPosts();
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//게시글화면에서 학과 핫 게시글을 가져온다
app.get('/departmentHotpost', async (req, res) => {
  try {
      const rows = await getdepartmentHotPosts();
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//게시글화면에서 학과 책갈피 게시글을 가져온다
app.post('/departmentbookmark', async (req, res) => {
  const { user_id } = req.body;
  console.log(user_id);
  try {
      const rows = await getdepartmentBookmarkPosts(user_id);
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
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

// 과목 가져오기
app.post('/getlecture', async (req, res) => {
  const studentId = req.body.student_pk; // POST 요청에서 student_id를 가져옴
  if (!studentId) {
      return res.status(400).json({ error: 'student_id is required' });
  }

  try {
      const rows = await getLectureList(studentId);
      const processedData = rows.map(item => ({
          lecture_id: item.lecture_id,
          professor_name: item.name, 
          credit: item.credit,
          lecture_name: item.lecture_name,
          lecture_room: item.lecture_room,
          lecture_time: item.lecture_time,
          week: item.week,
          nonattendance: item.nonattendance,
          attendance: item.attendance,
          tardy: item.tardy,
          absent: item.absent,
          weeknum : item.weeknum,
          lecture_grade : item.lecture_grade,
          lecture_semester : item.lecture_semester
      }));
      res.json({ data: processedData });
      console.log(processedData)
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//상품 등록하기
app.post('/postItem', async (req, res) => {
  const { campus_id, name, price, code_num, using_time, image_num, sell_check, explain} = req.body;
  PostItem(campus_id, name, price, code_num, using_time, image_num, sell_check, explain);
  console.log("성공적으로 값 넣음");
});

//상품 편집하기
app.post('/updateItem', async (req, res) => {
  const { name, newname, price, using_time, image_num, sell_check, explain} = req.body;
  UpdateItem(name, newname, price, using_time, image_num, sell_check, explain);
  console.log("성공적으로 값 넣음");
});

//상품 삭제하기
app.post('/deleteItem', async (req, res) => {
  const { name, deletenum} = req.body;
  DeleteItem(name, deletenum);
  console.log("성공적으로 값 넣음");
});

//유저 삭제하기
app.post('/delete_user', async (req, res) => {
  const { user_pk } = req.body;
  DeleteUser(user_pk);
  console.log("성공적으로 값 넣음");
});

//학과 이름 가져오기
app.post('/get_department_name', async (req, res) => {
  const {department_name} = req.body; //데이터 가져올때 무조건 awit
  const rows = await get_department_name(department_name);
  const Department = {
    userdepartment: rows[0].name
  };
  res.json(Department);
  
  //console.log("학과 PK성공적으로 넣음");
});

//학교 이름 가져오기
app.post('/get_university_name', async (req, res) => {
  const {university_name} = req.body; //데이터 가져올때 무조건 awit
  const rows = await get_university_name(university_name);
  const University = {
    useruniversity: rows[0].name
  };
  res.json(University);
  
  //console.log("학교 PK성공적으로 넣음");
});

//계정 삭제
app.post('/delete_user', async (req, res) => {
  const { user_pk } = req.body;
  try {
      await DeleteUser(user_pk);
      console.log("계정 삭제 완료");
      res.status(200).send({ message: "계정 삭제가 완료되었습니다." }); // 클라이언트에 응답 전송
  } catch (error) {
      console.error("계정 삭제 실패:", error);
      res.status(500).send({ message: "계정 삭제 실패" }); // 클라이언트에 응답 전송
  }
});

//계정 업데이트
app.post('/updateAccount', async (req, res) => {
  const { email, grade, currentstatus, student_id } = req.body;
  console.log("성공적으로 값 넣음");
  try {
    Updateaccount(email, grade, currentstatus, student_id);
    console.log("성공적으로 업데이트 됨");
    res.status(200).send({ message: "계정 업데이트가 완료되었습니다." }); // 클라이언트에 응답 전송
  } catch (error) {
    console.error("계정 업데이트 실패", error);
    res.status(500).send({ message: "계정 업데이트 실패" }); // 클라이언트에 응답 전송
  }
});

//이미지 업데이트
app.post('/updateImg', async (req, res) => {
  const { profilePhoto, user_id } = req.body;
  console.log("성공적으로 값 넣음");
  try {
    UpdateImg(profilePhoto, user_id);
    console.log("성공적으로 업데이트 됨");
    res.status(200).send({ message: "이미지 업데이트가 완료되었습니다." }); // 클라이언트에 응답 전송
  } catch (error) {
    console.error("계정 업데이트 실패", error);
    res.status(500).send({ message: "이미지 업데이트 실패" }); // 클라이언트에 응답 전송
  }
});

//사용자의 현제 책갈피 정보를 가져옴
app.post('/get_user_have_post', async (req, res) => {
  const {user_id} = req.body; //데이터 가져올때 무조건 awit
  //console.log(user_id);
  const rows = await get_user_have_posts(user_id);
  const user_have_posts = rows.map(item => ({
    user_id : item.user_id,
    post_id : item.post_id
  }));
  //console.log(user_have_posts);
  res.json(user_have_posts);
  console.log("책갈피 정보를 가져옴");
});

//책갈피 추가 삭제
app.post('/add_book_mark', async (req, res) => {
  try {
    const { user_id, post_id } = req.body; //1번 body에서 값 추출

    const result = await add_book_mark(user_id, post_id); //2번 db실행
    if (result === true) {
      console.log("추가완료");
      res.status(200).send({ message: "북마크 추가 완료" });
    } 
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).send({ message: "서버 오류" });
  }
});

//책갈피 삭제
app.post('/delete_book_mark', async (req, res) => {
  try {
    const { user_id, post_id } = req.body; //1번 body에서 값 추출

    const deleteResult = await delete_book_mark(user_id, post_id);
    if (deleteResult === true) {
      console.log("삭제완료");
      res.status(200).send({ message: "북마크 삭제 완료" });
    } 
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).send({ message: "서버 오류" });
  }
})

//포스트 디테일 페이지 정보 불러오기
app.post('/get_post_detail', async (req, res) => {
  const {post_id} = req.body; //데이터 가져올때 무조건 awit
  const row = await get_post_detail(post_id);

  const userData = {
    post_writer: row[0].student_name,
    writer_department: row[0].department_name,
    write_date: formatDate2(row[0].date),
    title: row[0].title,
    contents : row[0].contents,
    like : row[0].like,
    view: row[0].view,
    writer_propile: row[0].profilePhoto,
    post_id : row[0].post_id,
  };
  res.json(userData);

});

//포스트 댓글 리스트 불러오기
app.post('/get_comment', async (req, res) => {
  const {post_ida} = req.body; //데이터 가져올때 무조건 awit
  const rows = await getComment(post_ida);
      const commentdata = rows.map(item => ({
          comment_id : item.comment_id,
          content : item.contents,
          date : formatDate(item.date),
          like : item.like,
          student_name : item.student_name,
          department_name : item.department_name,
          user_id : item.user_id,
          post_id : item.post_id,
          user_profile : item.profilePhoto
      }));
      res.json(commentdata);
      console.log("성공적으로 댓글 데이터 보냄");
});


// 학교 건물 정보 가져오기
app.get('/getSchoolBuildingInfo', async (req, res) => {
  try {
      const rows = await get_campus_building_Info();
      const processedData = rows.map(item => ({
          campus_id: item.campus_id,
          building_name: item.building_name,
          campus_place: item.campus_place,
          latitude: item.latitude,
          longitude: item.longitude
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 학교 정보 가져오기
app.get('/getSchoolInfo', async (req, res) => {
  try {
      const rows = await get_campus_Info();
      const processedData = rows.map(item => ({
          department_id: item.department_id,
          department_name: item.department_name,
          campus_id: item.campus_id,
          campus_name: item.campus_name,
          department_phone: item.department_phone,
          department_floor: item.department_floor,
          department_building: item.department_building
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


//포스터 대댓글 하나 가져오기
app.post('/get_recomment', async (req, res) => {
  const {comment_id} = req.body; //데이터 가져올때 무조건 awit
  const rows = await getReComment(comment_id);
      const recommentdata = rows.map(item => ({
          recomment_id : item.recomment_id,
          comment_id : item.comment_id,
          student_name : item.student_name,
          department_name : item.department_name,
          content : item.contents,
          user_id : item.user_id,
          date : formatDate(item.date),
          like : item.like,
          user_profile : item.profilePhoto,
      }));
      res.json(recommentdata);
      //console.log(recommentdata);
});

//이미지 업로드 및 DB저장
app.post('/upload', upload.array('images'), (req, res) => {
  console.log("일단 서버에는 잘 들어와");
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded');
  }

  const fileNames = req.files.map(file => file.filename); // 파일 이름 추출
  const fileNamesString = fileNames.join(', '); // 파일 이름을 문자열로 결합

  // 파일 이름에서 마지막 숫자 추출
  const lastChar = fileNamesString.match(/\d/g).pop(); // 파일 이름에서 모든 숫자를 찾아 마지막 숫자 추출
  const user_pk = parseInt(lastChar, 10); // 마지막 문자를 정수로 변환

  console.log(fileNamesString);
  updateUserImg(user_pk, fileNamesString);
  res.send(fileNamesString);
});

//게시물 댓글 달기
app.post('/writecomment', async (req, res) => {
  try {
    
    const { post_id, user_id, contents} = req.body;
    //console.log(post_id);
    const result = await post_comment(post_id, user_id, contents);
    if(result == true) {
      console.log("댓글 달림");
      res.json(result);
    }else if(result == false) {
      console.log("댓글 안달림");
      res.json(result);
    }
  } catch (error) {
    console.error("댓글달기 실패:", error);
  }
});

//게시물 대댓글 달기
app.post('/rewritecomment', async (req, res) => {
  try {
    const { comment_id, user_id, contents} = req.body;
    //console.log(post_id);
    const result = await post_recomment(comment_id, user_id, contents);
    console.log(result);
    if(result == true) {
      console.log("대댓글 달림");
      res.json(result);
    }else if(result == false) {
      console.log("대댓글 안달림");
      res.json(result);
    }
  } catch (error) {
    console.error("대댓글달기 실패:", error);
  }
});


app.post('/post_like_up', async (req, res) => {
  try {
    const { post_id } = req.body; //1번 body에서 값 추출
    const result = await post_like_up(post_id); 

    if (result === true) {
      console.log("포스터 좋아요 누르기 성공");
      res.status(200).send({ message: "포스터 좋아요 누르기 성공" });
    } 
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).send({ message: "서버 오류" });
  }
});

app.post('/comment_like_up', async (req, res) => {
  try {
    const { comment_id } = req.body; //1번 body에서 값 추출
    const result = await comment_like_up(comment_id); 

    if (result === true) {
      console.log("댓글 좋아요 누르기 성공");
      res.status(200).send({ message: "댓글 좋아요 누르기 성공" });
    } 
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).send({ message: "서버 오류" });
  }
});

app.post('/recomment_like_up', async (req, res) => {
  try {
    const { recomment_id } = req.body; //1번 body에서 값 추출
    const result = await recomment_like_up(recomment_id); 

    if (result === true) {
      console.log("대댓글 좋아요 누르기 성공");
      res.status(200).send({ message: "대댓글 좋아요 누르기 성공" });
    } 
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).send({ message: "서버 오류" });
  }
});

app.post('/write_post', async (req, res) => {
  try {
    const { user_id, department_check, inform_check, title, contents} = req.body;
    console.log(title);
    console.log(contents);
    console.log(inform_check);
    console.log(department_check);
    console.log(user_id);
    const result = await write_post(user_id, department_check, inform_check, title, contents);
    if(result == true) {
      console.log("게시물 쓰기 성공");
      res.json(result);
    }else if(result == false) {
      console.log("게시물 쓰기 실패");
      res.json(result);
    }
  } catch (error) {
    console.error("게시물 쓰기 실패:", error);
  }
});



//게시물 찾기
app.post('/search_post', async (req, res) => {
  const { search_text } = req.body;
  try {
      const rows = await searchPost(search_text);
      const processedData = rows.map(item => ({
        post_id: item.post_id,
        title: item.title,
        contents: item.contents,
        date: formatDate(item.date),
        view: item.view,
        like: item.like,
        name: item.name,
        admin_check: item.admin_check,
      }));
      res.json(processedData);
      console.log("성공적으로 데이터 보냄");
  } catch (error) {
      console.error(error); 
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/view_count_up', async (req, res) => {
  try {
    const { post_id } = req.body; //1번 body에서 값 추출
    const result = await view_count_up(post_id); 

    if (result === true) {
      console.log("view 횟수 증가!");
      res.status(200).send({ message: "view 횟수 증가!" });
    } 
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).send({ message: "서버 오류" });
  }
});


//서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
