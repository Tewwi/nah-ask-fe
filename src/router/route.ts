import { lazy } from "react";
import IRoute from "../interface/InterfaceRouter";
import { pathName } from "./pathName";

const HomePage = lazy(() => import("../pages/HomePage/HomePage"));
const QuestionPage = lazy(() => import("../pages/QuestionPage/QuestionPage"));
const LoginPage = lazy(() => import("../pages/AuthPage/LoginPage"));
const RegisterPage = lazy(() => import("../pages/AuthPage/RegisterPage"));
const UserPage = lazy(() => import("../pages/UserPage/UserPage"));
const ListTagsPage = lazy(() => import("../pages/TagsPage/ListTagsPage"));
const CreateTagPage = lazy(() => import("../pages/TagsPage/CreateTag"));
const UnapprovedQuestion = lazy(
  () => import("../pages/QuestionPage/UnapprovedQuestion")
);
const CreateQuestionPage = lazy(
  () => import("../pages/QuestionPage/CreateQuestionPage")
);
const QuestionDetailPage = lazy(
  () => import("../pages/QuestionPage/QuestionDetailPage")
);
const EditQuestionPage = lazy(
  () => import("../pages/QuestionPage/EditQuestionPage")
);
const SearchResultPage = lazy(
  () => import("../pages/SearchResultPage/SearchResultPage")
);

const routes: IRoute[] = [
  {
    path: `${pathName.questions}/${pathName.create}`,
    components: CreateQuestionPage,
    needLogin: true,
  },
  {
    path: pathName.search,
    components: SearchResultPage,
  },
  {
    path: pathName.login,
    components: LoginPage,
  },
  {
    path: pathName.register,
    components: RegisterPage,
  },
  {
    path: `${pathName.user}/:id`,
    components: UserPage,
  },
  {
    path: `${pathName.questions}/:id`,
    components: QuestionDetailPage,
  },
  {
    path: `${pathName.questions}/edit/:id`,
    components: EditQuestionPage,
  },
  {
    path: pathName.questions,
    components: QuestionPage,
  },
  {
    path: `${pathName.unapproved}`,
    components: UnapprovedQuestion,
    needAdminRole: true,
  },
  {
    path: `${pathName.tag}${pathName.create}`,
    components: CreateTagPage,
    needAdminRole: true,
  },
  {
    path: `${pathName.tag}`,
    components: ListTagsPage,
  },
  {
    path: pathName.home,
    components: HomePage,
  },
  {
    path: "*",
    components: HomePage,
  },
];

export default routes;
