import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import {
	deleteDocument,
	deleteFile,
	deleteFolder,
	getAdminFiles,
	getAdminFolders,
	getUserFiles,
	getUserFolders,
} from "redux/actionCreators/filefoldersActionCreators";
import { Box, Grid } from "../../../../../node_modules/@mui/material/index.js";
import DescriptionIcon from "@mui/icons-material/Description";
import SubNav from "../SubNav.js";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

const FolderAdminComponent = () => {
	const { folderId } = useParams();

	const { files, folders, isLoading } = useSelector(
		(state) => ({
			folders: state.filefolders.adminFolders,
			files: state.filefolders.adminFiles,
			isLoading: state.filefolders.isLoading,
		}),
		shallowEqual
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (isLoading && (!folders || !files)) {
			dispatch(getAdminFolders());
			dispatch(getAdminFiles());
		}
	}, [dispatch, isLoading]);
	const adminFiles = files && files.filter((file) => file.data.parent === folderId);

	const currentFolder = folders && folders.find((folder) => folder.docId === folderId);
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
			<SubNav currentFolder={currentFolder} />
			<Box>
				<Grid container spacing={2}>
					<Grid item md={12}>
						<Box component={"p"} sx={{ borderBottom: "1px solid #DEE2E6", py: "10px" }}>
							Created Files
						</Box>
						<Box sx={{ height: "150px", pt: "8px", pb: "10px", px: "10px" }}>
							{!files ? (
								<Box component={"h1"} sx={{ textAlign: "center" }}>
									Fetching Files....
								</Box>
							) : (
								adminFiles.map(({ data, docId }) => (
									<Grid
										item
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
										md={2}
										sx={{
											textAlign: "center",
											p: "10px",
											border: "1px solid #dee2e6",
											maxWidth: "150px",
											m: "25px auto",
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
										<DescriptionIcon
											style={{
												fontSize: "3rem",
												mt: "10px",
												color: "#A9B4F4",
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
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default FolderAdminComponent;
