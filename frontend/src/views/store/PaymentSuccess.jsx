import React, { useState, useEffect } from "react";
import axios from "../../utils/axios";
import { useParams } from "react-router-dom";

function PaymentSuccess() {
	const [order, setOrder] = useState([]);
	const [status, setStatus] = useState("Verifying");

	const params = useParams();

	const urlParam = new URLSearchParams(window.location.search);
	const sessionID = urlParam.get("session_id");
	const paypalOrderID = urlParam.get("paypal_order_id");

	console.log("Session ID: " + sessionID);
	console.log("Paypal order ID: " + paypalOrderID);

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.api_instance.get(
					`checkout/${params.order_oid}`
				);
				setOrder(response.data);
			} catch (e) {
				console.log(e);
			}
		})();
	}, [params]);

	useEffect(() => {
		(async () => {
			const formdata = new FormData();
			formdata.append("order_oid", params.order_oid);
			formdata.append("paypal_order_id", paypalOrderID);
			formdata.append("session_id", sessionID);

			setStatus("Verifying");

			try {
				const response = await axios.api_instance.post(
					"payment-success",
					formdata
				);
				console.log(response.data);
				setStatus(response.data.message);
			} catch (e) {
				console.log(e);
			}
		})();
	}, []);

	console.log(status);

	return (
		<div>
			<main className="mb-4 mt-4 h-100">
				<div className="container">
					{/* Section: Checkout form */}
					<section className="">
						<div className="gx-lg-5">
							<div className="row pb50">
								<div className="col-lg-12">
									<div className="dashboard_title_area">
										{/* Header section */}
										{status == "Verifying" && (
											<h4 className="fw-bold text-center mb-4 mt-4">
												Verifying Checkout{" "}
												<i className="fa fa-spinner fa-spin" />{" "}
											</h4>
										)}

										{status == "Order already paid" && (
											<h4 className="fw-bold text-center mb-4 mt-4">
												Order already paid!{" "}
												<i className="fa fa-check-circle" />{" "}
											</h4>
										)}

										{status == "Payment successful" && (
											<h4 className="fw-bold text-center mb-4 mt-4">
												Payment successful!{" "}
												<i className="fa fa-check-circle" />{" "}
											</h4>
										)}

										{(status == "Your invoice is unpaid" ||
											status ==
												"Your invoice is cancelled" ||
											status ==
												"An error occured, please try again") && (
											<h4 className="fw-bold text-center mb-4 mt-4">
												{status}{" "}
												<i className="fa-solid fa-circle-exclamation"></i>{" "}
											</h4>
										)}
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-xl-12">
									<div className="application_statics">
										<div className="account_user_deails dashboard_page">
											<div className="d-flex justify-content-center align-items-center">
												<div className="col-lg-12">
													<div className="border border-3 border-success" />
													<div className="card bg-white shadow p-5">
														<div className="mb-4 text-center">
															<i
																className="fa fa-check-circle text-success"
																style={{
																	fontSize: 100,
																	color: "green",
																}}
															/>
														</div>
														<div className="text-center">
															{status ==
																"Verifying" && (
																<>
																	<h4>
																		Please
																		wait for
																		a moment
																		while
																		order is
																		proccessed!
																	</h4>
																	<p className="text-danger fw-bold">
																		NOTE: Do
																		not
																		reload
																		or leave
																		the
																		page!
																	</p>
																</>
															)}

															{(status ==
																"Your invoice is unpaid" ||
																status ==
																	"Your invoice is cancelled" ||
																status ==
																	"An error occured, please try again") && (
																<>
																	<h4>
																		Your
																		invoice
																		has
																		either
																		been
																		cancelled
																		or not
																		been
																		paid
																	</h4>
																	<p className="text-danger fw-bold">
																		NOTE:
																		Please
																		try
																		again!
																	</p>
																</>
															)}

															{(status ==
																"Order already paid" ||
																status ==
																	"Payment successful") && (
																<>
																	<h1>
																		Thank
																		You !
																	</h1>
																	<p>
																		Your
																		checkout
																		was
																		successfull,
																		we have
																		sent the
																		order
																		detail
																		to your
																		email:{" "}
																		<span className="fw-bold">
																			{
																				order.email
																			}
																		</span>
																	</p>
																	<p>
																		Your
																		order
																		id:{" "}
																		<span className="fw-bold">
																			#
																			{
																				order.oid
																			}
																		</span>
																	</p>
																	<button
																		className="btn btn-success mt-3"
																		data-bs-toggle="modal"
																		data-bs-target="#exampleModal">
																		View
																		Order{" "}
																		<i className="fa fa-eye" />{" "}
																	</button>
																	<a
																		href="/"
																		className="btn btn-primary mt-3 ms-2">
																		Download
																		Invoice{" "}
																		<i className="fa fa-file-invoice" />{" "}
																	</a>
																	<a className="btn btn-secondary mt-3 ms-2">
																		Go Home{" "}
																		<i className="fa fa-fa-arrow-left" />{" "}
																	</a>
																</>
															)}
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
			<div
				className="modal fade"
				id="exampleModal"
				tabIndex={-1}
				aria-labelledby="exampleModalLabel"
				aria-hidden="true">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLabel">
								Order Summary
							</h5>
							<button
								type="button"
								className="btn-close"
								data-bs-dismiss="modal"
								aria-label="Close"
							/>
						</div>
						<div className="modal-body">
							<div className="modal-body text-start text-black p-4">
								<h5
									className="mb-3 modal-title text-uppercase "
									id="exampleModalLabel">
									Full name: {order.full_name}
								</h5>
								<h6>Email: {order.email}</h6>
								<h6>Mobile: {order.mobile}</h6>
								<h6 className="">Address: {order.address}</h6>
								<h6 className="">City: {order.city}</h6>
								<h6 className="">State: {order.state}</h6>
								<h6 className="">Country: {order.country}</h6>
								<p
									className="mb-0"
									style={{ color: "#35558a" }}>
									Payment summary
								</p>
								<hr
									className="mt-2 mb-4"
									style={{
										height: 0,
										backgroundColor: "transparent",
										opacity: ".75",
										borderTop: "2px dashed #9e9e9e",
									}}
								/>
								<div className="d-flex justify-content-between">
									<p className="fw-bold mb-0">Subtotal</p>
									<p className="text-muted mb-0">
										${order?.sub_total}
									</p>
								</div>
								<div className="d-flex justify-content-between">
									<p className="small mb-0">Shipping Fee</p>
									<p className="small mb-0">
										${order?.shipping_amount}
									</p>
								</div>
								<div className="d-flex justify-content-between">
									<p className="small mb-0">Service Fee</p>
									<p className="small mb-0">
										${order?.service_fee}
									</p>
								</div>
								<div className="d-flex justify-content-between">
									<p className="small mb-0">Tax</p>
									<p className="small mb-0">
										${order?.tax_fee}
									</p>
								</div>
								<div className="d-flex justify-content-between">
									<p className="small mb-0">Discount</p>
									<p className="small mb-0">
										-${order?.saved}
									</p>
								</div>
								<div className="d-flex justify-content-between mt-4">
									<p className="fw-bold">Total</p>
									<p
										className="fw-bold"
										style={{ color: "#35558a" }}>
										${order?.total}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PaymentSuccess;
