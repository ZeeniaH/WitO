import styles from "./companies.module.scss";
import { Box } from "@mui/system";
import { Button, Container, Grid } from "@mui/material";
import data from "../data.json";
import SlideToggle from "react-slide-toggle";

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

import { useCompanyContext } from "../../hooks/useCompanyContext";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";

function Companies() {
	const user = JSON.parse(localStorage.getItem("user"));
	const { company, dispatch } = useCompanyContext();
	const reduxDispatch = useDispatch();

	useEffect(() => {
		const fetchCompanies = async () => {
			reduxDispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/company/`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();

			if (response.ok) {
				// setCompanies(json);
				dispatch({ type: "SET_COMPANIES", payload: json });
			}
			reduxDispatch(setLoading(true));
		};
		fetchCompanies();
	}, [dispatch]);

	return (
		<>
			<Container maxWidth="lg">
				<Box className={styles.companySection}>
					<Box className={styles.companyHeading}>
						<Box component={"h1"}>Companies</Box>
						<Box className={styles.addCompanyButton}>
							<Link to="/addCompany">
								<Button variant="outlined">Add New Company</Button>
							</Link>
						</Box>
					</Box>
				</Box>
				<Grid sx={{ pb: "60px" }} container spacing={2}>
					{data.map((item, index) => {
						return (
							<Grid item md={3} xs={6} key={index}>
								<Box className={styles.companyBox}>
									<SlideToggle
										collapsed
										duration={800}
										render={({ toggle, setCollapsibleElement, progress }) => (
											<>
												<Box
													className={styles.companyContent}
													onClick={toggle}
												>
													<Box className={styles.companyImage}>
														<img
															src={item.image}
															alt="Company One"
														></img>
													</Box>
													<Box className={styles.companyTitle}>
														<Box component={"h2"}>{item.title}</Box>
													</Box>
												</Box>
												<Box
													className={styles.dropDownMenu}
													ref={setCollapsibleElement}
												>
													<ul>
														<li>
															<Link to="/home/vehicle-list">
																Vehicles
															</Link>
														</li>
														<li>
															<Link to="/home/worker-list">
																Workers
															</Link>
														</li>
														<li>
															<Link to="/home/appointments-list">
																Appointments
															</Link>
														</li>
														<li>
															<Link to="/home/calendar">
																Calendar
															</Link>
														</li>
														<li>
															<Link to="/home/archive">Archive</Link>
														</li>
													</ul>
												</Box>
											</>
										)}
									/>
								</Box>
							</Grid>
						);
					})}
				</Grid>
			</Container>
		</>
	);
}

export default Companies;
