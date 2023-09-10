import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, FormHelperText, Stack, InputLabel, OutlinedInput, FormControl, Select, MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import styles from "./workerList.module.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate, useParams } from "react-router-dom";
import firebase from "API/firebase";
import { setLoading } from "redux/actionCreators/loadingActionCreators";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import { useDispatch } from "react-redux";

import useNumberOnly from "hooks/useNumberOnly";
import { strengthColor, strengthIndicator } from "utils/password-strength";

import pdfIcon from "../../Vehicle/VehicleForm/pdf-icon.png";
import imageIcon from "../../Vehicle/VehicleForm/image-icon.png";
import fileIcon from "../../Vehicle/VehicleForm/file-icon.png";

const index = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const params = useParams();

	const [level, setLevel] = useState();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));
	const user = JSON.parse(localStorage.getItem("user"));
	const [downloadURL, setDownloadURL] = useState("");
	const [downloadPersonalDataUploadURL, setDownloadPersonalDataUploadURL] = useState("");
	const [downloadStaffPictureURL, setDownloadStaffPictureURL] = useState("");

	const [accountCurrentStatus, setAccountCurrentStatus] = useState("denied");

	const [downloadDocumentUrls, setDownloadDocumentUrls] = useState([]);

	const handleAccountStatusChange = (event) => {
		setAccountCurrentStatus(event.target.value);
	};

	const changePassword = (value) => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	useEffect(() => {
		changePassword("");
	}, []);

	const handleStaffPictureUpload = async (event) => {
		dispatch(setLoading(true));
		const file = event.target.files[0];
		const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
		const blockedExtensions = [".jfif"];
		const maxSize = 2000 * 1024; // 2000KB
		const extension = file.name.substr(file.name.lastIndexOf("."));

		if (!allowedTypes.includes(file.type) || blockedExtensions.includes(extension)) {
			alert(`File ${file.name} is not a JPG, JPEG, or PNG image`);
			dispatch(setLoading(false));
			return;
		}
		if (file.size > maxSize) {
			alert("File size must not exceed 2MB");
			dispatch(setLoading(false));
			return;
		}
		const storageRef = firebase.storage().ref();
		const imagesRef = storageRef.child("images");
		const fileRef = imagesRef.child(file.name);
		const snapshot = await fileRef.put(file);
		await snapshot.ref.getDownloadURL().then(function (url) {
			console.log("File available at", url);
			setDownloadStaffPictureURL(url);
		});
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

	const getFileIcon = (downloadDocumentUrl) => {
		const fileExtension = downloadDocumentUrl
			.split(".")
			.pop()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "")
			.split("altmedia")[0]; // Extract only the "pdf" part
		if (fileExtension === "pdf") {
			return <img src={pdfIcon} alt="PDF" width="100" />;
		} else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
			return <img src={imageIcon} alt="Image" width="100" />;
		} else {
			return <img src={fileIcon} alt="File" width="100" />;
		}
	};

	return (
		<>
			<Box
				sx={{
					width: "100%",
					minHeight: "100vh",
				}}
				className={styles.workerFormSection}
			>
				<Grid container spacing={2}>
					<Grid item xs={12}>
						<Box className={styles.rightSideSection}>
							<Box className={styles.workerHeading} component={"h1"}>Add New Worker</Box>
							<Box className={styles.addWorkerFieldsBody}>
								<Box className={styles.workerFields}>
									<Formik
										initialValues={{
											email: "",
											phoneNumber: "",
											firstName: "",
											lastName: "",
											birthName: "",
											password: "",
											confirmPassword: "",
											datePicker: datePicker,
											placeOfBirth: "",
											nationalities: "",
											street: "",
											zip: "",
											city: "",
											taxId: "",
											taxClass: "",
											socialSecurityNumber: "",
											healthInsurance: "",
											children: "",
											iban: "",
											bic: "",
											nameOfBank: "",
											personalDataUpload: "",
											staffPicture: "",
											accountStatus: "",
											submit: null,
										}}
										validationSchema={Yup.object().shape({
											email: Yup.string()
												.email("Must be a valid email")
												.max(50, "maximum 50 characters")
												.required("Email is required"),
											firstName: Yup.string()
												.max(50, "maximum 50 characters")
												.required("First Name required"),
											lastName: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Last Name required"),
											birthName: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Birth Name required"),
											phoneNumber: Yup.string().required(
												"Phone Number is required"
											),
											datePicker: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Date of Birth is required"),
											placeOfBirth: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Place of birth is required"),
											street: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Street is required"),
											zip: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Zip Code is required"),
											city: Yup.string()
												.max(50, "maximum 50 characters")
												.required("City is required"),
											taxId: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Tax Id is required"),
											taxClass: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Tax Class is required"),
											socialSecurityNumber: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Social Security Number is required"),
											healthInsurance: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Health Insurance is required"),
											children: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Number of children is required"),
											iban: Yup.string()
												.max(50, "maximum 50 characters")
												.required("IBAN is required"),
											bic: Yup.string()
												.max(50, "maximum 50 characters")
												.required("BIC is required"),
											nameOfBank: Yup.string()
												.max(50, "maximum 50 characters")
												.required("Name of Bank is required"),
											password: Yup.string().max(50, "maximum 50 characters").required("Password is required"),
											confirmPassword: Yup.string().oneOf(
												[Yup.ref("password"), null],
												"Passwords must match"
											),
										})}
										onSubmit={async (
											values,
											{ setErrors, setStatus, setSubmitting }
										) => {
											if (!downloadURL) {
												setErrors({ staffPicture: "Worker image is required" });
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
											const nationalities = values.nationalities
												.split(",")
												.map((item) => item.trim());
											const worker = {
												selectCompany: companyJson.companyName,
												companyLogo: companyJson.companyLogo,
												email: values.email,
												phoneNumber: values.phoneNumber,
												firstName: values.firstName,
												lastName: values.lastName,
												birthName: values.birthName,
												password: values.password,
												dob: datePicker,
												placeOfBirth: values.placeOfBirth,
												nationalities: nationalities,
												street: values.street,
												zip: values.zip,
												city: values.city,
												taxId: values.taxId,
												taxClass: values.taxClass,
												socialSecurityNumber:
													values.socialSecurityNumber,
												healthInsurance: values.healthInsurance,
												children: values.children,
												iban: values.iban,
												bic: values.bic,
												nameOfBank: values.nameOfBank,
												personalDataUpload: downloadDocumentUrls,
												staffPicture: downloadStaffPictureURL,
												accountStatus: accountCurrentStatus,
												role: "Worker"
											};
											const response = await fetch(
												`${BASE_URL}/worker/${params.id}/workers`,
												{
													method: "POST",
													headers: {
														"Content-Type": "application/json",
														Authorization: `Bearer ${user.tokens.access.token}`,
													},
													body: JSON.stringify(worker),
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
												navigate(`/home/worker-list/${params.id}`);
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
																id="firstName"
																label="First Name"
																type="text"
																value={values.firstName}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.firstName &&
																	errors.firstName
																)}
															/>
															{touched.firstName &&
																errors.firstName && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-firstName"
																	>
																		{errors.firstName}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="lastName"
																label="Last Name"
																type="text"
																value={values.lastName}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.lastName &&
																	errors.lastName
																)}
															/>
															{touched.lastName &&
																errors.lastName && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-lastName"
																	>
																		{errors.lastName}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="birthName"
																label="Birth Name"
																type="text"
																value={values.birthName}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.birthName &&
																	errors.birthName
																)}
															/>
															{touched.birthName &&
																errors.birthName && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-birthName"
																	>
																		{errors.birthName}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="phoneNumber"
																label="Phone Number"
																type="text"
																value={values.phoneNumber}
																onBlur={handleBlur}
																onChange={(e) => {
																	useNumberOnly(
																		setFieldValue,
																		"phoneNumber",
																		e
																	);
																}}
																error={Boolean(
																	touched.phoneNumber &&
																	errors.phoneNumber
																)}
															/>
															{touched.phoneNumber &&
																errors.phoneNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-phoneNumber"
																	>
																		{errors.phoneNumber}
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
																	label="Date Of Birth"
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
																{touched.datePicker &&
																	errors.datePicker && (
																		<FormHelperText
																			error
																			id="standard-weight-helper-text-datePicker"
																		>
																			{errors.datePicker}
																		</FormHelperText>
																	)}
															</LocalizationProvider>
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="placeOfBirth"
																label="Place of Birth"
																type="text"
																value={values.placeOfBirth}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.placeOfBirth &&
																	errors.placeOfBirth
																)}
															/>
															{touched.placeOfBirth &&
																errors.placeOfBirth && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-placeOfBirth"
																	>
																		{errors.placeOfBirth}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="nationalities"
																label="Nationalities"
																type="text"
																value={values.nationalities}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.nationalities &&
																	errors.nationalities
																)}
															/>
															{touched.nationalities &&
																errors.nationalities && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-nationalities"
																	>
																		{errors.nationalities}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="street"
																label="Street / Street No"
																type="text"
																value={values.street}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.street &&
																	errors.street
																)}
															/>
															{touched.street &&
																errors.street && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-street"
																	>
																		{errors.street}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="zip"
																label="ZIP Code"
																type="text"
																value={values.zip}
																onBlur={handleBlur}
																onChange={(e) => {
																	useNumberOnly(
																		setFieldValue,
																		"zip",
																		e
																	);
																}}
																error={Boolean(
																	touched.zip &&
																	errors.zip
																)}
															/>
															{touched.zip &&
																errors.zip && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-zip"
																	>
																		{errors.zip}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="city"
																label="City"
																type="text"
																value={values.city}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.city &&
																	errors.city
																)}
															/>
															{touched.city &&
																errors.city && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-city"
																	>
																		{errors.city}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="taxId"
																label="Tax ID"
																type="text"
																value={values.taxId}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.taxId && errors.taxId
																)}
															/>
															{touched.taxId && errors.taxId && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-taxId"
																>
																	{errors.taxId}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="taxClass"
																label="Tax Class"
																type="text"
																value={values.taxClass}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.taxClass &&
																	errors.taxClass
																)}
															/>
															{touched.taxClass &&
																errors.taxClass && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-taxClass"
																	>
																		{errors.taxClass}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="socialSecurityNumber"
																label="Social Security Number"
																type="text"
																value={values.socialSecurityNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.socialSecurityNumber &&
																	errors.socialSecurityNumber
																)}
															/>
															{touched.socialSecurityNumber &&
																errors.socialSecurityNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-socialSecurityNumber"
																	>
																		{
																			errors.socialSecurityNumber
																		}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="healthInsurance"
																label="Health Insurance"
																type="text"
																value={values.healthInsurance}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.healthInsurance &&
																	errors.healthInsurance
																)}
															/>
															{touched.healthInsurance &&
																errors.healthInsurance && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-healthInsurance"
																	>
																		{errors.healthInsurance}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="children"
																label="Children, if so, how much"
																type="text"
																value={values.children}
																onBlur={handleBlur}
																onChange={(e) => {
																	useNumberOnly(
																		setFieldValue,
																		"children",
																		e
																	);
																}}
																error={Boolean(
																	touched.children &&
																	errors.children
																)}
															/>
															{touched.children &&
																errors.children && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-children"
																	>
																		{errors.children}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="nameOfBank"
																label="Name of Bank"
																type="text"
																value={values.nameOfBank}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.nameOfBank &&
																	errors.nameOfBank
																)}
															/>
															{touched.nameOfBank &&
																errors.nameOfBank && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-nameOfBank"
																	>
																		{errors.nameOfBank}
																	</FormHelperText>
																)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<TextField
															id="iban"
															label="IBAN"
															type="text"
															fullWidth
															value={values.iban}
															onBlur={handleBlur}
															onChange={handleChange}
															error={Boolean(
																touched.iban &&
																errors.iban
															)}
														/>
														{touched.iban &&
															errors.iban && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-iban"
																>
																	{errors.iban}
																</FormHelperText>
															)}
													</Grid>
													<Grid item xs={12}>
														<TextField
															id="bic"
															label="BIC"
															type="text"
															fullWidth
															value={values.bic}
															onBlur={handleBlur}
															onChange={handleChange}
															error={Boolean(
																touched.bic &&
																errors.bic
															)}
														/>
														{touched.bic &&
															errors.bic && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-bic"
																>
																	{errors.bic}
																</FormHelperText>
															)}
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
															{errors.personalDataUpload && downloadDocumentUrls.length === 0 && (
																<FormHelperText error>{errors.personalDataUpload}</FormHelperText>
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
																	<Box className={styles.fileSelectButton}>
																		Staff Picture
																	</Box>
																	<Box className={styles.fileSelectName}></Box>
																</Box>
																<input
																	type="file"
																	onChange={handleStaffPictureUpload}
																/>
															</Button>
															{downloadStaffPictureURL ? (
																<img src={downloadStaffPictureURL} alt="" width="100" />
															) : (
																<p style={{ color: "red" }}>{errors.staffPicture}</p>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<TextField
																id="email"
																label="E-mail"
																type="email"
																value={values.email}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.email && errors.email
																)}
															/>
															{touched.email && errors.email && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-email"
																>
																	{errors.email}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<InputLabel htmlFor="password-signup">
																Password*
															</InputLabel>
															<OutlinedInput
																fullWidth
																error={Boolean(touched.password && errors.password)}
																id="password-signup"
																type={showPassword ? "text" : "password"}
																value={values.password}
																name="password"
																onBlur={handleBlur}
																onChange={(e) => {
																	handleChange(e);
																	changePassword(e.target.value);
																}}
															/>
															{touched.password && errors.password && (
																<FormHelperText error id="helper-text-password-signup">
																	{errors.password}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<Stack spacing={1}>
															<InputLabel htmlFor="confirm-password-signup">
																Confirm Password*
															</InputLabel>
															<OutlinedInput
																fullWidth
																error={Boolean(
																	touched.confirmPassword && errors.confirmPassword
																)}
																id="confirmPassword-signup"
																type={showConfirmPassword ? "text" : "password"}
																value={values.confirmPassword}
																name="confirmPassword"
																onBlur={handleBlur}
																onChange={(e) => {
																	handleChange(e);
																}}
															/>
															{touched.confirmPassword && errors.confirmPassword && (
																<FormHelperText error id="helper-text-confirm-password-signup">
																	{errors.confirmPassword}
																</FormHelperText>
															)}
														</Stack>
													</Grid>
													<Grid item xs={12}>
														<FormControl fullWidth>
															<InputLabel id="demo-simple-select-label">
																PWA Access
															</InputLabel>
															<Select
																labelId="demo-simple-select-label"
																id="demo-simple-select"
																value={accountCurrentStatus}
																label="Account Status"
																onChange={
																	handleAccountStatusChange
																}
																displayEmpty
															>
																<MenuItem value={"denied"}>
																	Denied
																</MenuItem>
																<MenuItem value={"approved"}>
																	Allowed
																</MenuItem>
															</Select>
														</FormControl>
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
															Add New Worker
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
};
export default index;
