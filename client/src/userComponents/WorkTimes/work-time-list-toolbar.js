import {
	Box,
	Typography, Button
} from "@mui/material";
import { useTranslation } from 'react-i18next'
import useGoBack from '../../hooks/useGoBack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const WorkerTimeListToolbar = ({ setWorkerQuery, id }) => {
	const { t } = useTranslation();
	return (
		<Box>
			<Box>
				<Button
					sx={{ fontSize: "12px", mb: "10px" }}
					variant="outlined"
					onClick={useGoBack}
					startIcon={<ArrowBackIcon />}
				>
					{t('Back')}
				</Button>
			</Box>
			<Box
				sx={{
					alignItems: "center",
					display: "flex",
					justifyContent: "space-between",
					flexWrap: "wrap",
					m: -1,
				}}
			>
				<Typography sx={{ m: 1 }} variant="h4">
					{t('Worker Time')}
				</Typography>
				<Box sx={{ m: 1 }}>
				</Box>
			</Box>
		</Box>
	)
};
