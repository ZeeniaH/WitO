import { Box } from "@mui/system";
import { Container, Grid, Pagination } from "@mui/material";

import { useEffect, useRef, useState } from "react";
import { CompanyListToolbar } from "../../userComponents/company/company-list-toolbar";

import { useCompanyContext } from "../../hooks/useCompanyContext";
import { BASE_URL } from "config";
import { CompanyCard } from "userComponents/company/company-card";
import { useTranslation } from 'react-i18next';


function Companies() {
	const [companyQuery, setCompanyQuery] = useState();
	const user = JSON.parse(localStorage.getItem("user"));
	const { company, dispatch } = useCompanyContext();
	const companyCardRef = useRef([]);
	const { t } = useTranslation();


	const fetchCompanies = async () => {
		const response = await fetch(`${BASE_URL}/company/mine`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			dispatch({ type: "SET_COMPANIES", payload: json });
		}
	};

	const handlePageChange = async (event, value) => {
		fetchCompaniesByPage(value);
		console.log(companyCardRef.current);
		if (companyCardRef.current) {
			companyCardRef.current.map((companyCard) => {
				if (companyCard.state.toggleState == "EXPANDED") {
					companyCard.toggle();
				}
			});
		}
	};

	const fetchCompaniesByPage = async (page) => {
		const response = await fetch(`${BASE_URL}/company/mine?page=${page}`, {
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${user.tokens.access.token}`,
			},
		});
		const json = await response.json();
		if (response.ok) {
			dispatch({ type: "SET_COMPANIES", payload: json });
		}
	};

	useEffect(() => {
		fetchCompanies();
		return () => {
			dispatch({ type: "SET_COMPANIES", payload: null });
		};
	}, [dispatch]);
	const searchCompanies = async (companyQuery) => {
		if (companyQuery) {
			const response = await fetch(`${BASE_URL}/company/mine?companyName=${companyQuery}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.tokens.access.token}`,
				},
			});
			const json = await response.json();
			if (response.ok) {
				dispatch({ type: "SET_COMPANIES", payload: json });
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
			<Container maxWidth="lg">
				<Box sx={{ my: "40px" }}>
					<CompanyListToolbar setCompanyQuery={setCompanyQuery} />
				</Box>

				<Grid sx={{ pb: "60px" }} container spacing={2}>
					{company &&
						(company.results.length > 0 ? (
							company.results.map((company, index) => {
								return (
									<Grid item key={index} lg={4} md={6} xs={12}>
										<CompanyCard
											companyCardRef={companyCardRef}
											index={index}
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
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						pb: 5,
					}}
				>
					<Pagination
						color="primary"
						count={company ? company.totalPages : 0}
						page={company ? company.page : 0}
						size="small"
						onChange={handlePageChange}
					/>
				</Box>
			</Container>
		</>
	);
}

export default Companies;
