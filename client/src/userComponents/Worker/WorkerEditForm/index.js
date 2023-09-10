import React, { useEffect, useState } from "react";
import { Button, Grid, TextField, FormHelperText, InputAdornment, IconButton, Stack, FormControl, InputLabel, Select, MenuItem, OutlinedInput } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import styles from "./workerEditForm.module.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import WorkerSideBar from "../WorkerAsideBar";
import firebase from "API/firebase";
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import useNumberOnly from "hooks/useNumberOnly";
import { strengthColor, strengthIndicator } from "utils/password-strength";
import pdfIcon from "../../Vehicle/VehicleForm/pdf-icon.png";
import imageIcon from "../../Vehicle/VehicleForm/image-icon.png";
import fileIcon from "../../Vehicle/VehicleForm/file-icon.png";
import { EyeOutlined, EyeInvisibleOutlined, CloseOutlined } from "@ant-design/icons";
import { useTranslation } from 'react-i18next'
import useGoBack from '../../../hooks/useGoBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const index = () => {
	const { t } = useTranslation();
	const [worker, setWorker] = useState();
	const [accountCurrentStatus, setAccountCurrentStatus] = useState("");
	const [downloadDocumentUrls, setDownloadDocumentUrls] = useState([]);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const params = useParams();
	const [level, setLevel] = useState();

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = JSON.parse(localStorage.getItem("user"));
	const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));

	const handleAccountStatusChange = (event) => {
		setAccountCurrentStatus(event.target.value);
	};

	useEffect(() => {
		const fetchWorker = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/worker/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setWorker(json);
				setDatePicker(json.dob);
				setDownloadDocumentUrls(json.personalDataUpload);
				setDownloadStaffPictureURL(json.staffPicture);

				setAccountCurrentStatus(json.accountStatus);
			}
			dispatch(setLoading(false));
		};
		fetchWorker();
	}, []);

	const [existingDownloadDocumentUrls, setExistingDownloadDocumentUrls] = useState([]);
	const [existingImageNames, setExistingImageNames] = useState([]);
	const [imageNames, setImageNames] = useState([]);
	const [downloadURL, setDownloadURL] = useState("");
	const [downloadPersonalDataUploadURL, setDownloadPersonalDataUploadURL] = useState("");
	const [downloadStaffPictureURL, setDownloadStaffPictureURL] = useState("");

	const changePassword = (value) => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	useEffect(() => {
		changePassword("");
	}, []);

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
		var documents = [...downloadDocumentUrls]; // Copy current URLs
		var names = [...imageNames]; // Copy current names

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
			names.push(file.name); // Store image name
		}

		setDownloadDocumentUrls(documents);
		setImageNames(names);
		dispatch(setLoading(false));
	};

	const handleRemoveImage = (indexToRemove) => {
		const updatedDownloadDocumentUrls = downloadDocumentUrls.filter(
			(_, index) => index !== indexToRemove
		);
		const updatedImageNames = imageNames.filter(
			(_, index) => index !== indexToRemove
		);
		setDownloadDocumentUrls(updatedDownloadDocumentUrls);
		setImageNames(updatedImageNames);
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

	const isImageFile = (url) => {
		const imageExtensions = ["jpg", "jpeg", "png", "gif"];
		const fileExtension = url
			.split(".")
			.pop()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "")
			.split("altmedia")[0];
		return imageExtensions.includes(fileExtension);
	};

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
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleMouseDownConfirmPassword = (event) => {
		event.preventDefault();
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
					{worker && (
						<WorkerSideBar companyId={worker.companyId} />
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
						className={styles.workerEditFormSection}
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
									<Box className={styles.workerHeading} component={"h1"}>{t('Edit Worker')}</Box>
									<Box className={styles.editWorkerFieldsBody}>
										<Box className={styles.editWorkerFields}>
											<Formik
												enableReinitialize={true}
												initialValues={
													worker
														? {
															firstName: worker.firstName,
															lastName: worker.lastName,
															birthName: worker.birthName,
															email: worker.email,
															phoneNumber: worker.phoneNumber,
															name: worker.name,
															datePicker: worker.dob,
															placeOfBirth: worker.placeOfBirth,
															nationalities:
																worker.nationalities.toString(),
															street: worker.street,
															zip: worker.zip,
															city: worker.city,
															taxId: worker.taxId,
															taxClass: worker.taxClass,
															socialSecurityNumber:
																worker.socialSecurityNumber,
															healthInsurance:
																worker.healthInsurance,
															children: worker.children,
															iban: worker.iban,
															bic: worker.bic,
															nameOfBank: worker.nameOfBank,
															personalDataUpload: worker.personalDataUpload,
															staffPicture: worker.staffPicture,
															password: worker.password,
															accountStatus: worker.accountStatus,
															submit: null,
														}
														: {
															firstName: "",
															lastName: "",
															birthName: "",
															email: "",
															phoneNumber: "",
															name: "",
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
															password: "",
															confirmPassword: "",
															submit: null,
														}
												}
												validationSchema={Yup.object().shape({
													email: Yup.string()
														.email(t("Must be a valid email"))
														.max(50, t("maximum 50 characters"))
														.required(t("Email is required")),
													firstName: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("First Name required")),
													lastName: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Last Name required")),
													birthName: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Birth Name required")),
													phoneNumber: Yup.string()
														.required(t("Phone Number is required")),
													datePicker: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Date of Birth is required")),
													placeOfBirth: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Place of birth is required")),
													street: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Street is required")),
													zip: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Zip Code is required")),
													city: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("City is required")),
													taxId: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Tax Id is required")),
													taxClass: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Tax Class is required")),
													socialSecurityNumber: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Social Security Number is required")),
													healthInsurance: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Health Insurance is required")),
													children: Yup.string()
														.required(t("Number of children is required")),
													iban: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("IBAN is required")),
													bic: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("BIC is required")),
													nameOfBank: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Name of Bank is required")),
													password: Yup.string()
														.max(50, t("maximum 50 characters"))
														.required(t("Password is required")),
													confirmPassword: Yup.string().oneOf(
														[Yup.ref("password"), null],
														t("Passwords must match")
													),
												})}
												onSubmit={async (
													values,
													{ setErrors, setStatus, setSubmitting }
												) => {
													dispatch(setLoading(true));
													const nationalities = values.nationalities
														.split(",")
														.map((item) => item.trim());
													const updatedWorker = {
														email: values.email,
														phoneNumber: values.phoneNumber,
														firstName: values.firstName,
														lastName: values.lastName,
														birthName: values.birthName,
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
														password: values.password,
														personalDataUpload: downloadDocumentUrls,
														staffPicture: downloadStaffPictureURL,
														accountStatus: accountCurrentStatus,
													};

													const response = await fetch(
														`${BASE_URL}/worker/${worker.companyId}/workers/${params.id}`,
														{
															method: "PATCH",
															headers: {
																"Content-Type":
																	"application/json",
																Authorization: `Bearer ${user.tokens.access.token}`,
															},
															body: JSON.stringify(updatedWorker),
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
														navigate(`/home/worker-list/${worker.companyId}`);
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
																		label={t('First Name')}
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
																				{t(errors.firstName)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="lastName"
																		label={t('Last Name')}
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
																				{t(errors.lastName)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="birthName"
																		label={t('Birth Name')}
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
																				{t(errors.birthName)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="phoneNumber"
																		label={t('Phone Number')}
																		type="text"
																		value={
																			values.phoneNumber
																		}
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
																				{t(errors.phoneNumber)}
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
																			label={t('Date of Birth')}
																			openTo="year"
																			views={[
																				"year",
																				"month",
																				"day",
																			]}
																			value={datePicker}
																			onChange={(
																				newValue
																			) => {
																				setDatePicker(
																					newValue
																				);
																				handleChange;
																			}}
																			renderInput={(
																				params
																			) => (
																				<TextField
																					{...params}
																				/>
																			)}
																			inputFormat="DD/MM/YYYY"

																		/>
																		{touched.datePicker &&
																			errors.datePicker && (
																				<FormHelperText
																					error
																					id="standard-weight-helper-text-datePicker"
																				>
																					{t(errors.datePicker)}
																				</FormHelperText>
																			)}
																	</LocalizationProvider>
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="placeOfBirth"
																		label={t('Place of Birth')}
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
																				{t(errors.placeOfBirth)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="nationalities"
																		label={t('Nationalities')}
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
																				{t(errors.nationalities)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="street"
																		label={t('Street / Street No')}
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
																				{t(errors.street)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="zip"
																		label={t('ZIP Code')}
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
																				{t(errors.zip)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="city"
																		label={t('City')}
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
																				{t(errors.city)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="taxId"
																		label={t('Tax ID')}
																		type="text"
																		value={values.taxId}
																		onBlur={handleBlur}
																		onChange={handleChange}
																		error={Boolean(
																			touched.taxId &&
																			errors.taxId
																		)}
																	/>
																	{touched.taxId &&
																		errors.taxId && (
																			<FormHelperText
																				error
																				id="standard-weight-helper-text-taxId"
																			>
																				{t(errors.taxId)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="taxClass"
																		label={t('Tax Class')}
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
																				{t(errors.taxClass)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="socialSecurityNumber"
																		label={t('Social Security Number')}
																		type="text"
																		value={
																			values.socialSecurityNumber
																		}
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
																				{t(errors.socialSecurityNumber)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="healthInsurance"
																		label={t('Health Insurance')}
																		type="text"
																		value={
																			values.healthInsurance
																		}
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
																				{t(errors.healthInsurance)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="children"
																		label={t('Children, if so, how much')}
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
																				{t(errors.children)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="nameOfBank"
																		label={t('Name of the Bank')}
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
																				{t(errors.nameOfBank)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<TextField
																	id="iban"
																	label={t('IBAN')}
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
																			{t(errors.iban)}
																		</FormHelperText>
																	)}
															</Grid>
															<Grid item xs={12}>
																<TextField
																	id="bic"
																	label={t('BIC')}
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
																			{t(errors.bic)}
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
																			<div key={index} className={styles.imagePreviewContainer}>
																				<IconButton
																					onClick={() => handleRemoveImage(index)}
																					className={styles.removeButton}
																					aria-label="Remove"
																				>
																					<CloseOutlined />
																				</IconButton>
																				{isImageFile(downloadDocumentUrl) ? (
																					<img
																						src={downloadDocumentUrl}
																						alt={`Image ${index}`}
																						className={styles.imagePreview}
																					/>
																				) : (
																					getFileIcon(downloadDocumentUrl)
																				)}
																				<div className={styles.imageName}>{imageNames[index]}</div>
																			</div>
																		))}
																	</Box>
																	{errors.personalDataUpload && downloadDocumentUrls.length === 0 && (
																		<FormHelperText error>{t(errors.personalDataUpload)}</FormHelperText>
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
																				{t('Staff Picture')}
																			</Box>
																			<Box className={styles.fileSelectName}></Box>
																		</Box>
																		<input
																			type="file"
																			onChange={handleStaffPictureUpload}
																		/>
																	</Button>
																	<img
																		src={downloadStaffPictureURL}
																		alt=""
																		width="100"
																	/>
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
																			touched.email &&
																			errors.email
																		)}
																	/>
																	{touched.email &&
																		errors.email && (
																			<FormHelperText
																				error
																				id="standard-weight-helper-text-email"
																			>
																				{t(errors.email)}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<InputLabel htmlFor="password-signup">
																		{t('Update Password')}
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
																		endAdornment={
																			<InputAdornment position="end">
																				<IconButton
																					aria-label="toggle password visibility"
																					onClick={handleClickShowPassword}
																					onMouseDown={handleMouseDownPassword}
																					edge="end"
																					size="large"
																				>
																					{showPassword ? (
																						<EyeOutlined />
																					) : (
																						<EyeInvisibleOutlined />
																					)}
																				</IconButton>
																			</InputAdornment>
																		}
																		placeholder=""
																	/>

																	{touched.password && errors.password && (
																		<FormHelperText error id="helper-text-password-signup">
																			{t(errors.password)}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<InputLabel htmlFor="confirm-password-signup">
																		{t('Confirm Update Password')}
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
																		endAdornment={
																			<InputAdornment position="end">
																				<IconButton
																					aria-label="toggle password visibility"
																					onClick={handleClickShowConfirmPassword}
																					onMouseDown={handleMouseDownConfirmPassword}
																					edge="end"
																					size="large"
																				>
																					{showConfirmPassword ? (
																						<EyeOutlined />
																					) : (
																						<EyeInvisibleOutlined />
																					)}
																				</IconButton>
																			</InputAdornment>
																		}
																		placeholder=""
																	/>
																	{touched.confirmPassword && errors.confirmPassword && (
																		<FormHelperText error id="helper-text-confirm-password-signup">
																			{t(errors.confirmPassword)}
																		</FormHelperText>
																	)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<FormControl fullWidth>
																	<InputLabel id="demo-simple-select-label">
																		{t('PWA Access')}
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
																			{t('Denied')}
																		</MenuItem>
																		<MenuItem value={"approved"}>
																			{t('Allowed')}
																		</MenuItem>
																	</Select>
																</FormControl>
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
																	{t('Update Worker')}
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
};
export default index;
