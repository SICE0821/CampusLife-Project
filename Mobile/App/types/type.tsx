export type RootStackParam = {
    CommunityPage : undefined;
    CommunityDetailPage : {
      name : string,
      age : number,
    };
    WritePostPage : undefined;
    TimetablePage : undefined;
    CommunityTopNavigation : undefined;
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
    point : number,
    birth : Date,
    currentstatus : string,
    profile_photo : string,
  }