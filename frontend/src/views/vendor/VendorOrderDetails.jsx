import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import moment from "moment";
import { Link, useParams } from "react-router-dom";

function VendorOrderDetails() {
	const [order, setOrder] = useState([]);
	const [orderItems, setOrderItems] = useState([]);

	const userData = UserData();
	const params = useParams();

	const fetchOrderDetail = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/orders/order-detail/${userData?.vendor_id}/${params?.order_oid}`
			);
			console.log(response.data);
			setOrder(response?.data);
			setOrderItems(response?.data?.orderitem);
		} catch (e) {
			console.log(e);
		}
	};

	function capitalizeFirstLetter(string) {
		if (string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}

	// fetch order details
	useEffect(() => {
		fetchOrderDetail();
	}, []);

	return (
		<div className="container-fluid">
			<section className="">
				<div className="row h-100">
					<VendorSidebar />
					<div className="col-lg-9 mt-4">
						<main className="mb-5">
							<div className="container px-4">
								<section className="mb-5">
									<h3 className="mb-3">
										{" "}
										<i className="fa fa-shopping-cart text-primary" />{" "}
										#{order?.oid}
									</h3>
									<div className="row gx-xl-5">
										<div className="col-lg-3 mb-4 mb-lg-0">
											<div
												className="rounded shadow"
												style={{
													backgroundColor: "#B2DFDB",
												}}>
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="ps-3 py-2">
															<h6 className="mb-1">
																Total
															</h6>
															<h4 className="mb-0">
																${order?.total}
																<span
																	className=""
																	style={{
																		fontSize:
																			"0.875rem",
																	}}></span>
															</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-3 mb-4 mb-lg-0">
											<div
												className="rounded shadow"
												style={{
													backgroundColor: "#D1C4E9",
												}}>
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="ps-3 py-2">
															<h6 className="mb-1">
																Payment Status
															</h6>
															<h4 className="mb-0">
																{capitalizeFirstLetter(
																	order.payment_status
																)}
																<span
																	className=""
																	style={{
																		fontSize:
																			"0.875rem",
																	}}></span>
															</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-3 mb-4 mb-lg-0">
											<div
												className="rounded shadow"
												style={{
													backgroundColor: "#BBDEFB",
												}}>
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="ps-3 py-2">
															<h6 className="mb-1">
																Order Status
															</h6>
															<h4 className="mb-0">
																{capitalizeFirstLetter(
																	order.order_status
																)}
																<span
																	className=""
																	style={{
																		fontSize:
																			"0.875rem",
																	}}></span>
															</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-3 mb-4 mb-lg-0">
											<div
												className="rounded shadow"
												style={{
													backgroundColor: "#bbfbeb",
												}}>
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="ps-3 py-2">
															<h6 className="mb-1">
																Shipping Amount
															</h6>
															<h4 className="mb-0">
																$
																{
																	order.shipping_amount
																}
																<span
																	className=""
																	style={{
																		fontSize:
																			"0.875rem",
																	}}></span>
															</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-4 mb-4 mb-lg-0 mt-5">
											<div
												className="rounded shadow"
												style={{
													backgroundColor: "#bbf7fb",
												}}>
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="ps-3 py-2">
															<h6 className="mb-1">
																Tax Fee
															</h6>
															<h4 className="mb-0">
																${order.tax_fee}
																<span
																	className=""
																	style={{
																		fontSize:
																			"0.875rem",
																	}}></span>
															</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-4 mb-4 mb-lg-0 mt-5">
											<div
												className="rounded shadow"
												style={{
													backgroundColor: "#eebbfb",
												}}>
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="ps-3 py-2">
															<h6 className="mb-1">
																Service Fee
															</h6>
															<h4 className="mb-0">
																$35.39
																<span
																	className=""
																	style={{
																		fontSize:
																			"0.875rem",
																	}}></span>
															</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-lg-4 mb-4 mb-lg-0 mt-5">
											<div
												className="rounded shadow"
												style={{
													backgroundColor: "#bbc5fb",
												}}>
												<div className="card-body">
													<div className="d-flex align-items-center">
														<div className="ps-3 py-2">
															<h6 className="mb-1">
																Discount Fee
															</h6>
															<h4 className="mb-0">
																${order.saved}
																<span
																	className=""
																	style={{
																		fontSize:
																			"0.875rem",
																	}}></span>
															</h4>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</section>

								<section className="">
									<div className="row rounded shadow p-3">
										<div className="col-lg-12 mb-4 mb-lg-0">
											<table className="table align-middle mb-0 bg-white">
												<thead className="bg-light">
													<tr>
														<th>Product</th>
														<th>Price</th>
														<th>Qty</th>
														<th>Total</th>
													</tr>
												</thead>
												<tbody>
													{orderItems?.map(
														(item, index) => (
															<tr key={index}>
																<td>
																	<div className="d-flex align-items-center">
																		<img
																			src={
																				item
																					?.product
																					?.image
																			}
																			style={{
																				width: 80,
																				borderRadius: 5,
																			}}
																			alt=""
																		/>
																		<p className="text-muted ms-3 mb-0">
																			{moment(
																				item.date
																			).format(
																				"MMM D, YYYY"
																			)}
																		</p>
																	</div>
																</td>
																<td>
																	<p className="fw-normal mb-1">
																		$
																		{
																			item
																				?.product
																				?.price
																		}
																	</p>
																</td>
																<td>
																	<p className="fw-normal mb-1">
																		{
																			item.qty
																		}
																	</p>
																</td>
																<td>
																	<span className="fw-normal mb-1">
																		$
																		{
																			item.sub_total
																		}
																	</span>
																</td>
															</tr>
														)
													)}
												</tbody>
											</table>
										</div>
									</div>
								</section>
							</div>
						</main>
					</div>
				</div>
			</section>
			{/*Section: Wishlist*/}
		</div>
	);
}

export default VendorOrderDetails;
