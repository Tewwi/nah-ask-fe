import { IImage } from "./QuestionItemInterface";

export interface IUser {
  avatar: IImage;
  email: string;
  role: string;
  userName: string;
  _id: string;
  createAt: Date;
  isBlock: boolean
}
