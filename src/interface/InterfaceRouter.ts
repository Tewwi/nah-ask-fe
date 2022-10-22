import { LazyExoticComponent } from "react";

export default interface IRoute {
  path: string;
  components: LazyExoticComponent<any>;
  needLogin?: boolean;
  needAdminRole?: boolean;
}
