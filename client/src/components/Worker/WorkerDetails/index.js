import React, { useEffect, useState } from "react";
import { Backdrop, Box, Button, Container, Grid } from "@mui/material";
import styles from "./workerDetails.module.scss";
import BusinessIcon from "@mui/icons-material/Business";
import PersonIcon from "@mui/icons-material/Person";
import AsideBar from "../WorkerAsideBar";
import PopUpModal from "../../DeletePopUp";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Slide from "@mui/material/Slide";
import WorkerEditForm from "../WorkerEditForm";
import { useParams } from "react-router-dom";
import { BASE_URL } from "config";
import moment from "moment";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import { useTranslation } from 'react-i18next';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useGoBack from '../../../hooks/useGoBack';
import Tooltip from '@mui/material/Tooltip';


import pdfIcon from "../../Vehicle/VehicleForm/pdf-icon.png";
import imageIcon from "../../Vehicle/VehicleForm/image-icon.png";
import fileIcon from "../../Vehicle/VehicleForm/file-icon.png";

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

function Index() {
	const { t } = useTranslation();
	const [worker, setWorker] = useState({});
	const params = useParams();
	const dispatch = useDispatch();
	// const { user } = useAuthContext();
	const user = JSON.parse(localStorage.getItem("user"));

	useEffect(() => {
		const fetchWorker = async () => {
			dispatch(setLoading(true));
			const response = await fetch(`${BASE_URL}/worker/${params.id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				setWorker(json);
			}
			dispatch(setLoading(false));
		};
		fetchWorker();
	}, []);

	const getStatusColor = () => {
		if (worker.accountStatus === "approved") {
			return "#52c41a";
		}
		else if (worker.accountStatus === "denied") {
			return "#ff4d4f";
		} return "";
	};

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
			<Container>
				<Box className={styles.workerDetailsSection}>
					<Grid sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} container spacing={2}>
						<Grid item md={6} xs={12}>
							<Button
								sx={{ fontSize: "12px", mb: "10px" }}
								variant="outlined"
								onClick={useGoBack}
								startIcon={<ArrowBackIcon />}
							>
								{t('Back')}
							</Button>
							<Box className={styles.workerHeading} component={"h1"}>
								{t('Worker Details')}
							</Box>
						</Grid>
						<Grid item md={6} xs={12}>
							<Box
								className={styles.accountStatus}>
								<Box component={"h4"}>{t('Account Status')} :</Box>
								<Box sx={{ ml: "10px" }} component={"h6"} style={{ textTransform: "capitalize", backgroundColor: getStatusColor() }}> {worker.accountStatus}</Box>
							</Box>
						</Grid>
					</Grid>
					<Grid container spacing={2}>
						<Grid item md={6} xs={12}>
							<Box className={styles.workerBox}>
								<Box className={styles.workerBoxContent}>
									<Grid className={styles.mobileResponsive} container spacing={2}>
										<Grid item md={"auto"}>
											<Box>
												<Box className={styles.workerBoxImage}>
													<a
														href={worker?.companyLogo}
														download="Company Logo"
														target="_blank"
														rel="noreferrer"
													>
														<img
															src={worker?.companyLogo}
															alt="images"
														></img>
													</a>
												</Box>
											</Box>
										</Grid>
										<Grid item className={styles.workerBoxTitle} md>
											<Box>
												<BusinessIcon />
											</Box>
											<Box component={"h3"} my="0">
												{worker.selectCompany}
											</Box>
										</Grid>
									</Grid>
								</Box>
							</Box>
						</Grid>
						<Grid item md={6} xs={12}>
							<Box className={styles.workerBox}>
								<Box className={styles.workerBoxContent}>
									<Grid className={styles.mobileResponsive} container spacing={2}>
										<Grid item md={"auto"}>
											<Box>
												<Box className={styles.workerBoxImage}>
													<a
														href={worker.staffPicture}
														download="worker"
														target="_blank"
														rel="noreferrer"
													>
														<img
															src={worker.staffPicture}
															alt="images"
														></img>
													</a>
												</Box>
											</Box>
										</Grid>
										<Grid item className={styles.workerBoxTitle} md>
											<Box>
												<PersonIcon />
											</Box>
											<Box component={"h3"} my="0">
												{worker.firstName} {worker.lastName}
											</Box>
										</Grid>
									</Grid>
								</Box>
							</Box>
						</Grid>
					</Grid>

					<Box className={`${styles.workerBox} ${styles.workerBoxTwo}`}>
						<Box component={"h4"}>{t('Other Details')}</Box>
						<Grid container spacing={2}>
							<Grid item md={6}>
								<Box className={styles.workerBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('Personal Number')}</th>
												<td>{worker.personalNumber}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Phone Number')}</th>
												<td>{worker.phoneNumber}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Birth Date')}</th>
												<td>{moment(worker.dob).format("DD-MM-YYYY")}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Place of Birth')}</th>
												<td>{worker.placeOfBirth}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Nationalities')}</th>
												<td>
													{worker.nationalities &&
														worker.nationalities.length > 0 ? (
														worker.nationalities.map(
															(nationality, index) => (
																<Box component={"span"} key={index}>
																	{nationality}
																	{index !=
																		worker.nationalities
																			.length -
																		1 && ","}
																</Box>
															)
														)
													) : (
														<>N/A</>
													)}
												</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Street / Street No')}</th>
												<td>{worker.street}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('ZIP Code')}</th>
												<td>{worker.zip}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('City')}</th>
												<td>{worker.city}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Tax ID')}</th>
												<td>{worker.taxId}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Birth Name')}</th>
												<td>{worker.birthName}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
							<Grid item md={6}>
								<Box className={styles.workerBoxTwoContent}>
									<table>
										<tbody>
											<tr>
												<th>{t('Tax Class')}</th>
												<td>{worker.taxClass}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Social Security Number')}</th>
												<td>{worker.socialSecurityNumber}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Health Insurance')}</th>
												<td>{worker.healthInsurance}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Children, if so, how much')}</th>
												<td>{worker.children}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Name of the Bank')}</th>
												<td>{worker.nameOfBank}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('IBAN')}</th>
												<td>{worker.iban}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('BIC')}</th>
												<td>{worker.bic}</td>
											</tr>
											<tr className={styles.spacer}></tr>
											<tr>
												<th>{t('Contact E-mail')}</th>
												<td>{worker.email}</td>
											</tr>
										</tbody>
									</table>
								</Box>
							</Grid>
							<Grid item md={12}>
										<Box className={styles.workerBoxTwoContent}>
											<table>
												<tbody>
													<tr>
														<th>{t('Personal Data')}</th>
														<td className={styles.workerImages}>
															{worker.personalDataUpload &&
																worker.personalDataUpload.length > 0 &&
																worker.personalDataUpload.map(
																	(personalDataUploads, index) => {
																		// Split the URL at "?" to get the part before "?"
																		const urlParts = personalDataUploads.split("?");

																		// Split the part before "?" at "/documents%2F" to get the last segment
																		const segments = urlParts[0].split("/documents%2F");
																		let documentName = segments.pop(); // Extract the last segment

																		// Replace any %20 in the file name with a space
																		documentName = decodeURIComponent(documentName);

																		return (
																			<Box key={index} sx={{ mr: 2, mb: 2 }}>
																				<a href={personalDataUploads} target="_blank">
																					{getFileIcon(personalDataUploads)}
																				</a>
																				<Tooltip title={documentName} placement="top">
																					<Box sx={{
																						maxWidth: "70px",
																						overflow: "hidden",
																						textOverflow: "ellipsis",
																						whiteSpace: "nowrap"
																					}}
																					>
																						{documentName}
																					</Box>
																				</Tooltip>
																			</Box>
																		);
																	}
																)}
														</td>
													</tr>
												</tbody>
											</table>
										</Box>
									</Grid>
						</Grid>
					</Box>
				</Box>
			</Container>
		</>
	);
}

export default Index;
