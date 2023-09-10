import React from "react";
import dayjs from "dayjs";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Slide from "@mui/material/Slide";
import styles from "./addRecipient.module.scss";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { Grid, TextField, Box } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

function Index() {
  const [open, setOpen] = React.useState(false);
  const [toggle, setToggle] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const [value, setValue] = React.useState(dayjs("2014-08-18T21:11:54"));

  const handleChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Box>
        <Box className={styles.addButton}>
          <Button variant='contained' onClick={handleClickOpen}>
            <AddCircleOutlineIcon />
          </Button>
        </Box>
        <Dialog
          open={open}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby='alert-dialog-slide-description'
        >
          <DialogContent>
            <Box
              sx={{
                position: "absolute",
                right: "15px",
                top: "5px",
              }}
            >
              <Box component={"a"} data-dismiss='modal' href='#'>
                <CloseIcon fontSize='small' onClick={handleClose} />
              </Box>
            </Box>
            <DialogContentText

              id='alert-dialog-slide-description'
            >
              <Box
                sx={{
                  width: "100%",
                  py: 5,
                }}
                className={styles.addManualSection}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box className={styles.rightSideSection}>
                      <Box component={"h2"}>Add Recipient</Box>
                      <Box className={styles.addManualFieldsBody}>
                        <Box className={styles.addManualFields}>
                          {/* <Select
                                                        className={
                                                            styles.textField
                                                        }
                                                    >
                                                        <TextField
                                                            sx={{
                                                                width: "100%",
                                                            }}
                                                        />
                                                        <MenuItem>
                                                            Select Company
                                                        </MenuItem>
                                                        <MenuItem>
                                                            Company 1
                                                        </MenuItem>
                                                        <MenuItem>
                                                            Company 2
                                                        </MenuItem>
                                                        <MenuItem>
                                                            Company 3
                                                        </MenuItem>
                                                    </Select> */}
                          <TextField
                            className={styles.textField}
                            id='outlined-input'
                            label='Customer*'
                            type='Text'
                          />
                          <TextField
                            className={styles.textField}
                            id='outlined-input'
                            label='Invoice Title*'
                            type='text'
                          />

                          <Button
                            sx={{
                              mt: "20px",
                              float: "right",
                              textTransform: "capitalize",
                            }}
                            variant='contained'
                            onClick={handleClose}
                          >
                            Save
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
}

export default Index;
