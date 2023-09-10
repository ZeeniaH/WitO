import React, { useEffect, useState } from "react";
import { Box, Button, Container, Grid } from "@mui/material";
import styles from "./vehicleDetails.module.scss";
import BusinessIcon from "@mui/icons-material/Business";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import Header from "../../Header";
import VehicleAsideBar from "../VehicleAsideBar";
import Slide from "@mui/material/Slide";
import { useParams } from "react-router-dom";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import moment from "moment";
import pdfIcon from "../VehicleForm/pdf-icon.png";
import imageIcon from "../VehicleForm/image-icon.png";
import fileIcon from "../VehicleForm/file-icon.png";
import { useTranslation } from 'react-i18next';
import useGoBack from '../../../hooks/useGoBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function Index() {
	const [vehicle, setVehicle] = useState({});
	const params = useParams();
	const dispatch = useDispatch();
	const user = JSON.parse(localStorage.getItem("user"));
	const { t } = useTranslation();

	useEffect(() => {
		const fetchVehicle = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/vehicle/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			console.log(json);
			if (response.ok) {
				setVehicle(json);
			}
			dispatch(setLoading(false));
		};
		fetchVehicle();
	}, []);

	const getFileIcon = (downloadDocumentUrl) => {
		const fileExtension = downloadDocumentUrl
			.split(".")
			.pop()
			.toLowerCase()
			.replace(/[^a-z0-9]/g, "")
			.split("altmedia")[0]; // Extract only the "pdf" part

		// Add additional file types and corresponding image files as needed
		if (fileExtension === "pdf") {
			return <img src={pdfIcon} alt="PDF" width="100" />;
		} else if (["jpg", "jpeg", "png", "gif"].includes(fileExtension)) {
			return <img src={imageIcon} alt="Image" width="100" />;
		} else {
			return <img src={fileIcon} alt="File" width="100" />;
		}
	};

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
					}}
				>
					<VehicleAsideBar companyId={vehicle.companyId} />
				</Grid>
				<Grid item xs>
					<Container
						sx={{
							paddingLeft: {
								xs: "80px",
								md: "16px",
							},
						}}
					>
						<Box className={styles.vehiclesDetailsSection}>
							<Box>
								<Button
									sx={{ fontSize: "12px", mt: "15px" }}
									variant="outlined"
									onClick={useGoBack}
									startIcon={<ArrowBackIcon />}
								>
									{t('Back')}
								</Button>
							</Box>
							<Box className={styles.vehicleHeading} component={"h1"}>
								{t('Vehicle Details')}
							</Box>
							<Grid container spacing={2}>
								<Grid item md={6} xs={12}>
									<Box className={styles.vehicleBox}>
										<Box className={styles.vehicleBoxContent}>
											<Grid
												className={styles.mobileResponsive}
												container
												spacing={2}
											>
												<Grid item md={"auto"}>
													<Box>
														<Box className={styles.vehicleBoxImage}>
															<a
																href={vehicle?.companyLogo}
																download="Company Logo"
																target="_blank"
																rel="noreferrer"
															>
																<img
																	src={vehicle?.companyLogo}
																	alt="images"
																></img>
															</a>
														</Box>
													</Box>
												</Grid>
												<Grid item className={styles.vehicleBoxTitle} md>
													<Box>
														<BusinessIcon />
													</Box>
													<Box component={"h3"}>
														{vehicle.selectCompany}
													</Box>
												</Grid>
											</Grid>
										</Box>
									</Box>
								</Grid>
								<Grid item md={6} xs={12}>
									<Box className={styles.vehicleBox}>
										<Box className={styles.vehicleBoxContent}>
											<Grid
												className={styles.mobileResponsive}
												container
												spacing={2}
											>
												<Grid item md={"auto"}>
													<Box>
														<Box className={styles.vehicleBoxImage}>
															<a
																href={vehicle.carImage}
																download="vehicle"
																target="_blank"
																rel="noreferrer"
															>
																<img
																	src={vehicle.carImage}
																	alt="images"
																></img>
															</a>
														</Box>
													</Box>
												</Grid>
												<Grid item className={styles.vehicleBoxTitle} md>
													<Box>
														<DirectionsCarFilledIcon />
													</Box>
													<Box component={"h3"}>{vehicle.makeName}</Box>
												</Grid>
											</Grid>
										</Box>
									</Box>
								</Grid>
							</Grid>

							<Box className={`${styles.vehicleBox} ${styles.vehicleBoxTwo}`}>
								<Box component={"h4"}>{t('Other Details')}</Box>
								<Grid container spacing={2}>
									<Grid item md={6}>
										<Box className={styles.vehicleBoxTwoContent}>
											<table>
												<tbody>
													<tr>
														<th>{t('Model')}</th>
														<td>{vehicle.model}</td>
													</tr>
													<tr className={styles.spacer}></tr>
													<tr>
														<th>{t('License Plate')}</th>
														<td>{vehicle.licensePlate}</td>
													</tr>
													<tr className={styles.spacer}></tr>
													<tr>
														<th>{t('Registered City')}</th>
														<td>{vehicle.registeredCity}</td>
													</tr>
													<tr className={styles.spacer}></tr>
													<tr>
														<th>{t('Vehicle Identification Number')}</th>
														<td>{vehicle.vehicleIdentificationNumber}</td>
													</tr>
													<tr className={styles.spacer}></tr>
													<tr>
														<th>{t('First Registration Date')}</th>
														<td>{moment(vehicle.firstRegistrationDate).format("DD-MM-YYYY")}</td>
													</tr>
												</tbody>
											</table>
										</Box>
									</Grid>
									<Grid item md={6}>
										<Box className={styles.vehicleBoxTwoContent}>
											<table>
												<tbody>
													<tr>
														<th>{t('Color')}</th>
														<td>{vehicle.color}</td>
													</tr>
													<tr className={styles.spacer}></tr>
													<tr>
														<th>{t('Insurance')}</th>
														<td>{vehicle.insurance}</td>
													</tr>
													<tr className={styles.spacer}></tr>
													<tr>
														<th>{t('Policy Number')}</th>
														<td>{vehicle.policyNumber}</td>
													</tr>
													<tr className={styles.spacer}></tr>
													<tr>
														<th>{t('Fuel')}</th>
														<td>{vehicle.fuel}</td>
													</tr>
												</tbody>
											</table>
										</Box>
									</Grid>

									<Grid item md={12}>
										<Box className={styles.vehicleBoxTwoContent}>
											<table>
												<tbody>
													<tr>
														<th>{t('Damage Documentation')}</th>
														<td className={styles.carImages}>
															{vehicle.damageDocumentation &&
																vehicle.damageDocumentation.length > 0 &&
																vehicle.damageDocumentation.map(
																	(damageDocumentations, index) => (
																		<a
																			href={damageDocumentations}
																			key={index}
																			target="_blank"
																		>
																			<Box key={index} sx={{ mr: 2, mb: 2 }}>
																				{getFileIcon(damageDocumentations)}
																			</Box>
																		</a>
																	)
																)}
														</td>
													</tr>
												</tbody>
											</table>
										</Box>
									</Grid>
									<Grid item md={12}>
										<Box className={styles.vehicleBoxTwoContent}>
											<table>
												<tbody>
													<tr>
														<th>{t('Repair Pictures')}</th>
														<td className={styles.carImages}>
															{vehicle.repairPictures &&
																vehicle.repairPictures.length > 0 &&
																vehicle.repairPictures.map(
																	(repairPictures, index) => (
																		<a
																			href={repairPictures}
																			key={index}
																			target="_blank"
																		>
																			<img
																				src={repairPictures}
																				alt="images"
																			></img>
																		</a>
																	)
																)}
														</td>
													</tr>
												</tbody>
											</table>
										</Box>
									</Grid>
									<Grid item md={12}>
										<Box className={styles.vehicleBoxTwoContent}>
											<table>
												<tbody>
													<tr>
														<th>{t('Car Images')}</th>
														<td className={styles.carImages}>
															{vehicle.carImage &&
																vehicle.carImage.length > 0 &&
																vehicle.carImage.map(
																	(carImages, index) => (
																		<a
																			href={carImages}
																			key={index}
																			target="_blank"
																		>
																			<img
																				src={carImages}
																				alt="images"
																			></img>
																		</a>
																	)
																)}
														</td>
													</tr>
												</tbody>
											</table>
										</Box>
									</Grid>
									<Grid item md={12}>
										<Box className={styles.vehicleBoxTwoContent}>
											<table>
												<tbody>
													<tr>
														<th>{t('Damage Image/s')}</th>
														<td className={styles.carImages}>
															{vehicle.carDamageImages &&
																vehicle.carDamageImages.length >
																0 &&
																vehicle.carDamageImages.map(
																	(carDamageImage, index) => (
																		<a
																			href={carDamageImage}
																			key={index}
																			target="_blank"
																		>
																			<img
																				src={carDamageImage}
																				alt="images"
																			></img>
																		</a>
																	)
																)}
														</td>
													</tr>
												</tbody>
											</table>
										</Box>
									</Grid>
								</Grid>
								<Box className={styles.totalNumber}>
									<Grid container spacing={2}>
										<Grid item md={4} xs={12}>
											<Box className={styles.totalNumberContent}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="23"
													height="23"
													viewBox="0 0 23 23"
												>
													<g
														id="order_icon"
														data-name="order icon"
														transform="translate(0.167 0.333)"
													>
														<circle
															id="Ellipse_82"
															data-name="Ellipse 82"
															cx="11.5"
															cy="11.5"
															r="11.5"
															transform="translate(-0.167 -0.333)"
															fill="#07447c"
														></circle>
														<g
															id="noun_Number_2492089"
															transform="translate(4.898 4.898)"
														>
															<g
																id="Group_393"
																data-name="Group 393"
																transform="translate(0 0)"
															>
																<path
																	id="Path_2199"
																	data-name="Path 2199"
																	d="M12.139,9.823H16.33L16.9,7.535a.706.706,0,1,1,1.369.342l-.487,1.946H19a.706.706,0,0,1,0,1.412H17.432l-1.059,4.235H19a.706.706,0,0,1,0,1.412H16.02l-.572,2.288a.706.706,0,0,1-1.369-.342l.487-1.946H10.374L9.8,19.169a.706.706,0,0,1-1.369-.342l.487-1.946H7.706a.706.706,0,1,1,0-1.412H9.272l1.059-4.235H7.706a.706.706,0,1,1,0-1.412h2.978l.572-2.288a.706.706,0,0,1,1.369.342Zm-.353,1.412-1.059,4.235h4.191l1.059-4.235Z"
																	transform="translate(-7 -7)"
																	fill="#f6f8fa"
																></path>
															</g>
														</g>
													</g>
												</svg>
												<h2>{vehicle.mileage}</h2>
												<span>{t('Mileage')}</span>
											</Box>
										</Grid>
										<Grid item md={4} xs={12}>
											<Box className={styles.totalNumberContent}>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="23"
													height="23"
													viewBox="0 0 23 23"
												>
													<g
														id="order_icon"
														data-name="order icon"
														transform="translate(0.167 0.333)"
													>
														<circle
															id="Ellipse_82"
															data-name="Ellipse 82"
															cx="11.5"
															cy="11.5"
															r="11.5"
															transform="translate(-0.167 -0.333)"
															fill="#07447c"
														></circle>
														<g
															id="noun_Number_2492089"
															transform="translate(4.898 4.898)"
														>
															<g
																id="Group_393"
																data-name="Group 393"
																transform="translate(0 0)"
															>
																<path
																	id="Path_2199"
																	data-name="Path 2199"
																	d="M12.139,9.823H16.33L16.9,7.535a.706.706,0,1,1,1.369.342l-.487,1.946H19a.706.706,0,0,1,0,1.412H17.432l-1.059,4.235H19a.706.706,0,0,1,0,1.412H16.02l-.572,2.288a.706.706,0,0,1-1.369-.342l.487-1.946H10.374L9.8,19.169a.706.706,0,0,1-1.369-.342l.487-1.946H7.706a.706.706,0,1,1,0-1.412H9.272l1.059-4.235H7.706a.706.706,0,1,1,0-1.412h2.978l.572-2.288a.706.706,0,0,1,1.369.342Zm-.353,1.412-1.059,4.235h4.191l1.059-4.235Z"
																	transform="translate(-7 -7)"
																	fill="#f6f8fa"
																></path>
															</g>
														</g>
													</g>
												</svg>
												<h2>{vehicle.lastMaintenanceMileage ? vehicle.lastMaintenanceMileage : "-"}</h2>
												<span>{t('Last maintenance mileage')}</span>
											</Box>
										</Grid>
									</Grid>
								</Box>
							</Box>
						</Box>
					</Container>
				</Grid>
			</Grid>
		</>
	);
}

export default Index;
