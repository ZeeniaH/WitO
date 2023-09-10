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
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import useGoBack from '../../hooks/useGoBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const WorkerDataListToolbar = ({ setWorkerQuery, companyId }) => {
	const { t } = useTranslation();
	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(user));
	}, [user]);
	const isBookKeeper = user?.user?.role !== "BookKeeper";

	return (
		<Box>
			<Box>
				<Button
					sx={{ fontSize: "12px", mb: "10px" }}
					variant="outlined"
					onClick={useGoBack}
					startIcon={<ArrowBackIcon />}
				>
					{t('Back')}
				</Button>
			</Box>
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

				{isBookKeeper && (
					<Box sx={{ m: 1 }}>
						<Link to={`/home/add-worker/${companyId}`} style={{ textDecoration: "none" }}>
							<Button color="primary" variant="contained">
								{t('Add New Worker')}
							</Button>
						</Link>
					</Box>
				)}
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
		</Box >
	);
};

