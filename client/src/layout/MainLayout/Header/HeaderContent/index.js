// material-ui
import { Box, IconButton, Link, useMediaQuery, Select, MenuItem } from "@mui/material";
import { GithubOutlined } from "@ant-design/icons";

import { useTranslation } from 'react-i18next';

// project import
import Search from "./Search";
import Profile from "./Profile";
import Notification from "./Notification";
import MobileSection from "./MobileSection";

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
	const matchesXs = useMediaQuery((theme) => theme.breakpoints.down("md"));
	const { t, i18n } = useTranslation();


	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('selectedLanguage', lng); // Store the selected language in local storage
	};
	return (
		<>
			{/* {!matchesXs && <Search />} */}
			{!matchesXs && <Box sx={{ width: "100%" }}></Box>}

			{matchesXs && <Box sx={{ width: "100%", ml: 1 }} />}
			<Box sx={{ marginRight: "10px" }}>
				<Select
					sx={{ color: "#000", borderColor: "unset" }}
					value={i18n.language}
					onChange={(event) => changeLanguage(event.target.value)}
					inputProps={{
						'aria-label': 'language-select',
					}}
				>
					<MenuItem value="de">
						<img
							src="/images/germany.png"
							alt="Germany"
							style={{ width: "20px", height: "auto", marginRight: "5px" }}
						/>
						de
					</MenuItem>
					<MenuItem value="en">
						<img
							src="/images/england.png"
							alt="England"
							style={{ width: "20px", height: "auto", marginRight: "5px" }}
						/>
						en
					</MenuItem>
				</Select>
			</Box>
			<Notification />
			{!matchesXs && <Profile />}
			{matchesXs && <MobileSection />}
		</>
	);
};

export default HeaderContent;
