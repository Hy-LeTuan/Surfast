import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import moment from "moment";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";

function CustomerNotification() {
	const [notifications, setNotifications] = useState([]);

	const userData = UserData();

	const fetchNotifications = async () => {
		try {
			const response = await axios.api_instance.get(
				`customer/notification/${userData.user_id}`
			);
			console.log(response.data);
			setNotifications(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const markNotificationAsSeen = async (userID, notiID) => {
		try {
			const response = await axios.api_instance.get(
				`customer/notification/${userID}/${notiID}`
			);
			console.log(response.data);
			fetchNotifications();
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, []);

	return (
		<div>
			<main className="mt-5" style={{ marginBottom: 200 }}>
				<div className="container">
					<section className="">
						<div className="row">
							<Sidebar />
							<div className="col-lg-9 mt-1">
								<section className="">
									<main className="mb-5" style={{}}>
										<div className="container px-4">
											{/* Section: Summary */}
											<section className="">
												<h3 className="mb-3">
													{" "}
													<i className="fa fa-bell" />{" "}
													Notifications{" "}
												</h3>
												<div className="list-group">
													{notifications?.map(
														(noti, index) => (
															<a
																href="#"
																className="list-group-item list-group-item-action mb-4 border rounded"
																aria-current="true"
																key={index}>
																<div className="d-flex w-100 justify-content-between align-items-center mb-2 ">
																	<div className="d-flex align-items-center justify-content-center gap-3">
																		<button
																			className="btn btn-success"
																			onClick={() =>
																				markNotificationAsSeen(
																					userData.user_id,
																					noti.id
																				)
																			}>
																			{noti.seen ? (
																				<i className="fa fa-check"></i>
																			) : (
																				<i className="fa fa-eye-slash"></i>
																			)}
																		</button>
																		<h5 className="mb-1">
																			Order
																			Confirmed!
																		</h5>
																	</div>
																	<small>
																		{moment(
																			noti.date
																		).format(
																			"MMM DD, YYYY"
																		)}
																	</small>
																</div>
																<p className="mb-1">
																	Your order #
																	{
																		noti
																			?.order
																			?.oid
																	}{" "}
																	was
																	successful
																</p>
																<small className="">
																	Total: $
																	{
																		noti
																			?.order
																			?.total
																	}
																</small>{" "}
																<br />
																<small className="">
																	Shipping: $
																	{
																		noti
																			?.order
																			?.shipping_amount
																	}
																</small>{" "}
																<br />
																<small className="">
																	Tax: $
																	{
																		noti
																			?.order
																			?.tax_fee
																	}
																</small>{" "}
																<br />
																<small className="">
																	Service Fee:
																	$
																	{
																		noti
																			?.order
																			?.service_fee
																	}
																</small>{" "}
																<br />
															</a>
														)
													)}

													{notifications.length <
														1 && (
														<h6>
															No notifications yet
														</h6>
													)}
												</div>
											</section>
											{/* Section: Summary */}
											{/* Section: MSC */}
											{/* Section: MSC */}
										</div>
										{/* Container for demo purpose */}
									</main>
								</section>
							</div>
						</div>
					</section>
					{/*Section: Wishlist*/}
				</div>
			</main>
		</div>
	);
}

export default CustomerNotification;
