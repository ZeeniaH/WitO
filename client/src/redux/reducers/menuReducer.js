import {
    SET_ACTIVE_ITEM,
    SET_ACTIVE_COMPONENT,
    SET_OPEN_DRAWER,
    SET_OPEN_COMPONENT_DRAWER,
} from "../actions/menuActions";

// initial state
const initialState = {
    openItem: ["dashboard"],
    openComponent: "buttons",
    drawerOpen: false,
    componentDrawerOpen: true,
};

// ==============================|| SLICE - MENU ||============================== //

const menu = (state = initialState, { type, payload }) => {
    switch (type) {
        case SET_ACTIVE_ITEM:
            state = { ...state, openItem: payload };
            return state;
        case SET_ACTIVE_COMPONENT:
            state = { ...state, openComponent: payload };
            return state;
        case SET_OPEN_DRAWER:
            state = { ...state, drawerOpen: payload };
            return state;
        case SET_OPEN_COMPONENT_DRAWER:
            state = { ...state, componentDrawerOpen: payload };
            return state;
        default:
            return state;
    }
};
export default menu;