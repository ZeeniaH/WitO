import { BASE_URL } from "config";
import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

export const useRegister = () => {
	const [isLoading, setIsLoading] = useState(null);
	const [error, setError] = useState(null);
	const { dispatch } = useAuthContext();
	const reduxDispatch = useDispatch();

	const register = async (name, email, password) => {
		reduxDispatch(setLoading(true));
		setIsLoading(true);
		setError(null);
		const response = await fetch(`${BASE_URL}/auth/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});
		const json = await response.json();
		if (!response.ok) {
			setIsLoading(false);
			setError(json.message);
		}
		if (response.ok) {
			// set user to local Storage
			localStorage.setItem("user", JSON.stringify(json));

			dispatch({ type: "LOGIN", payload: json });

			// update loading state
			setIsLoading(false);
		}
		reduxDispatch(setLoading(false));
	};

	return { register, isLoading, error };
};
