import { toast } from "react-toastify";
import { database } from "../../API/firebase";
import docModel from "../../models/docs";
import fileModel from "../../models/files";
import firebase from "firebase/app";
import {
    SET_LOADING,
    SET_ADMIN_FILES,
    SET_ADMIN_FOLDERS,
    SET_USER_FOLDERS,
    ADD_USER_FOLDER,
    SET_USER_FILES,
    ADD_USER_FILE,
    UPDATE_USER_FILE_DATA,
} from "../actions/filefoldersActions";

const setLoading = (data) => ({
    type: SET_LOADING,
    payload: data,
});
const setAdminFiles = (data) => ({
    type: SET_ADMIN_FILES,
    payload: data,
});
const setAdminFolders = (data) => ({
    type: SET_ADMIN_FOLDERS,
    payload: data,
});

export const getAdminFolders = () => (dispatch) => {
    dispatch(setLoading(true));

    database.docs
        .where("createdBy", "==", "admin")
        .get()
        .then((folders) => {
            const allFolders = [];
            folders.docs.forEach((doc) => {
                allFolders.push({ data: doc.data(), docId: doc.id });
            });
            dispatch(setAdminFolders(allFolders));
            dispatch(setLoading(false));
        })
        .catch((err) => {
            toast.error("Failed to fetch data!");
        });
};

export const getAdminFiles = () => (dispatch) => {
    database.files
        .where("createdBy", "==", "admin")
        .get()
        .then((files) => {
            const allFiles = [];
            files.docs.forEach((doc) => {
                allFiles.push({ data: doc.data(), docId: doc.id });
            });
            dispatch(setAdminFiles(allFiles));
        })
        .catch((err) => {
            toast.error("Failed to fetch data!");
        });
};

const setUserFolders = (data) => ({
    type: SET_USER_FOLDERS,
    payload: data,
});

export const getUserFolders = (userId, companyId) => async (dispatch) => {
    if (userId && companyId) {
        database.docs
            .where("createdBy", "==", userId)
            .where("companyId", "==", companyId) // Filter by companyId
            .get()
            .then((folders) => {
                const allFolders = [];
                folders.docs.forEach((doc) => {
                    allFolders.push({ data: doc.data(), docId: doc.id });
                });
                dispatch(setUserFolders(allFolders));
            })
            .catch((err) => {
                console.log("foldererr", err);
                toast.error("Failed to fetch data!");
            });
    }
};

const addUserFolder = (data) => ({
    type: ADD_USER_FOLDER,
    payload: data,
});
export const addFolderUser = (name, userId, parent, path, companyId) => (dispatch) => {
    database.docs
        .add(docModel(userId, companyId, name, path, parent)) // Pass companyId to docModel
        .then(async (doc) => {
            const data = await doc.get();
            dispatch(addUserFolder({ data: data.data(), docId: data.id }));
            toast.success("Folder added Successfully!");
        })
        .catch((err) => {
            console.log(err);
            toast.error("Something went wrong!");
        });
};

const setUserFiles = (data) => ({
    type: SET_USER_FILES,
    payload: data,
});

export const getUserFiles = (userId, companyId) => (dispatch) => {
    if (userId && companyId) {
        database.files
            .where("createdBy", "==", userId)
            .where("companyId", "==", companyId)
            .get()
            .then((files) => {
                const allFiles = [];
                files.docs.forEach((doc) => {
                    allFiles.push({ data: doc.data(), docId: doc.id });
                });
                dispatch(setUserFiles(allFiles));
            })
            .catch((err) => {
                console.log("foldererr", err);
                toast.error("Failed to fetch data!");
            });
    }
};

const addUserFile = (data) => ({
    type: ADD_USER_FILE,
    payload: data,
});

export const addFileUser = ({ uid, companyId, parent, data, name, url, path }) => async (dispatch) => {
    try {
        if (!companyId && parent) {
            const folderData = await database.docs.doc(parent).get();
            const folderCompanyId = folderData.get("companyId");
            if (!folderCompanyId) {
                throw new Error("Failed to fetch companyId from parent folder");
            }
            dispatch(addFileUser({ uid, companyId: folderCompanyId, parent, data, name, url, path })); // Retry the action with the companyId from parent folder
        } else {
            database.files
                .add(fileModel(uid, companyId, parent, data, name, url, path))
                .then(async (doc) => {
                    const data = await doc.get();
                    dispatch(addUserFile({ data: data.data(), docId: data.id }));
                    if (data.data().url === "") {
                        toast.success("File created Successfully!");
                        toast.success("You can double click on the file to open the editor!");
                    } else {
                        toast.success("File uploaded Successfully!");
                    }
                })
                .catch((err) => {
                    console.log(err);
                    toast.error("Something went wrong!");
                });
        }
    } catch (error) {
        console.log(error);
        toast.error("Failed to fetch companyId from parent folder!");
    }
};

const updateUserFileData = (data) => ({
    type: UPDATE_USER_FILE_DATA,
    payload: data,
});

export const userFileDataUpdate = (data, docId) => (dispatch) => {
    database.files
        .doc(docId)
        .update({
            updatedAt: new Date(),
            data: data,
        })
        .then(() => {
            dispatch(updateUserFileData({ data, docId }));
            toast.success("Saved Successfully!!");

            document.querySelector(".CodeMirror").focus();
        })
        .catch((err) => {
            console.log(err);
            toast.error("Something went wrong!");
        });
};

export const deleteFile = (documentId) => {
    return (dispatch, getState) => {
        dispatch(setLoading(true));

        const { userFiles } = getState().filefolders; // Get the current userFiles state
        const updatedFiles = userFiles.filter((file) => file.docId !== documentId); // Remove the deleted file from the state

        database.files
            .doc(documentId)
            .delete()
            .then(() => {
                dispatch(setLoading(false));
                dispatch(setUserFiles(updatedFiles)); // Update the Redux store with the updated files
                toast.success("File deleted Successfully!");
            })
            .catch((error) => {
                dispatch(setLoading(false));
                toast.error("Something went wrong!");
            });
    };
};

export const deleteFolder = (documentId) => {
    return async (dispatch, getState) => {
        dispatch(setLoading(true));

        const { userFolders } = getState().filefolders; // Get the current userFolders state
        const updatedFolders = userFolders.filter(
            (folder) => folder.docId !== documentId
        ); // Remove the deleted folder from the state

        try {
            await database.docs.doc(documentId).delete(); // Wait for the deletion operation to complete

            dispatch(setLoading(false));
            dispatch(setUserFolders(updatedFolders)); // Update the Redux store with the updated folders
            toast.success("Folder deleted Successfully!");
        } catch (error) {
            dispatch(setLoading(false));
            toast.error("Something went wrong!");
        }
    };
};
