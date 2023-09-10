import React, { useState } from 'react';
import { Box, Button, Typography, } from '@mui/material'
import Header from "../Header"
import MonthlyPlan from './monthlyPlan';
import YearlyPan from './yearlyPlan'
import { React_Price_TableId, Publishable_Key } from 'config';

function index() {
	const [selected, setSelected] = useState('monthly');

	const handleMonthlyClick = () => {
		setSelected('monthly');
	};

	const handleYearlyClick = () => {
		setSelected('yearly');
	};

	return (
		<>
			<Header />
			{/* <Box sx={{ pb: "60px" }}>
				<Box sx={{ padding: "50px", textAlign: { sm: "center", xm: "start" }, }}>
					<Box>
						<Box sx={{ fontSize: "22px", fontWeight: "bold" }}>Pricing</Box>
						<Box sx={{ width: { sm: "400px", xs: "unset" }, m: "auto", pt: "10px" }}>Sign up in less than 30 seconds. Try out our 7 day risk free trial, upgrade at anytime, no questions, no hassle.</Box>
					</Box>
				</Box>
				<Box sx={{ textAlign: "center" }}>
					<Button sx={{ padding: "10px 40px" }} variant={selected === 'monthly' ? 'contained' : 'outlined'} onClick={handleMonthlyClick}>
						Monthly
					</Button>
					<Button sx={{ padding: "10px 40px" }} variant={selected === 'yearly' ? 'contained' : 'outlined'} onClick={handleYearlyClick}>
						Yearly
					</Button>
					<Typography variant="h5">
						{selected === 'monthly' ?
							<MonthlyPlan /> : <YearlyPan />}
					</Typography>

				</Box>
			</Box> */}
			<stripe-pricing-table pricing-table-id={React_Price_TableId}
				publishable-key={Publishable_Key}>
			</stripe-pricing-table>
		</>
	)
}

export default index