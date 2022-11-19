import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ITag } from "../../interface/QuestionItemInterface";
import { pathName } from "../../router/pathName";

interface ITagChip {
  data: ITag;
}

const TagChip = (props: ITagChip) => {
  const { data } = props;
  const navigate = useNavigate();

  const btnStyle = {
    minWidth: "0px",
    maxWidth: "100%",
    bgcolor: "#e1ecf4",
    border: "none",
    marginLeft: '8px',
    "&:hover": {
      border: "none",
      bgcolor: "#e1ecf4",
      opacity: "0.8",
    },
  };

  const handleClick = () => {
    navigate(`${pathName.search}?tag=${data._id}`);
  };

  return (
    <Button onClick={handleClick} variant="outlined" size="small" sx={btnStyle}>
      <Typography variant="body2" noWrap>
        {data.name}
      </Typography>
    </Button>
  );
};

export default TagChip;
