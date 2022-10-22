import { Box, ImageList, ImageListItem } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { constantValue } from "../../util/constant";

const useStyle = makeStyles((theme) => ({
  imgItem: {
    cursor: "pointer",
    padding: "5px",
  },
}));

interface IQuestionImgPreview {
  images: [any];
}

const QuestionImgPreview = ({ images }: IQuestionImgPreview) => {
  const [imgIndex, setImgIndex] = useState(0);
  const [isPreviewImgOpen, setIsPreviewImgOpen] = useState(false);
  const classes = useStyle();

  const handleClickImg = async (index: number) => {
    setImgIndex(index);
    setIsPreviewImgOpen(true);
  };

  return (
    <Box mt="10px">
      <ImageList sx={{ height: 120 }}>
        {images.map((item, index) => (
          <ImageListItem key={item} sx={{ width: 120 }}>
            <img
              onClick={() => handleClickImg(index)}
              className={classes.imgItem}
              src={item.url}
              alt={item.publicID}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
      {isPreviewImgOpen && (
        <Lightbox
          mainSrc={images[imgIndex].url}
          nextSrc={images[imgIndex + 1] && images[imgIndex + 1].url}
          prevSrc={
            images[imgIndex - 1] && images[imgIndex + images.length - 1].url
          }
          onCloseRequest={() => setIsPreviewImgOpen(false)}
          onMovePrevRequest={() =>
            setImgIndex((imgIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() => setImgIndex((imgIndex + 1) % images.length)}
        />
      )}
    </Box>
  );
};

export default QuestionImgPreview;
