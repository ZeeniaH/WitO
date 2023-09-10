import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Divider from "@mui/material/Divider";

import { Link, useNavigate } from "react-router-dom";

import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";

function Index() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  console.log("context", user);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Box sx={{ p: "10px 20px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Box sx={{
                background: "#fff",
                width: "50px",
                height: "50px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px"
              }}>
                <Link to='/worker/default' >
                  <img
                    style={{ width: "30px" }}
                    src={"/images/Company.png"}
                    alt='images'

                  ></img>
                </Link>
              </Box>
              <Box>
                <IconButton
                  size='large'
                  aria-label='account of current user'
                  aria-controls='menu-appbar'
                  aria-haspopup='true'
                  onClick={handleMenu}
                  color='inherit'
                  sx={{
                    width: "unset",
                    height: "unset",
                  }}
                >
                  <AccountCircle />
                  <Box
                    sx={{
                      alignSelf: "center",
                      fontSize: "18px",
                    }}
                  >
                    {user?.user?.role}
                  </Box>
                  <ExpandMoreIcon sx={{ alignSelf: "center" }} />
                </IconButton>
              </Box>
            </Box>

            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem>
                <Link style={{ color: "#000", textDecoration: "none" }} to="/worker/user-profile">Profile</Link>
              </MenuItem>
              <Divider />
              <MenuItem>
                <Link style={{ color: "#000", textDecoration: "none" }} to='/home/pricing-plans'> Price Plans</Link>
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </AppBar>
      </Box>
    </>
  );
}

export default Index;
