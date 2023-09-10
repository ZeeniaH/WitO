import React, { useCallback, useEffect, useState } from "react";
import { InputLabel, MenuItem, FormControl, Select, Box, TextField, Fade } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { storage } from "API/firebase";
import { addFileUser } from "redux/actionCreators/filefoldersActionCreators";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LinearProgress from "@mui/material/LinearProgress";
import Tesseract from "tesseract.js";
import { Document, Page, pdfjs } from "react-pdf";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
};

const UploadFile = ({ currentFolder }) => {
	const [file, setFile] = useState(null);
	const [fileName, setFileName] = useState("");
	const [progress, setProgress] = useState(0);
	const [fileType, setFileType] = useState(null);
	const [selectedWord, setSelectedWord] = useState("");

	const dispatch = useDispatch();
	const { userId, userFiles } = useSelector(
		(state) => ({
			userId: state.auth.userId,
			userFiles: state.filefolders.userFiles,
		}),
		shallowEqual
	);

	const handleFileSubmit = async (e) => {
		e.preventDefault();
		if (!file) return toast.dark("Please add file!");
		const fileExtension = file.name.split(".").reverse()[0];
		setFileType(fileExtension);

		const allowedExtensions = ["png", "jpg", "jpeg", "pdf"];
		if (allowedExtensions.indexOf(fileExtension) === -1) {
			return toast.dark(`File with extension ${fileExtension} not allowed!`);
		}
		const filteredFiles =
			currentFolder === "root folder"
				? userFiles.filter(
						(file) =>
							file.data.parent === "" &&
							file.data.name === fileName.split("\\").reverse()[0]
				  )
				: userFiles.filter(
						(file) =>
							file.data.parent === currentFolder.docId &&
							file.data.name === fileName.split("\\").reverse()[0]
				  );
		if (filteredFiles.length > 0) return toast.dark("This is already present in folder");

		const uploadFileRef = storage.ref(`files/${userId}/${selectedWord}.${fileType}`);

		uploadFileRef.put(file).on(
			"state_change",
			(snapshot) => {
				const newProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				setProgress(newProgress);
			},
			(error) => {
				return toast.error(error.message);
			},
			async () => {
				const url = await uploadFileRef.getDownloadURL();
				if (currentFolder === "root folder") {
					dispatch(
						addFileUser({
							uid: userId,
							parent: "",
							data: "",
							name: file.name,
							url: url,
							path: [],
						})
					);
					setFile("");
					setFileName("");
					setProgress(0);
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
						name: file.name,
						url: url,
						path: path,
					})
				);
				setFile("");
				setFileName("");
				setProgress(0);
				setOpen(false);
				return;
			}
		);
	};
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = (event, reason) => {
		setFile(null);
		setFileName("");
		setOpen(false);
	};

	return (
		<>
			<ToastContainer autoClose={8000} />
			<Box>
				<Button
					sx={{ color: "#000", border: "1px solid", fontSize: "12px" }}
					onClick={handleOpen}
					variant="outlined"
					startIcon={<FileUploadIcon />}
				>
					Upload File
				</Button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<Fade in={open}>
						<Box sx={style}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "space-between",
									p: "15px",
								}}
							>
								<Box>
									<Typography
										sx={{ p: "6px 0" }}
										id="modal-modal-title"
										variant="h4"
										component="h2"
									>
										Upload File
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
							<Divider style={{ border: "1px solid #645353" }} />
							<Box sx={{ p: "25px 15px", mt: "10px" }}>
								{progress && progress !== 100 ? (
									<LinearProgress now={progress} label={`${progress}%`} />
								) : progress === 100 ? (
									<p>File Uploaded Successfully</p>
								) : (
									<Box
										component="form"
										onSubmit={handleFileSubmit}
										encType="multipart/form-data"
										sx={{ "& >.MuiFormControl-root": { my: 2, width: "100%" } }}
									>
										<Button
											sx={{
												width: "100%",
												p: "0",
												border: "1px solid #bbb5b5",
												background: "#dce4ec",
												padding: "15px",
												display: "inline - block",
												height: "100 %",
												lineHEight: "50px",
											}}
											variant="outlined"
											component="label"
										>
											<Box sx={{ color: "#000" }}>Choose File</Box>

											<Box>{fileName}</Box>
											<input
												type="file"
												custom="true"
												hidden
												onChange={(e) => {
													setFile(e.target.files[0]);
													setFileName(
														e.target.value.split("\\").reverse()[0]
													);
												}}
											/>
										</Button>
										<Box sx={{ pt: "30px" }}>
											<Button
												type="submit"
												sx={{ width: "100%" }}
												variant="contained"
											>
												Add File
											</Button>
										</Box>
									</Box>
								)}
							</Box>
						</Box>
					</Fade>
				</Modal>
			</Box>
		</>
	);
};

export default UploadFile;
