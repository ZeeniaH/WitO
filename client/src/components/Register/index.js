import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useEffect } from "react";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

import { useRegister } from "../../hooks/useRegister";
import { IconButton, InputAdornment } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginFormValidator } from "./hooks/useLoginFormValidator";
import LoadingButton from "@mui/lab/LoadingButton";

function Copyright(props) {
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{"Copyright © "}
			<Link color="inherit" href="https://witorbit.netlify.app/">
				Witorbit
			</Link>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

export default function SignUp() {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setshowConfirmPassword] = useState(false);
	const { register, isLoading, error } = useRegister();

	const { errors, validateForm, onBlurField } = useLoginFormValidator(form);

	const navigate = useNavigate();

	const onUpdateField = (e) => {
		const field = e.target.name;
		const nextFormState = {
			...form,
			[field]: e.target.value,
		};
		setForm(nextFormState);
		if (errors[field].dirty)
			validateForm({
				form: nextFormState,
				errors,
				field,
			});
	};

	const handleClickShowPassword = () => {
		setShowPassword(!showPassword);
	};
	const handleClickShowConfirmPassword = () => {
		setshowConfirmPassword(!showConfirmPassword);
	};
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const { isValid } = validateForm({ form, errors, forceTouchErrors: true });
		if (!isValid) return;
		// alert(JSON.stringify(form, null, 2));
		await register(form.name, form.email, form.password);
		!error && navigate("/");
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Avatar sx={{ m: 1, backgroundColor: "secondary.main" }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>
				<Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								autoComplete="given-name"
								name="name"
								required
								fullWidth
								id="name"
								label="Name"
								autoFocus
								value={form.name}
								onChange={onUpdateField}
								onBlur={onBlurField}
								error={errors.name.dirty && errors.name.error}
								helperText={
									errors.name.dirty && errors.name.error && errors.name.message
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								id="email"
								label="Email Address"
								name="email"
								autoComplete="email"
								value={form.email}
								onChange={onUpdateField}
								onBlur={onBlurField}
								error={(errors.email.dirty && errors.email.error) || !!error}
								helperText={
									(errors.email.dirty &&
										errors.email.error &&
										errors.email.message) ||
									error
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="password"
								label="Password"
								type={showPassword ? "text" : "password"}
								id="password"
								autoComplete="new-password"
								value={form.password}
								onChange={onUpdateField}
								onBlur={onBlurField}
								InputProps={{
									// <-- This is where the toggle button is added.
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
											>
												{showPassword ? <Visibility /> : <VisibilityOff />}
											</IconButton>
										</InputAdornment>
									),
								}}
								error={errors.password.dirty && errors.password.error}
								helperText={
									errors.password.dirty &&
									errors.password.error &&
									errors.password.message
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								name="confirmPassword"
								label="Confirm Password"
								type={showConfirmPassword ? "text" : "password"}
								id="confirm-password"
								autoComplete="confirm-password"
								value={form.confirmPassword}
								onChange={onUpdateField}
								onBlur={onBlurField}
								InputProps={{
									// <-- This is where the toggle button is added.
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												aria-label="toggle password visibility"
												onClick={handleClickShowConfirmPassword}
												onMouseDown={handleMouseDownPassword}
											>
												{showConfirmPassword ? (
													<Visibility />
												) : (
													<VisibilityOff />
												)}
											</IconButton>
										</InputAdornment>
									),
								}}
								error={errors.confirmPassword.dirty && errors.confirmPassword.error}
								helperText={
									errors.confirmPassword.dirty &&
									errors.confirmPassword.error &&
									errors.confirmPassword.message
								}
							/>
						</Grid>
						{/* <Grid item xs={12}>
								<FormControlLabel
									control={<Checkbox value="allowExtraEmails" color="primary" />}
									label="I want to receive inspiration, marketing promotions and updates via email."
								/>
							</Grid> */}
					</Grid>
					<LoadingButton
						loading={isLoading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign Up
					</LoadingButton>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Link to="/">
								<Typography variant="body2">
									Already have an account? Sign in
								</Typography>
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	);
}
