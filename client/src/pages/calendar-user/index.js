import React from 'react'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useParams } from "react-router-dom";
import CompanyHeader from "../../userComponents/Header"
import Calender from '../../Scheduler/index';
import { useDispatch } from 'react-redux';

function Calendar() {
	const { user } = useAuthContext();
	const params = useParams();
  const dispatch = useDispatch();
  let HeaderComponent = CompanyHeader;

		if (user?.user?.role === 'CompanyOwner') {
			HeaderComponent = CompanyHeader;
		} else if (user?.user?.role === 'Worker') {
			HeaderComponent = PwaHeader;
		}
  return (
    <>
      <HeaderComponent />
      <Calender companyId={params.companyId} workerId={params.workerId} />
    </>
  )
}

export default Calendar