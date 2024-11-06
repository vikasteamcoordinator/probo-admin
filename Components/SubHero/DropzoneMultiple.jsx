// ** Next, React And Locals Imports
import { useEffect, useState } from "react";
import Link from "next/link";
import ToastStatus from "@/Components/Toaster/ToastStatus";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import CustomImage from "@/Components/Image/CustomImage";
import theme from "@/mui/theme.js";
import useStyles from "./styles.js";

// ** MUI Imports
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { MdClose } from "react-icons/md";

function DropzoneMultiple(props) {
  const { classes } = useStyles();

  // States
  const [prevImages, setPrevImages] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    maxFiles: 4,
    maxSize: 1000000,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles?.length > 0 && prevImages.length < 3) {
        // For preview images while uploading
        const imageFiles = acceptedFiles.map((file) => Object.assign(file));

        setPrevImages((prevValue) => [...prevValue, ...imageFiles]);

        // To store images in server
        let image = new FormData();

        for (let i = 0; i < acceptedFiles.length; i++) {
          image.append("<HOMEPAGE_IMAGES>", acceptedFiles[i]);
        }

        const { data } = await axios.post(
          process.env.NEXT_PUBLIC_API_URL + "homepage-images",
          image
        );

        const path = [...props.value];

        data?.paths.map((item) => path.push(item.split("/")[3]));

        if (props.onChange) {
          props.onChange(path);
        }
      } else {
        ToastStatus(
          "Error",
          "You can only upload 3 files & maximum size of 1 MB."
        );
      }
    },
    onDropRejected: () => {
      ToastStatus(
        "Error",
        "You can only upload 3 files & maximum size of 1 MB."
      );
    },
  });

  useEffect(() => {
    const images = props.value;

    // Convert to blob image
    if (images.length > 0 && prevImages.length === 0) {
      images.map((image) => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}uploads/${image}`)
          .then((res) => res.blob())
          .then((blob) => {
            setPrevImages((prevValue) => [...prevValue, blob]);
          })
          .catch((error) => {
            // Handle error if the fetch operation fails
            console.error(error);
          });
      });
    }
  }, [props.value]);

  // Render the preview image
  const renderImages = (file) => {
    return (
      <CustomImage
        alt={"risk reducer"}
        src={URL.createObjectURL(new Blob([file]))}
        width={55}
        height={45}
      />
    );
  };

  const handleRemoveFile = (file, index) => {
    const filtered = prevImages.filter((item) => item !== file);

    if (prevImages.length > 0) {
      setPrevImages(filtered);
    }

    // Removing image from db
    const removeImageIndex = props.value[index];

    const filteredImages = props.value.filter(
      (item) => item !== removeImageIndex
    );

    props.onChange(filteredImages);
  };

  const handleRemoveAllFiles = () => {
    setPrevImages([]);
    // Removing images from db
    props.onChange([]);
  };

  // Preview images
  const fileList = prevImages.map((file, index) => (
    <ListItem sx={{ p: 0 }} key={index} className={classes.previewImg}>
      <div className={classes.removeImg}>
        <div>{renderImages(file)}</div>
      </div>
      <MdClose
        onClick={() => handleRemoveFile(file, index)}
        className={classes.removeImgIcon}
      />
    </ListItem>
  ));

  const handleLinkClick = (event) => {
    event.preventDefault();
  };

  return (
    <div>
      <Box {...getRootProps()} className={classes.dropZone}>
        <input {...getInputProps()} />
        <Box className={classes.uploadContainer}>
          <CustomImage
            src={"/assets/uploadIcon.png"}
            alt="upload icon"
            width={100}
            height={100}
          />
          <Box>
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              Drop files here or click{" "}
              <Link href="/" onClick={handleLinkClick}>
                browse
              </Link>{" "}
              thorough your machine
            </Typography>
          </Box>
        </Box>
      </Box>
      <Typography sx={{ mt: 1 }} variant="body1" align="center">
        {props.text}
      </Typography>
      {prevImages?.length > 0 && (
        <div className={classes.previewImgContainer}>
          <List className={classes.previewImgs}>{fileList}</List>
          <div className={classes.removeAllBtn}>
            <PrimaryButton
              text="Remove All"
              onClick={handleRemoveAllFiles}
              style={{
                backgroundColor: `${theme.palette.error.light} !important`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default DropzoneMultiple;
