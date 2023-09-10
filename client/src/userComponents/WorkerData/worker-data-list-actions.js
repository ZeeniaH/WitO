import React, { useState } from "react";
import { Typography, Popover, MenuList, MenuItem, ListItemIcon } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { BASE_URL } from "config";
import { useConfirm } from "material-ui-confirm";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

function Actions({ workerId, fetchWorkers }) {
	const [anchorEl, setAnchorEl] = useState();
	const user = JSON.parse(localStorage.getItem("user"));
	const confirm = useConfirm();
	const dispatch = useDispatch();

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleDelete = async (id) => {
		confirm({
			description: "Are you sure you want to delete this item? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				dispatch(setLoading(true));
				const response = await fetch(`${BASE_URL}/worker/${id}`, {
					method: "DELETE",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				});
				// const json = await response.json();
				if (response.ok) {
					fetchWorkers();
					handleClose();
				}
				dispatch(setLoading(false));
			})
			.catch(() => {});
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	return (
		<>
			<IconButton
				aria-label="settings"
				aria-describedby={id}
				variant="contained"
				onClick={handleClick}
			>
				<MoreVertIcon />
			</IconButton>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
			>
				<MenuList>
					{/* <Link
						to={`/home/worker/${workerId}`}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<MenuItem color="theme.primary">
							<ListItemIcon>
								<VisibilityIcon fontSize="small" />
							</ListItemIcon>
							<Typography variant="inherit">View</Typography>
						</MenuItem>
					</Link> */}
					<Link style={{ textDecoration: "none", color: "inherit" }}>
						<MenuItem>
							<ListItemIcon></ListItemIcon>
							<Typography variant="inherit">Worktime</Typography>
						</MenuItem>
					</Link>
					<MenuItem>
						<ListItemIcon></ListItemIcon>
						<Typography variant="inherit">Calender</Typography>
					</MenuItem>
					<MenuItem>
						<ListItemIcon></ListItemIcon>
						<Typography variant="inherit">Import from worker</Typography>
					</MenuItem>
					<MenuItem>
						<ListItemIcon></ListItemIcon>
						<Typography variant="inherit">Export to worker</Typography>
					</MenuItem>
					<Link
						to={`/home/edit-worker/${workerId}`}
						style={{ textDecoration: "none", color: "inherit" }}
					>
						<MenuItem>
							<ListItemIcon></ListItemIcon>
							<Typography variant="inherit">Edit</Typography>
						</MenuItem>
					</Link>
					<MenuItem onClick={() => handleDelete(workerId)}>
						<ListItemIcon></ListItemIcon>
						<Typography variant="inherit">Delete</Typography>
					</MenuItem>
				</MenuList>
			</Popover>
		</>
	);
}

export default Actions;
