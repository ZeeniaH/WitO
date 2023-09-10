import React, { useEffect, useState } from "react";
import Axios from "axios";
import { Button, Grid, TextField, FormHelperText, Stack } from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import styles from "./ProfileEditForm.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../Header";
import ProfileSideBar from "../ProfileSideBar";

import firebase from "API/firebase";
// third party
import * as Yup from "yup";
import { Formik } from "formik";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import useNumberOnly from "hooks/useNumberOnly";

const index = () => {
	const [users, setUsers] = useState();
	const [downloadURL, setDownloadURL] = useState("");
	const params = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		const fetchProfile = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/user/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setUsers(json);
				setDownloadURL(json.avatar);
			}
			dispatch(setLoading(false));
		};
		fetchProfile();
	}, []);

	console.log("users", users)

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
					<ProfileSideBar />
				</Grid>
				<Grid item xs>
					<Box

						className={styles.profileEditFormSection}
					>
						<Grid container sx={{
							padding: {
								xs: "20px 20px 20px 83px",
								md: "20px 20px 20px 16px"

							}
						}} spacing={2}>
							<Grid item xs={12}>
								<Box className={styles.rightSideSection}>
									<Box component={"h2"}>Edit Profile</Box>
									<Box className={styles.editProfileFieldsBody}>
										<Box className={styles.editFields}>
											<Formik
												enableReinitialize={true}
												initialValues={
													users
														? {
															name: users.name,
															phoneNumber: users.phoneNumber,
															description: users.description,
															avatar: users.avatar,
															submit: null,
														}
														: {
															name: "",
															phoneNumber: "",
															description: "",
															avatar: "",
															submit: null,
														}
												}
												validationSchema={Yup.object().shape({
													name: Yup.string()
														.max(50, "maximum 20 characters")
														.required("Name is required"),
													phoneNumber: Yup.string().required(
														"Phone Number is required"
													),
													description: Yup.string()
														.max(50, "maximum 50 characters")
														.required("description is required"),

												})}
												onSubmit={async (
													values,
													{ setErrors, setStatus, setSubmitting }
												) => {

													dispatch(setLoading(true));
													const updateUser = {
														name: values.name,
														phoneNumber: values.phoneNumber,
														description: values.description,
														avatar: downloadURL
													};
													const response = await fetch(
														`${BASE_URL}/user/${params.id}`,
														{
															method: "PATCH",
															headers: {
																"Content-Type": "application/json",
																Authorization: `Bearer ${user.tokens.access.token}`,
															},
															body: JSON.stringify(updateUser),
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
														navigate(`/home/user-profile`);
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
																		id="name"
																		label="Name"
																		type="text"
																		value={values.name}
																		onBlur={handleBlur}
																		onChange={handleChange}
																		error={Boolean(
																			touched.name &&
																			errors.name
																		)}
																	/>
																	{touched.name &&
																		errors.name && (
																			<FormHelperText
																				error
																				id="standard-weight-helper-text-name"
																			>
																				{errors.name}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="phoneNumber"
																		label="phone Number"
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
																				{
																					errors.phoneNumber
																				}
																			</FormHelperText>
																		)}
																</Stack>
															</Grid>
															<Grid item xs={12}>
																<Stack spacing={1}>
																	<TextField
																		id="description"
																		label="Description"
																		type="text"
																		value={values.description}
																		onBlur={handleBlur}
																		onChange={handleChange}
																		error={Boolean(
																			touched.description &&
																			errors.description
																		)}
																	/>
																	{touched.description &&
																		errors.description && (
																			<FormHelperText
																				error
																				id="standard-weight-helper-text-description"
																			>
																				{errors.description}
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
																				Profile Picture
																			</Box>
																			<Box
																				className={
																					styles.fileSelectName
																				}
																			></Box>
																		</Box>
																		<input
																			onChange={
																				handleImageUpload
																			}
																			type="file"
																		/>
																	</Button>
																	<img
																		src={downloadURL}
																		alt=""
																		width="100"
																	/>
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
																	Update User
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