import React, { useEffect } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	TextField,
	InputAdornment,
	SvgIcon,
	Typography,
} from "@mui/material";
import { Search as SearchIcon } from "../../icons/search";
import { Upload as UploadIcon } from "../../icons/upload";
import { Download as DownloadIcon } from "../../icons/download";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../hooks/useGoBack';



export const WorkersListToolbar = ({ setWorkerQuery, id }) => {
	const user = JSON.parse(localStorage.getItem("user"));
	const { t } = useTranslation();

	useEffect(() => {
		// Update localStorage when user changes
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);

	const isBookKeeper = user?.user?.role !== "BookKeeper";

	return (
		<Box>
			<Button
				sx={{ fontSize: "12px", mb: "10px" }}
				variant="outlined"
				onClick={useGoBack}
				startIcon={<ArrowBackIcon />}
			>
				{t('Back')}
			</Button>
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
					m: -1,
				}}
			>
				<Typography sx={{ m: 1 }} variant="h4">
					{t('Workers')}
				</Typography>
				<Box sx={{ m: 1 }}>
					{/* <Link to={`/dashboard/add-worker/${id}`} style={{ textDecoration: "none" }}>
						<Button color="primary" variant="contained">
							Add New Worker
						</Button>
					</Link> */}
				</Box>
			</Box>
			<Box sx={{ mt: 3 }}>
				<Card>
					<CardContent>
						<Box sx={{ maxWidth: 500 }}>
							<TextField
								fullWidth
								InputProps={{
									startAdornment: (
										<InputAdornment position="start">
											<SvgIcon color="action" fontSize="small">
												<SearchIcon />
											</SvgIcon>
										</InputAdornment>
									),
								}}
								placeholder={t("Search By Worker Name")}
								variant="outlined"
								onChange={(e) => setWorkerQuery(e.target.value)}
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};
