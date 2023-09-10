import {
    SET_ACTIVE_ITEM,
    SET_ACTIVE_COMPONENT,
    SET_OPEN_DRAWER,
    SET_OPEN_COMPONENT_DRAWER,
} from "../actions/menuActions";

const activeItem = (data) => ({
    type: SET_ACTIVE_ITEM,
    payload: data,
});

const activeComponent = (data) => ({
    type: SET_ACTIVE_COMPONENT,
    payload: data,
});

const openDrawer = (data) => ({
    type: SET_OPEN_DRAWER,
    payload: data,
});

const openComponentDrawer = (data) => ({
    type: SET_OPEN_COMPONENT_DRAWER,
    payload: data,
});

export const setActiveItem = (data) => (dispatch) => {
    dispatch(activeItem(data));
};

export const setActiveComponent = (data) => (dispatch) => {
    dispatch(activeComponent(data));
};

export const setOpenDrawer = (data) => (dispatch) => {
    dispatch(openDrawer(data));
};

export const setOpenComponentDrawer = (data) => (dispatch) => {
    dispatch(openComponentDrawer(data));
};