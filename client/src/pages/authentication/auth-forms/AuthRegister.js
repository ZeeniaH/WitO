import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
// material-ui
import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	Grid,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
	Select,
	MenuItem,
	InputAdornment,
	IconButton
} from "@mui/material";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../../hooks/useGoBack';


// third party
import * as Yup from "yup";
import firebase from "API/firebase";
import { Formik } from "formik";

// project import
import AnimateButton from "components/@extended/AnimateButton";
import { strengthColor, strengthIndicator } from "utils/password-strength";

// assets
import { useRegister } from "hooks/useRegister";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

// ============================|| FIREBASE - REGISTER ||============================ //

const AuthRegister = () => {
	const { t } = useTranslation()
	const [level, setLevel] = useState();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const { register, isLoading, error } = useRegister();
	// const { user } = useAuthContext();
	const user = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};

	const changePassword = (value) => {
		const temp = strengthIndicator(value);
		setLevel(strengthColor(temp));
	};

	const handleClickShowConfirmPassword = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleMouseDownConfirmPassword = (event) => {
		event.preventDefault();
	};

	useEffect(() => {
		changePassword("");
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
			<Button
				sx={{ fontSize: "12px", mb: "10px" }}
				variant="outlined"
				onClick={useGoBack}
				startIcon={<ArrowBackIcon />}
			>
				{t('Back')}
			</Button>
			<Box sx={{ maxWidth: "500px", margin: "0 auto" }}>
				<Formik
					initialValues={{
						name: "",
						email: "",
						avatar: "",
						phoneNumber: "",
						password: "",
						confirmPassword: "",
						// role: "",
						submit: null,
					}}
					validationSchema={Yup.object().shape({
						name: Yup.string()
							.max(50, t("maximum 50 characters"))
							.required(t("Name required")),
						email: Yup.string()
							.email(t("Must be a valid email"))
							.max(50, t("maximum 50 characters"))
							.required(t("Email is required")),
						phoneNumber: Yup.string()
							.required(t("Phone Number is required")),
						password: Yup.string()
							.max(50, t("maximum 50 characters"))
							.required(t("Password is required")),
						confirmPassword: Yup.string().oneOf(
							[Yup.ref("password"), null],
							t("Passwords must match")
						),
						// role: Yup.string()
						// 	.max(50, t("maximum 50 characters"))
						// 	.required(t("Role is required")),
					})}
					onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
						setSubmitting(true);
						try {
							dispatch(setLoading(true));
							const { name, email, password, phoneNumber, avatar } = values;
							const response = await fetch(`${BASE_URL}/user`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									Authorization: `Bearer ${user.tokens.access.token}`,
								},
								body: JSON.stringify({ name, email, password, phoneNumber, role: "Admin", avatar: downloadURL }),
							});
							const json = await response.json();
							if (!response.ok) {

								setStatus({ success: false });
								setErrors({ submit: json.message });
								setSubmitting(false);
							}
							if (response.ok) {
								// update loading state
								setStatus({ success: true });
								setSubmitting(false);
								navigate("/dashboard/users");
							}
							dispatch(setLoading(false));
						} catch (err) {
							console.error(err);
							setStatus({ success: false });
							setErrors({ submit: err.message });
							setSubmitting(false);
						}
					}}
				>
					{({
						errors,
						handleBlur,
						handleChange,
						handleSubmit,
						isSubmitting,
						touched,
						values,
					}) => (
						<form noValidate onSubmit={handleSubmit}>
							<Grid container spacing={3}>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="name-signup">{t('Name')}</InputLabel>
										<OutlinedInput
											id="name-login"
											type="name"
											value={values.name}
											name="name"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder=""
											fullWidth
											error={Boolean(touched.name && errors.name)}
										/>
										{touched.name && errors.name && (
											<FormHelperText error id="helper-text-name-signup">
												{t(errors.name)}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="email-signup">
											{t('Email Address')}
										</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.email && errors.email)}
											id="email-login"
											type="email"
											value={values.email}
											name="email"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder=""
											inputProps={{}}
										/>
										{touched.email && errors.email && (
											<FormHelperText error id="helper-text-email-signup">
												{t(errors.email)}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<Button sx={{ width: "100%", p: "0", border: "1px solid #bbb5b5", }} variant="outlined" component="label" >
											<Box sx={{ display: "block", color: "#34495e", cursor: "pointer", height: "50px", lineHeight: "40px", textAlign: "left", background: "#ffffff", overflow: "hidden", position: "relative", width: "100%" }} >
												<Box sx={{ background: "#dce4ec", padding: "0 10px", display: "inline-block", height: "100 %", lineHeight: "50px;" }} > {t('Upload Picture')} </Box>
												<Box sx={{ lineHeight: "40px", display: "inline-block", padding: "0 10px", }} ></Box>
											</Box>
											<input onChange={handleImageUpload} type="file" />
										</Button>
										<img src={downloadURL} alt="" width="100" />
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="phoneNumber-signup">
											{t('Phone Number')}
										</InputLabel>
										<OutlinedInput
											fullWidth
											error={Boolean(touched.phoneNumber && errors.phoneNumber)}
											id="phoneNumber-login"
											type="phoneNumber"
											value={values.phoneNumber}
											name="phoneNumber"
											onBlur={handleBlur}
											onChange={handleChange}
											placeholder=""
											inputProps={{}}
										/>
										{touched.phoneNumber && errors.phoneNumber && (
											<FormHelperText error id="helper-text-phoneNumber-signup">
												{t(errors.phoneNumber)}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="password-signup">{t('Password')}</InputLabel>
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
									<FormControl fullWidth sx={{ mt: 2 }}>
										<Grid container spacing={2} alignItems="center">
											<Grid item>
												<Box
													sx={{
														backgroundColor: level?.color,
														width: 85,
														height: 8,
														borderRadius: "7px",
													}}
												/>
											</Grid>
											<Grid item>
												<Typography variant="subtitle1" fontSize="0.75rem">
													{level?.label}
												</Typography>
											</Grid>
										</Grid>
									</FormControl>
								</Grid>
								<Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="confirmPassword-signup">
											{t('Confirm Password')}
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
											<FormHelperText
												error
												id="helper-text-confirmPassword-signup"
											>
												{t(errors.confirmPassword)}
											</FormHelperText>
										)}
									</Stack>
								</Grid>
								{/* <Grid item xs={12}>
									<Stack spacing={1}>
										<InputLabel htmlFor="role-signup">{t('Role')}</InputLabel>
										<Select
											fullWidth
											error={Boolean(touched.role && errors.role)}
											id="role-login"
											type="role"
											value={values.role}
											defaultValue="Admin"
											name="role"
											onBlur={handleBlur}
											onChange={handleChange}
										>
											<MenuItem value={"Admin"}>{t('Admin')}</MenuItem>
											<MenuItem value={"CompanyOwner"}>
												{t('CompanyOwner')}
											</MenuItem>
										</Select>
										{touched.role && errors.role && (
											<FormHelperText error id="helper-text-role-signup">
												{t(errors.role)}
											</FormHelperText>
										)}
									</Stack>
								</Grid> */}
								{errors.submit && (
									<Grid item xs={12}>
										<FormHelperText error>{t(errors.submit)}</FormHelperText>
									</Grid>
								)}
								<Grid item xs={12}>
									<AnimateButton>
										<Button
											disableElevation
											disabled={isSubmitting}
											fullWidth
											size="large"
											type="submit"
											variant="contained"
											color="primary"
										>
											{t('Create Account')}
										</Button>
									</AnimateButton>
								</Grid>
							</Grid>
						</form>
					)}
				</Formik>
			</Box>
		</>
	);
};

export default AuthRegister;
