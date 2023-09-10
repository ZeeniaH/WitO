import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Typography,
	Modal,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { storage, firestore } from "API/firebase";
import { addFileUser } from "redux/actionCreators/filefoldersActionCreators";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import LinearProgress from "@mui/material/LinearProgress";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { toLowercaseExtension } from "../../../utils/toLowercaseExtention";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { BASE_URL } from "config";
import socketIOClient from 'socket.io-client';

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	borderRadius: "15px",
};

const UploadFile = ({ currentFolder }) => {
	const { t } = useTranslation();
	const params = useParams();

	let companyId;
	if (params.companyId) {
		companyId = params.companyId;
	} else if (params.id) {
		companyId = params.id;
	}

	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const user = JSON.parse(localStorage.getItem("user"));

	const handleClose = () => {
		setFiles([]);
		setFileName([]);
		setOpen(false)
	};
	const [files, setFiles] = useState([]);
	const [fileName, setFileName] = useState([]);
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);

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
		dispatch(setLoading(true));
		if (!files || files.length === 0) {
			dispatch(setLoading(false));
			return toast.dark("Please add file(s)!");
		}

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const fileName = file.name;

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
			if (filteredFiles.length > 0) {
				toast.dark(`"${fileName}" is already present in folder`);
				dispatch(setLoading(false));
				continue;
			}

			// const uploadFileRef = storage.ref(`files/${userId}/${fileName}`);
			const uploadFileRef = storage.ref(`files/${companyId}/${userId}/${fileName}`);

			await uploadFileRef.put(file).on(
				"state_change",
				(snapshot) => {
					const newProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					setProgress(newProgress);
				},
				(error) => {
					toast.error(error.message);
					dispatch(setLoading(false));
				},
				async () => {
					const url = await uploadFileRef.getDownloadURL();
					if (currentFolder === "root folder") {
						dispatch(
							addFileUser({
								uid: userId,
								parent: "",
								companyId: companyId,
								data: "",
								name: fileName,
								url: url,
								path: [],
							})
						);
					} else {
						const path =
							currentFolder.data.path.length > 0
								? [...currentFolder.data.path, { id: currentFolder.docId, name: currentFolder.data.name },]
								: [{ id: currentFolder.docId, name: currentFolder.data.name }];

						dispatch(
							addFileUser({
								uid: userId,
								parent: currentFolder.docId,
								companyId: companyId,
								data: { isNew: true, status: "In Progress" },
								name: fileName,
								url: url,
								path: path,
							})
						);
					}
					setProgress(0);
					if (i === files.length - 1) {
						dispatch(setLoading(false));
					}

					try {
						const notifyResponse = await fetch(`${BASE_URL}/notify/create`, {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json',
								Authorization: `Bearer ${user.tokens.access.token}`,
							},
							body: JSON.stringify({
								isRead: false,
								message: `By ${user.user.name} to archive`,
								heading: 'File Upload',
								icon: 'file-upload',
								companyId: companyId,
								workerId: user.user.id
							}),
						});
						const notifyJson = await notifyResponse.json();

						if (!notifyResponse.ok) {
							console.error('Failed to create notification:', notifyJson.message);
						}
					} catch (error) {
						console.error('Error creating notification:', error);
					}
				}
			);
		}

		setFiles([]);
		setOpen(false);
	};

	const handleFileChange = async (e) => {
		setIsLoading(true);
		let errorOccurred = false;
		if (e.target.files) {
			setFiles([]);
			setFileName([]);
			// Convert the file list to an array
			const filesArray = Array.from(e.target.files);
			if (filesArray.length === 0) {
				setIsLoading(false);
				errorOccurred = true;
				toast.dark("Please add a file!");
			}
			if (filesArray.length > 10) {
				setIsLoading(false);
				errorOccurred = true;
				toast.dark("Maximum 10 files can be uploaded at once");
			}

			// Create a new array with the new file names
			const newFileNames = filesArray.map((file) => {
				return toLowercaseExtension(file.name);
			});

			const fileExtensions = newFileNames.map((fileName) => {
				const lastDotIndex = fileName.lastIndexOf(".");
				const extension = fileName.substring(lastDotIndex + 1);
				return extension;
			});

			const allowedExtensions = ["png", "jpg", "jpeg", "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"];

			fileExtensions.forEach((extension) => {
				if (allowedExtensions.indexOf(extension) === -1) {
					setIsLoading(false);
					errorOccurred = true;
					toast.dark(`File with extension ${extension} not allowed!`);
				}
			});

			// Return if an error has occurred
			if (errorOccurred) {
				return;
			}

			// Update the state with the new file names
			setFiles(filesArray);
			setFileName(newFileNames);

			setIsLoading(false);
		}
	};

	console.log("companyId", companyId)

	return (
		<>
			<ToastContainer autoClose={8000} />

			<Box>
				<Button
					sx={{ color: "#7206ef", border: "1px solid", fontSize: "12px" }}
					onClick={handleOpen}
					variant="outlined"
					startIcon={<FileUploadIcon />}
				>
					{t('Upload File')}
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
									{t('Upload File')}
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
							{isLoading && (
								<Box
									sx={{
										position: "absolute",
										left: 0,
										top: 0,
										width: "100%",
										height: "100%",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
										zIndex: 2,
										backgroundColor: "rgba(0, 0, 0, 0.68)",
									}}
								>
									<img src="/images/loader.gif" />
								</Box>
							)}
							{progress && progress !== 100 ? (
								<LinearProgress now={progress} label={`${progress}%`} />
							) : progress === 100 ? (
								<Box component={"p"}>{t('File Uploaded Successfully')}</Box>
							) : (
								<Box
									component="form"
									onSubmit={handleFileSubmit}
									encType="multipart/form-data"
									sx={{ "& >.MuiFormControl-root": { my: 1 } }}
								>
									<Button
										sx={{
											width: "100%",
											p: "0",
											border: "1px solid #bbb5b5",
											background: "#dce4ec",
											padding: "15px",
											display: "inline-block",
											height: "100%",
											lineHeight: "50px",
											mb: "10px",
										}}
										variant="outlined"
										component="label"
									>
										<Box sx={{ color: "#000", display: "flex", justifyContent: "center" }}>{t('Choose File')} &nbsp;</Box>
										<input
											type="file"
											custom="true"
											hidden
											multiple
											onChange={(e) => handleFileChange(e)}
										/>
									</Button>

									{
										fileName.map((name, index) => (
											<Box sx={{
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												maxWidth: "200px",
											}} key={index}>{name}</Box>
										))
									}

									<Box sx={{ pt: "30px" }}>
										<Button
											type="submit"
											sx={{ width: "100%" }}
											variant="contained"
										>
											{t('Add File')}
										</Button>
									</Box>
								</Box>
							)}
						</Box>
					</Box>
				</Modal>
			</Box>
		</>
	);
};

export default UploadFile;
