// import Head from 'next/head';
import { Box, Container, Typography, Grid } from "@mui/material";
// import { DashboardLayout } from '../components/dashboard-layout';
import { SettingsNotifications } from "../../pwaComponent/settings/settings-notifications";
import { SettingsPassword } from "../../pwaComponent/settings/settings-password";
import ProfileSideBar from "../../userComponents/Profile/ProfileSideBar";
import Layout from "../../pwa-layout";
import { useTranslation } from 'react-i18next';

const settings = () => {
	const { t } = useTranslation();
	return (
		<>
			<Layout />

			<Box sx={{
				p: {
					md: "20px 40px 40px 30px",
					xs: "20px 20px 20px 20px"
				}, height: "100vh",
			}} >
				<Typography sx={{ mb: 3 }} variant="h4">
					{t('Settings')}
				</Typography>
				{/* <SettingsNotifications /> */}
				<Box sx={{ pt: 3 }}>
					<SettingsPassword />
				</Box>
			</Box>

		</>
	);
}
// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default settings; 