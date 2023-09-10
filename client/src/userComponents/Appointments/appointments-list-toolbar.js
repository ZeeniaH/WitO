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

export const AppointmentsListToolbar = ({ setAppointmentQuery, companyId }) => {
	const { t } = useTranslation();

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
					{t('Appointments')}
				</Typography>
				<Box sx={{ m: 1 }}>
					<Link to={`/home/add-appointment/${companyId}`} style={{ textDecoration: "none" }}>
						<Button color="primary" variant="contained">
							{t('Add New Appointment')}
						</Button>
					</Link>
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
								placeholder={t('Search By Worker Name')}
								variant="outlined"
								onChange={(e) => setAppointmentQuery(e.target.value)}
							/>
						</Box>
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};
