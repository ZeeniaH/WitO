export const nameValidator = (name) => {
	if (!name) {
		return "Name is required";
	} else if (name.length > 30) {
		return "Password must have a maximum 30 characters";
	}
	return "";
};
export const emailValidator = (email) => {
	if (!email) {
		return "Email is required";
	} else if (!new RegExp(/\S+@\S+\.\S+/).test(email)) {
		return "Incorrect email format";
	}
	return "";
};

export const passwordValidator = (password) => {
	if (!password) {
		return "Password is required";
	} else if (password.length < 8) {
		return "Password must have a minimum 8 characters";
	} else if (!new RegExp(/\d/).test(password) || !new RegExp(/[a-zA-Z]/).test(password)) {
		return "password must contain at least 1 letter and 1 number";
	}
	return "";
};
export const confirmPasswordValidator = (confirmPassword, form) => {
	if (!confirmPassword) {
		return "Confirm password is required";
	} else if (confirmPassword.length < 8) {
		return "Confirm password must have a minimum 8 characters";
	} else if (confirmPassword !== form.password) {
		return "Passwords do not match";
	}
	return "";
};
