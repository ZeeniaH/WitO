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
import { Box, Button, Grid } from "../../../../../node_modules/@mui/material/index";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Header from "./Header";

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
	const [prevData, setPrevData] = useState("");
	const [data, setData] = useState("");

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
							background: "rgba(0, 0, 0, 0.98)",
							m: "0",
							width: "100%",
							height: "100%",
						}}
					>
						<Grid container spacing={2}>
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
									<Box
										component={"p"}
										sx={{
											textAlign: "left",
											px: "10px",
											my: "10px",
											color: "#fff",
										}}
									>
										{currentFile.data.name}
									</Box>
									<Box sx={{ display: "flex" }}>
										<Button
											style={{ fontSize: "12px" }}
											variant="outlined"
											onClick={() => navigate(-1)}
											startIcon={<ArrowBackIcon />}
										>
											Go Back
										</Button>
										<Box sx={{ ml: "5px" }}>
											<Button
												target="_blank"
												variant="outlined"
												href={currentFile.data.url}
												download
												startIcon={<DownloadIcon />}
											>
												Download
											</Button>
										</Box>
									</Box>
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
							background: "rgba(0, 0, 0, 0.98)",
							position: "fixed",
							top: "0",
							left: "0",
							m: "0",
							width: "100%",
							height: "100%",
						}}
					>
						<Grid container spacing={2}>
							<Grid item md={12}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										p: "10px",
									}}
								>
									<Box
										component={"p"}
										sx={{
											textAlign: "left",
											px: "10px",
											my: "10px",
											color: "#fff",
										}}
									>
										{currentFile.data.name}
									</Box>
									<Box sx={{ display: "flex" }}>
										<Button
											style={{ fontSize: "12px" }}
											variant="outlined"
											onClick={() => navigate(-1)}
											startIcon={<ArrowBackIcon />}
										>
											Go Back
										</Button>
										<Box sx={{ ml: "5px" }}>
											<Button
												target="_blank"
												variant="outlined"
												href={currentFile.data.url}
												download
												startIcon={<DownloadIcon />}
											>
												Download
											</Button>
										</Box>
									</Box>
								</Box>
								<Grid item md={12} style={{ height: "83%" }}>
									{currentFile.data.name
										.split(".")
										[currentFile.data.name.split(".").length - 1].includes(
											"pdf"
										) ? (
										<Button
											target="_blank"
											variant="outlined"
											href={currentFile.data.url}
											startIcon={<RemoveRedEyeIcon />}
										>
											View{" "}
											{
												currentFile.data.name.split(".")[
													currentFile.data.name.split(".").length - 1
												]
											}{" "}
											File
										</Button>
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
										<Button
											target="_blank"
											variant="outlined"
											href={currentFile.data.url}
											startIcon={<RemoveRedEyeIcon />}
										>
											View
											{
												currentFile.data.name.split(".")[
													currentFile.data.name.split(".").length - 1
												]
											}
											file
										</Button>
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
