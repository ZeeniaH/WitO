import React, { useEffect } from "react";
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
import { useState } from "react";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useRef } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { IconButton, InputAdornment } from "@mui/material";
import { useLoginFormValidator } from "./hooks/useLoginFormValidator";
import Notification from "../../utils/notification/Notification";
import { useAuthContext } from "hooks/useAuthContext";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

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

export default function Login() {
	const [form, setForm] = useState({
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState();
	const [isLoading, setIsLoading] = useState(false);
	const [notificationKey, setNotificationKey] = useState("");
	// const { login, isLoading, error } = useLogin();
	const reduxDispatch = useDispatch();

	const { errors, validateForm, onBlurField } = useLoginFormValidator(form);

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
	const handleMouseDownPassword = (event) => {
		event.preventDefault();
	};
	const navigate = useNavigate();

	const { dispatch } = useAuthContext();

	const handleLogin = async (e) => {
		e.preventDefault();
		reduxDispatch(setLoading(true));
		setIsLoading(true);
		const { isValid } = validateForm({ form, errors, forceTouchErrors: true });
		if (!isValid) return;
		// await login(form.email, form.password);
		// debugger;
		// !error && navigate(redirectedPath, { replace: true });

		const { email, password } = form;
		const response = await fetch(`${BASE_URL}/auth/login`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const json = await response.json();
		if (!response.ok) {
			setIsLoading(false);
			setError(json.message);
			setNotificationKey(Math.random());
		}
		if (response.ok) {
			// set user to local Storage
			localStorage.setItem("user", JSON.stringify(json));

			// update the auth context
			dispatch({ type: "LOGIN", payload: json });

			// update loading state
			setIsLoading(false);
			navigate("/dashboard/default");
		}
		reduxDispatch(setLoading(false));
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
					Sign in
				</Typography>
				<Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
					{error && <Notification msg={error} key={notificationKey} type="error" />}
					<TextField
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						onChange={onUpdateField}
						onBlur={onBlurField}
						value={form.email}
						error={errors.email.dirty && errors.email.error}
						helperText={
							errors.email.dirty && errors.email.error && errors.email.message
						}
					/>
					<TextField
						required
						fullWidth
						name="password"
						label="Password"
						type={showPassword ? "text" : "password"}
						id="password"
						autoComplete="password"
						onChange={onUpdateField}
						onBlur={onBlurField}
						value={form.password}
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
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<LoadingButton
						loading={isLoading}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</LoadingButton>
					<Grid container>
						<Grid item xs>
							{/* <Link href="#" variant="body2">
								Forgot password?
							</Link> */}
						</Grid>
						<Grid item>
							<Link to="/signup">
								<Typography variant="body2">
									{"Don't have an account? Sign Up"}
								</Typography>
							</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}
