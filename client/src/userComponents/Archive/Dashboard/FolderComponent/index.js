import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import {
	deleteFile,
	deleteFolder,
	getAdminFiles,
	getAdminFolders,
	getUserFiles,
	getUserFolders,
	userFileDataUpdate
} from "redux/actionCreators/filefoldersActionCreators";
import { Box, Grid, InputAdornment, TextField, SvgIcon } from "@mui/material";
import SubNav from "../SubNav.js";
import Chip from '@mui/material/Chip';
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import Header from "userComponents/Header";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useConfirm } from "material-ui-confirm";
import { Search as SearchIcon } from "../../../../icons/search";
import { useTranslation } from 'react-i18next';

const FolderComponent = () => {
	const { t } = useTranslation();
	const { folderId } = useParams();
	const params = useParams();
	const companyId = params.companyId;
	const confirm = useConfirm();

	const [searchQuery, setSearchQuery] = useState("");

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
		// debugger
		if (isLoading) {
			dispatch(getAdminFolders());
			dispatch(getAdminFiles());
		}
		if (!folders && !files) {
			dispatch(getUserFolders(userId, companyId));
			dispatch(getUserFiles(userId, companyId));
		}
	}, [dispatch, folders, isLoading]);

	// Function to fetch user folders and files
	const fetchUserFoldersAndFiles = () => {
		dispatch(getUserFolders(userId, companyId));
		dispatch(getUserFiles(userId, companyId));
	};

	// Refresh the folder when the component is mounted
	useEffect(() => {
		fetchUserFoldersAndFiles();
	}, []);

	const userFolders = folders && folders.filter((file) => file.data.parent === folderId);

	const currentFolder = folders && folders.find((folder) => folder.docId === folderId);

	const createdFiles =
		files && files.filter((file) => file.data.parent === folderId && file.data.url === "");

	const uploadedFiles =
		files && files.filter((file) => file.data.parent === folderId && file.data.url !== "");

	// Filter the uploadedUserFiles based on the search query
	const filteredFiles = uploadedFiles && uploadedFiles.filter((file) => {
		const name = file.data.name.toLowerCase();
		const query = searchQuery.toLowerCase();
		return name.includes(query);
	});


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
				<Header />
				<SubNav currentFolder={currentFolder} />
				<Box>
					<Grid container spacing={2}>
						<Grid item md={12}>
							<Box component={"p"} sx={{ textAlign: "center", py: "10px" }}>
								{t('Empty Folder')}
							</Box>
						</Grid>
					</Grid>
				</Box>
			</>
		);
	}

	const handleDeleteFile = async (documentId) => {
		confirm({
			description: "Are you sure you want to delete this item? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				await dispatch(deleteFile(documentId));
				await dispatch(getUserFiles(userId));
			})
			.catch(() => { });
	};

	const handleDeleteFolder = async (documentId) => {
		confirm({
			description: "Are you sure you want to delete this item? You can not undo this action.",
			confirmationText: "yes",
			cancellationText: "No",
		})
			.then(async () => {
				await dispatch(deleteFolder(documentId));
				await dispatch(getUserFolders(userId));
			})
			.catch(() => { });
	};

	return (
		<>
			<Header />
			<SubNav currentFolder={currentFolder} />
			<Box sx={{ maxWidth: 300, p: "0 10px" }}>
				<TextField
					fullWidth
					InputProps={{
						startAdornment: (
							<InputAdornment position="start">
								<SvgIcon fontSize="small" color="action">
									<SearchIcon />
								</SvgIcon>
							</InputAdornment>
						),
					}}
					placeholder={t('Search files')}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</Box>
			{userFolders && userFolders.length > 0 && (
				<>
					<Box
						component={"p"}
						sx={{ textAlign: "center", borderBottom: "1px solid #DEE2E6", py: "10px" }}
					>
						{t('Sub Folders')}
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
										// onDoubleClick={() =>
										// 	navigate(`/home/archive/folder/${docId}`)
										// }
										onDoubleClick={() => navigate(`/home/archive/${companyId}/folder/${docId}`)}
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
										{!["Ausgang Rechnung", "Eingang Rechnung", "Ausgang Brief", "Eingang Brief", "Ausgang Angebot", "Eingang Angebot",].includes(data.name) && (
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
										)}
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
									<Box sx={{ display: "flex", justifyContent: "space-between", mb: "15px" }} >
										<IconButton
											aria-label="delete"
											onClick={() => handleDeleteFile(docId)}
											sx={{
												color: "error.light",
												position: "absolute",
												top: "5px",
												right: "5px",
												mt: "4px"
											}}
										>
											<DeleteIcon />
										</IconButton>
										{data.data?.isNew === true && (
											<Chip variant="outlined" color="info" label="New" size="small" />
										)}
									</Box>
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
			{filteredFiles && filteredFiles.length > 0 && (
				<>
					<Box
						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
					>
						{t('Uploaded Files')}
					</Box>
					<Grid>
						<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
							{filteredFiles.map(({ data, docId }) => (
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
									<Box sx={{ display: "flex", justifyContent: "space-between", mb: "15px" }} >
										<IconButton
											aria-label="delete"
											onClick={() => handleDeleteFile(docId)}
											sx={{
												color: "error.light",
												position: "absolute",
												top: "5px",
												right: "5px",
												mt: "4px"
											}}
										>
											<DeleteIcon />
										</IconButton>
										{data.data?.isNew === true && (
											<Chip variant="outlined" color="info" label="New" size="small" />
										)}
									</Box>


									{
										data.name.split(".")[data.name.split(".").length - 1].includes("png") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("jpg") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("jpeg") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("svg") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("gif") ? (
											<PhotoSizeSelectActualIcon style={{ fontSize: "48px", color: "#5BA3B2" }} />
										) : data.name.split(".")[data.name.split(".").length - 1].includes("mp4") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("mpeg") ? (
											<VideoLibraryIcon style={{ fontSize: "48px", color: "#F47D02" }} />
										) : data.name.split(".")[data.name.split(".").length - 1].includes("pdf") ? (
											<PictureAsPdfIcon style={{ fontSize: "48px", color: "#F47D02" }} />
										) : data.name.split(".")[data.name.split(".").length - 1].includes("doc") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("docx") ? (
											<img src="/images/word-docs.png" alt="Word Document" style={{ width: "80px", height: "48px" }} />
										) : data.name.split(".")[data.name.split(".").length - 1].includes("xls") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("xlsx") ? (
											<img src="/images/excel-xlxs.png" alt="Excel Spreadsheet" style={{ width: "80px", height: "48px" }} />
										) : data.name.split(".")[data.name.split(".").length - 1].includes("ppt") ||
											data.name.split(".")[data.name.split(".").length - 1].includes("pptx") ? (
											<img src="/images/powerpoint-ppts.png" alt="PowerPoint Presentation" style={{ width: "60px", height: "48px" }} />
										) : null
									}
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
