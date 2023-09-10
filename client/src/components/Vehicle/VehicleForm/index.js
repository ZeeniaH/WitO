import React, { useEffect, useState } from "react";
import {
	Button,
	Checkbox,
	FormControlLabel,
	Grid,
	TextField,
	FormHelperText,
	Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import styles from "./VehicleForm.module.scss";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import firebase from "API/firebase";
import imageIcon from "./image-icon.png";
import fileIcon from "./file-icon.png";
import pdfIcon from "./pdf-icon.png";
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import useNumberOnly from "hooks/useNumberOnly";

function VehicleForm() {
	const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));
	const { user } = useAuthContext();
	const [toggle, setToggle] = useState(true);

	const [downloadUrls, setDownloadUrls] = useState([]);
	const [downloadDamageUrls, setDownloadDamageUrls] = useState([]);
	const [downloadDocumentUrls, setDownloadDocumentUrls] = useState([]);
	const [downloadRepairUrls, setDownloadRepairUrls] = useState([]);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const params = useParams();

	useEffect(() => {
		console.log(downloadUrls);
	}, [downloadUrls]);

	/** Multiple images upload to firebase firestore */
	const handleMultipleImageUpload = async (event) => {
		event.preventDefault();
		dispatch(setLoading(true));
		const files = event.target.files;
		if (files.length > 10) {
			alert("You can only upload up to 10 files.");
			dispatch(setLoading(false));
			return;
		}
		const storageRef = firebase.storage().ref();
		const folderRef = storageRef.child("images");
		const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
		const blockedExtensions = [".jfif"];
		const maxSize = 2000 * 1024; // 2000KB
		var images = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const extension = file.name.substr(file.name.lastIndexOf("."));
			if (!allowedTypes.includes(file.type) || blockedExtensions.includes(extension)) {
				alert(`File ${file.name} is not a JPG, JPEG, or PNG image`);
				dispatch(setLoading(false));
				return;
			}
			if (file.size > maxSize) {
				alert(`File ${file.name} is larger than 2 MB`);
				dispatch(setLoading(false));
				return;
			}
			const image = new Image();
			const imageUrl = URL.createObjectURL(file);
			await new Promise((resolve, reject) => {
				image.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					const targetWidth = 80;
					const targetHeight = 80;
					canvas.width = targetWidth;
					canvas.height = targetHeight;
					ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
					canvas.toBlob((blob) => {
						const resizedFile = new File([blob], file.name, { type: file.type });
						resolve(resizedFile);
					}, file.type);
				};

				image.onerror = reject;
				image.src = imageUrl;
			});
			const resizedFile = await resizeImage(image, 80, 80); // Function to resize image
			const fileRef = folderRef.child(file.name);
			await fileRef.put(resizedFile);
			const downloadUrl = await fileRef.getDownloadURL();
			images.push(downloadUrl);
		}
		setDownloadUrls(images);
		dispatch(setLoading(false));
	};

	// Function to resize image using HTML canvas
	function resizeImage(image, width, height) {
		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = width;
			canvas.height = height;
			ctx.drawImage(image, 0, 0, width, height);
			canvas.toBlob((blob) => {
				const resizedFile = new File([blob], "resizedImage.png", { type: "image/png" });
				resolve(resizedFile);
			}, "image/png");
		});
	}

	const handleDamageImageUpload = async (event) => {
		event.preventDefault();
		dispatch(setLoading(true));
		const files = event.target.files;
		if (files.length > 10) {
			alert("You can only upload up to 10 files.");
			dispatch(setLoading(false));
			return;
		}
		const storageRef = firebase.storage().ref();
		const folderRef = storageRef.child("images");
		const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
		const blockedExtensions = [".jfif"];
		const maxSize = 2000 * 1024; // 2000KB
		var images = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const extension = file.name.substr(file.name.lastIndexOf("."));
			if (!allowedTypes.includes(file.type) || blockedExtensions.includes(extension)) {
				alert(`File ${file.name} is not a JPG, JPEG, or PNG image`);
				dispatch(setLoading(false));
				return;
			}
			if (file.size > maxSize) {
				alert(`File ${file.name} is larger than 2 MB`);
				dispatch(setLoading(false));
				return;
			}
			const image = new Image();
			const imageUrl = URL.createObjectURL(file);
			await new Promise((resolve, reject) => {
				image.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					const targetWidth = 80;
					const targetHeight = 80;
					canvas.width = targetWidth;
					canvas.height = targetHeight;
					ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
					canvas.toBlob((blob) => {
						const resizedFile = new File([blob], file.name, { type: file.type });
						resolve(resizedFile);
					}, file.type);
				};
				image.onerror = reject;
				image.src = imageUrl;
			});
			const resizedFile = await resizeImage(image, 80, 80); // Function to resize image
			const fileRef = folderRef.child(file.name);
			await fileRef.put(resizedFile);
			const downloadDamageUrls = await fileRef.getDownloadURL();
			images.push(downloadDamageUrls);
		}
		setDownloadDamageUrls(images);
		dispatch(setLoading(false));
	};

	const handleDownloadDocumentUrls = async (event) => {
		event.preventDefault();
		dispatch(setLoading(true));
		const files = event.target.files;
		if (files.length > 10) {
			alert("You can only upload up to 10 files.");
			dispatch(setLoading(false));
			return;
		}
		const storageRef = firebase.storage().ref();
		const folderRef = storageRef.child("documents");
		const maxSize = 2000 * 1024; // 2000KB
		var documents = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			if (file.size > maxSize) {
				alert(`File ${file.name} is larger than 2 MB`);
				dispatch(setLoading(false));
				return;
			}
			const fileRef = folderRef.child(file.name);
			await fileRef.put(file);
			const downloadDocumentUrl = await fileRef.getDownloadURL();
			documents.push(downloadDocumentUrl);
		}
		setDownloadDocumentUrls(documents);
		dispatch(setLoading(false));
	};

	const handleDownloadRepairUrls = async (event) => {
		event.preventDefault();
		dispatch(setLoading(true));
		const files = event.target.files;
		if (files.length > 10) {
			alert("You can only upload up to 10 files.");
			dispatch(setLoading(false));
			return;
		}
		const storageRef = firebase.storage().ref();
		const folderRef = storageRef.child("images");
		const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
		const blockedExtensions = [".jfif"];
		const maxSize = 2000 * 1024; // 2000KB
		var images = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const extension = file.name.substr(file.name.lastIndexOf("."));
			if (!allowedTypes.includes(file.type) || blockedExtensions.includes(extension)) {
				alert(`File ${file.name} is not a JPG, JPEG, or PNG image`);
				dispatch(setLoading(false));
				return;
			}
			if (file.size > maxSize) {
				alert(`File ${file.name} is larger than 2 MB`);
				dispatch(setLoading(false));
				return;
			}
			const image = new Image();
			const imageUrl = URL.createObjectURL(file);
			await new Promise((resolve, reject) => {
				image.onload = () => {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					const targetWidth = 80;
					const targetHeight = 80;
					canvas.width = targetWidth;
					canvas.height = targetHeight;
					ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

					canvas.toBlob((blob) => {
						const resizedFile = new File([blob], file.name, { type: file.type });
						resolve(resizedFile);
					}, file.type);
				};
				image.onerror = reject;
				image.src = imageUrl;
			});
			const resizedFile = await resizeImage(image, 80, 80); // Function to resize image
			const fileRef = folderRef.child(file.name);
			await fileRef.put(resizedFile);
			const downloadRepairUrls = await fileRef.getDownloadURL();
			images.push(downloadRepairUrls);
		}
		setDownloadRepairUrls(images);
		dispatch(setLoading(false));
	};

	const getFileIcon = (downloadDocumentUrl) => {
		const fileExtension = downloadDocumentUrl
			.split(".")
			.pop()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "")
			.split("altmedia")[0]; // Extract only the "pdf" part

		// Add additional file types and corresponding image files as needed
		if (fileExtension === "pdf") {
			return <img src={pdfIcon} alt="PDF" width="80px" height="80px" />;
		} else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
			return <img src={imageIcon} alt="Image" width="80px" height="80px" />;
		} else {
			return <img src={fileIcon} alt="File" width="80px" height="80px" />;
		}
	};

	return (
		<>
			<Box
				sx={{
					width: "100%",
					minHeight: "100vh",
				}}
				className={styles.vehicleFormSection}
			>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box className={styles.rightSideSection}>
							<Box className={styles.vehicleHeading} component={"h1"}>Add New Vehicle</Box>
							<Box className={styles.addVehicleFieldsBody}>
								<Box className={styles.vehicleFields}>
									<Formik
										initialValues={{
											makeName: "",
											model: "",
											licensePlate: "",
											mileage: "",
											registeredCity: "",
											color: "",
											insurance: "",
											lastMaintenanceMileage: "",
											vehicleIdentificationNumber: "",
											datePicker: datePicker,
											policyNumber: "",
											fuel: "",
											damageDocumentation: "",
											repairPictures: "",
											carImage: "",
											carDamageImages: "",
											submit: null,
										}}
										validationSchema={Yup.object().shape({
											makeName: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("Maker is required")),
											model: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("Model required")),
											licensePlate: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("License Plate is required")),
											mileage: Yup.number()
												.required(t("Mileage required")),
											registeredCity: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("Registered City required")),
											color: Yup.string()
												.max(50, t("maximum 50 characters")).optional(),
											insurance: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("Insurance is required")),
											lastMaintenanceMileage: Yup.number().optional(),
											vehicleIdentificationNumber: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("Vehicle Identification Number is required")),
											datePicker: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("First Registration Date is required")),
											policyNumber: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("Policy Number is required")),
											fuel: Yup.string()
												.max(50, t("maximum 50 characters"))
												.required(t("Fuel is required")),
										})}
										onSubmit={async (
											values,
											{ setErrors, setStatus, setSubmitting }
										) => {
											if (downloadUrls.length === 0) {
												setErrors({ carImage: "Vehicle image is required" });
												return;
											}
											dispatch(setLoading(true));
											const company = await fetch(`${BASE_URL}/company/${params.id}`, {
												method: "GET",
												headers: {
													"Content-Type": "application/json",
													Authorization: `Bearer ${user.tokens.access.token}`,
												},
											});
											const companyJson = await company.json();
											const vehicle = {
												selectCompany: companyJson.companyName,
												companyLogo: companyJson.companyLogo,
												makeName: values.makeName,
												model: values.model,
												licensePlate: values.licensePlate,
												mileage: values.mileage,
												registeredCity: values.registeredCity,
												color: values.color,
												insurance: values.insurance,
												lastMaintenanceMileage:
													values.lastMaintenanceMileage,
												vehicleIdentificationNumber:
													values.vehicleIdentificationNumber,
												firstRegistrationDate: datePicker,
												policyNumber:
													values.policyNumber,
												fuel:
													values.fuel,
												carImage: downloadUrls,
												damageDocumentation: downloadDocumentUrls,
												repairPictures: downloadRepairUrls,
												carDamage: toggle,
												carDamageImages: downloadDamageUrls,
											};
											const response = await fetch(
												`${BASE_URL}/vehicle/${params.id}/vehicles`,
												{
													method: "POST",
													headers: {
														"Content-Type": "application/json",
														Authorization: `Bearer ${user.tokens.access.token}`,
													},
													body: JSON.stringify(vehicle),
												}
											);
											const json = await response.json();

											if (!response.ok) {
												setStatus({ success: false });
												setErrors({ submit: json.message });
												setSubmitting(false);
											}
											if (response.ok) {
												setStatus({ success: true });
												setSubmitting(false);
												navigate(`/dashboard/vehicles/${params.id}`);
											}
											dispatch(setLoading(false));
										}}
									>
										{({
											errors,
											handleBlur,
											handleChange,
											setFieldValue,
											handleSubmit,
											isSubmitting,
											touched,
											values,
										}) => (
											<form noValidate onSubmit={handleSubmit}>
												<Grid container spacing={3}>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="makeName"
																label="Marker"
																type="text"
																fullWidth
																value={values.makeName}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.makeName &&
																	errors.makeName
																)}
															/>
															{touched.makeName &&
																errors.makeName && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-makeName"
																	>
																		{errors.makeName}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="model"
																label="Model"
																type="text"
																fullWidth
																value={values.model}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.model && errors.model
																)}
															/>
															{touched.model && errors.model && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-model"
																>
																	{errors.model}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="licensePlate"
																label="License Plate"
																type="text"
																fullWidth
																value={values.licensePlate}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.licensePlate &&
																	errors.licensePlate
																)}
															/>
															{touched.licensePlate &&
																errors.licensePlate && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-licensePlate"
																	>
																		{errors.licensePlate}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="registeredCity"
																label="Registered City"
																type="text"
																fullWidth
																value={values.registeredCity}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.registeredCity &&
																	errors.registeredCity
																)}
															/>
															{touched.registeredCity &&
																errors.registeredCity && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-registeredCity"
																	>
																		{errors.registeredCity}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="color"
																label="Color"
																type="text"
																fullWidth
																value={values.color}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.color && errors.color
																)}
															/>
															{touched.color && errors.color && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-color"
																>
																	{errors.color}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="insurance"
																label="Insurance"
																type="text"
																fullWidth
																value={values.insurance}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.insurance &&
																	errors.insurance
																)}
															/>
															{touched.insurance &&
																errors.insurance && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-insurance"
																	>
																		{errors.insurance}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="mileage"
																label="Mileage"
																type="text"
																fullWidth
																value={values.mileage}
																onBlur={handleBlur}
																onChange={(e) => {
																	useNumberOnly(
																		setFieldValue,
																		"mileage",
																		e
																	);
																}}
																error={Boolean(
																	touched.mileage &&
																	errors.mileage
																)}
															/>
															{touched.mileage && errors.mileage && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-mileage"
																>
																	{errors.mileage}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="lastMaintenanceMileage"
																label="Last Maintenance Mileage"
																type="text"
																fullWidth
																value={
																	values.lastMaintenanceMileage
																}
																onBlur={handleBlur}
																onChange={(e) => {
																	useNumberOnly(
																		setFieldValue,
																		"lastMaintenanceMileage",
																		e
																	);
																}}
																error={Boolean(
																	touched.lastMaintenanceMileage &&
																	errors.lastMaintenanceMileage
																)}
															/>
															{touched.lastMaintenanceMileage &&
																errors.lastMaintenanceMileage && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-lastMaintenanceMileage"
																	>
																		{
																			errors.lastMaintenanceMileage
																		}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="vehicleIdentificationNumber"
																label="Vehicle Identification Number"
																type="text"
																fullWidth
																value={
																	values.vehicleIdentificationNumber
																}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.vehicleIdentificationNumber &&
																	errors.vehicleIdentificationNumber
																)}
															/>
															{touched.vehicleIdentificationNumber &&
																errors.vehicleIdentificationNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-vehicleIdentificationNumber"
																	>
																		{
																			errors.vehicleIdentificationNumber
																		}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<LocalizationProvider
																dateAdapter={AdapterDayjs}
															>
																<DatePicker
																	disableFuture
																	label="First Registration Date"
																	openTo="year"
																	views={["year", "month", "day"]}
																	value={datePicker}
																	onChange={(newValue) => {
																		setDatePicker(newValue);
																		handleChange;
																	}}
																	renderInput={(params) => (
																		<TextField {...params} />
																	)}
																	inputFormat="DD/MM/YYYY"

																/>
																{touched.firstRegistrationDate &&
																	errors.firstRegistrationDate && (
																		<FormHelperText
																			error
																			id="standard-weight-helper-text-firstRegistrationDate"
																		>
																			{errors.firstRegistrationDate}
																		</FormHelperText>
																	)}
															</LocalizationProvider>
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="policyNumber"
																label="Policy Number"
																type="text"
																fullWidth
																value={
																	values.policyNumber
																}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.policyNumber &&
																	errors.policyNumber
																)}
															/>
															{touched.policyNumber &&
																errors.policyNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-policyNumber"
																	>
																		{
																			errors.policyNumber
																		}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="fuel"
																label="Fuel"
																type="text"
																fullWidth
																value={
																	values.fuel
																}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.fuel &&
																	errors.fuel
																)}
															/>
															{touched.fuel &&
																errors.fuel && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-fuel"
																	>
																		{
																			errors.fuel
																		}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<Button
																sx={{
																	width: "100%",
																	p: "0",
																	border: "1px solid #bbb5b5",
																}}
																variant="outlined"
																component="label"
															>
																<Box className={styles.fileSelect}>
																	<Box
																		className={
																			styles.fileSelectButton
																		}
																	>
																		Choose Documents
																	</Box>
																	<Box
																		className={
																			styles.fileSelectName
																		}
																	></Box>
																</Box>
																<input
																	onChange={
																		handleDownloadDocumentUrls
																	}
																	multiple
																	type="file"
																/>
															</Button>
															<Box sx={{ display: "flex", flexWrap: "wrap" }}>
																{downloadDocumentUrls.map((downloadDocumentUrl, index) => (
																	<Box key={index} sx={{ mr: 2, mb: 2 }}>
																		{getFileIcon(downloadDocumentUrl)}
																	</Box>
																))}
															</Box>
															{errors.damageDocumentation && downloadDocumentUrls.length === 0 && (
																<FormHelperText error>{errors.damageDocumentation}</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<Button
																sx={{
																	width: "100%",
																	p: "0",
																	border: "1px solid #bbb5b5",
																}}
																variant="outlined"
																component="label"
															>
																<Box className={styles.fileSelect}>
																	<Box
																		className={
																			styles.fileSelectButton
																		}
																	>
																		Choose Repair Images
																	</Box>
																	<Box
																		className={
																			styles.fileSelectName
																		}
																	></Box>
																</Box>
																<input
																	onChange={
																		handleDownloadRepairUrls
																	}
																	multiple
																	type="file"
																/>
															</Button>
															<Box sx={{ display: "flex", flexWrap: "wrap" }}>
																{downloadRepairUrls.map((downloadRepairUrl, index) => (
																	<Box key={index} sx={{ mr: 2, mb: 2 }}>
																		<img src={downloadRepairUrl} alt="" width="100" />
																	</Box>
																))}
															</Box>
															{errors.repairPictures && downloadRepairUrls.length === 0 && (
																<FormHelperText error>{errors.repairPictures}</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<Button
																sx={{
																	width: "100%",
																	p: "0",
																	border: "1px solid #bbb5b5",
																}}
																variant="outlined"
																component="label"
															>
																<Box className={styles.fileSelect}>
																	<Box
																		className={
																			styles.fileSelectButton
																		}
																	>
																		Choose Car Images
																	</Box>
																	<Box
																		className={
																			styles.fileSelectName
																		}
																	></Box>
																</Box>
																<input
																	onChange={
																		handleMultipleImageUpload
																	}
																	multiple
																	type="file"
																/>
															</Button>
															<Box sx={{ display: "flex", flexWrap: "wrap" }}>
																{downloadUrls.map((downloadUrl, index) => (
																	<Box key={index} sx={{ mr: 2, mb: 2 }}>
																		<img src={downloadUrl} alt="" width="100" />
																	</Box>
																))}
															</Box>
															{errors.carImage && downloadUrls.length === 0 && (
																<FormHelperText error>{errors.carImage}</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<Box>
																<FormControlLabel
																	onClick={() =>
																		setToggle(!toggle)
																	}
																	value="start"
																	control={<Checkbox />}
																	label="Car Damage/s"
																	labelPlacement="start"
																/>
															</Box>
															<Button
																sx={{
																	width: "100%",
																	display: toggle
																		? "none"
																		: "block",
																	p: "0",
																	border: "1px solid #bbb5b5",
																}}
																variant="outlined"
																component="label"
															>
																<Box
																	sx={{
																		display: "flex",
																		alignItems: "center",
																	}}
																>
																	<Box
																		className={
																			styles.fileSelect
																		}
																	>
																		<Box
																			className={
																				styles.fileSelectButton
																			}
																		>
																			Damage Image/Images
																		</Box>
																		<Box
																			className={
																				styles.fileSelectName
																			}
																		></Box>
																	</Box>
																	<input
																		onChange={
																			handleDamageImageUpload
																		}
																		multiple
																		type="file"
																	/>
																</Box>
															</Button>
															<Box
																sx={{
																	flexWrap: "wrap",

																	display: toggle
																		? "flex"
																		: "none",
																}}
															>
																{downloadDamageUrls.map(
																	(downloadDamageUrl, index) => (
																		<Box
																			key={index}
																			sx={{ mr: 2, mb: 2 }}
																		>
																			<img
																				src={
																					downloadDamageUrl
																				}
																				alt=""
																				width="100"
																			/>
																		</Box>
																	)
																)}
															</Box>
														</Stack>
													</Grid>
													<Grid item xs={12}>
														{errors.submit && (
															<Grid item xs={12}>
																<FormHelperText error>
																	{errors.submit}
																</FormHelperText>
															</Grid>
														)}
														<Button
															type="submit"
															disabled={isSubmitting}
															sx={{ mt: "20px" }}
															variant="contained"
														>
															Add New Vehicle
														</Button>
													</Grid>
												</Grid>
											</form>
										)}
									</Formik>
								</Box>
							</Box>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</>
	);
}

export default VehicleForm;
