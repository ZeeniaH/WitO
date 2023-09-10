import { SET_LOADING } from "../actions/loadingActions";

const initialState = {
	isLoading: false,
};

const loadingReducer = (state = initialState, { type, payload }) => {
	switch (type) {
		case SET_LOADING:
			state = { ...state, isLoading: payload };
			return state;
		default:
			return state;
	}
};
export default loadingReducer;
