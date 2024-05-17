
export type UserData = {
    admin_check: boolean,
    campus_pk: number,
    department_pk: number, //얘 학과 pk값 가져오기.
    email: string,
    friend_code: string,
    grade: number, //grade
    name: string,
    student_pk: number,
    user_pk: number,
    point : number,
    birth : string,
    currentstatus : string,
    profile_photo : string,
    id : string,
  }

  export type PostDeatilData = {
    post_writer : string,
    writer_department : string,
    write_date : string,
    title : string,
    contents : string,
    like : number,
    view : number,
    writer_propile : string,
  }

  export type PostCommentData = {
    comment_id : number,
    content : string,
    date : string,
    like : number
    student_name : string,
    department_name : string,
    user_id : number,
    post_id : number,
  }