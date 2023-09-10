import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button, Grid, TextField, FormHelperText, Stack } from "@mui/material";
import { Box } from "@mui/system";
import styles from "./addCompany.module.scss";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";

import firebase from "API/firebase";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import useNumberOnly from "hooks/useNumberOnly";

const AddCompany = () => {
	const [datePicker, setDatePicker] = useState(dayjs("2014-08-18T21:11:54"));

	const navigate = useNavigate();
	const user = JSON.parse(localStorage.getItem("user"));

	const [downloadURL, setDownloadURL] = useState("");
	const dispatch = useDispatch();

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
			<Grid item xs>
				<Box
					sx={{
						width: "100%",
						minHeight: "100vh",
					}}
					className={styles.addCompanyFormSection}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<Box className={styles.rightSideSection}>
								<Box className={styles.companyHeading} component={"h1"}>Add New Company</Box>
								<Box className={styles.addCompanyFieldsBody}>
									<Box className={styles.companyFields}>
										<Formik
											initialValues={{
												companyName: "",
												contactNo: "",
												street: "",
												zip: "",
												city: "",
												companyLogo: "",
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
											}}
											validationSchema={Yup.object().shape({
												companyName: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Company Name is required"),
												contactNo: Yup.string().required(
													"Telephone Number is required"
												),
												street: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Street is required"),
												zip: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Zip Code is required"),
												city: Yup.string()
													.max(50, "maximum 50 characters")
													.required("City is required"),
												companyRegistrationNumber: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Company Registration Number is required"),
												managingDirector: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Managing Director is required"),
												taxNumber: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Tax Number is required"),
												vatID: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Vat ID is required"),
												datePicker: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Partnership Agreement Dated is required"),
												nameOfBank: Yup.string()
													.max(50, "maximum 50 characters")
													.required("Bank Name is required"),
												iban: Yup.string()
													.max(50, "maximum 50 characters")
													.required("IBAN is required"),
												bic: Yup.string()
													.max(50, "maximum 50 characters")
													.required("BIC is required"),
												email: Yup.string()
													.email("Must be a valid email")
													.max(50, "maximum 50 characters")
													.required("Email is required"),
											})}
											onSubmit={async (
												values,
												{ setErrors, setStatus, setSubmitting }
											) => {
												if (!downloadURL) {
													setErrors({ companyLogo: "Company logo is required" });
													return;
												}
												dispatch(setLoading(true));
												const company = {
													companyName: values.companyName,
													companyLogo: downloadURL,
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
												};
												const response = await fetch(
													`${BASE_URL}/company/add-new-company`,
													{
														method: "POST",
														body: JSON.stringify(company),
														headers: {
															"Content-Type": "application/json",
															Authorization: `Bearer ${user.tokens.access.token}`,
														},
													}
												);
												const json = await response.json();
												console.log(json);
												if (!response.ok) {
													setStatus({ success: false });
													setErrors({ submit: json.message });
													setSubmitting(false);
												}
												if (response.ok) {
													setStatus({ success: true });
													setSubmitting(false);
													navigate("/dashboard/company-owners");
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
																	label="Company Name"
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
																			{errors.companyName}
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
															<TextField
																id="companyRegistrationNumber"
																label="Company Registration Number"
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
																		{errors.companyRegistrationNumber}
																	</FormHelperText>
																)}
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="managingDirector"
																label="Managing Director"
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
																		{errors.managingDirector}
																	</FormHelperText>
																)}
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="taxNumber"
																label="Tax Number"
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
																		{errors.taxNumber}
																	</FormHelperText>
																)}
														</Grid>

														<Grid item xs={12}>
															<TextField
																id="vatID"
																label="Vat ID"
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
																		{errors.vatID}
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
																		label="Partnership Agreement Dated"
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
																				{errors.partnershipAgreementDated}
																			</FormHelperText>
																		)}
																</LocalizationProvider>
															</Stack>
														</Grid>
														<Grid item xs={12}>
															<TextField
																id="nameOfBank"
																label="Name of Bank"
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
																		{errors.nameOfBank}
																	</FormHelperText>
																)}
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
															<TextField
																id="contactNo"
																label="Telephone Number"
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
																	touched.contactNo &&
																	errors.contactNo
																)}
															/>
															{touched.contactNo &&
																errors.contactNo && (
																	<FormHelperText
																		error
																		id="standard-weight-helper-text-contactNo"
																	>
																		{errors.contactNo}
																	</FormHelperText>
																)}
														</Grid>

														<Grid item xs={12}>
															<TextField
																id="email"
																label="E-mail"
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
																	{errors.email}
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
																		<Box className={styles.fileSelectButton}>
																			Company Logo
																		</Box>
																		<Box className={styles.fileSelectName}></Box>
																	</Box>
																	<input
																		type="file"
																		filename="companyLogo"
																		onChange={handleImageUpload}
																	/>
																</Button>
																{downloadURL ? (
																	<img src={downloadURL} alt="" width="100" />
																) : (
																	<p style={{ color: "red" }}>{errors.companyLogo}</p>
																)}
															</Stack>
														</Grid>
														{errors.submit && (
															<Grid item xs={12}>
																<FormHelperText error>
																	{errors.submit}
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
																Add New Company
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
};
export default AddCompany;
