import { IUser } from "./UserInterface";

interface IComment {
  _id: string;
  body: string;
  blogID: string;
  author: IUser;
  createAt: Date;
}

interface ICreateComment {
  body: string;
  blogID: string;
  author: IUser;
}

interface ITag {
  _id: string;
  name: string;
  description: string;
  createAt: Date;
}

interface ICreateTag {
  name: string;
  description: string;
}

interface IQuestion {
  _id: string;
  thumb?: [string];
  comment?: [IComment];
  body: string;
  approve: boolean;
  title: string;
  author: IUser;
  tags: [ITag];
  createAt: Date;
}

interface IImage {
  url: string;
  publicID: string;
}

interface INewQuestion {
  body: string;
  title: string;
  tags: [string];
  thumb?: any;
}

export type {
  IComment,
  ITag,
  IQuestion,
  ICreateComment,
  IImage,
  INewQuestion,
  ICreateTag,
};
