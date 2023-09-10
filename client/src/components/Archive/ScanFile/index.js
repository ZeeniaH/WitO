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
import DocumentScannerIcon from "@mui/icons-material/DocumentScanner";
import LinearProgress from "@mui/material/LinearProgress";
import Tesseract from "tesseract.js";
import { Document, Page, pdfjs } from "react-pdf";
import { toLowercaseExtension } from "../../../utils/toLowercaseExtention";
import { useParams } from "react-router-dom";

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

const ScanFile = ({ currentFolder }) => {
	const params = useParams();
	const companyId = params.id;
	const [file, setFile] = useState(null);
	const [convertedFile, setConvertedFile] = useState(null);
	const [fileName, setFileName] = useState("");
	const [progress, setProgress] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [numPages, setNumPages] = useState(null);
	const [imageUrlArray, setImageUrlArray] = useState([]);
	const [fileType, setFileType] = useState(null);
	const [selectedPDFFile, setSelectedPDFFile] = useState();
	const [extractedInvoiceNumbers, setExtractedInvoiceNumbers] = useState([]);
	const [selectedWord, setSelectedWord] = useState("");

	const dispatch = useDispatch();
	const { userId, userFiles } = useSelector(
		(state) => ({
			userId: state.auth.userId,
			userFiles: state.filefolders.userFiles,
		}),
		shallowEqual
	);

	pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
	const handlePdf = useCallback(() => {
		setImageUrlArray([]);
		// if (!!file?.type?.length && file.type === "application/pdf") {
		// 	setIsLoading(true);
		setSelectedPDFFile(file);
		// } else if (!!file?.type?.length) {
		// 	setFileType("image");
		// 	setImageUrlArray([URL.createObjectURL(file).toString()]);
		// }
		// setFileType("image");
		// setImageUrlArray([URL.createObjectURL(file).toString()]);
		// await handleConvertedFile();
	}, [setSelectedPDFFile, setImageUrlArray, imageUrlArray, setIsLoading, isLoading, file]);
	const handleConvertedFile = async () => {
		await Tesseract.recognize(convertedFile, "eng", {
			// logger: (m) => console.log(m),
		}).then(async ({ data: { text } }) => {
			const words = text.split(/[\s\n]+/);
			// const wordsStartingWithRe = await words.filter((word) => word.startsWith("INV"));
			const regex = /^(INV|RE|R|LC)/;
			const extractedWords = words.filter((word) => regex.test(word));
			console.log("Invoice#: " + extractedWords);
			if (extractedWords && extractedWords.length > 0) {
				setExtractedInvoiceNumbers(extractedWords);
			}
			setSelectedWord(extractedWords[0]);
		});
	};
	const handleImage = async () => {
		await Tesseract.recognize(file, "eng", {
			// logger: (m) => console.log(m),
		}).then(async ({ data: { text } }) => {
			const words = text.split(/[\s\n]+/);
			// const wordsStartingWithRe = await words.filter((word) => word.startsWith("INV"));
			const regex = /^(INV|RE|R|LC)/;
			const extractedWords = words.filter((word) => regex.test(word));
			if (extractedWords && extractedWords.length > 0) {
				console.log("Invoice#: " + extractedWords);
				setExtractedInvoiceNumbers(extractedWords);
				setSelectedWord(extractedWords[0]);
			} else {
				// setExtractedInvoiceNumbers([]);
				console.log(file.name.split(".")[0]);
				setSelectedWord(file.name.split(".")[0]);
			}
		});
	};
	const handleFileChange = async (e) => {
		setFileName(e.target.value);
		setFile(e.target.files[0]);
		if (file.type) {
			var extension = file.type;
			if (
				extension == "image/jpeg" ||
				extension == "image/jpg" ||
				extension == "image/png" ||
				extension == "image/webp"
			) {
				await handleImage();
			} else if ((extension = "application/pdf")) {
				await handlePdf();
			}
		} else {
			await handleImage();
		}
	};

	const onLoadSuccess = useCallback(
		({ numPages }) => {
			setNumPages(numPages);
			setIsLoading(false);
		},
		[setNumPages, numPages, setIsLoading]
	);
	const onRenderSuccess = useCallback(
		(pageIndex) => {
			Array.from(new Array(numPages), (el, index) => {
				const importPDFCanvas = document.querySelector(
					`.import-pdf-page-${index + 1} canvas`
				);
				pageIndex === index &&
					importPDFCanvas.toBlob((blob) => {
						// setImageUrlArray((prev) => [...prev, URL.createObjectURL(blob)]);
						setImageUrlArray([URL.createObjectURL(blob)]);
					});
			});
		},
		[numPages, setImageUrlArray, imageUrlArray]
	);

	const handleFileSubmit = (e) => {
		e.preventDefault();
		if (!file) return toast.dark("Please add file!");
		const allowedExtensions = ["png", "jpg", "jpeg", "pdf"];
		if (allowedExtensions.indexOf(fileType) === -1) {
			return toast.dark(`File with extension ${fileType} not allowed!`);
		}
		if (!selectedWord) {
			return toast.dark(`Please enter invoice number.`);
		}
		const filteredFiles =
			currentFolder === "root folder"
				? userFiles.filter(
					(file) =>
						file.data.parent === "" &&
						file.data.name ===
						selectedWord + "." + fileType.split("\\").reverse()[0]
				)
				: userFiles.filter(
					(file) =>
						file.data.parent === currentFolder.docId &&
						file.data.name ===
						selectedWord + "." + fileType.split("\\").reverse()[0]
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
				console.log(fileType);
				console.log(selectedWord);
				if (currentFolder === "root folder") {
					dispatch(
						addFileUser({
							uid: userId,
							parent: "",
							companyId: companyId,
							data: "",
							name: selectedWord + "." + fileType,
							url: url,
							path: [],
						})
					);
					setFile("");
					setConvertedFile("");
					setFileName("");
					setProgress(0);
					setOpen(false);
					setExtractedInvoiceNumbers([]);
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
						companyId: companyId,
						data: { isNew: true, status: "In Progress" },
						name: selectedWord + "." + fileType,
						url: url,
						path: path,
					})
				);
				setFile("");
				setConvertedFile("");
				setFileName("");
				setProgress(0);
				setOpen(false);
				setExtractedInvoiceNumbers([]);
				return;
			}
		);
	};
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = (event, reason) => {
		if (reason && reason == "backdropClick") return;
		setFile(null);
		setSelectedPDFFile(null);
		setConvertedFile("");
		setFileName("");
		setOpen(false);
		setExtractedInvoiceNumbers([]);
		setSelectedWord(null);
	};

	useEffect(() => {
		if (file) {
			const handleFileChange = async () => {
				setIsLoading(true);
				const fileExtension = file.name.split(".").reverse()[0].toLowerCase();
				setFileType(fileExtension);
				console.log(fileType);
				const allowedExtensions = ["png", "jpg", "jpeg", "pdf"];
				if (allowedExtensions.indexOf(fileExtension) === -1) {
					toast.dark(`File with extension ${fileExtension} not allowed!`);
					setIsLoading(false);
					return;
				}
				if (
					fileExtension == "jpeg" ||
					fileExtension == "jpg" ||
					fileExtension == "png" ||
					fileExtension == "webp"
				) {
					await handleImage();
				} else if (fileExtension == "pdf") {
					handlePdf();
				}
				setIsLoading(false);
			};
			handleFileChange();
		}
	}, [file]);

	useEffect(() => {
		setSelectedWord(extractedInvoiceNumbers[0]);
	}, [extractedInvoiceNumbers]);

	useEffect(() => {
		console.log(selectedWord);
	}, [selectedWord]);

	useEffect(() => {
		const convertedFileFunction = async () => {
			if (imageUrlArray && imageUrlArray.length > 0) {
				setConvertedFile(imageUrlArray[0]);
			}
		};
		convertedFileFunction();
	}, [imageUrlArray]);

	useEffect(() => {
		const readConvertedFile = async () => {
			setIsLoading(true);
			if (convertedFile) {
				console.log(convertedFile);
				await Tesseract.recognize(convertedFile, "eng", {
					// logger: (m) => console.log(m),
				}).then(async ({ data: { text } }) => {
					const words = text.split(/[\s\n]+/);
					// const wordsStartingWithRe = await words.filter((word) => word.startsWith("INV"));
					const regex = /^(INV|RE|R|LC)/;
					const extractedWords = words.filter((word) => regex.test(word));
					console.log("Invoice#: " + extractedWords);
					if (extractedWords && extractedWords.length > 0) {
						setExtractedInvoiceNumbers(extractedWords);
					}
					setSelectedWord(extractedInvoiceNumbers[0]);
				});
			}
			setIsLoading(false);
		};
		readConvertedFile();
	}, [convertedFile]);

	return (
		<>
			<ToastContainer autoClose={8000} />
			<Box>
				<Button
					sx={{ color: "#7206ef", border: "1px solid", fontSize: "12px" }}
					onClick={handleOpen}
					variant="outlined"
					startIcon={<DocumentScannerIcon />}
				>
					Scan Invoice
				</Button>
				<Modal
					open={open}
					onClose={handleClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					disableEscapeKeyDown={true}
					BackdropProps={{
						timeout: 500,
					}}
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
										Scan Invoice
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
											<Box sx={{ color: "#000" }}>Choose File &nbsp;</Box>

											<Box>{fileName}</Box>
											<input
												type="file"
												custom="true"
												hidden
												onChange={(e) => {
													setFile(e.target.files[0]);
													setFileName(
														toLowercaseExtension(
															e.target.value.split("\\").reverse()[0]
														)
													);
												}}
											/>
										</Button>

										{selectedPDFFile && (
											<Box style={{ display: "none" }}>
												<Document
													file={selectedPDFFile}
													onLoadSuccess={onLoadSuccess}
													error={<div>An error occurred!</div>}
												>
													{Array.from(
														new Array(numPages),
														(el, index) => (
															<Box key={`page_${index + 1}`}>
																<Page
																	key={`page_${index + 1}`}
																	pageNumber={index + 1}
																	className={`import-pdf-page-${index + 1
																		}`}
																	onRenderSuccess={() =>
																		onRenderSuccess(index)
																	}
																	width={1024}
																	renderTextLayer={false}
																	renderAnnotationLayer={false}
																	error={
																		<div>
																			An error occurred!
																		</div>
																	}
																/>
																{imageUrlArray[index] && (
																	<a
																		href={imageUrlArray[index]}
																		download
																	>
																		download file
																	</a>
																)}
															</Box>
														)
													)}
												</Document>
											</Box>
										)}
										{/* {!!imageUrlArray?.length &&
								// fileType === "image" &&
								imageUrlArray.map((image, index) => (
									<div key={`page_${index + 1}`}>
										<img src={image} width="100" />
										<a href={image} download>
											download file
										</a>
									</div>
								))} */}
										{extractedInvoiceNumbers &&
											extractedInvoiceNumbers.length > 0 && (
												<>
													<FormControl fullWidth>
														<InputLabel id="extracted-words-label">
															Extracted Words
														</InputLabel>
														<Select
															labelId="extracted-words-label"
															label="Extracted Words"
															defaultValue={
																extractedInvoiceNumbers[0]
															}
															value={selectedWord}
															onChange={(e) =>
																setSelectedWord(e.target.value)
															}
														>
															{extractedInvoiceNumbers.map(
																(extractedInvoiceNumber, index) => (
																	<MenuItem
																		value={
																			extractedInvoiceNumber
																		}
																		key={index}
																	>
																		{extractedInvoiceNumber}
																	</MenuItem>
																)
															)}
														</Select>
													</FormControl>
												</>
											)}

										<FormControl fullWidth>
											<TextField
												id="invoice-number-label"
												label="Invoice Number"
												variant="outlined"
												InputLabelProps={{
													shrink: true,
												}}
												defaultValue={selectedWord}
												value={selectedWord}
												onChange={(e) => setSelectedWord(e.target.value)}
											/>
										</FormControl>
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

export default ScanFile;
