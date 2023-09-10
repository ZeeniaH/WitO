import { Collapse, Grow, IconButton, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import MuiAlert from "@mui/material/Alert";
import CloseIcon from "@mui/icons-material/Close";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Notification({ msg, type }) {
	const [open, setOpen] = useState(true);

	useEffect(() => {
		setOpen(true);
		setTimeout(() => {
			setOpen(false);
		}, 3000);
	}, []);

	const handleClose = (event, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setOpen(false);
	};
	return (
		<Collapse in={open}>
			<Alert
				severity={type}
				action={
					<IconButton
						aria-label="close"
						color="inherit"
						size="small"
						onClick={handleClose}
					>
						<CloseIcon fontSize="inherit" />
					</IconButton>
				}
				sx={{ width: "100%" }}
			>
				{msg}
			</Alert>
		</Collapse>
	);
}
