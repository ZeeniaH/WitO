import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Slide from "@mui/material/Slide";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

function Index({ message, open, Transition, handleClose }) {
  return (
    <Box>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogContent sx={{ textAlign: "center", padding: "40px 90px" }}>
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
          <Box sx={{ color: "#FF9800", mb: "10px" }}>
            <WarningAmberIcon sx={{ fontSize: "50px" }} />
          </Box>
          <Box sx={{ mb: "10px" }} component={"h2"}>
            Warning!
          </Box>
          <Box component={"p"}>{message}</Box>
        </DialogContent>
        <DialogActions sx={{ p: "20px" }}>
          <Button
            sx={{
              backgroundColor: "#65b12d",
              "&:hover": {
                backgroundColor: "#65b12d",
              },
            }}
            variant='contained'
            onClick={handleClose}
          >
            Yes
          </Button>
          <Button
            sx={{
              backgroundColor: "#F44336",
              "&:hover": {
                backgroundColor: "#F44336",
              },
            }}
            variant='contained'
            onClick={handleClose}
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Index;
