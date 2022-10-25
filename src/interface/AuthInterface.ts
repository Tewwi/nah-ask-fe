import { IImage } from "./QuestionItemInterface";

export interface ILogin {
  email: string;
  password: string;
  remember: boolean;
}

export interface IRegister {
  userName: string;
  avatar?: IImage;
  email: string;
  password: string;
  re_password: string;
}
