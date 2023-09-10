// import Head from 'next/head';
import { Box, Container, Typography, Button } from "@mui/material";
// import { DashboardLayout } from '../components/dashboard-layout';
import { SettingsNotifications } from "../../components/settings/settings-notifications";
import { SettingsPassword } from "../../components/settings/settings-password";
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../hooks/useGoBack';


const settings = () => {
	const { t } = useTranslation();

	return (
		<>
			<Container maxWidth="lg">
				<Button
					sx={{ fontSize: "12px", mb: "10px" }}
					variant="outlined"
					onClick={useGoBack}
					startIcon={<ArrowBackIcon />}
				>
					{t('Back')}
				</Button>
				<Typography sx={{ mb: 3 }} variant="h4">
					{t('Settings')}
				</Typography>
				{/* <SettingsNotifications /> */}
				<Box sx={{ pt: 3 }}>
					<SettingsPassword />
				</Box>
			</Container>
		</>
	)
};

// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default settings;
