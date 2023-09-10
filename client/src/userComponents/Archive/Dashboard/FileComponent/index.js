import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
	getAdminFiles,
	getAdminFolders,
	getUserFiles,
	getUserFolders,
} from "redux/actionCreators/filefoldersActionCreators";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/eclipse.css";
import "codemirror/mode/xml/xml";
import "codemirror/mode/php/php";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/textile/textile";
import "codemirror/mode/jsx/jsx";
import "codemirror/mode/css/css";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import { Controlled as CodeMirror } from "react-codemirror2";
import FileViewer from "react-file-viewer";

import "./FileComponent.css";
import { Box, Button, Grid, FormControl, Select, MenuItem } from "@mui/material";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "./Header";
import { Link } from "react-router-dom";
import { database } from "../../../../API/firebase";

const FileComponent = () => {
	const { fileId } = useParams();
	const navigate = useNavigate();

	const { isLoading, userId, currentFile, folders } = useSelector(
		(state) => ({
			userId: state.auth.userId,
			isLoading: state.filefolders.isLoading,
			folders: state.filefolders.UserFolders,
			currentFile: state.filefolders.userFiles?.find((file) => file.docId === fileId),
		}),
		shallowEqual
	);
	const user = JSON.parse(localStorage.getItem("user"));

	const [prevData, setPrevData] = useState("");
	const [data, setData] = useState("");

	const [selectedValue, setSelectedValue] = useState("");
	const [isNew, setNew] = useState(true);

	useEffect(() => {
		const fetchDocument = async () => {
			try {
				const doc = await database.files.doc(fileId).get();
				if (doc.exists) {
					const { status, isNew } = doc.data().data;
					setSelectedValue(status);
					if (isNew) {
						updateIsNew(false);
					}
				}
			} catch (error) {
				console.log("Error fetching document:", error);
			}
		};

		fetchDocument();
	}, [fileId]);

	const updateIsNew = (isNew) => {
		if (user?.user?.role === "BookKeeper") {
			database.files
				.doc(fileId)
				.update({
					"data.isNew": isNew,
				})
				.then(() => {
					console.log("isNew updated successfully.");
					setNew(isNew);
				})
				.catch((error) => {
					console.log("Error updating isNew:", error);
				});
		}
	};

	const handleChange = (event) => {
		if (user?.user?.role === "BookKeeper") {
			setSelectedValue(event.target.value);
			updateStatus(event.target.value);
		}
	};

	const updateStatus = (status) => {
		const updatedStatus = status === "Completed" ? "Completed" : "In Progress";

		database.files
			.doc(fileId)
			.update({
				"data.status": updatedStatus,
			})
			.then(() => {
				console.log("Status updated successfully.");
			})
			.catch((error) => {
				console.log("Error updating status:", error);
			});
	};


	const codes = {
		html: "xml",
		php: "php",
		js: "javascript",
		jsx: "jsx",
		txt: "textile",
		xml: "xml",
		css: "css",
		c: "clike",
		cpp: "clike",
		java: "textile",
		cs: "clike",
		py: "python",
		json: "javascript",
	};

	const dispatch = useDispatch();

	const extension =
		currentFile &&
		currentFile.data.name.split(".")[currentFile.data.name.split(".").length - 1];

	useEffect(() => {
		if (isLoading && !folders && !currentFile) {
			dispatch(getAdminFolders());
			dispatch(getAdminFiles());
			dispatch(getUserFolders(userId));
			dispatch(getUserFiles(userId));
		}

		if (
			currentFile &&
			(currentFile.data.url === "" ||
				!currentFile.data.name.includes(".jpg") ||
				!currentFile.data.name.includes(".png") ||
				!currentFile.data.name.includes(".jpeg") ||
				!currentFile.data.name.includes(".doc") ||
				!currentFile.data.name.includes(".ppt") ||
				!currentFile.data.name.includes(".pptx") ||
				!currentFile.data.name.includes(".xls") ||
				!currentFile.data.name.includes(".rar"))
		) {
			setData(currentFile.data.data);
			setPrevData(currentFile.data.data);
		}
	}, [dispatch, isLoading, currentFile && currentFile.data.data]);

	if (isLoading) {
		return (
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<Box component={"h1"} sx={{ textAlign: "center", my: "10px" }}>
						Fetching file...
					</Box>
				</Grid>
			</Grid>
		);
	}

	console.log("currentFile", currentFile)
	return (
		<>
			{currentFile ? (
				currentFile.data.url === "" &&
					(!currentFile.data.name.includes(".jpg") ||
						!currentFile.data.name.includes(".png") ||
						!currentFile.data.name.includes(".jpeg") ||
						!currentFile.data.name.includes(".doc") ||
						!currentFile.data.name.includes(".ppt") ||
						!currentFile.data.name.includes(".pptx") ||
						!currentFile.data.name.includes(".xls") ||
						!currentFile.data.name.includes(".rar")) ? (
					<>
						<Header
							currentFile={currentFile}
							data={data}
							prevData={prevData}
							userId={userId}
							setPrevData={setPrevData}
							setData={setData}
						/>

						<Box
							sx={{
								overflowX: "hidden",
								overflowY: "auto",
								m: "0",
								width: "100%",
								pt: "10px",
							}}
						>
							<Grid container spacing={2}>
								<Grid item md={12}>
									<CodeMirror
										value={data}
										options={{
											mode: {
												name: codes[extension],
												json: extension === "json",
											},
											theme: "eclipse",
											lineNumbers: true,
											inputStyle: "textarea",
											autofocus: true,
											lineWrapping: true,
										}}
										onBeforeChange={(editor, data, value) => {
											setData(value);
										}}
										style={{ textAlign: "left !important" }}
									/>
								</Grid>
							</Grid>
						</Box>
					</>
				) : currentFile.data.name
					.split(".")
				[currentFile.data.name.split(".").length - 1].includes("png") ||
					currentFile.data.name
						.split(".")
					[currentFile.data.name.split(".").length - 1].includes("jpg") ||
					currentFile.data.name
						.split(".")
					[currentFile.data.name.split(".").length - 1].includes("jpeg") ||
					currentFile.data.name
						.split(".")
					[currentFile.data.name.split(".").length - 1].includes("svg") ||
					currentFile.data.name
						.split(".")
					[currentFile.data.name.split(".").length - 1].includes("gif") ? (
					<Box
						style={{
							background: "rgb(131 131 131 / 98%)",
							m: "0",
							width: "100%",
							height: "100%",
						}}
					>
						<Grid spacing={2}>
							<Grid item md={12}>
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										justifyContent: "space-between",
										alignItems: "center",
										p: "10px",
									}}
								>
									<Grid container spacing={2}>
										<Grid item xs={4} sm={1} md={1}>
											<Box
												sx={{
													background: "#fff",
													width: "50px",
													height: "50px",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													borderRadius: "5px",
													px: "10px",
													my: "10px",
												}}
											>
												<Link to="/home/default">
													<img
														style={{ width: "30px" }}
														src={"/images/ios/60.png"}
														alt="images"
													></img>
												</Link>
											</Box>
										</Grid>
										<Grid item xs={8} sm={5} md={5}>
											<Box sx={{ display: "flex", alignItems: "center", color: "#fff", }}>
												<Box sx={{
													mr: "10px", mb: "0", fontSize: {
														xs: "16px",
														md: "18px"
													}
												}} component={"h5"}>
													Document Name :
												</Box>
												<Box
													component={"p"}
													sx={{
														textAlign: {
															xs: "center",
															sm: "left",
														},
														px: "10px",
														my: "10px",
														border: "1px solid #bfbfbf",
														padding: "10px 15px",
														borderRadius: "4px",
														overflow: "hidden",
														textOverflow: "ellipsis",
														whiteSpace: "nowrap",
														maxWidth: "200px",
													}}
												>
													{currentFile.data.name}
												</Box>

											</Box>

										</Grid>
										<Grid item xs={12} sm={6} md={6}>
											<Box sx={{
												display: {
													xs: "block",
													md: "flex"
												},
												justifyContent: {
													xs: "center",
													md: "end",
												},
												px: "10px",
												my: "10px",

											}}>
												{
													currentFile.data.data.status ?
														<Box sx={{
															display: "flex",
															justifyContent: {
																xs: "center",
																sm: "end",
																md: "unset"
															}, mb: {
																xs: "15px",
																md: "unset"
															}
														}}>
															<Box sx={{ display: "flex", alignItems: "center", color: "#fff", mr: "10px", mb: "0" }} component={"h5"}>
																Status :
															</Box>
															<Box sx={{ mr: "10px" }}>
																<FormControl>
																	<Select
																		style={{ color: "#fff" }}
																		labelId="dropdown-label"
																		id="dropdown"
																		value={selectedValue}
																		onChange={handleChange}
																		disabled={user?.user?.role !== 'BookKeeper'}
																	>
																		<MenuItem value="In Progress">In Progress</MenuItem>
																		<MenuItem value="Completed">Completed</MenuItem>
																	</Select>
																</FormControl>
															</Box>
														</Box> : ""
												}

												<Box sx={{
													display: "flex", justifyContent: {
														xs: "center",
														sm: "end",
														md: "unset"
													}
												}}>
													<Button
														sx={{ fontSize: "12px", p: "10px 15px" }}
														variant="contained"
														onClick={() => navigate(-1)}
														startIcon={<ArrowBackIcon />}
													>
														Go Back
													</Button>
													{/* <a
														href="/home/archive"
														style={{
															fontSize: "12px",
															padding: "9px 15px",
															textDecoration: "none",
															display: "inline-block",
															backgroundColor: "#1890ff",
															color: "#ffffff",
															borderRadius: "6px",
														}}
													>
														<ArrowBackIcon style={{ marginRight: "5px" }} />
														Go Back
													</a> */}

													<Box sx={{ ml: "5px" }}>
														<Button
															sx={{ fontSize: "12px", p: "10px 15px" }}
															target="_blank"
															variant="contained"
															href={currentFile.data.url}
															download
															startIcon={<DownloadIcon />}
														>
															Download
														</Button>
													</Box>
												</Box>
											</Box>
										</Grid>
									</Grid>
								</Box>
								<img
									src={currentFile.data.url}
									alt={currentFile.data.url}
									width="100%"
								/>
							</Grid>
						</Grid>
					</Box>
				) : (
					<Box
						sx={{
							background: "rgb(131 131 131 / 98%)",
							m: "0",
							width: "100%",
							height: "100%",
						}}
					>
						<Grid spacing={2}>
							<Grid item md={12}>
								<Box
									sx={{
										display: "flex",
										flexWrap: "wrap",
										justifyContent: "space-between",
										alignItems: "center",
										p: "10px",
									}}
								>
									<Grid container spacing={2}>
										<Grid item xs={4} sm={1} md={1}>
											<Box
												sx={{
													background: "#fff",
													width: "50px",
													height: "50px",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													borderRadius: "5px",
													px: "10px",
													my: "10px",
												}}
											>
												<Link to="/home/default">
													<img
														style={{ width: "30px" }}
														src={"/images/ios/60.png"}
														alt="images"
													></img>
												</Link>
											</Box>
										</Grid>
										<Grid item xs={8} sm={5} md={5}>
											<Box sx={{ display: "flex", alignItems: "center", color: "#fff", }}>
												<Box sx={{
													mr: "10px", mb: "0", fontSize: {
														xs: "16px",
														md: "18px"
													}
												}} component={"h5"}>
													Document Name :
												</Box>
												<Box
													component={"p"}
													sx={{
														textAlign: {
															xs: "center",
															sm: "left",
														},
														px: "10px",
														my: "10px",
														border: "1px solid #bfbfbf",
														padding: "10px 15px",
														borderRadius: "4px"
													}}
												>
													{currentFile.data.name}
												</Box>
											</Box>

										</Grid>

										<Grid item xs={12} sm={6} md={6}>
											<Box sx={{
												display: {
													xs: "block",
													md: "flex"
												},
												justifyContent: {
													xs: "center",
													md: "end",
												},
												px: "10px",
												my: "10px",


											}}>
												<Box sx={{
													display: "flex",
													justifyContent: {
														xs: "center",
														sm: "end",
														md: "unset"
													}, mb: {
														xs: "15px",
														md: "unset"
													}
												}}>
													{
														currentFile.data.data.status ?
															<Box sx={{
																display: "flex",
																justifyContent: {
																	xs: "center",
																	sm: "end",
																	md: "unset"
																}, mb: {
																	xs: "15px",
																	md: "unset"
																}
															}}>
																<Box sx={{ display: "flex", alignItems: "center", color: "#fff", mr: "10px", mb: "0" }} component={"h5"}>
																	Status :
																</Box>
																<Box sx={{ mr: "10px" }}>
																	<FormControl>
																		<Select
																			style={{ color: "#fff" }}
																			labelId="dropdown-label"
																			id="dropdown"
																			value={selectedValue}
																			onChange={handleChange}
																			disabled={user?.user?.role !== 'BookKeeper'}
																		>
																			<MenuItem value="In Progress">In Progress</MenuItem>
																			<MenuItem value="Completed">Completed</MenuItem>
																		</Select>
																	</FormControl>
																</Box>
															</Box> : ""
													}
												</Box>

												<Box sx={{
													display: "flex", justifyContent: {
														xs: "center",
														sm: "end",
														md: "unset"
													}
												}}>
													<Button
														sx={{ fontSize: "12px", p: "10px 15px" }}
														variant="contained"
														onClick={() => navigate(-1)}
														startIcon={<ArrowBackIcon />}
													>
														Go Back
													</Button>
													{/* <a
														href="/home/archive"
														style={{
															fontSize: "12px",
															padding: "9px 15px",
															textDecoration: "none",
															display: "inline-block",
															backgroundColor: "#1890ff",
															color: "#ffffff",
															borderRadius: "6px",
														}}
													>
														<ArrowBackIcon style={{ marginRight: "5px" }} />
														Go Back
													</a> */}
													<Box sx={{ ml: "5px" }}>
														<Button
															sx={{ fontSize: "12px", p: "10px 15px" }}
															target="_blank"
															variant="contained"
															href={currentFile.data.url}
															download
															startIcon={<DownloadIcon />}
														>
															Download
														</Button>
													</Box>
												</Box>
											</Box>
										</Grid>
									</Grid>
								</Box>
								<Grid item md={12} style={{ height: "83%" }}>
									{currentFile.data.name
										.split(".")
									[currentFile.data.name.split(".").length - 1].includes(
										"pdf"
									) ? (
										<Box sx={{ p: "18px" }}>
											<Button
												target="_blank"
												variant="outlined"
												href={currentFile.data.url}
												startIcon={<RemoveRedEyeIcon />}
											>
												View {" "}
												{
													currentFile.data.name.split(".")[
													currentFile.data.name.split(".").length - 1
													]
												} {" "}
												file
											</Button>
										</Box>
									) : currentFile.data.name
										.split(".")
									[currentFile.data.name.split(".").length - 1].includes(
										"csv"
									) ||
										currentFile.data.name
											.split(".")
										[currentFile.data.name.split(".").length - 1].includes(
											"xslx"
										) ||
										currentFile.data.name
											.split(".")
										[currentFile.data.name.split(".").length - 1].includes(
											"docx"
										) ||
										currentFile.data.name
											.split(".")
										[currentFile.data.name.split(".").length - 1].includes(
											"mp4"
										) ||
										currentFile.data.name
											.split(".")
										[currentFile.data.name.split(".").length - 1].includes(
											"webm"
										) ||
										currentFile.data.name
											.split(".")
										[currentFile.data.name.split(".").length - 1].includes(
											"mp3"
										) ? (
										<FileViewer
											fileType={
												currentFile.data.name.split(".")[
												currentFile.data.name.split(".").length - 1
												]
											}
											filePath={currentFile.data.url}
											errorComponent={
												<>
													<Box component={"h1"}>
														This file is not viewable
													</Box>
													<Button
														target="_blank"
														variant="outlined"
														href={currentFile.data.url}
														download
														startIcon={<DownloadIcon />}
													>
														Download
													</Button>
												</>
											}
											style={{ height: "100%", width: "100%" }}
										/>
									) : (
										<Box sx={{ p: "18px" }}>
											<Button
												target="_blank"
												variant="outlined"
												href={currentFile.data.url}
												startIcon={<RemoveRedEyeIcon />}
											>
												View {" "}
												{
													currentFile.data.name.split(".")[
													currentFile.data.name.split(".").length - 1
													]
												}
												{" "}file
											</Button>
										</Box>
									)}
								</Grid>
							</Grid>
						</Grid>
					</Box>
				)
			) : (
				<Box sx={{ m: "0", width: "100%", height: "100%" }}>
					<Grid container spacing={2}>
						<Grid item md={12}>
							File Not Present
						</Grid>
					</Grid>
				</Box>
			)}
		</>
	);
};

export default FileComponent;
