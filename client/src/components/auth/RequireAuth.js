import React, { useEffect, useState } from "react";
import { Navigate, useLocation, useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "./auth";

import { useAuthContext } from "../../hooks/useAuthContext";
import { BASE_URL } from "config";

const RequireAuth = ({ children }) => {
	const { user, dispatch } = useAuthContext();
	const location = useLocation();
	const params = useParams();
	const navigate = useNavigate();

	useEffect(() => {

		const fetchSubscription = async () => {
			try {
				if (user.user.subscriptionId || params.sessionId) {
					let subscriptionId
					if (user.user.subscriptionId) {
						subscriptionId = user.user.subscriptionId
					} else if (params.sessionId) {
						// await fetch(`${BASE_URL}/stripe/checkout-session/cs_test_a1ZoUl5GHqzMJsxFCWqx54hBRRfXwNYKjd1f2MQ4ZquKSHYutMD1clrVlT`, {
						await fetch(`${BASE_URL}/stripe/checkout-session/${params.sessionId}`, {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${user.tokens.access.token}`,
							},
						})
							.then((res) => res.json())
							.then(async (subscription) => {
								subscriptionId = subscription.subscription;
							});
					}
					if (subscriptionId) {
						await fetch(`${BASE_URL}/stripe/subscription/${subscriptionId}`, {
							method: "GET",
							headers: {
								"Content-Type": "application/json",
								Authorization: `Bearer ${user.tokens.access.token}`,
							},
						})
							.then((res) => res.json())
							.then(async (subscription) => {
								console.log(subscription);
								// status could be 'active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing'
								console.log(`Subscription status: ${subscription.status}`);
								let userr;
								if (subscription.status === "active") {
									userr = {
										isSubscribed: true,
										subscriptionId: subscriptionId,
										planType: subscription.items.data[0].plan.product.metadata.plan_type,
									};
								} else {
									userr = {
										isSubscribed: false,
										subscriptionId: '',
										planType: '',
									};
								}
								if (user.user.isSubscribed !== userr.isSubscribed || user.user.planType !== subscription.items.data[0].plan.product.metadata.plan_type) {
									const response = await fetch(`${BASE_URL}/user/${user.user.id}`, {
										method: "PATCH",
										headers: {
											"Content-Type": "application/json",
											Authorization: `Bearer ${user.tokens.access.token}`,
										},
										body: JSON.stringify(userr),
									});
									const json = await response.json();

									if (!response.ok) {
									}
									if (response.ok) {
										userr = {
											...user,
											user: json
										}
										localStorage.setItem("user", JSON.stringify(userr));
										dispatch({ type: "SET_USER", payload: userr });
										if (json.isSubscribed) {
											navigate("/home/default");
										} else {
											navigate("/home/pricing");
										}
									}
								} else {
									if (!userr.isSubscribed) {
										// navigate("/home/default");
										navigate("/home/pricing");
									}
								}

							});
					}
				} else {
					navigate("/home/pricing");
				}
			} catch (error) {
				console.error("Error fetching subscription data:", error);
			}
		};

		if (user && user.user && user.user.role === "CompanyOwner") {
			fetchSubscription();
		}

	}, [user])

	if (!localStorage.getItem("user"))
		return <Navigate to="/" state={{ path: location.pathname }} />;
	return children;

};

export default RequireAuth;
