import React from "react";
import { useNavigate } from "react-router-dom";
import { userFileDataUpdate } from "redux/actionCreators/filefoldersActionCreators";
import { useDispatch } from "react-redux";
import { Box, Button, Grid } from "../../../../../node_modules/@mui/material/index";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Header = ({ data, prevData, currentFile, setPrevData, setData }) => {
	const navigate = useNavigate();

	const dispatch = useDispatch();
	const pushItBack = () => {
		if (data.trim() !== prevData.trim()) {
			if (window.confirm("are your sure to leave without saving data?")) {
				navigate(
					currentFile.data.parent === ""
						? "/home/archive"
						: `home/archive/folder/${currentFile.data.parent}`
				);
			} else {
				return;
			}
		} else {
			navigate(
				currentFile.data.parent === ""
					? "/home/archive"
					: `/home/archive/folder/${currentFile.data.parent}`
			);
		}
	};
	const saveFile = () => {
		setData(data + "\n");
		setPrevData(data.trim());
		dispatch(userFileDataUpdate(data.trim(), currentFile.docId));
	};

	return (
		<Box sx={{ px: "10px", display: "flex", alignItems: "center", borderBottom: "1px solid #DEE2E6", mb: "10px", justifyContent: "space-between", py: "10px", pt: "10px" }} >
			<Grid style={{ display: "flex", justifyContent: "space-around" }} container spacing={2}>
				<Grid item xs={12} md={5} >
					<Box component={"h5"} sx={{
						textAlign: {
							md: "unset",
							xs: "center"
						}
					}}>
						{currentFile.data.name}
						{data.trim() !== prevData.trim() && " [* . Modified]"}
					</Box>
				</Grid>
				<Grid item sx={12} md={5}>
					<Box sx={{ display: "flex", justifyContent: "end" }}>
						<Box>

							<Button variant="outlined"
								disabled={data.trim() === prevData.trim()}
								onClick={() => saveFile()} startIcon={<SaveIcon />}>
								Save
							</Button>
						</Box>


						<Box sx={{ ml: "5px" }}>
							<Button variant="outlined"
								onClick={() => pushItBack()} startIcon={<ArrowBackIcon />}>
								Go Back
							</Button>
						</Box>

					</Box>
				</Grid>
			</Grid>


		</Box>
	);
};

export default Header;
