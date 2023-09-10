import React from "react";
import { Link } from "react-router-dom";
import { Box, Grid, Button } from "../../../../../node_modules/@mui/material/index.js";
import CreateFile from "../../CreateFile/index.js";
import CreateFolder from "../../CreateFolder/index.js";
import ScanFile from "../../ScanFile/index.js";
import UploadFile from "../../UploadFile/index.js";
import BreadCrum from "../BreadCrum.js";

import ReceiptIcon from "@mui/icons-material/Receipt";

const SubNav = ({ currentFolder }) => {
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
												<ScanFile currentFolder={currentFolder} />
											</Box>
											<Box sx={{ mr: 2, mb: 2 }}>
												<UploadFile currentFolder={currentFolder} />
											</Box>
											<Box sx={{ mr: 2, mb: 2 }}>
												<CreateFolder currentFolder={currentFolder} />
											</Box>
											<Link
												style={{ textDecoration: "none" }}
												to={"/home/invoice"}
											>
												<Button
													startIcon={<ReceiptIcon />}
													sx={{
														color: "#000",
														border: "1px solid",
														fontSize: "12px",
													}}
													variant="outlined"
												>
													Manual Invoice
												</Button>
											</Link>
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
										<Box component={"p"}>Root</Box>
									</Box>
									<Box sx={{ display: "flex", flexWrap: "wrap" }}>
										<Box sx={{ mr: 2, mb: 2 }}>
											<ScanFile currentFolder={currentFolder} />
										</Box>
										<Box sx={{ mr: 2, mb: 2 }}>
											<UploadFile currentFolder={currentFolder} />
										</Box>
										<Box sx={{ mr: 2, mb: 2 }}>
											<CreateFolder currentFolder={currentFolder} />
										</Box>
										<Link
											style={{ textDecoration: "none" }}
											to={"/home/invoice"}
										>
											<Button
												startIcon={<ReceiptIcon />}
												sx={{
													color: "#000",
													border: "1px solid",
													fontSize: "12px",
												}}
												variant="outlined"
											>
												Manual Invoice
											</Button>
										</Link>
									</Box>
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
