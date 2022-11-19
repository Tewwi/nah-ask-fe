import { text } from "./Text";
import HomeIcon from "@mui/icons-material/Home";
import ListAltIcon from "@mui/icons-material/ListAlt";
import StyleIcon from "@mui/icons-material/Style";
import { SvgIconComponent } from "@mui/icons-material";
interface ISideBarItem {
  text: string;
  link: string;
  icon: SvgIconComponent;
}

export const sideBarItem: ISideBarItem[] = [
  {
    text: text.Home,
    link: "",
    icon: HomeIcon,
  },
  {
    text: text.AllQuestion,
    link: "question",
    icon: ListAltIcon,
  },
  {
    text: text.Tag,
    link: "tag",
    icon: StyleIcon,
  },
];
