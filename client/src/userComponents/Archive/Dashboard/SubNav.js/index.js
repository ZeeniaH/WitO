import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Grid, Button } from "@mui/material";
import CreateFile from "../../CreateFile/index.js";
import CreateFolder from "../../CreateFolder/index.js";
import ScanFile from "../../ScanFile/index.js";
import UploadFile from "../../UploadFile/index.js";
import BreadCrum from "../BreadCrum.js";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { useTranslation } from 'react-i18next';

const SubNav = ({ currentFolder, companyId }) => {
	const { t } = useTranslation();
	const params = useParams();

	const user = JSON.parse(localStorage.getItem('user'));
	const isCompanyOwner = user?.user?.role === "CompanyOwner";
	const isRootFolder = currentFolder === "root folder";

	// console.log("currentFolder", currentFolder)

	return (
		<>
			<Box sx={{ pt: "20px" }}>
				<Grid container spacing={2}>
					<Grid
						item
						md={12}
						style={{
							display: "flex",
							alignItems: "center",
							px: "10px",
							pt: "10px",
							justifyContent: "space-between",
						}}
					>
						{currentFolder && currentFolder !== "root folder" ? (
							<>
								<Box
									sx={{
										display: {
											md: "flex",
											xs: "block",
										},
										justifyContent: "space-between",
										width: "100%",
										px: "15px",
									}}
								>
									<BreadCrum currentFolder={currentFolder} />
									{currentFolder.data.createdBy !== "admin" && (
										<Box sx={{ display: "flex", flexWrap: "wrap" }}>
											<Box sx={{ mr: 2, mb: 2 }}>
												<ScanFile currentFolder={currentFolder} companyId={companyId} />
											</Box>
											<Box sx={{ mr: 2, mb: 2 }}>
												<UploadFile currentFolder={currentFolder} companyId={companyId} />
											</Box>
											{
												isCompanyOwner && currentFolder.data.path.length == "9" ? "" : <Box sx={{ mr: 2, mb: 2 }}>
													<CreateFolder currentFolder={currentFolder} companyId={params.companyId} />
												</Box>
											}
										</Box>
									)}
								</Box>
							</>
						) : (
							<>
								<Box
									sx={{
										display: {
											md: "flex",
											xs: "block",
										},
										justifyContent: "space-between",
										width: "100%",
										px: "15px",
									}}
								>
									<Box>
										<Box component={"p"}>{t('Root')}</Box>
									</Box>
									{currentFolder && isRootFolder && (
										<Box sx={{ display: "flex", flexWrap: "wrap" }}>
											{
												isCompanyOwner ? <>
													<Box sx={{ mr: 2, mb: 2 }}>
														<ScanFile currentFolder={currentFolder} companyId={companyId} />
													</Box>
													<Box sx={{ mr: 2, mb: 2 }}>
														<UploadFile currentFolder={currentFolder} companyId={companyId} />
													</Box>
													<Box sx={{ mr: 2, mb: 2 }}>
														<CreateFolder currentFolder={currentFolder} companyId={companyId} />
													</Box>
													<Link
														style={{ textDecoration: "none" }}
														to={`/home/invoice/${companyId}`}
													>
														<Button
															startIcon={<ReceiptIcon />}
															sx={{
																color: "#7206ef",
																border: "1px solid",
																fontSize: "12px",
															}}
															variant="outlined"
														>
															{t('Manual Invoice')}
														</Button>
													</Link></> : <Link
														style={{ textDecoration: "none" }}
														to={`/home/invoice/${companyId}`}
													>
													<Button
														startIcon={<ReceiptIcon />}
														sx={{
															color: "#7206ef",
															border: "1px solid",
															fontSize: "12px",
														}}
														variant="outlined"
													>
														{t('Manual Invoice')}
													</Button>
												</Link>
											}
										</Box>
									)}
								</Box>
							</>
						)}
					</Grid>
				</Grid>
			</Box>
		</>
	);
};

export default SubNav;