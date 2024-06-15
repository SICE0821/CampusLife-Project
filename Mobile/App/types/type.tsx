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
  student_semester : number, 
  college : number,
  title : string
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
  user_id : number
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

export type ShopItemData = {
  code_num : string,
  count : number,
  explain : string,
  image_num : number,
  name : string,
  object_id : number,
  price : number,
  sell_check : boolean,
  using_time : string,
}

export type UserHaveCouponData = {
  code_num : string,
  explain : string,
  image_num : number,
  name : string,
  object_id : number,
  price : number,
  sell_check : boolean,
  using_time : string,
  buy_date : string,
  using_check : boolean,
  using_date : boolean,
  count : number,
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

export type Lecture = {
  forEach: any;
  lecture_id: number;
  credit: number;
  professor_name: string;
  lecture_name: string;
  lecture_room: string;
  lecture_time: string;
  week: string;
  division : string;
  nonattendance: number;
  attendance: number;
  tardy: number;
  absent: number;
  weeknum: number;
  lecture_grade : number;
  lecture_semester : number;
  lecture_credit : number;
  lecture_grades : string;
  session_duration: number;
}

export type aramData = {
  aram_id : number,
  user_id : number,
  target_id : number,
  title : string,
  target_type : string,
  time : string,
  post_comment_id : number,
  post_comment_title : string,
  hot_post_id : number,
  hot_post_title : string,
  school_notice_id : number,
  school_notice_title : string,
  department_notice_id : number,
  department_notice_title : string,
  my_post_like_id : number,
  my_post_like_title : string,
  new_event_id : number,
  new_event_name : string,
  friend_code_id : number,
  friend_code_my_name : string,
}

export type EventData = {
  event_id : number,
  campus_id : number,
  user_id : number,
  name : string,
  get_point : number,
  info : string,
  simple_info : string,
  event_photo : string,
  start_date : string,
  close_date : string,
  is_event_close : boolean
  photo_list: {
    photo_data : string
  }[];
}

export type AdminEventList = {
  event_id : number,
  name : string,
  info : string,
  campus_id : number,
  event_photo : string,
  start_date : string,
  close_date  : string
};

export type EditEventInfo = {
  event_id : number,
  campus_id : number,
  name : string,
  get_point : number,
  info : string,
  simple_info : string,
  start_date : string,
  close_date : string,
}

export type EditEventVote = {
  vote_index : number,
  vote_name : string,
}
