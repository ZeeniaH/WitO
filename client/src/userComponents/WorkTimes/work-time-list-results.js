import React, { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { setLoading } from "redux/actionCreators/loadingActionCreators";
import { useDispatch } from "react-redux";
import Pagination from "utils/Pagination";
import { useTranslation } from "react-i18next";
import { Box, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { toast, ToastContainer } from "react-toastify";

export const WorkerTimeListResults = ({ workerQuery, companyId, workerId }) => {
	const { t } = useTranslation();
	const [trackTime, setTrackTime] = useState([]);
	const [startDate, setStartDate] = useState(null);
	const [endDate, setEndDate] = useState(null);
	const user = JSON.parse(localStorage.getItem("user"));
	const dispatch = useDispatch();

	function convertTimestampToHHMMSS(timestamp) {
		// Create a new Date object with the given timestamp
		let date = new Date(timestamp);

		// Get the components of the time
		let totalSeconds = Math.floor(date.getTime() / 1000);
		let hours = Math.floor(totalSeconds / 3600);
		let minutes = Math.floor((totalSeconds % 3600) / 60);
		let seconds = totalSeconds % 60;

		// Format the time
		let formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
			.toString()
			.padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

		return formattedTime;
	}

	const fetchTrackTime = async () => {
		dispatch(setLoading(true));
		const response = await fetch(
			`${BASE_URL}/trackTime/${workerId}/company/${companyId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			}
		);
		let json = await response.json();
		if (response.ok) {
			const updatedJson = json.map((item) => ({
				...item,
				timeTracked: convertTimestampToHHMMSS(item.timeTracked),
			}));
			setTrackTime(updatedJson);
		}
		dispatch(setLoading(false));
	};

	const calculateTotalTimeForSelectedDates = () => {
		if (!trackTime.length || !startDate || !endDate) {
			return "00:00:00";
		}
		const selectedStartTime = startDate.getTime();
		const selectedEndTime = endDate.getTime() + 24 * 60 * 60 * 1000; // Include the end day.

		const totalTime = trackTime.reduce((total, item) => {
			const itemDate = new Date(item.startTime).getTime();
			if (itemDate >= selectedStartTime && itemDate <= selectedEndTime) {
				const timeInSeconds = item.timeTracked
					.split(":")
					.reduce(
						(acc, timePart, index) =>
							acc + parseInt(timePart) * Math.pow(60, 2 - index),
						0
					);
				return total + timeInSeconds;
			}
			return total;
		}, 0);

		return convertTimestampToHHMMSS(totalTime * 1000);
	};

	// Validate end date
	const handleEndDateChange = (date) => {
		setEndDate(date);
		if (!date || date < startDate) {
			toast.error("End date should be greater than start date.");
		}
	};

	useEffect(() => {
		fetchTrackTime();
	}, []);

	const formatDate = (date) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // Add leading zero
		const day = String(date.getDate()).padStart(2, "0"); // Add leading zero
		return `${month}-${day}-${year}`;
	};

	return (
		<>
			<ToastContainer autoClose={8000} />
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<Box
					sx={{
						display: "flex",
						alignItems: "baseline",
						justifyContent: "end",
						width: "100%",
						float: "right",
						flexDirection: {
							xs: "column",
							sm: "row"
						}
					}}
				>
					<Box component="h4" sx={{
						mr: 2, mb: {
							xs: 2,
							sm: 0
						}
					}}>{t("Select Date Range")}:</Box>
					<Box sx={{
						mr: 2,
						display: "inline-flex",
						mb: {
							xs: 2,
							sm: 0
						}
					}}>
						<DatePicker
							label={t("Start Date")}
							value={startDate}
							onChange={(date) => setStartDate(date)}
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="MM-DD-YYYY"
									InputLabelProps={{ shrink: true }}
								/>
							)}
						/>
					</Box>
					<Box sx={{
						display: "inline-flex",
						mb: {
							xs: 2,
							sm: 0
						}
					}}>
						<DatePicker
							label={t("End Date")}
							value={endDate}
							onChange={handleEndDateChange} // Use the validated change handler
							renderInput={(params) => (
								<TextField
									{...params}
									placeholder="MM-DD-YYYY"
									InputLabelProps={{ shrink: true }}
								/>
							)}
						/>
					</Box>
					<Box
						sx={{
							height: "40px",
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							color: "#fff",
							borderRadius: "4px",
							padding: "15px",
							textTransform: "capitalize",
							backgroundColor: "#7206ef",
							fontSize: "22px",
							marginLeft: "10px",
							marginBottom: "20px",
						}}
					>
						{calculateTotalTimeForSelectedDates()}
					</Box>
				</Box>
				<Pagination
					headings={[
						{ title: t("Date") },
						{ title: t("Start Time") },
						{ title: t("End Time") },
						{ title: t("Time Tracked") },
						{ title: t("License Plate") },
						{ title: t("Actions"), align: "right" },
					]}
					data={trackTime}
					moduleName="trackTime"
					cellData={[
						{
							dataType: "date",
							dataKey: "startTime",
							dateFormat: {
								day: "2-digit",
								month: "2-digit",
								year: "numeric",
							},
						},
						{
							dataType: "date",
							dataKey: "startTime",
							dateFormat: {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
								hour12: true,
							},
						},
						{
							dataType: "date",
							dataKey: "endTime",
							dateFormat: {
								hour: "2-digit",
								minute: "2-digit",
								second: "2-digit",
								hour12: true,
							},
						},
						{
							dataType: "text",
							dataKey: "timeTracked",
						},
						{
							dataType: "text",
							dataKey: "licensePlate",
						},
						{
							align: "right",
							dataType: "actions",
							dataKey: "_id",
							actions: {
								edit: true,
								delete: true,
							},
						},
					]}
					fetchData={fetchTrackTime}
					navigateLayer="home"
					companyId={workerId}
				/>
			</LocalizationProvider>
		</>
	);
};