import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
	deleteDocument,
	deleteFile,
	deleteFolder,
	getAdminFiles,
	getAdminFolders,
	getUserFiles,
	getUserFolders,
} from "redux/actionCreators/filefoldersActionCreators";
import { Box, Grid } from "@mui/material/index.js";
import SubNav from "../SubNav.js";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Layout from "pwa-layout";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const FolderComponent = () => {
	const { folderId } = useParams();

	const { folders, isLoading, userId, files } = useSelector(
		(state) => ({
			folders: state.filefolders.userFolders,
			files: state.filefolders.userFiles,
			isLoading: state.filefolders.isLoading,
			userId: state.auth.userId,
		}),
		shallowEqual
	);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		if (isLoading) {
			dispatch(getAdminFolders());
			dispatch(getAdminFiles());
		}
		if (!folders && !files) {
			dispatch(getUserFolders(userId));
			dispatch(getUserFiles(userId));
		}
	}, [dispatch, folders, isLoading]);
	const userFolders = folders && folders.filter((file) => file.data.parent === folderId);

	const currentFolder = folders && folders.find((folder) => folder.docId === folderId);

	const createdFiles =
		files && files.filter((file) => file.data.parent === folderId && file.data.url === "");

	const uploadedFiles =
		files && files.filter((file) => file.data.parent === folderId && file.data.url !== "");

	if (isLoading) {
		return (
			<Box>
				<Grid container spacing={2}>
					<Grid item md={12}>
						<Box component={"p"} sx={{ textAlign: "center", py: "10px" }}>
							Fetching data...
						</Box>
					</Grid>
				</Grid>
			</Box>
		);
	}

	if (
		userFolders &&
		userFolders.length < 1 &&
		createdFiles &&
		createdFiles.length < 1 &&
		uploadedFiles &&
		uploadedFiles.length < 1
	) {
		return (
			<>
				<Layout />
				<SubNav currentFolder={currentFolder} />
				<Box>
					<Grid container spacing={2}>
						<Grid item md={12}>
							<Box component={"p"} sx={{ textAlign: "center", py: "10px" }}>
								Empty Folder
							</Box>
						</Grid>
					</Grid>
				</Box>
			</>
		);
	}

	const handleDeleteFile = async (documentId) => {
		await dispatch(deleteFile(documentId));
		dispatch(getUserFiles(userId));
	};

	const handleDeleteFolder = async (documentId) => {
		await dispatch(deleteFolder(documentId));
		dispatch(getUserFolders(userId));
	};

	return (
		<>
			<Layout />
			<SubNav currentFolder={currentFolder} />
			{userFolders && userFolders.length > 0 && (
				<>
					<Box component={"p"} sx={{ borderBottom: "1px solid #DEE2E6", py: "10px" }}>
						Created Folders
					</Box>
					<Grid>
						<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
							{!folders ? (
								<Box component={"h1"} sx={{ textAlign: "center" }}>
									Fetching Files....
								</Box>
							) : (
								userFolders.map(({ data, docId }) => (
									<Grid
										item
										md={2}
										xs={6}
										onDoubleClick={() =>
											navigate(`/home/archive/folder/${docId}`)
										}
										onClick={(e) => {
											if (e.currentTarget.classList.contains("text-white")) {
												e.currentTarget.style.background = "#fff";
												e.currentTarget.classList.remove("text-white");
												e.currentTarget.classList.remove("shadow-sm");
											} else {
												e.currentTarget.style.background = "#017bf562";
												e.currentTarget.classList.add("text-white");
												e.currentTarget.classList.add("shadow-sm");
											}
										}}
										key={docId}
										sx={{
											textAlign: "center",
											p: "10px",
											border: "1px solid #dee2e6",
											maxWidth: "150px",
											m: "25px 5px",
											position: "relative",
										}}
									>
										<IconButton
											aria-label="delete"
											onClick={() => handleDeleteFolder(docId)}
											sx={{
												color: "error.light",
												position: "absolute",
												top: "5px",
												right: "5px",
											}}
										>
											<DeleteIcon />
										</IconButton>
										<FolderIcon
											style={{
												fontSize: "3rem",
												mt: "10px",
												color: "#D7C47A",
											}}
										/>
										<Box
											component={"p"}
											sx={{
												textAlign: "center",
												mt: "10px",
												maxWidth: "100%",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{data.name}
										</Box>
									</Grid>
								))
							)}
						</Grid>
					</Grid>
				</>
			)}
			{createdFiles && createdFiles.length > 0 && (
				<>
					<Box sx={{ textAlign: "center", borderBottom: "1px   #dee2e6", py: "20px" }}>
						Created Files
					</Box>
					<Grid>
						<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
							{createdFiles.map(({ data, docId }) => (
								<Grid
									item
									md={2}
									xs={6}
									onDoubleClick={() => navigate(`/home/archive/file/${docId}`)}
									onClick={(e) => {
										if (e.currentTarget.classList.contains("text-white")) {
											e.currentTarget.style.background = "#fff";
											e.currentTarget.classList.remove("text-white");
											e.currentTarget.classList.remove("shadow-sm");
										} else {
											e.currentTarget.style.background = "#017bf562";
											e.currentTarget.classList.add("text-white");
											e.currentTarget.classList.add("shadow-sm");
										}
									}}
									key={docId}
									sx={{
										textAlign: "center",
										p: "10px",
										border: "1px solid #dee2e6",
										maxWidth: "150px",
										m: "25px 5px",
										position: "relative",
									}}
								>
									<IconButton
										aria-label="delete"
										onClick={() => handleDeleteFile(docId)}
										sx={{
											color: "error.light",
											position: "absolute",
											top: "5px",
											right: "5px",
										}}
									>
										<DeleteIcon />
									</IconButton>
									<DescriptionIcon
										style={{ fontSize: "3rem", mt: "10px", color: "#A9B4F4" }}
									/>
									<Box
										component={"p"}
										sx={{
											textAlign: "center",
											mt: "10px",
											maxWidth: "100%",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{data.name}
									</Box>
								</Grid>
							))}
						</Grid>
					</Grid>
				</>
			)}
			{uploadedFiles && uploadedFiles.length > 0 && (
				<>
					<Box
						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
					>
						Uploaded Files
					</Box>
					<Grid>
						<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
							{uploadedFiles.map(({ data, docId }) => (
								<Grid
									item
									md={2}
									xs={6}
									onDoubleClick={() => navigate(`/home/archive/file/${docId}`)}
									onClick={(e) => {
										if (e.currentTarget.classList.contains("text-white")) {
											e.currentTarget.style.background = "#fff";
											e.currentTarget.classList.remove("text-white");
											e.currentTarget.classList.remove("shadow-sm");
										} else {
											e.currentTarget.style.background = "#017bf562";
											e.currentTarget.classList.add("text-white");
											e.currentTarget.classList.add("shadow-sm");
										}
									}}
									key={docId}
									sx={{
										textAlign: "center",
										p: "10px",
										border: "1px solid #dee2e6",
										maxWidth: "150px",
										m: "25px 5px",
										position: "relative",
									}}
								>
									<IconButton
										aria-label="delete"
										onClick={() => handleDeleteFile(docId)}
										sx={{
											color: "error.light",
											position: "absolute",
											top: "5px",
											right: "5px",
										}}
									>
										<DeleteIcon />
									</IconButton>
									{data.name
										.split(".")
									[data.name.split(".").length - 1].includes("png") ||
										data.name
											.split(".")
										[data.name.split(".").length - 1].includes("jpg") ||
										data.name
											.split(".")
										[data.name.split(".").length - 1].includes("jpeg") ||
										data.name
											.split(".")
										[data.name.split(".").length - 1].includes("svg") ||
										data.name
											.split(".")
										[data.name.split(".").length - 1].includes("gif") ? (
										<PhotoSizeSelectActualIcon
											style={{ fontSize: "48px", color: "#5BA3B2" }}
										/>
									) : data.name
										.split(".")
									[data.name.split(".").length - 1].includes("mp4") ||
										data.name
											.split(".")
										[data.name.split(".").length - 1].includes("mpeg") ? (
										<VideoLibraryIcon
											style={{ fontSize: "48px", color: "#F47D02" }}
										/>
									) : (
										<PictureAsPdfIcon style={{ fontSize: "48px" }} />
									)}
									<Box
										component={"p"}
										sx={{
											textAlign: "center",
											mt: "10px",
											maxWidth: "100%",
											overflow: "hidden",
											textOverflow: "ellipsis",
											whiteSpace: "nowrap",
										}}
									>
										{data.name}
									</Box>
								</Grid>
							))}
						</Grid>
					</Grid>
				</>
			)}
		</>
	);
};

export default FolderComponent;
