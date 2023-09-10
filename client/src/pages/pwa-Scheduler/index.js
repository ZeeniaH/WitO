import React from 'react'
import Scheduler from "../../Scheduler";
import Layout from '../../pwa-layout';
import { useParams } from "react-router-dom";

function Calender() {
	const params = useParams();

	return (
		<>
			<Layout />
			<Scheduler companyId={params.companyId} workerId={params.workerId} />
		</>
	);
}

export default Calender