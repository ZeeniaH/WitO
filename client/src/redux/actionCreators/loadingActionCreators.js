import { SET_LOADING } from "../actions/loadingActions";

export const setLoading = (isLoading) => ({
	type: SET_LOADING,
	payload: isLoading,
});
