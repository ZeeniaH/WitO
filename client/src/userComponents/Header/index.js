import * as React from "react";
import AppBar from "@mui/material/AppBar";
import { Avatar, Box, Button, Divider, IconButton, Menu, MenuItem, Select } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import Notification from "./Notification";
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import { BASE_URL } from "config";



function Index() {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const { t } = useTranslation();

	const user = JSON.parse(localStorage.getItem("user"));
	const navigate = useNavigate();
	const { logout } = useLogout();
	const params = useParams();

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	const { i18n } = useTranslation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		localStorage.setItem('selectedLanguage', lng); // Store the selected language in local storage
	};

	const manageSubscription = async () => {
		if (user.user.subscriptionId || params.sessionId) {
			let subscriptionId
			if (user.user.subscriptionId) {
				subscriptionId = user.user.subscriptionId
			} else if (params.sessionId) {
				// await fetch(`${BASE_URL}/stripe/checkout-session/cs_test_a1ZoUl5GHqzMJsxFCWqx54hBRRfXwNYKjd1f2MQ4ZquKSHYutMD1clrVlT`, {
				await fetch(`${BASE_URL}/stripe/checkout-session/${params.sessionId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				})
					.then((res) => res.json())
					.then(async (subscription) => {
						subscriptionId = subscription.subscription;
					});
			}
			if (subscriptionId) {
				await fetch(`${BASE_URL}/stripe/subscription/${subscriptionId}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.tokens.access.token}`,
					},
				})
					.then((res) => res.json())
					.then(async (subscription) => {
						console.log(subscription.customer);
						const customerId = subscription.customer;
						// status could be 'active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing'
						console.log(`Subscription status: ${subscription.status}`);
						let body = {
							customer: customerId,
							return_url: window.location.href,

						};
						// if (subscription.status === "active") {
						// 	userr = {
						// 		isSubscribed: true,
						// 		subscriptionId: subscriptionId,
						// 		planType: subscription.items.data[0].plan.product.metadata.plan_type,
						// 	};
						// } else {
						// 	userr = {
						// 		isSubscribed: false,
						// 		subscriptionId: '',
						// 		planType: '',
						// 	};
						// }
						// if (user.user.isSubscribed !== userr.isSubscribed) {
						const response = await fetch(`${BASE_URL}/stripe/create-customer-portal-session`, {
							method: "POST",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${user.tokens.access.token}`,
							},
							body: JSON.stringify(body),
						});
						const json = await response.json();

						if (!response.ok) {
						}
						if (response.ok) {
							window.location.replace(json.url);
						}
						// } else {
						// 	if (userr.isSubscribed) {
						// 		navigate("/home/default");
						// 	} else {
						// 		navigate("/home/pricing");
						// 	}
						// }

					});
			}
		}
	}

	return (
		<>
			<Box sx={{ flexGrow: 1 }}>
				<AppBar sx={{ backgroundColor: "#5e27ff" }} position="static">
					<Box sx={{ p: "10px 20px" }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<Box
								sx={{
									background: "#fff",
									width: "50px",
									height: "50px",
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
									borderRadius: "5px",
								}}
							>
								<Link to="/home/default">
									<img
										style={{ width: "30px" }}
										src={"/images/ios/60.png"}
										alt="images"
									></img>
								</Link>
							</Box>

							<Box
								sx={{
									display: "flex",
									alignItems: "center",
								}}
							>
								<Box sx={{ marginRight: "10px" }}>
									<Select
										sx={{ color: "#fff", borderColor: "unset" }}
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
								<IconButton
									size="large"
									aria-label="account of current user"
									aria-controls="menu-appbar"
									aria-haspopup="true"
									onClick={handleMenu}
									color="inherit"
									sx={{
										width: "unset",
										height: "unset",
									}}
								>
									<Avatar alt="profile user" src={user?.user?.avatar} sx={{ width: 32, height: 32 }} />
									<ExpandMoreIcon sx={{ alignSelf: "center" }} />
								</IconButton>
							</Box>
						</Box>
						<Menu
							id="menu-appbar"
							anchorEl={anchorEl}
							anchorOrigin={{
								vertical: "bottom",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical: "top",
								horizontal: "left",
							}}
							open={Boolean(anchorEl)}
							onClose={handleClose}
						>
							<Link
								style={{ color: "#000", textDecoration: "none" }}
								to="/home/user-profile"
							>
								<MenuItem>
									{t('Profile')}
								</MenuItem>
							</Link>
							<Divider />
							{
								user?.user?.role === "BookKeeper" &&
								<Link
									style={{ color: "#000", textDecoration: "none" }}
									to="/home/hire-request"
								>
									<MenuItem>
										{t('Hire Request')}
									</MenuItem>
								</Link>
							}
							{
								user?.user?.role === "BookKeeper" &&
								<Link
									style={{ color: "#000", textDecoration: "none" }}
									to="/home/manage-companies"
								>
									<MenuItem>
										{t('Manage Companies')}
									</MenuItem>
								</Link>
							}
							{
								user?.user?.role === "CompanyOwner" ?
									<><MenuItem onClick={manageSubscription}>
										{t('Price Plans')}
									</MenuItem>
									</>
									: ""
							}
							<MenuItem onClick={handleLogout}>{t('Logout')}</MenuItem>
						</Menu>
					</Box>
				</AppBar>
			</Box>
		</>
	);
}

export default Index;
