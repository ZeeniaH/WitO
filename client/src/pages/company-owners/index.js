import { Box, Container, Grid, Pagination } from "@mui/material";
import { CompanyListToolbar } from "../../components/company/company-list-toolbar";
import { CompanyCard } from "../../components/company/company-card";
import { useCompanyContext } from "hooks/useCompanyContext";
import { useEffect, useState } from "react";
import { BASE_URL } from "config";
import { useTranslation } from 'react-i18next';

const CompanyOwners = () => {
	const [companyQuery, setCompanyQuery] = useState();
	const [page, setPage] = useState(0);
	const user = JSON.parse(localStorage.getItem("user"));
	const { company, dispatch } = useCompanyContext();
	const { t } = useTranslation();

	const fetchCompanies = async () => {
		const response = await fetch(`${BASE_URL}/company/`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		console.log(json);
		if (response.ok) {
			dispatch({ type: "SET_COMPANIES", payload: json });
		}
	};

	const handlePageChange = async (event, value) => {
		fetchCompaniesByPage(value);
	};

	const fetchCompaniesByPage = async (page) => {
		const response = await fetch(`${BASE_URL}/company?page=${page}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			dispatch({ type: "SET_COMPANIES", payload: json });
			setPage(0);
		}
	};

	useEffect(() => {
		fetchCompanies();
	}, [dispatch]);

	const searchCompanies = async (companyQuery) => {
		if (companyQuery) {
			const response = await fetch(`${BASE_URL}/company?companyName=${companyQuery}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				dispatch({ type: "SET_COMPANIES", payload: json });
				setPage(json.page);
			}
		} else {
			fetchCompanies();
		}
	};

	useEffect(() => {
		searchCompanies(companyQuery);
	}, [companyQuery]);

	return (
		<>
			<Container maxWidth={false}>
				<CompanyListToolbar setCompanyQuery={setCompanyQuery} />
				<Box sx={{ pt: 3 }}>
					<Grid container spacing={3}>
						{company &&
							(company.results.length > 0 ? (
								company.results.map((company, index) => {
									return (
										<Grid item key={index} lg={4} md={6} xs={12}>
											<CompanyCard
												company={company}
												fetchCompanies={fetchCompanies}
											/>
										</Grid>
									);
								})
							) : (
								<Grid sx={{ py: "60px", display: "flex", justifyContent: "center", alignItems: "center" }} container spacing={2}>

									<Box>
										<h1 >{t('No Company Found')}</h1>
									</Box>
								</Grid>
							))}
					</Grid>
				</Box>
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						pt: 3,
					}}
				>
					{company && (
						<>
							{
								company.results.length > 0 && (
									<Pagination
										color="primary"
										count={company ? company.totalPages : 0}
										page={company ? company.page : 0}
										size="small"
										onChange={handlePageChange}
									/>
								)
							}
						</>
					)}

				</Box>
			</Container>
		</>
	);
};

export default CompanyOwners;
