import React, { useState } from "react";
import {
  Backdrop,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./AppointmentComplete.module.scss";
import Header from "../../Header";
import AppointmentAsideBar from "../AppointmentAsideBar";

function Index() {
  const [toggle, setToggle] = useState(true);
  const [show, setShow] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <Header></Header>
      <Grid position='relative' container spacing={2}>
        <Grid
          item
          xs={"auto"}
          sx={{
            position: {
              md: "static",
              xs: "absolute",
            },
            left: "0",
            top: "0",
            zIndex: "2",
          }}
        >
          <AppointmentAsideBar></AppointmentAsideBar>
        </Grid>
        <Grid item xs>
          <Backdrop
            open={open}
            onClick={handleDrawerClose}
            sx={{ zIndex: 1 }}
          ></Backdrop>
          <Box
            sx={{
              width: "100%",
              minHeight: "100vh",
              py: 5,
              px: {
                xs: 3,
                md: 7,
                lg: 5,
              },
              pl: {
                xs: 10,
                md: "0",
              },
            }}
            className={styles.AppointmentSection}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className={styles.rightSideSection}>
                  <Box component={"h2"}>Appointment Completed</Box>
                  <Box className={styles.AppointmentFieldsBody}>
                    <Box className={styles.AppointmentFields}>
                      <Box>
                        <FormControlLabel
                          onClick={() => setToggle(!toggle)}
                          value='start'
                          control={<Checkbox />}
                          label='Car Damage/s'
                          labelPlacement='start'
                        />
                      </Box>
                      <TextField
                        sx={{
                          display: toggle ? "none" : "block",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Damage Reason'
                        type='text'
                      />
                      <TextField
                        sx={{
                          display: toggle ? "block" : "none",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Damage Address'
                        type='text'
                      />

                      <TextField
                        sx={{
                          display: toggle ? "block" : "none",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Other Details'
                        type='text'
                      />
                      <Button
                        sx={{
                          width: "100%",
                          display: toggle ? "block" : "none",
                          p: "0",

                          border: "1px solid #bbb5b5",
                        }}
                        variant='outlined'
                        component='label'
                      >
                        <Box className={styles.fileSelect}>
                          <Box className={styles.fileSelectButton}>
                            Damage Image/Images
                          </Box>
                          <Box className={styles.fileSelectName}></Box>
                        </Box>
                        <input hidden accept='image/*' multiple type='file' />
                      </Button>

                      <Divider
                        sx={{
                          m: "30px auto",
                        }}
                      />
                      <Box>
                        <FormControlLabel
                          onClick={() => setShow(!show)}
                          value='start'
                          control={<Checkbox />}
                          label='Traffic Violation'
                          labelPlacement='start'
                        />
                      </Box>
                      <TextField
                        sx={{
                          display: show ? "block" : "none",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Violation Reason'
                        type='text'
                      />
                      <TextField
                        sx={{
                          display: show ? "block" : "none",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Violation Fine'
                        type='text'
                      />

                      <TextField
                        sx={{
                          display: show ? "block" : "none",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Ticket Number'
                        type='text'
                      />
                      <TextField
                        sx={{
                          display: show ? "block" : "none",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Violation Address'
                        type='text'
                      />
                      <TextField
                        sx={{
                          display: show ? "block" : "none",
                          "& .MuiInputBase-root": {
                            width: "100%",
                          },
                        }}
                        className={styles.textField}
                        id='outlined-input'
                        label='Other Details'
                        type='text'
                      />
                      <Divider sx={{ m: "20px auto" }} />
                      <TextField
                        className={styles.textField}
                        id='outlined-input'
                        label='Current Mileage'
                        type='text'
                      />

                      <Button sx={{ mt: "20px" }} variant='contained'>
                        Set Appointment Completed
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default Index;
