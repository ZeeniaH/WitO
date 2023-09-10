import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addFolderUser } from "redux/actionCreators/filefoldersActionCreators";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
};

const CreateFolder = ({ currentFolder }) => {
	// const [showModal, setShowModal] = useState(false);
	const [folderName, setFolderName] = useState("");

	const dispatch = useDispatch();
	const { userId, userFolders } = useSelector(
		(state) => ({
			userId: state.auth.userId,
			userFolders: state.filefolders.userFolders,
		}),
		shallowEqual
	);

	const handleFolderSubmit = (e) => {
		e.preventDefault();
		const filteredFolders =
			currentFolder === "root folder"
				? userFolders.filter(
						(folder) =>
							folder.data.parent === "" && folder.data.name === folderName.trim()
				  )
				: userFolders.filter(
						(folder) =>
							folder.data.parent === currentFolder.docId &&
							folder.data.name === folderName.trim()
				  );
		if (!folderName) return toast.dark("Please enter folder name!");

		if (filteredFolders.length > 0) return toast.dark("This is already present in folder");

		if (currentFolder === "root folder") {
			dispatch(addFolderUser(folderName, userId, "", []));
			setFolderName("");
			setOpen(false);
			return;
		}

		const path =
			currentFolder.data.path.length > 0
				? [
						...currentFolder.data.path,
						{ id: currentFolder.docId, name: currentFolder.data.name },
				  ]
				: [{ id: currentFolder.docId, name: currentFolder.data.name }];
		dispatch(addFolderUser(folderName, userId, currentFolder.docId, path));
		setFolderName("");
		setOpen(false);
		return;
	};

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<>
			<div>
				<Button
					sx={{ color: "#000", border: "1px solid", fontSize: "12px" }}
					onClick={handleOpen}
					variant="outlined"
					startIcon={<CreateNewFolderIcon />}
				>
					Create Folder
				</Button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Box sx={style}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								p: "10px",
							}}
						>
							<Box>
								<Typography
									sx={{ p: "6px 0" }}
									id="modal-modal-title"
									variant="h4"
									component="h2"
								>
									Create Folder
								</Typography>
							</Box>
							<Box>
								<Button
									onClick={handleClose}
									variant="white"
									style={{ cursor: "pointer" }}
								>
									<CloseIcon />
								</Button>
							</Box>
						</Box>
						<Divider style={{ color: "#645353", border: "1px solid" }} />
						<Box sx={{ p: "25px 15px", mt: "10px" }}>
							<form onSubmit={handleFolderSubmit}>
								<TextField
									sx={{ minWidth: "45ch" }}
									id="outlined-basic"
									label="Enter Folder Name"
									variant="outlined"
									value={folderName}
									onChange={(e) => setFolderName(e.target.value)}
								/>
								<Box sx={{ pt: "30px" }}>
									<Button
										type="submit"
										sx={{ minWidth: "45ch" }}
										variant="contained"
									>
										Add Folder
									</Button>
								</Box>
							</form>
						</Box>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default CreateFolder;
