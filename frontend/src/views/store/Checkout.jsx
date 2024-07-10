import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import Swal from "sweetalert2";
import { SERVER_URL, PAYPAL_CLIENT_ID } from "../../utils/constant";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Toast = Swal.mixin({
	toast: true,
	position: "top",
	showConfirmButton: false,
	timer: 1500,
	timerProgressBar: true,
});

function Checkout() {
	const [order, setOrder] = useState([]);
	const [couponCode, setCouponCode] = useState("");
	const [paymentLoading, setPaymentLoading] = useState(false);

	const params = useParams();
	const navigate = useNavigate();

	const fetchOrderData = async () => {
		try {
			const response = await axios.api_instance.get(
				`checkout/${params.order_oid}`
			);

			console.log(response.data);
			setOrder(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchOrderData();
	}, []);

	const applyCoupon = async () => {
		console.log("coupon applied");
		console.log(couponCode);

		const formdata = new FormData();
		formdata.append("order_oid", order.oid);
		formdata.append("coupon_code", couponCode);

		try {
			const response = await axios.api_instance.post("coupon", formdata);
			Toast.fire({
				icon: "success",
				title: response.data.message,
			});
			fetchOrderData();
		} catch (e) {
			Toast.fire({
				icon: "warning",
				title: e.response.data.message,
			});
		}
	};

	const payWithStripe = (event) => {
		setPaymentLoading(true);
		event.target.form.submit();
	};

	// paypal payment
	const initialOptions = {
		clientId: PAYPAL_CLIENT_ID,
		currency: "USD",
		intent: "capture",
	};

	return (
		<main>
			<main className="mb-4 mt-4">
				<div className="container">
					<section className="">
						<div className="row gx-lg-5">
							<div className="col-lg-8 mb-4 mb-md-0">
								<section className="">
									<div className="alert alert-warning">
										<strong>
											Review Your Shipping &amp; Order
											Details{" "}
										</strong>
									</div>
									<form>
										<h5 className="mb-4 mt-4">
											Shipping address
										</h5>
										<div className="row mb-4">
											<div className="col-lg-12">
												<div className="form-outline">
													<label
														className="form-label"
														htmlFor="form6Example2">
														Full Name
													</label>
													<input
														type="text"
														readOnly
														className="form-control"
														value={
															order.full_name ||
															""
														}
													/>
												</div>
											</div>

											<div className="col-lg-6 mt-4">
												<div className="form-outline">
													<label
														className="form-label"
														htmlFor="form6Example2">
														Email
													</label>
													<input
														type="text"
														readOnly
														className="form-control"
														value={
															order.email || ""
														}
													/>
												</div>
											</div>

											<div className="col-lg-6 mt-4">
												<div className="form-outline">
													<label
														className="form-label"
														htmlFor="form6Example2">
														Mobile
													</label>
													<input
														type="text"
														readOnly
														className="form-control"
														value={
															order.mobile || ""
														}
													/>
												</div>
											</div>
											<div className="col-lg-6 mt-4">
												<div className="form-outline">
													<label
														className="form-label"
														htmlFor="form6Example2">
														Address
													</label>
													<input
														type="text"
														readOnly
														className="form-control"
														value={
															order.address || ""
														}
													/>
												</div>
											</div>
											<div className="col-lg-6 mt-4">
												<div className="form-outline">
													<label
														className="form-label"
														htmlFor="form6Example2">
														City
													</label>
													<input
														type="text"
														readOnly
														className="form-control"
														value={order.city || ""}
													/>
												</div>
											</div>
											<div className="col-lg-6 mt-4">
												<div className="form-outline">
													<label
														className="form-label"
														htmlFor="form6Example2">
														State
													</label>
													<input
														type="text"
														readOnly
														className="form-control"
														value={
															order.state || ""
														}
													/>
												</div>
											</div>
											<div className="col-lg-6 mt-4">
												<div className="form-outline">
													<label
														className="form-label"
														htmlFor="form6Example2">
														Country
													</label>
													<input
														type="text"
														readOnly
														className="form-control"
														value={
															order.country || ""
														}
													/>
												</div>
											</div>
										</div>

										<h5 className="mb-4 mt-4">
											Billing address
										</h5>
										<div className="form-check mb-2">
											<input
												className="form-check-input me-2"
												type="checkbox"
												defaultValue=""
												id="form6Example8"
												defaultChecked=""
											/>
											<label
												className="form-check-label"
												htmlFor="form6Example8">
												Same as shipping address
											</label>
										</div>
									</form>
								</section>
								{/* Section: Biling details */}
							</div>
							<div className="col-lg-4 mb-4 mb-md-0">
								{/* Section: Summary */}
								<section className="shadow-4 p-4 rounded-5 mb-4">
									<h5 className="mb-3">Cart Summary</h5>
									<div className="d-flex justify-content-between mb-3">
										<span>Subtotal </span>
										<span>${order.sub_total}</span>
									</div>
									<div className="d-flex justify-content-between">
										<span>Shipping </span>
										<span>${order.shipping_amount}</span>
									</div>
									<div className="d-flex justify-content-between">
										<span>Tax </span>
										<span>${order.tax_fee}</span>
									</div>
									<div className="d-flex justify-content-between">
										<span>Servive Fee </span>
										<span>${order.service_fee}</span>
									</div>
									<div className="d-flex text-danger justify-content-between">
										<span>Discount </span>
										<span>-${order.saved}</span>
									</div>
									<hr className="my-4" />
									<div className="d-flex justify-content-between fw-bold mb-5">
										<span>Total </span>
										<span>${order.total}</span>
									</div>

									<div className="shadow p-3 d-flex mt-4 mb-4">
										<input
											name="couponCode"
											type="text"
											className="form-control"
											style={{
												border: "dashed 1px gray",
											}}
											placeholder="Enter Coupon Code"
											id=""
											onChange={(e) =>
												setCouponCode(e.target.value)
											}
										/>
										<button
											className="btn btn-success ms-1"
											onClick={applyCoupon}>
											<i className="fa fa-check-circle"></i>
										</button>
									</div>

									{paymentLoading == true ? (
										<form
											action={`${SERVER_URL}/api/v1/stripe-checkout/${order?.oid}`}
											method="POST">
											<button
												type="submit"
												disabled
												className="btn btn-primary btn-rounded w-100 mt-2"
												style={{
													backgroundColor: "#635BFF",
												}}>
												Processing
												<i className="ms-2 fa fa-spinner fa-spin"></i>
											</button>
										</form>
									) : (
										<form
											action={`${SERVER_URL}/api/v1/stripe-checkout/${order?.oid}`}
											method="POST">
											<button
												type="submit"
												className="btn btn-primary btn-rounded w-100 mt-2"
												onClick={payWithStripe}
												style={{
													backgroundColor: "#635BFF",
												}}>
												Pay with Stripe{" "}
												<i className="ms-2 fa fa-credit-card"></i>
											</button>
										</form>
									)}

									<PayPalScriptProvider
										options={initialOptions}>
										<PayPalButtons
											className="mt-3"
											createOrder={(data, actions) => {
												return actions.order.create({
													purchase_units: [
														{
															amount: {
																currency_code:
																	"USD",
																value: order.total.toString(),
															},
														},
													],
												});
											}}
											onApprove={async (
												data,
												actions
											) => {
												const details =
													await actions.order.capture();
												const name =
													details.payer.name
														.given_name;
												const status = details.status;
												const paypal_order_id =
													data.orderID;

												console.log(
													"Status: " + status
												);

												if (status === "COMPLETED") {
													navigate(
														`/payment-success/${order.oid}/?paypal_order_id=${paypal_order_id}`
													);
												}
											}}
										/>
									</PayPalScriptProvider>

									{/* <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Flutterwave)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paystack)</button>
                                <button type="button" className="btn btn-primary btn-rounded w-100 mt-2">Pay Now (Paypal)</button> */}
								</section>
							</div>
						</div>
					</section>
				</div>
			</main>
		</main>
	);
}

export default Checkout;
