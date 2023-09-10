import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box } from "@mui/material/index";
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BreadCrum = ({ currentFolder }) => {
	const { t } = useTranslation();
	const params = useParams();
	const companyId = params.companyId;
	const navigate = useNavigate();
	return (
		<Breadcrumbs aria-label="breadcrumb">
			{currentFolder && currentFolder.data.path.length > 0 ? (
				<Box>
					<Link
						style={{ color: "#000", cursor: "pointer" }}
						underline="hover"
						color="inherit"
						onClick={() => navigate(`/home/archive/${companyId}`)}
					// onClick={() => navigate("/home/archive")}
					>
						{t('Root')}
					</Link>
					<NavigateNextIcon fontSize="small" />
					{/* {currentFolder.data.path.map((folder, index) => (
						<>
							<Link
								style={{ color: "#000", cursor: "pointer" }}
								underline="hover"
								color="inherit"
								onClick={() =>
									navigate(
										currentFolder.data.createdBy === "admin"
											? `/home/archive/folder/admin/${folder.id}`
											: `/home/archive/folder/${folder.id}`
									)
								}
							>
								{folder.name}
							</Link>
							<NavigateNextIcon fontSize="small" />
						</>
					))} */}
					<Link
						style={{ color: "#000", cursor: "pointer" }}
						underline="hover"
						color="inherit"
						disabled
						active="true"
					>
						{currentFolder.data.name}
					</Link>
					<NavigateNextIcon fontSize="small" />
				</Box>
			) : (
				<Box>
					<Link
						style={{ color: "#000", cursor: "pointer" }}
						underline="hover"
						color="inherit"
						onClick={() => navigate(`/home/archive/${companyId}`)}
					// onClick={() => navigate("/home/archive")}
					>
						{t('Root')}
					</Link>
					<NavigateNextIcon fontSize="small" />

					<Link
						style={{ color: "#000", cursor: "pointer" }}
						underline="hover"
						color="inherit"
						disabled
						active="true"
					>
						{currentFolder.data.name}
					</Link>
				</Box>
			)
			}
		</Breadcrumbs >
	);
};

export default BreadCrum;
