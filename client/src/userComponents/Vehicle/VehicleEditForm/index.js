import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import styles from "./VehicleEditForm.module.scss";
import {
	Checkbox,
	FormControlLabel,
	Grid,
	TextField,
	Box,
	Stack,
	FormHelperText,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Header";
import VehicleAsideBar from "../VehicleAsideBar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import firebase from "API/firebase";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import useNumberOnly from "hooks/useNumberOnly";
import pdfIcon from "../VehicleForm/pdf-icon.png";
import imageIcon from "../VehicleForm/image-icon.png";
import fileIcon from "../VehicleForm/file-icon.png";
import { useTranslation } from 'react-i18next';
import useGoBack from '../../../hooks/useGoBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Index() {
	const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));
	const { t } = useTranslation();

	const [toggle, setToggle] = useState(true);
	const [vehicle, setVehicle] = useState();

	const [downloadUrls, setDownloadUrls] = useState([]);
	const [downloadDamageUrls, setDownloadDamageUrls] = useState([]);
	const [downloadDocumentUrls, setDownloadDocumentUrls] = useState([]);
	const [downloadRepairUrls, setDownloadRepairUrls] = useState([]);

	const params = useParams();
	const dispatch = useDispatch();
	const user = JSON.parse(localStorage.getItem("user"));

	const navigate = useNavigate();

	useEffect(() => {
		const fetchVehicle = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/vehicle/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setVehicle(json);
				setDownloadUrls(json.carImage);
				setDownloadDamageUrls(json.carDamageImages);
				setDownloadDocumentUrls(json.damageDocumentation);
				setDownloadRepairUrls(json.repairPictures)
				setToggle(json.carDamage);
			}
			dispatch(setLoading(false));
		};
		fetchVehicle();
	}, []);

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
			const fileRef = folderRef.child(file.name);
			await fileRef.put(file);
			const downloadUrl = await fileRef.getDownloadURL();
			images.push(downloadUrl);
		}
		setDownloadUrls(images);
		dispatch(setLoading(false));
	};

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
			const fileRef = folderRef.child(file.name);
			await fileRef.put(file);
			const downloadDamageUrl = await fileRef.getDownloadURL();
			images.push(downloadDamageUrl);
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
			const fileRef = folderRef.child(file.name);
			await fileRef.put(file);
			const downloadDamageUrl = await fileRef.getDownloadURL();
			images.push(downloadDamageUrl);
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
			return <img src={pdfIcon} alt="PDF" width="100" />;
		} else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
			return <img src={imageIcon} alt="Image" width="100" />;
		} else {
			return <img src={fileIcon} alt="File" width="100" />;
		}
	};

	return (
		<>
			<Header />
			<Grid position="relative" container spacing={2}>
				<Grid
					item
					xs={"auto"}
					sx={{
						position: {
							md: "static",
							xs: "absolute",
						},
						left: "0",
						top: "0",
						zIndex: "2",
						height: {
							xs: "100%",
							md: "unset",
						},
					}}
				>
					{vehicle && (
						<VehicleAsideBar companyId={vehicle.companyId} />
					)}
				</Grid>
				<Grid item xs>
					<Box
						sx={{
							width: "100%",
							minHeight: "100vh",
							paddingLeft: {
								xs: "80px",
								md: "16px",
							},
						}}
						className={styles.vehicleEditFormSection}
					>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<Box className={styles.rightSideSection}>
									<Box>
										<Button
											sx={{ fontSize: "12px", mt: "15px" }}
											variant="outlined"
											onClick={useGoBack}
											startIcon={<ArrowBackIcon />}
										>
											{t('Back')}
										</Button>
									</Box>
									<Box className={styles.vehicleHeading} component={"h1"}>{t('Edit Vehicle')}</Box>
									<Box className={styles.editVehicleFieldsBody}>
										<Box className={styles.editFields}>
											<Formik
												enableReinitialize={true}
												initialValues={
													vehicle
														? {
															makeName: vehicle.makeName,
															model: vehicle.model,
															licensePlate: vehicle.licensePlate,
															mileage: vehicle.mileage,
															registeredCity: vehicle.registeredCity,
															color: vehicle.color,
															insurance: vehicle.insurance,
															lastMaintenanceMileage:
																vehicle.lastMaintenanceMileage,
															vehicleIdentificationNumber: vehicle.vehicleIdentificationNumber,
															datePicker: datePicker,
															policyNumber: vehicle.policyNumber,
															fuel: vehicle.fuel,
															submit: null,
														}
														: {
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
														}
												}
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
													dispatch(setLoading(true));
													const updatedVehicle = {
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
														carImage: downloadUrls,
														carDamage: toggle,
														carDamageImages: downloadDamageUrls,
													};
													const response = await fetch(
														`${BASE_URL}/vehicle/${vehicle.companyId}/vehicles/${params.id}`,
														{
															method: "PATCH",
															headers: {
																"Content-Type": "application/json",
																Authorization: `Bearer ${user.tokens.access.token}`,
															},
															body: JSON.stringify(updatedVehicle),
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
														navigate(`/home/vehicle-list/${vehicle.companyId}`);
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
																		label={t('Maker')}
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
																				{t(errors.makeName)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="model"
																		label={t('Model')}
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
																			{t(errors.model)}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="licensePlate"
																		label={t('License Plate')}
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
																				{t(errors.licensePlate)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="registeredCity"
																		label={t('Registered City')}
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
																				{t(errors.registeredCity)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="color"
																		label={t('Color')}
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
																			{t(errors.color)}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="insurance"
																		label={t('Insurance')}
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
																				{t(errors.insurance)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="mileage"
																		label={t('Mileage')}
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
																			{t(errors.mileage)}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="lastMaintenanceMileage"
																		label={t('Last maintenance mileage')}
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
																				{t(errors.lastMaintenanceMileage)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="vehicleIdentificationNumber"
																		label={t('Vehicle Identification Number')}
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
																				{t(errors.vehicleIdentificationNumber)}
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
																			label={t('First Registration Date')}
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
																					{t(errors.firstRegistrationDate)}
																				</FormHelperText>
																			)}
																	</LocalizationProvider>
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="policyNumber"
																		label={t('Policy Number')}
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
																				{t(errors.policyNumber)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="fuel"
																		label={t('Fuel')}
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
																				{t(errors.fuel)}
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
																				{t('Choose Documents')}
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
																		<FormHelperText error>{t(errors.damageDocumentation)}</FormHelperText>
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
																				{t('Choose Repair Images')}
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
																		<FormHelperText error>{t(errors.repairPictures)}</FormHelperText>
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
																				{t('Choose Car Images')}
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
																		<FormHelperText error>{t(errors.carImage)}</FormHelperText>
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
																			label={t('Car Damage/s')}
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
																					{t('Damage Image/Images')}
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
																			{t(errors.submit)}
																		</FormHelperText>
																	</Grid>
																)}
																<Button
																	type="submit"
																	disabled={isSubmitting}
																	sx={{ mt: "20px" }}
																	variant="contained"
																>
																	{t('Update Vehicle')}
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
				</Grid>
			</Grid>
		</>
	);
}

export default Index;
