// import React, { useEffect } from "react";
// import { shallowEqual, useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
// 	deleteDocument,
// 	deleteFile,
// 	deleteFolder,
// 	getAdminFiles,
// 	getAdminFolders,
// 	getUserFiles,
// 	getUserFolders,
// } from "redux/actionCreators/filefoldersActionCreators";
// import SubNav from "../SubNav.js";
// import Layout from "../../../../pwa-layout";
// import { Box, Grid } from "../../../../../node_modules/@mui/material/index.js";
// import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
// import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
// import DescriptionIcon from "@mui/icons-material/Description";
// import FolderIcon from "@mui/icons-material/Folder";
// import IconButton from "@mui/material/IconButton";
// import DeleteIcon from "@mui/icons-material/Delete";
// import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

// const Home = () => {
// 	const navigate = useNavigate();
// 	const dispatch = useDispatch();
// 	const { isLoading, adminFolders, allUserFolders, userId, allUserFiles } = useSelector(
// 		(state) => ({
// 			isLoading: state.filefolders.isLoading,
// 			adminFolders: state.filefolders.adminFolders,
// 			allUserFolders: state.filefolders.userFolders,
// 			allUserFiles: state.filefolders.userFiles,
// 			userId: state.auth.userId,
// 		}),
// 		shallowEqual
// 	);

// 	const userFolders =
// 		allUserFolders && allUserFolders.filter((folder) => folder.data.parent === "");

// 	const createdUserFiles =
// 		allUserFiles &&
// 		allUserFiles.filter((file) => file.data.parent === "" && file.data.url === "");
// 	const uploadedUserFiles =
// 		allUserFiles &&
// 		allUserFiles.filter((file) => file.data.parent === "" && file.data.url !== "");

// 	useEffect(() => {
// 		if (isLoading && !adminFolders) {
// 			dispatch(getAdminFolders());
// 			dispatch(getAdminFiles());
// 		}
// 		if (!userFolders) {
// 			dispatch(getUserFiles(userId));
// 			dispatch(getUserFolders(userId));
// 		}
// 	}, [dispatch, isLoading]);

// 	if (isLoading) {
// 		return (
// 			<Grid container spacing={2}>
// 				<Grid item xs={12}>
// 					<Box component={"h1"} sx={{ textAlign: "center", my: "10px" }}>
// 						Fetching folders...
// 					</Box>
// 				</Grid>
// 			</Grid>
// 		);
// 	}

// 	const handleDeleteFile = async (documentId) => {
// 		await dispatch(deleteFile(documentId));
// 		dispatch(getUserFiles(userId));
// 	};

// 	const handleDeleteFolder = async (documentId) => {
// 		await dispatch(deleteFolder(documentId));
// 		dispatch(getUserFolders(userId));
// 	};

// 	return (
// 		<>
// 			<Layout />
// 			<SubNav currentFolder="root folder" />
// 			{adminFolders && adminFolders.length > 0 && (
// 				<>
// 					<Box
// 						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
// 					>
// 						Admin Folders
// 					</Box>

// 					<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
// 						{adminFolders.map(({ data, docId }) => (
// 							<Grid
// 								item
// 								xs={6}
// 								md={2}
// 								onDoubleClick={() =>
// 									navigate(`/home/archive/folder/admin/${docId}`)
// 								}
// 								onClick={(e) => {
// 									if (e.currentTarget.classList.contains("text-white")) {
// 										e.currentTarget.style.background = "#fff";
// 										e.currentTarget.classList.remove("text-white");
// 										e.currentTarget.classList.remove("shadow-sm");
// 									} else {
// 										e.currentTarget.style.background = "#017bf562";
// 										e.currentTarget.classList.add("text-white");
// 										e.currentTarget.classList.add("shadow-sm");
// 									}
// 								}}
// 								key={docId}
// 								sx={{
// 									textAlign: "center",
// 									p: "10px",
// 									border: "1px solid #dee2e6",
// 									maxWidth: "150px",
// 									m: "25px 5px",
// 									position: "relative",
// 								}}
// 							>
// 								<IconButton
// 									aria-label="delete"
// 									onClick={() => handleDeleteFolder(docId)}
// 									sx={{
// 										color: "error.light",
// 										position: "absolute",
// 										top: "5px",
// 										right: "5px",
// 									}}
// 								>
// 									<DeleteIcon />
// 								</IconButton>
// 								<FolderIcon
// 									style={{ fontSize: "3rem", mt: "10px", color: "#D7C47A" }}
// 								/>
// 								<Box
// 									component={"p"}
// 									sx={{
// 										textAlign: "center",
// 										mt: "10px",
// 										maxWidth: "100%",
// 										overflow: "hidden",
// 										textOverflow: "ellipsis",
// 										whiteSpace: "nowrap",
// 									}}
// 								>
// 									{data.name}
// 								</Box>
// 							</Grid>
// 						))}
// 					</Grid>
// 				</>
// 			)}
// 			{userFolders && userFolders.length > 0 && (
// 				<>
// 					<Box
// 						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
// 					>
// 						Created Folders
// 					</Box>

// 					<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
// 						{userFolders.map(({ data, docId }) => (
// 							<Grid
// 								item
// 								xs={6}
// 								md={2}
// 								onDoubleClick={() => navigate(`/home/archive/folder/${docId}`)}
// 								onClick={(e) => {
// 									if (e.currentTarget.classList.contains("text-white")) {
// 										e.currentTarget.style.background = "#fff";
// 										e.currentTarget.classList.remove("text-white");
// 										e.currentTarget.classList.remove("shadow-sm");
// 									} else {
// 										e.currentTarget.style.background = "#017bf562";
// 										e.currentTarget.classList.add("text-white");
// 										e.currentTarget.classList.add("shadow-sm");
// 									}
// 								}}
// 								key={docId}
// 								sx={{
// 									textAlign: "center",
// 									p: "10px",
// 									border: "1px solid #dee2e6",
// 									maxWidth: "150px",
// 									m: "25px 5px",
// 									position: "relative",
// 								}}
// 							>
// 								<IconButton
// 									aria-label="delete"
// 									onClick={() => handleDeleteFolder(docId)}
// 									sx={{
// 										color: "error.light",
// 										position: "absolute",
// 										top: "5px",
// 										right: "5px",
// 									}}
// 								>
// 									<DeleteIcon />
// 								</IconButton>
// 								<FolderIcon
// 									style={{ fontSize: "3rem", mt: "10px", color: "#D7C47A" }}
// 								/>
// 								<Box
// 									component={"p"}
// 									sx={{
// 										textAlign: "center",
// 										mt: "10px",
// 										maxWidth: "100%",
// 										overflow: "hidden",
// 										textOverflow: "ellipsis",
// 										whiteSpace: "nowrap",
// 									}}
// 								>
// 									{data.name}
// 								</Box>
// 							</Grid>
// 						))}
// 					</Grid>
// 				</>
// 			)}
// 			{createdUserFiles && createdUserFiles.length > 0 && (
// 				<>
// 					<Box
// 						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
// 					>
// 						Created Files
// 					</Box>

// 					<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
// 						{createdUserFiles.map(({ data, docId }) => (
// 							<Grid
// 								item
// 								xs={6}
// 								md={2}
// 								onDoubleClick={() => navigate(`/home/archive/file/${docId}`)}
// 								onClick={(e) => {
// 									if (e.currentTarget.classList.contains("text-white")) {
// 										e.currentTarget.style.background = "#fff";
// 										e.currentTarget.classList.remove("text-white");
// 										e.currentTarget.classList.remove("shadow-sm");
// 									} else {
// 										e.currentTarget.style.background = "#017bf562";
// 										e.currentTarget.classList.add("text-white");
// 										e.currentTarget.classList.add("shadow-sm");
// 									}
// 								}}
// 								key={docId}
// 								sx={{
// 									textAlign: "center",
// 									p: "10px",
// 									border: "1px solid #dee2e6",
// 									maxWidth: "150px",
// 									m: "25px 5px",
// 									position: "relative",
// 								}}
// 							>
// 								<IconButton
// 									aria-label="delete"
// 									onClick={() => handleDeleteFile(docId)}
// 									sx={{
// 										color: "error.light",
// 										position: "absolute",
// 										top: "5px",
// 										right: "5px",
// 									}}
// 								>
// 									<DeleteIcon />
// 								</IconButton>
// 								<DescriptionIcon
// 									style={{ fontSize: "3rem", mt: "10px", color: "#A9B4F4" }}
// 								/>
// 								<Box
// 									component={"p"}
// 									sx={{
// 										textAlign: "center",
// 										mt: "10px",
// 										maxWidth: "100%",
// 										overflow: "hidden",
// 										textOverflow: "ellipsis",
// 										whiteSpace: "nowrap",
// 									}}
// 								>
// 									{data.name}
// 								</Box>
// 							</Grid>
// 						))}
// 					</Grid>
// 				</>
// 			)}
// 			{uploadedUserFiles && uploadedUserFiles.length > 0 && (
// 				<>
// 					<Box
// 						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
// 					>
// 						Uploaded Files
// 					</Box>

// 					<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
// 						{uploadedUserFiles.map(({ data, docId }) => (
// 							<Grid
// 								item
// 								xs={6}
// 								md={2}
// 								onDoubleClick={() => navigate(`/home/archive/file/${docId}`)}
// 								onClick={(e) => {
// 									if (e.currentTarget.classList.contains("text-white")) {
// 										e.currentTarget.style.background = "#fff";
// 										e.currentTarget.classList.remove("text-white");
// 										e.currentTarget.classList.remove("shadow-sm");
// 									} else {
// 										e.currentTarget.style.background = "#017bf562";
// 										e.currentTarget.classList.add("text-white");
// 										e.currentTarget.classList.add("shadow-sm");
// 									}
// 								}}
// 								key={docId}
// 								sx={{
// 									textAlign: "center",
// 									p: "10px",
// 									border: "1px solid #dee2e6",
// 									maxWidth: "150px",
// 									m: "25px 5px",
// 									position: "relative",
// 								}}
// 							>
// 								<IconButton
// 									aria-label="delete"
// 									onClick={() => handleDeleteFile(docId)}
// 									sx={{
// 										color: "error.light",
// 										position: "absolute",
// 										top: "5px",
// 										right: "5px",
// 									}}
// 								>
// 									<DeleteIcon />
// 								</IconButton>
// 								{data.name
// 									.split(".")
// 									[data.name.split(".").length - 1].includes("png") ||
// 								data.name
// 									.split(".")
// 									[data.name.split(".").length - 1].includes("jpg") ||
// 								data.name
// 									.split(".")
// 									[data.name.split(".").length - 1].includes("jpeg") ||
// 								data.name
// 									.split(".")
// 									[data.name.split(".").length - 1].includes("svg") ||
// 								data.name
// 									.split(".")
// 									[data.name.split(".").length - 1].includes("gif") ? (
// 									<PhotoSizeSelectActualIcon
// 										style={{ fontSize: "48px", color: "#5BA3B2" }}
// 									/>
// 								) : data.name
// 										.split(".")
// 										[data.name.split(".").length - 1].includes("mp4") ||
// 								  data.name
// 										.split(".")
// 										[data.name.split(".").length - 1].includes("mpeg") ? (
// 									<VideoLibraryIcon
// 										style={{ fontSize: "48px", color: "#F47D02" }}
// 									/>
// 								) : (
// 									<PictureAsPdfIcon style={{ fontSize: "48px" }} />
// 								)}

// 								<Box
// 									component={"p"}
// 									sx={{
// 										textAlign: "center",
// 										mt: "10px",
// 										maxWidth: "100%",
// 										overflow: "hidden",
// 										textOverflow: "ellipsis",
// 										whiteSpace: "nowrap",
// 									}}
// 								>
// 									{data.name}
// 								</Box>
// 							</Grid>
// 						))}
// 					</Grid>
// 				</>
// 			)}
// 		</>
// 	);
// };

// export default Home;
