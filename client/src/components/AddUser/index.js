import React from "react";
import { Button, MenuItem, Select, TextField } from "@mui/material";
import { Box, Container } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./AddUser.module.scss";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Header from "../Header";

function Index() {
  const [role, setRole] = React.useState("");
  const handleChange = (event) => {
    setRole(event.target.value);
  };
  return (
    <>
      <Header />
      <Box
        sx={{
          backgroundColor: "#f6f8fa",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <Container maxWidth='md'>
          <Box className={styles.addUserSection}>
            <Box className={styles.addUserIcon}>
              <PersonIcon />
            </Box>
            <Box className={styles.addUserContent}>
              <Box component={"h3"}>Add User</Box>
            </Box>
            <Box className={styles.addUserFieldsBody}>
              <Box className={styles.addUserFields}>
                <TextField
                  className={styles.textField}
                  id='outlined-input'
                  label='Name*'
                  type='name*'
                />
                <TextField
                  className={styles.textField}
                  id='outlined-password-input'
                  label='Email*'
                  type='Email*'
                />
                <TextField
                  className={styles.textField}
                  id='outlined-password-input'
                  label='Password*'
                  type='Password*'
                />
                <TextField
                  className={styles.textField}
                  id='outlined-password-input'
                  label='Confirm Password*'
                  type='Password*'
                />
                <FormControl fullWidth className={styles.textField}>
                  <InputLabel id='demo-simple-select-label'>
                    Select Role*
                  </InputLabel>
                  <Select
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    value={role}
                    label='Select Role*'
                    onChange={handleChange}
                  >
                    <MenuItem value={10}>Admin</MenuItem>
                    <MenuItem value={20}>Book Keeper</MenuItem>
                    <MenuItem value={30}>Company Owner</MenuItem>
                    <MenuItem value={40}>Worker</MenuItem>
                  </Select>
                </FormControl>
                <Button sx={{ width: "100%", mt: "15px" }} variant='contained'>
                  Add User
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
export default Index;
