import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import styles from "./CompanyEditForm.module.scss";
import { Grid, TextField, Box, Stack, FormHelperText } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Header";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../../hooks/useGoBack';

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import firebase from "API/firebase";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import useNumberOnly from "hooks/useNumberOnly";
import { useTranslation } from 'react-i18next';


function Index() {
	const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));
	const { t } = useTranslation();

	const [company, setCompany] = useState();
	const params = useParams();
	const dispatch = useDispatch();
	const user = JSON.parse(localStorage.getItem("user"));

	const navigate = useNavigate();

	useEffect(() => {
		const fetchCompany = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/company/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setCompany(json);
				setDownloadURL(json.companyLogo);
			}
			dispatch(setLoading(false));
		};
		fetchCompany();
	}, []);

	const [downloadURL, setDownloadURL] = useState("");

	const handleImageUpload = async (event) => {
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
			setDownloadURL(url);
		});
		dispatch(setLoading(false));
	};
	return (
		<>
			<Header />

			<Grid item xs>
				<Box
					sx={{
						width: "100%",
						minHeight: "100vh",
						px: "15px",
					}}
					className={styles.addCompanyFormSection}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Box className={styles.rightSideSection}>
								<Button
									sx={{ fontSize: "12px", mt: "15px" }}
									variant="outlined"
									onClick={useGoBack}
									startIcon={<ArrowBackIcon />}
								>
									{t('Back')}
								</Button>
								<Box className={styles.companyHeading} component={"h1"}>{t('Edit Company')}</Box>
								<Box className={styles.editCompanyFieldsBody}>
									<Box className={styles.editCompanyFields}>
										<Formik
											enableReinitialize={true}
											initialValues={
												company
													? {
														companyName: company.companyName,
														contactNo: company.contactNo,
														street: company.street,
														zip: company.zip,
														city: company.city,
														companyRegistrationNumber: company.companyRegistrationNumber,
														managingDirector: company.managingDirector,
														taxNumber: company.taxNumber,
														vatID: company.vatID,
														datePicker: datePicker,
														nameOfBank: company.nameOfBank,
														iban: company.iban,
														bic: company.bic,
														email: company.email,
														submit: null,
													}
													: {
														companyName: "",
														contactNo: "",
														street: "",
														zip: "",
														city: "",
														companyRegistrationNumber: "",
														managingDirector: "",
														taxNumber: "",
														vatID: "",
														datePicker: datePicker,
														nameOfBank: "",
														iban: "",
														bic: "",
														email: "",
														submit: null,
													}
											}
											validationSchema={Yup.object().shape({
												companyName: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Company Name is required")),
												contactNo: Yup.string()
													.required(t("Telephone Number is required")),
												street: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Street is required")),
												zip: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Zip Code is required")),
												city: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("City is required")),
												companyRegistrationNumber: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Company Registration Number is required")),
												managingDirector: Yup.string()
													.max(50, "maximum 50 characters")
													.required(t("Managing Director is required")),
												taxNumber: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Tax Number is required")),
												vatID: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Vat ID is required")),
												datePicker: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Partnership Agreement Dated is required")),
												nameOfBank: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("Bank Name is required")),
												iban: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("IBAN is required")),
												bic: Yup.string()
													.max(50, t("maximum 50 characters"))
													.required(t("BIC is required")),
												email: Yup.string()
													.email(t("Must be a valid email"))
													.max(50, t("maximum 50 characters"))
													.required(t("Email is required")),
											})}
											onSubmit={async (
												values,
												{ setErrors, setStatus, setSubmitting }
											) => {
												dispatch(setLoading(true));
												const company = {
													companyName: values.companyName,
													contactNo: values.contactNo,
													street: values.street,
													zip: values.zip,
													city: values.city,
													companyRegistrationNumber: values.companyRegistrationNumber,
													managingDirector: values.managingDirector,
													taxNumber: values.taxNumber,
													vatID: values.vatID,
													partnershipAgreementDated: datePicker,
													nameOfBank: values.nameOfBank,
													iban: values.iban,
													bic: values.bic,
													email: values.email,
													companyLogo: downloadURL,
												};
												const response = await fetch(
													`${BASE_URL}/company/${params.id}`,
													{
														method: "PATCH",
														body: JSON.stringify(company),
														headers: {
															"Content-Type": "application/json",
															Authorization: `Bearer ${user.tokens.access.token}`,
														},
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
													navigate("/home/default");
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
																	id="companyName"
																	label={t('Company Name')}
																	type="text"
																	fullWidth
																	value={values.companyName}
																	onBlur={handleBlur}
																	onChange={handleChange}
																	error={Boolean(
																		touched.companyName &&
																		errors.companyName
																	)}
																/>
																{touched.companyName &&
																	errors.companyName && (
																		<FormHelperText
																			error
																			id="standard-weight-helper-text-companyName"
																		>
																			{t(errors.companyName)}
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
																	label={t('Zip')}
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
															<TextField
																id="companyRegistrationNumber"
																label={t('Company Registration Number')}
																type="text"
																fullWidth
																value={values.companyRegistrationNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.companyRegistrationNumber &&
																	errors.companyRegistrationNumber
																)}
															/>
															{touched.companyRegistrationNumber &&
																errors.companyRegistrationNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-companyRegistrationNumber"
																	>
																		{t(errors.companyRegistrationNumber)}
																	</FormHelperText>
																)}
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="managingDirector"
																label={t('Managing Director')}
																type="text"
																fullWidth
																value={values.managingDirector}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.managingDirector &&
																	errors.managingDirector
																)}
															/>
															{touched.managingDirector &&
																errors.managingDirector && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-managingDirector"
																	>
																		{t(errors.managingDirector)}
																	</FormHelperText>
																)}
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="taxNumber"
																label={t('Tax Number')}
																type="text"
																fullWidth
																value={values.taxNumber}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.taxNumber &&
																	errors.taxNumber
																)}
															/>
															{touched.taxNumber &&
																errors.taxNumber && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-taxNumber"
																	>
																		{t(errors.taxNumber)}
																	</FormHelperText>
																)}
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="vatID"
																label={t('Vat ID')}
																type="text"
																fullWidth
																value={values.vatID}
																onBlur={handleBlur}
																onChange={handleChange}
																error={Boolean(
																	touched.vatID &&
																	errors.vatID
																)}
															/>
															{touched.vatID &&
																errors.vatID && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-vatID"
																	>
																		{t(errors.vatID)}
																	</FormHelperText>
																)}
														</Grid>
														<Grid item xs={12}>
															<Stack spacing={1}>
																<LocalizationProvider
																	dateAdapter={AdapterDayjs}
																>
																	<DatePicker
																		disableFuture
																		label={t('Partnership Agreement Dated')}
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
																	{touched.partnershipAgreementDated &&
																		errors.partnershipAgreementDated && (
																			<FormHelperText
																				error
																				id="standard-weight-helper-text-partnershipAgreementDated"
																			>
																				{t(errors.partnershipAgreementDated)}
																			</FormHelperText>
																		)}
																</LocalizationProvider>
															</Stack>
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="nameOfBank"
																label={t('Name of Bank')}
																type="text"
																fullWidth
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
																		{t(errors.bic)}
																	</FormHelperText>
																)}
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="contactNo"
																label={t('Telephone Number')}
																type="text"
																fullWidth
																value={values.contactNo}
																onBlur={handleBlur}
																onChange={(e) => {
																	useNumberOnly(
																		setFieldValue,
																		"contactNo",
																		e
																	);
																}}
																error={Boolean(
																	touched.contactNo && errors.contactNo
																)}
															/>
															{touched.contactNo && errors.contactNo && (
																<FormHelperText
																	error
																	id="standard-weight-helper-text-contactNo"
																>
																	{t(errors.contactNo)}
																</FormHelperText>
															)}
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="email"
																label={t('E-mail')}
																type="email"
																fullWidth
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
																	{t(errors.email)}
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
																			{t('Company Logo')}
																		</Box>
																		<Box
																			className={
																				styles.fileSelectName
																			}
																		></Box>
																	</Box>
																	<input
																		type="file"
																		filename="companyLogo"
																		onChange={handleImageUpload}
																	/>
																</Button>
																<img src={downloadURL} alt="" width="100" />
															</Stack>
														</Grid>
														{errors.submit && (
															<Grid item xs={12}>
																<FormHelperText error>
																	{t(errors.submit)}
																</FormHelperText>
															</Grid>
														)}
														<Grid item xs={12}>
															<Button
																disableElevation
																disabled={isSubmitting}
																type="submit"
																sx={{ mt: "20px" }}
																variant="contained"
															>
																{t('Update Company')}
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
		</>
	);
}

export default Index;
