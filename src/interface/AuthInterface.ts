export interface ILogin {
  email: string;
  password: string;
  remember: boolean;
}

export interface IRegister {
  userName: string;
  avatar?: string;
  avatarPublicID?: string;
  email: string;
  password: string;
  re_password: string;
}
