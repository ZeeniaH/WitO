// import Head from 'next/head';
import { Box, Container, Typography, Grid } from "@mui/material";
// import { DashboardLayout } from '../components/dashboard-layout';
import { SettingsNotifications } from "../../userComponents/Profile/settings/settings-notifications";
import { SettingsPassword } from "../../userComponents/Profile/settings/settings-password";
import ProfileSideBar from "../../userComponents/Profile/ProfileSideBar";
import Header from "../../userComponents/Header";
import { useTranslation } from 'react-i18next';


const settings = () => {
	const { t } = useTranslation();

	return (
		<>
			<Header />
			<Grid position="relative" container spacing={2}>
				<Grid
					item
					xs={"auto"}
					sx={{
						position: {
							md: "static",
							xs: "absolute",
						},
						left: "0",
						top: "0",
						zIndex: "2",
						height: {
							xs: "100%",
							md: "unset",
						},
						'& .css-14eao2k-MuiDrawer-docked': {
							boxShadow: "none",
						}
					}}
				>
					<ProfileSideBar />
				</Grid>
				<Grid item xs>
					<Box sx={{
						p: {
							md: "20px 40px 40px 30px",
							xs: "20px 20px 20px 75px"
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
				</Grid>
			</Grid>
		</>
	)

};

// Page.getLayout = (page) => (
//   <DashboardLayout>
//     {page}
//   </DashboardLayout>
// );

export default settings; 