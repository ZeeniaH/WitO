import { Box, Button, Container, Grid } from "@mui/material";
import React from "react";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import AddIcon from "@mui/icons-material/Add";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import styles from "./FileManager.module.scss";

function index() {
  return (
    <>
      <Container>
        <Box
          sx={{
            display: "flex",
            pt: "40px",
          }}
        >
          <Box>
            <Button
              sx={{ width: "115px" }}
              variant='contained'
              component='label'
              startIcon={<AddIcon />}
            >
              New
              {/* <input
                                hidden
                                accept="image/*"
                                multiple
                                type="file"
                            /> */}
            </Button>
          </Box>
          <Box sx={{ ml: "8px" }}>
            <Button
              sx={{ width: "115px" }}
              variant='outlined'
              component='label'
              startIcon={<FileUploadIcon />}
            >
              Upload
              <input hidden accept='image/*' multiple type='file' />
            </Button>
          </Box>
        </Box>
        <Box className={styles.fileManagerSection}>
          <Box component={"h1"}>My Files</Box>
          <Grid sx={{ pt: "30px" }} container spacing={2}>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 1</Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 2</Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 3</Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 4</Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 5</Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 6</Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 7</Box>
              </Box>
            </Grid>
            <Grid item md={3} xs={4}>
              <Box className={styles.fileManagerMain}>
                <Box className={styles.fileManagerContent}>
                  <InsertDriveFileIcon />
                </Box>
                <Box component={"h4"}>File 8</Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default index;
