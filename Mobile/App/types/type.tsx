export type RootStackParam = {
  CommunityPage: undefined;
  CommunityDetailPage: {
    name: string,
    age: number,
  };
  WritePostPage: undefined;
  TimetablePage: undefined;
  CommunityTopNavigation: undefined;
}


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
  point: number,
  birth: string,
  currentstatus: string,
  profile_photo: string | null,
  id: string,
}
export type PostDeatilData = {
  post_writer: string,
  writer_department: string,
  write_date: string,
  title: string,
  contents: string,
  like: number,
  view: number,
  writer_propile: string,
  post_id : number,
}

export type PostCommentData = {
  comment_id: number,
  content: string,
  date: string,
  like: number
  student_name: string,
  department_name: string,
  user_id: number,
  post_id: number,
  user_profile : string,
}

export type CommentsWithRecomments = {
  comment_id: number,
  content: string,
  date: string,
  like: number
  student_name: string,
  department_name: string,
  user_id: number,
  post_id: number,
  user_profile : string,
  recomments: {
    comment_id: number;
    content: string;
    date: string;
    like: number;
    department_name: string;
    recomment_id: number;
    student_name: string; // 대댓글에도 student_name이 포함될 것으로 예상되어 추가했습니다.
    user_id: number; // 대댓글에도 user_id가 포함될 것으로 예상되어 추가했습니다.
    user_profile : string,
  }[];
}