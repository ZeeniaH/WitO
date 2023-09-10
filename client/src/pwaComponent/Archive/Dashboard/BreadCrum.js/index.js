import React from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import { Box, Button } from "../../../../../node_modules/@mui/material/index";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const BreadCrum = ({ currentFolder }) => {
	const navigate = useNavigate();
	return (
		<Breadcrumbs aria-label="breadcrumb">
			{currentFolder && currentFolder.data.path.length > 0 ? (
				<Box>
					<Link
						style={{ color: "#000", cursor: "pointer" }}
						underline="hover"
						color="inherit"
						onClick={() => navigate("/home/archive")}
					>
						Root
					</Link>
					<NavigateNextIcon fontSize="small" />
					{currentFolder.data.path.map((folder, index) => (
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
					))}
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
						onClick={() => navigate("/home/archive")}
					>
						Root
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
			)}
		</Breadcrumbs>
	);
};

export default BreadCrum;
