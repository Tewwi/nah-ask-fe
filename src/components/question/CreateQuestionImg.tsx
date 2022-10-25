import { Box, Typography, List, ListItem } from "@mui/material";
import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { checkFile } from "../../util/handleError";

import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CancelIcon from "@mui/icons-material/Cancel";
import { text } from "../../util/Text";

const useStyle = makeStyles(() => ({
  imgContain: {
    backgroundColor: "transparent",
    textAlign: "center",
    cursor: "pointer",
    color: "#333",
    padding: "15px",
    border: "1px dotted #b3b3b3",
    minHeight: "80px",
    minWidth: "100px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContain: {
    display: "flex",
    height: "100%",
    marginRight: "20px",
    flexWrap: "wrap",
  },
  iconCamera: {
    color: "#b3b3b3",
    fontSize: "40px !important",
  },
  iconCancel: {
    color: "grey",
    position: "absolute",
    top: "-6px",
    right: "-5px",
  },
  img: {
    objectFit: "cover",
    height: "100%",
    width: "100%",
    padding: "0",
  },
  listImg: {
    maxHeight: "150px",
    maxWidth: "120px",
    padding: "0 !important",
    margin: "10px",
  },
}));

interface ICreateQuestionImg {
  control: Control<any, any>;
  images: any;
  setImages: React.Dispatch<any>;
}

const CreateQuestionImg = ({
  control,
  images,
  setImages,
}: ICreateQuestionImg) => {
  const classes = useStyle();
  const imgInputRef = React.useRef<HTMLInputElement>(null);
  const [previewImg, setPreviewImg] = useState<any>([]);
  const [error, setError] = useState("");

  const handleClickAvatar = () => {
    if (imgInputRef.current) {
      imgInputRef.current.click();
    }
  };

  const handleOnchangeImg = (file: any) => {
    const error = checkFile(file);

    if (error || images.length === 3) {
      if (error) {
        setError(error);
      } else {
        setError(text.ImgMax);
      }
      return images;
    }

    setError("");

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = function (e) {
      setPreviewImg((prev: any) => [...prev, reader.result]);
    };

    setImages((prev: Array<any>) => {
      if (prev && file) {
        return [...prev, file];
      }

      return prev;
    });

    return images;
  };

  const handleRemoveImg = (removeIndex: number) => {
    setImages((prev: Array<any>) =>
      prev.filter((_, index) => index !== removeIndex)
    );
    setPreviewImg((prev: Array<any>) =>
      prev.filter((_, index) => index !== removeIndex)
    );

    return images;
  };

  return (
    <>
      <Typography variant="h5">{text.Img}</Typography>
      <Typography variant="subtitle2">{text.AddImg}</Typography>

      <Box style={{ display: "flex" }}>
        <Controller
          name="img"
          control={control}
          render={({ field: { onChange, ...rest } }) => (
            <List className={classes.contentContain}>
              {images.map((_: any, index: number) => (
                <ListItem key={index} className={classes.listImg}>
                  <img
                    src={previewImg[index]}
                    alt={index.toString()}
                    className={classes.img}
                  />
                  <div
                    onClick={() => {
                      handleRemoveImg(index);
                    }}
                  >
                    <CancelIcon
                      fontSize="small"
                      className={classes.iconCancel}
                    />
                  </div>
                </ListItem>
              ))}
              <div className={classes.imgContain} onClick={handleClickAvatar}>
                <CameraAltOutlinedIcon className={classes.iconCamera} />
                <input
                  {...rest}
                  ref={imgInputRef}
                  onChange={(e: React.ChangeEvent<any>) => {
                    if (e.target.files) {
                      handleOnchangeImg(e.target.files[0]);
                    }
                  }}
                  style={{ display: "none" }}
                  multiple={true}
                  type="file"
                />
              </div>
            </List>
          )}
        />
      </Box>
      {error && (
        <Typography variant="subtitle2" color="red">
          {error}
        </Typography>
      )}
    </>
  );
};

export default CreateQuestionImg;
