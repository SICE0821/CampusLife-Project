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
    department_pk: number,
    email: string,
    friend_code: string,
    grade: number,
    name: string,
    student_pk: number,
    user_pk: number,
    point : number,
  }