import React, { useState } from "react";
import { toast } from "react-toastify";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { addFileUser } from "redux/actionCreators/filefoldersActionCreators";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import NoteAddIcon from "@mui/icons-material/NoteAdd";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
};

const CreateFile = ({ currentFolder }) => {
	const [showModal, setShowModal] = useState(false);
	const [file, setFile] = useState("");

	const dispatch = useDispatch();
	const { userId, userFiles } = useSelector(
		(state) => ({
			userId: state.auth.userId,
			userFiles: state.filefolders.userFiles,
		}),
		shallowEqual
	);

	const handleFileSubmit = (e) => {
		e.preventDefault();

		if (!file) return toast.dark("Please add file name!");
		const fileExtension =
			file.split(".").length > 1
				? file.split(".")[file.split(".").length - 1].toLowerCase()
				: "txt";
		const allowedExtensions = [
			"html",
			"php",
			"js",
			"jsx",
			"txt",
			"xml",
			"css",
			"c",
			"cpp",
			"java",
			"cs",
			"py",
			"json",
		];

		if (allowedExtensions.indexOf(fileExtension) === -1) {
			return toast.dark(`File with extension ${fileExtension} not allowed!`);
		}
		const fileName = file.split(".").length > 1 ? file : file + "." + fileExtension;

		const filteredFiles =
			currentFolder === "root folder"
				? userFiles.filter(
						(file) => file.data.parent === "" && file.data.name === fileName.trim()
				  )
				: userFiles.filter(
						(file) =>
							file.data.parent === currentFolder.docId &&
							file.data.name === fileName.trim()
				  );

		if (filteredFiles.length > 0) return toast.dark("This is already present in folder");

		if (currentFolder === "root folder") {
			dispatch(
				addFileUser({
					uid: userId,
					parent: "",
					data: "",
					name: fileName,
					url: "",
					path: [],
				})
			);
			setFile("");
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

		dispatch(
			addFileUser({
				uid: userId,
				parent: currentFolder.docId,
				data: "",
				name: fileName,
				url: "",
				path: path,
			})
		);
		setFile("");
		setOpen(false);
		return;
	};
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	return (
		<>
			<Box>
				{/* <Button sx={{ color: "#000", border: "1px solid", fontSize: "12px" }} onClick={handleOpen} variant="outlined" startIcon={<NoteAddIcon />}>
					Create File
				</Button> */}
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
									Create File
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
							<form onSubmit={handleFileSubmit}>
								<TextField
									sx={{ minWidth: "45ch" }}
									id="outlined-basic"
									label="Enter File Name"
									variant="outlined"
									placeholder="eg. index.html, index.js, index.php, index.txt"
									value={file}
									onChange={(e) => setFile(e.target.value)}
								/>
								<Box sx={{ pt: "30px" }}>
									<Button
										type="submit"
										sx={{ minWidth: "45ch" }}
										variant="contained"
									>
										Add File
									</Button>
								</Box>
							</form>
						</Box>
					</Box>
				</Modal>
			</Box>
		</>
	);
};

export default CreateFile;
