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
        getuserpk,
        getlecturelist,
        get_event_objcet,
        getBarcordMaxNum,
        PostItem,
        UpdateItem,
        DeleteItem,
        get_department_name,
        DeleteUser,
        get_user_have_posts,
        add_book_mark,
        delete_book_mark,
        get_post_detail,
        getComment } = require('./db.js'); // db 파일에서 함수 가져오기
app.use(express.json());

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
    birth: rows[0].birth,
    point: rows[0].point,
    currentstatus: rows[0].currentstatus,
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


//게시글화면에서 전체 게시글을 가져온다.
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
app.get('/getlecture', async (req, res) => {
  try {
      const rows = await getlecturelist();
      const processedData = rows.map(item => ({
          lecture_id: item.lecture_id,
          professor_name : item.professor_name,
          credit: item.credit,
          lecture_name : item.lecture_name,
          lecture_room : item.lecture_room,
          lecture_time : item.lecture_time,
          week: item.week
      }));
      res.json(processedData);
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
  
  console.log("학과 PK성공적으로 넣음");
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

//책갈피 추가 및 삭제
app.post('/add_book_mark', async (req, res) => {
  const {user_id, post_id} = req.body; //데이터 가져올때 무조건 awit

  const result = await add_book_mark(user_id, post_id);
  if(result == true) {
    console.log("추가완료");
  }else if(result == false) {
    const result = await delete_book_mark(user_id, post_id);;
    console.log("삭제됨");
  }
});

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
          date : item.date,
          like : item.like,
          student_name : item.student_name,
          department_name : item.department_name,
          user_id : item.user_id,
          post_id : item.post_id
      }));
      res.json(commentdata);
      console.log("성공적으로 댓글 데이터 보냄");
});

  
//서버 시작
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
