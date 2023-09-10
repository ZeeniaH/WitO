import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
	deleteFile,
	deleteFolder,
	getAdminFiles,
	getAdminFolders,
	getUserFiles,
	getUserFolders,
} from "redux/actionCreators/filefoldersActionCreators";
import SubNav from "../SubNav.js";
import Chip from '@mui/material/Chip';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../../../Header";
import PhotoSizeSelectActualIcon from "@mui/icons-material/PhotoSizeSelectActual";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import DescriptionIcon from "@mui/icons-material/Description";
import FolderIcon from "@mui/icons-material/Folder";
import { Box, Grid, InputAdornment, TextField, SvgIcon } from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { Search as SearchIcon } from "../../../../icons/search";
import { useTranslation } from 'react-i18next';

const Home = () => {
	const { t } = useTranslation();
	const user = JSON.parse(localStorage.getItem('user'))
	const params = useParams();
	const companyId = params.id;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const confirm = useConfirm();

	const [searchQuery, setSearchQuery] = useState("");

	const { isLoading, adminFolders, allUserFolders, userId, allUserFiles } = useSelector(
		(state) => ({
			isLoading: state.filefolders.isLoading,
			adminFolders: state.filefolders.adminFolders,
			allUserFolders: state.filefolders.userFolders,
			allUserFiles: state.filefolders.userFiles,
			userId: state.auth.userId,
		}),
		shallowEqual
	);
	const userFolders =
		allUserFolders && allUserFolders.filter((folder) => folder.data.parent === "");

	const uploadedUserFiles =
		allUserFiles &&
		allUserFiles.filter(
			(file) =>
				file.data.parent === "" &&
				file.data.url !== "" &&
				file.data.companyId === companyId
		);

	useEffect(() => {
		if (isLoading && !adminFolders) {
			dispatch(getAdminFolders());
			dispatch(getAdminFiles());
		}
		if (!userFolders) {
			dispatch(getUserFiles(userId, companyId));
			dispatch(getUserFolders(userId, companyId));
		}
	}, [dispatch, isLoading]);

	if (isLoading) {
		return (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Box component={"h1"} sx={{ textAlign: "center", my: "10px" }}>
						{t('Fetching folders')}...
					</Box>
				</Grid>
			</Grid>
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
				await dispatch(getUserFolders(userId, companyId));
			})
			.catch(() => { });
	};

	// Filter the uploadedUserFiles based on the search query
	const filteredFiles = uploadedUserFiles && uploadedUserFiles.filter((file) => {
		const name = file.data.name.toLowerCase();
		const query = searchQuery.toLowerCase();
		return name.includes(query);
	});

	return (
		<>
			<Header />
			<SubNav currentFolder="root folder" companyId={companyId} />
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
						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
					>
						{t('Root Folders')}
					</Box>

					<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
						{userFolders.map(({ data, docId }) => (
							<Grid
								item
								xs={6}
								md={2}
								onDoubleClick={() => navigate(`/home/archive/${companyId}/folder/${docId}`)}
								// onDoubleClick={() => navigate(`/home/archive/folder/${docId}`)}
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
								{!["Rechnung", "Brief", "Angebot"].includes(data.name) && (
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
									style={{ fontSize: "3rem", mt: "10px", color: "#D7C47A" }}
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
				</>
			)}
			{filteredFiles && filteredFiles.length > 0 && user?.user?.role === "CompanyOwner" && (
				<>
					<Box
						sx={{ textAlign: "center", borderBottom: "1px solid #dee2e6", py: "20px" }}
					>
						{t('Uploaded Files')}
					</Box>

					<Grid container spacing={2} sx={{ p: "25px", justifyContent: "center" }}>
						{filteredFiles.map(({ data, docId }) => (
							<Grid
								item
								xs={6}
								md={2}
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

								< Box
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
				</>
			)}
		</>
	);
};

export default Home;
