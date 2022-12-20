import { useEffect, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IRoute from "../interface/InterfaceRouter";
import { IUser } from "../interface/UserInterface";
import { selectCurrentUser } from "../redux/authSlice";
import { pathName } from "./pathName";

interface IProtectedRoute {
  route: IRoute;
}

const ProtectedRoute = ({ route }: IProtectedRoute) => {
  const currentUser: IUser | null = useSelector(selectCurrentUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      if ((route.needLogin || route.needAdminRole) && !currentUser) {
        navigate(pathName.login, { replace: true });
      }
    }
  }, [currentUser, navigate, route.needAdminRole, route.needLogin])

  useLayoutEffect(() => {
    if (!currentUser) {
      if ((route.needLogin || route.needAdminRole) && !currentUser) {
        navigate(pathName.login, { replace: true });
      }
    }
    if (route.needAdminRole && currentUser && currentUser.role !== "admin") {
      navigate("/");
    }
    if (route.notForBlockUser && currentUser && currentUser.isBlock) {
      navigate("/");
    }
  }, [
    currentUser,
    navigate,
    route.needAdminRole,
    route.needLogin,
    route.notForBlockUser,
  ]);

  return <route.components />;
};

export default ProtectedRoute;
