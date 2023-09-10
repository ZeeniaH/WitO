import { Box } from "@mui/system";
import React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import {
	Divider,
	MenuItem,
	Paper,
	Select,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextareaAutosize,
	TextField,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import AddIcon from "@mui/icons-material/Add";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Layout from "../../pwa-layout";

function Index() {
	const [value, setValue] = React.useState(dayjs("2014-08-18T21:11:54"));

	const handleChange = (newValue) => {
		setValue(newValue);
	};
	const [dueValue, setDueValue] = React.useState(dayjs("2014-08-18T21:11:54"));

	const handleDueChange = (newDueValue) => {
		setDueValue(newDueValue);
	};
	const [role, setRole] = React.useState("");
	const handleRoleChange = (event) => {
		setRole(event.target.value);
	};
	return (
		<>
			<Layout />
			<Box px={2} sx={{ overflowX: "auto" }}>
				<Box
					sx={{
						width: "796.8px",
						margin: "auto",
					}}
				>
					<Box sx={{ p: "60px 30px" }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
								textAlign: "end",
							}}
						>
							<Box sx={{ pt: "40px", display: "flex", alignSelf: "center" }}>
								<Box component={"h2"}>Company Name</Box>
							</Box>
							<Box>
								<Box sx={{ mb: "15px", fontSize: "22px" }} component={"h2"}>
									Invoice #0000085
								</Box>
								<Box sx={{ mb: "15px", maxWidth: "25ch" }}>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<DesktopDatePicker
											label="Issue Date"
											inputFormat="MM/DD/YYYY"
											value={value}
											onChange={handleChange}
											renderInput={(params) => <TextField {...params} />}
										/>
									</LocalizationProvider>
								</Box>
								<Box sx={{ maxWidth: "25ch" }}>
									<LocalizationProvider dateAdapter={AdapterDayjs}>
										<DesktopDatePicker
											label="Due Date"
											inputFormat="MM/DD/YYYY"
											value={dueValue}
											onChange={handleDueChange}
											renderInput={(params) => <TextField {...params} />}
										/>
									</LocalizationProvider>
								</Box>
								<Box
									sx={{
										display: "flex",
										justifyContent: "end",
										fontSize: "14px",
										pt: "5px",
									}}
									component={"p"}
								>
									Add Document Fields
									<InfoOutlinedIcon
										sx={{
											ml: "5px",
											fontSize: "20px",
											color: "cornflowerblue",
										}}
									/>
								</Box>
							</Box>
						</Box>
						<Box sx={{ p: "20px 0" }}>
							<Box>
								<Box component={"h3"}>IT-RIVER</Box>
								<Box component={"p"}> Province state 85</Box>
								<Box component={"p"}> 13409 Berlin</Box>
								<Box component={"p"}> Germany</Box>
								<Box component={"p"}> mail@itriverpartner.com</Box>
								<Box component={"p"}> 015901433052</Box>
								<Box component={"p"}> Company ID. 16/532/01409</Box>
							</Box>
						</Box>
						<Divider />
						<Box sx={{ p: "30px 0", maxWidth: "100ch" }}>
							<FormControl fullWidth>
								<InputLabel id="demo-simple-select-label">Customer*</InputLabel>
								<Select
									labelId="demo-simple-select-label"
									id="demo-simple-select"
									value={role}
									label="Customer*"
									onChange={handleRoleChange}
								>
									<MenuItem value={0} disabled>
										Choose a Contact
									</MenuItem>
									<MenuItem value={10}>Company 1</MenuItem>
									<MenuItem value={20}>Company 2</MenuItem>
									<MenuItem value={30}>Company 3</MenuItem>
									<MenuItem value={40}>Company 4</MenuItem>
								</Select>
							</FormControl>
						</Box>
						<Divider />
						<Box sx={{ p: "30px 0", maxWidth: "100ch" }}>
							<FormControl fullWidth>
								<TextField id="outlined-input" label="Invoice Title" type="text" />
							</FormControl>
						</Box>
						<Box>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead sx={{ bgcolor: "#dbeefd" }}>
										<TableRow>
											<TableCell>Product or Service</TableCell>
											<TableCell align="center">Description</TableCell>
											<TableCell align="center">Price</TableCell>
											<TableCell align="center">Quantity</TableCell>
											<TableCell align="center">Line Total</TableCell>
										</TableRow>
									</TableHead>
									<TableBody sx={{ bgcolor: "#f5fafe" }}>
										<TableRow
											sx={{
												"&:last-child td, &:last-child th": {
													border: 0,
												},
											}}
										>
											<TableCell component="th" scope="row">
												<Box
													sx={{
														p: "30px 0",
														maxWidth: "50ch",
													}}
												>
													<FormControl fullWidth>
														<InputLabel id="demo-simple-select-label">
															Add an Item
														</InputLabel>
														<Select
															labelId="demo-simple-select-label"
															id="demo-simple-select"
															value={role}
															label="Add an Item"
															onChange={handleRoleChange}
														>
															<MenuItem value={10}>
																Add an Item 1
															</MenuItem>
															<MenuItem value={20}>
																Add an Item 2
															</MenuItem>
															<MenuItem value={30}>
																Add an Item 3
															</MenuItem>
															<MenuItem value={40}>
																Add an Item 4
															</MenuItem>
														</Select>
													</FormControl>
												</Box>
											</TableCell>
											<TableCell align="center">
												<TextareaAutosize
													aria-label="minimum height"
													minRows={3}
													placeholder="Minimum 3 rows"
													style={{ width: 200 }}
												/>
											</TableCell>
											<TableCell align="center">
												<FormControl>
													<TextField
														id="outlined-input"
														label="Price"
														type="number"
													/>
												</FormControl>
											</TableCell>
											<TableCell align="center">
												<FormControl>
													<TextField
														id="outlined-input"
														label="Quantity"
														type="number"
													/>
												</FormControl>
											</TableCell>
											<TableCell align="center">0.00€‎</TableCell>
										</TableRow>
									</TableBody>
								</Table>
							</TableContainer>
						</Box>

						<Box sx={{ p: "40px 0" }}>
							<Box
								sx={{
									display: "flex",
									justifyContent: "end",
									pb: "30px",
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										width: "30%",
									}}
								>
									<Box>
										<Box
											sx={{ pb: "15px", fontWeight: "600" }}
											component={"h3"}
										>
											Sub Total
										</Box>
										<Box sx={{ display: "flex" }}>
											<Box sx={{ alignSelf: "center" }}>
												<AddIcon />
											</Box>
											<Box sx={{ ml: "8px" }} component={"p"}>
												Add Discount
											</Box>
										</Box>
									</Box>
									<Box sx={{ lineHeight: "60px" }}>0.00€‎</Box>
								</Box>
							</Box>
							<Divider sx={{ float: "right", width: "30%" }} />
						</Box>
						<Box sx={{ display: "flex", justifyContent: "end" }}>
							<Box
								sx={{
									pb: "30px",
									width: "30%",
								}}
							>
								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<Box sx={{ pb: "15px" }}>
										<Box
											sx={{ pb: "15px", fontWeight: "600" }}
											component={"h3"}
										>
											Total
										</Box>
										<Box sx={{ display: "flex" }}>
											<Box sx={{ alignSelf: "center" }}>
												<AddIcon />
											</Box>
											<Box sx={{ ml: "8px" }} component={"p"}>
												Request Deposit
											</Box>
											<InfoOutlinedIcon
												sx={{
													alignSelf: "center",
													ml: "5px",
													fontSize: "20px",
													color: "cornflowerblue",
												}}
											/>
										</Box>
									</Box>
									<Box sx={{ lineHeight: "60px" }}>0.00€‎</Box>
								</Box>

								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										pb: "30px",
									}}
								>
									<Box sx={{ fontWeight: "600" }} component={"h4"}>
										Amount Paid
									</Box>
									<Box sx={{ lineHeight: "60px" }}>0.00€‎</Box>
								</Box>

								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										p: "10px 15px",
										border: "1px solid #d0e1e9",
										bgcolor: "#f5fafe",
									}}
								>
									<Box component={"h4"}>Balance Due</Box>
									<Box component={"h4"}>0.00€‎</Box>
								</Box>
							</Box>
						</Box>
						<Divider />

						<Box className="App">
							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-start",
									pt: "30px",
									pb: "8px",
								}}
							>
								Notes{" "}
								<InfoOutlinedIcon
									sx={{ ml: "5px", fontSize: "20px", color: "cornflowerblue" }}
								/>
							</Box>
							<CKEditor
								editor={ClassicEditor}
								data="<p> Enter an additional note for your customers, e.g, Thanks for your interest. </p>"
								onReady={(editor) => {
									// console.log( 'Editor is ready to use!', editor );
								}}
								onChange={(event, editor) => {
									const data = editor.getData();
									// console.log( { event, editor, data } );
								}}
								onBlur={(event, editor) => {
									// console.log( 'Blur.', editor );
								}}
								onFocus={(event, editor) => {
									// console.log( 'Focus.', editor );
								}}
							/>
						</Box>
						<Box className="App">
							<Box
								sx={{
									display: "flex",
									justifyContent: "flex-start",
									pt: "30px",
									pb: "8px",
								}}
							>
								Terms{" "}
								<InfoOutlinedIcon
									sx={{ ml: "5px", fontSize: "20px", color: "cornflowerblue" }}
								/>
							</Box>
							<CKEditor
								editor={ClassicEditor}
								data="<p> Enter Specific terms for your customers, e.g. Payment is due within 21 days of issue.</p>"
								onReady={(editor) => {
									//    console.log( 'Editor is ready to use!', editor );
								}}
								onChange={(event, editor) => {
									const data = editor.getData();
									//    console.log( { event, editor, data } );
								}}
								onBlur={(event, editor) => {
									//    console.log( 'Blur.', editor );
								}}
								onFocus={(event, editor) => {
									// console.log( 'Focus.', editor );
								}}
							/>
						</Box>
					</Box>
				</Box>
			</Box>
		</>
	);
}

export default Index;
