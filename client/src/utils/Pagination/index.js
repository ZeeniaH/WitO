import React, { useEffect, useState } from "react";
import {
	Avatar,
	Box,
	Card,
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableFooter,
	TablePagination,
	TableRow,
	Typography,
	Button,
	Chip
} from "@mui/material";
import Actions from "./Actions";
import { getInitials } from "../getInitials";

function Pagination({ headings, data, moduleName, cellData, fetchData, navigateLayer, companyId, handleSelectDropdown, selectedDropdown }) {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<TableContainer component={Card}>
			<Table>
				<TableHead>
					<TableRow>
						{headings &&
							headings.length > 0 &&
							headings.map((heading, index) => (
								<TableCell
									key={index}
									align={heading.align ? heading.align : "left"}
								>
									{heading.title}
								</TableCell>
							))}
					</TableRow>
				</TableHead>
				<TableBody>
					{data && (data?.results?.length > 0 || data?.length > 0) ? (
						(rowsPerPage > 0
							? (data.results || data).slice(
								page * rowsPerPage,
								page * rowsPerPage + rowsPerPage
							)
							: (data.results || data)
						).map((item, index) => (
							<TableRow hover key={index}>
								{cellData &&
									cellData.length > 0 &&
									cellData.map((cellItem, index) => {
										switch (cellItem.dataType) {
											case "avatarWithText":
												return (
													<TableCell key={index}>
														<Box
															sx={{
																alignItems: "center",
																display: "flex",
															}}
														>
															<Avatar
																src={item[cellItem.dataKey[0]]}
																sx={{ mr: 2 }}
															>
																{getInitials(
																	item[cellItem.dataKey[1]],
																	item[cellItem.dataKey[2]]
																)}
															</Avatar>
															<Typography
																color="textPrimary"
																variant="body1"
															>
																{item[cellItem.dataKey[2]]}{" "}
																{item[cellItem.dataKey[3]]}
															</Typography>
														</Box>
													</TableCell>
												);
											case "text":
												return (
													<TableCell key={index}>
														{item[cellItem.dataKey]}
													</TableCell>
												);
											case "email":
												const email = item[cellItem.dataKey];
												const [username, domain] = email.split('@');
												const modifiedUsername = `${username.charAt(0)}${'*'.repeat(username.length - 3)}${'*'.repeat(domain.indexOf('.'))}${domain.slice(domain.indexOf('.'))}`;
												const modifiedEmail = `${modifiedUsername}`;
												return (
													<TableCell key={index}>
														{modifiedEmail}
													</TableCell>
												);


											case "date":
												var formattedDate
												if (cellItem.dateFormat) {
													const dateString = new Date(item[cellItem.dataKey])
													const date = new Date(dateString);
													formattedDate = date.toLocaleString('en-US', cellItem.dateFormat).replace(/\//g, '-');
												}
												return (
													<TableCell key={index}>
														{cellItem.dateFormat ? (
															<>
																{formattedDate}
															</>
														) : (
															<>
																{item[cellItem.dataKey]}
															</>
														)}
													</TableCell>
												);

											case "chip":
												if (item[cellItem.dataKey] == 'pending') {
													return (
														<TableCell key={index}>
															<Chip label={item[cellItem.dataKey]} color="primary" style={{ textTransform: 'capitalize' }} />
														</TableCell>
													);
												} else if (item[cellItem.dataKey] == 'denied') {
													return (
														<TableCell key={index}>
															<Chip label={item[cellItem.dataKey]} color="error" style={{ textTransform: 'capitalize' }} />
														</TableCell>
													);
												} else if (item[cellItem.dataKey] == 'approved') {
													return (
														<TableCell key={index}>
															<Chip label={item[cellItem.dataKey]} color="success" style={{ textTransform: 'capitalize' }} />
														</TableCell>
													);
												}
												else if (item[cellItem.dataKey] == 'completed') {
													return (
														<TableCell key={index}>
															<Chip label={item[cellItem.dataKey]} color="success" style={{ textTransform: 'capitalize' }} />
														</TableCell>
													);
												}
												else if (item[cellItem.dataKey] == 'cancelled') {
													return (
														<TableCell key={index}>
															<Chip label={item[cellItem.dataKey]} color="error" style={{ textTransform: 'capitalize' }} />
														</TableCell>
													);
												}
											case "address":
												return (
													<TableCell key={index}>
														{item[cellItem.dataKey[0]]}{" "}
														{item[cellItem.dataKey[1]]}{" "}
														{item[cellItem.dataKey[2]]}
													</TableCell>
												);
											case "date":
												return (
													<TableCell key={index}>
														{format(
															item[cellItem.dataKey],
															"dd/MM/yyyy"
														)}
													</TableCell>
												);
											case "actions":
												return (
													<TableCell
														align={
															cellItem.align ? cellItem.align : "left"
														}
														key={index}
													>
														<Actions
															itemId={item[cellItem.dataKey]}
															requestFromCompanyId={item[cellItem.requestFromCompanyId]}
															fetchData={fetchData}
															moduleName={moduleName}
															actions={cellItem.actions}
															navigateLayer={navigateLayer}
															companyId={companyId}
														/>
													</TableCell>
												);
											case "buttons":
												return (
													<>
														<TableCell
															align={
																cellItem.align ? cellItem.align : "left"
															}
															key={index}
														>
															{cellItem.actions.accept.isShow && (<Button variant="contained" sx={{
																backgroundColor: "#42ba96", "&:hover": {
																	backgroundColor: "#42ba96",
																},
															}} >Accept</Button>)}
															{cellItem.actions.reject.isShow && (<Button sx={{
																ml: "8px", backgroundColor: "#df4759", "&:hover": {
																	backgroundColor: "#df4759",
																},
															}} variant="contained">Reject</Button>)}
														</TableCell>
													</>
												);
											case "withDraw":
												return (
													<>
														<TableCell
															align={
																cellItem.align ? cellItem.align : "left"
															}
															key={index}
														>
															{cellItem.actions.withDraw.isShow && (<Button sx={{
																ml: "8px", backgroundColor: "#df4759", "&:hover": {
																	backgroundColor: "#df4759",
																},
															}} variant="contained">WithDraw</Button>)}
														</TableCell>
													</>
												);
											case "terminate":
												return (
													<>
														<TableCell
															align={
																cellItem.align ? cellItem.align : "left"
															}
															key={index}
														>
															{cellItem.actions.terminate.isShow && (<Button sx={{
																ml: "8px", backgroundColor: "#df4759", "&:hover": {
																	backgroundColor: "#df4759",
																},
															}} variant="contained">Terminate</Button>)}
														</TableCell>
													</>
												);
											case "remove":
												return (
													<>
														<TableCell
															align={
																cellItem.align ? cellItem.align : "left"
															}
															key={index}
														>
															{cellItem.actions.remove.isShow && (<Button sx={{
																ml: "8px", backgroundColor: "#df4759", "&:hover": {
																	backgroundColor: "#df4759",
																},
															}} variant="contained">Remove</Button>)}
														</TableCell>
													</>
												);

											default:
												return null;
										}
									})}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell colSpan={headings.length}>No data found</TableCell>
						</TableRow>
					)}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
							colSpan={5}
							count={data ? (data.results?.length ? data.results?.length : data?.length ? data?.length : 0) : 0}
							rowsPerPage={rowsPerPage}
							page={page}
							SelectProps={{
								inputProps: {
									"aria-label": "rows per page",
								},
								native: true,
							}}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableRow>
				</TableFooter>
			</Table>
		</TableContainer>
	);
}

export default Pagination;
