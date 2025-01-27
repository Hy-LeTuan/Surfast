import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import CartID from "../plugins/CartID";
import UserData from "../plugins/UserData";
import GetCurrentAddress from "../plugins/UserCountry";
import { CartContext } from "../plugins/Context";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
	toast: true,
	position: "top",
	showConfirmButton: false,
	timer: 1500,
	timerProgressBar: true,
});

function Cart() {
	const [cart, setCart] = useState([]);
	const [cartTotal, setCartTotal] = useState({});
	const [productQuantities, setProductQuantities] = useState([]);

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");

	const [address, setAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [country, setCountry] = useState("");

	const userData = UserData();
	const cart_id = CartID();
	const currentAddress = GetCurrentAddress();

	const [cartCount, setCartCount] = useContext(CartContext);

	const navigate = useNavigate();

	const fetchCartData = async (cartID, userID) => {
		const url = userID
			? `cart-list/${cartID}/${userID}`
			: `cart-list/${cartID}`;

		try {
			const response = await axios.api_instance.get(url);
			setCart(response.data);
			setCartCount(response.data.length);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchCartTotal = async (cartID, userID) => {
		const url = userID
			? `cart-detail/${cartID}/${userID}`
			: `cart-detail/${cartID}`;

		try {
			const response = await axios.api_instance.get(url);
			setCartTotal(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	if (cart_id !== undefined || cart_id !== null) {
		if (userData !== null || userData !== undefined) {
			// send cart data with user id
			useEffect(() => {
				fetchCartData(cart_id, userData?.user_id);
				fetchCartTotal(cart_id, userData?.user_id);
			}, []);
		} else {
			// send cart without user id and with cart id
			useEffect(() => {
				fetchCartData(cart_id, null);
				fetchCartTotal(cart_id, null);
			}, []);
		}
	}

	useEffect(() => {
		const initialQuantities = {};
		cart.forEach((c) => {
			initialQuantities[c.product?.id] = c.qty;
		});
		setProductQuantities(initialQuantities);
	}, [cart]);

	const handleQtyChange = (event, product_id) => {
		const quantity = event.target.value;

		setProductQuantities((prevQuantities) => ({
			...prevQuantities,
			[product_id]: quantity,
		}));
	};

	const updateCart = async (
		product_id,
		price,
		shipping_amount,
		color,
		size
	) => {
		const qtyValue = productQuantities[product_id];
		console.log("cart updated");
		console.log(qtyValue);

		const formdata = new FormData();

		formdata.append("product_id", product_id);
		formdata.append("user_id", userData.user_id);
		formdata.append("qty", qtyValue);
		formdata.append("price", price);
		formdata.append("shipping_amount", shipping_amount);
		formdata.append("country", currentAddress.country);
		formdata.append("size", size);
		formdata.append("color", color);
		formdata.append("cart_id", cart_id);

		try {
			const response = await axios.api_instance.post(
				"/cart-view",
				formdata
			);
			console.log(response);
			Toast.fire({
				icon: "success",
				title: response.data?.message,
			});
		} catch (e) {
			console.log(e);
		}

		fetchCartData(cart_id, userData?.user_id);
		fetchCartTotal(cart_id, userData?.user_id);
	};

	const handleDeleteCartItem = async (itemID) => {
		const url = userData?.user_id
			? `cart-delete/${cart_id}/${itemID}/${userData?.user_id}`
			: `cart-delete/${cart_id}/${itemID}`;

		try {
			const response = await axios.api_instance.delete(url);
			console.log(response.data);

			fetchCartData(cart_id, userData?.user_id);
			fetchCartTotal(cart_id, userData?.user_id);

			Toast.fire({
				icon: "success",
				title: "Item removed from cart",
			});
		} catch (e) {
			console.log(e);
		}
	};

	const handleShippingDetailChange = (event) => {
		const { name, value } = event.target;

		console.log("Name: " + name);
		console.log("Value: " + value);

		switch (name) {
			case "fullName":
				setFullName(value);
				break;
			case "email":
				setEmail(value);
				break;
			case "mobile":
				setMobile(value);
				break;
			case "address":
				setAddress(value);
				break;
			case "city":
				setCity(value);
				break;
			case "state":
				setState(value);
				break;
			case "country":
				setCountry(value);
				break;

			default:
				break;
		}
	};

	const createOrder = async () => {
		console.log("fullName: " + fullName);
		console.log("email: " + email);
		console.log("mobile: " + mobile);
		console.log("address: " + address);
		console.log("city: " + city);
		console.log("state: " + state);
		console.log("country: " + country);

		if (
			!fullName ||
			!email ||
			!mobile ||
			!address ||
			!city ||
			!state ||
			!country
		) {
			Swal.fire({
				icon: "warning",
				title: "Missing fields!",
				text: "All fields must be filled for checkout",
			});

			return;
		}

		const formdata = new FormData();

		formdata.append("full_name", fullName);
		formdata.append("email", email);
		formdata.append("mobile", mobile);
		formdata.append("address", address);
		formdata.append("city", city);
		formdata.append("state", state);
		formdata.append("country", country);

		formdata.append("cart_id", cart_id);
		formdata.append("user_id", userData ? userData?.user_id : 0);

		try {
			const response = await axios.api_instance.post(
				"create-order",
				formdata
			);
			console.log(response.data);

			Toast.fire({
				icon: "success",
				title: response.data?.message,
			});

			navigate(`/checkout/${response.data.order_oid}`);
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<main className="mt-5">
			<div className="container">
				<main className="mb-6">
					<div className="container">
						<section className="">
							<div className="row gx-lg-5 mb-5">
								<div className="col-lg-8 mb-4 mb-md-0">
									<section className="mb-5">
										{/* Single Item */}
										{cart?.map((c, index) => (
											<div
												className="row border-bottom mb-4"
												key={index}>
												<div className="col-md-2 mb-4 mb-md-0">
													<div
														className="bg-image ripple rounded-5 mb-4 overflow-hidden d-block"
														data-ripple-color="light">
														<Link to="">
															<img
																src={
																	c.product
																		?.image
																}
																className="w-100"
																alt=""
																style={{
																	height: "100px",
																	objectFit:
																		"cover",
																	borderRadius:
																		"10px",
																}}
															/>
														</Link>
														<a href="#!">
															<div className="hover-overlay">
																<div
																	className="mask"
																	style={{
																		backgroundColor:
																			"hsla(0, 0%, 98.4%, 0.2)",
																	}}
																/>
															</div>
														</a>
													</div>
												</div>
												<div className="col-md-8 mb-4 mb-md-0">
													<Link
														to={null}
														className="fw-bold text-dark mb-4">
														{c.product?.title}
													</Link>
													{c.size !== "No size" &&
														c.size !==
															"undefined" && (
															<p className="mb-0">
																<span className="text-muted me-2">
																	Size:
																</span>
																<span>
																	{c.size}
																</span>
															</p>
														)}
													{c.color !== "No color" &&
														c.color !==
															"undefined" && (
															<p className="mb-0">
																<span className="text-muted me-2">
																	Color:
																</span>
																<span>
																	{c?.color}
																</span>
															</p>
														)}
													<p className="mb-0">
														<span className="text-muted me-2">
															Price:
														</span>
														<span>
															${c.product.price}
														</span>
													</p>
													<p className="mb-0">
														<span className="text-muted me-2">
															Stock Qty:
														</span>
														<span>{c.qty}</span>
													</p>
													<p className="mb-0">
														<span className="text-muted me-2">
															Vendor:
														</span>
														<span>Desphixs</span>
													</p>
													<p className="mt-3">
														<button
															className="btn btn-danger"
															onClick={() =>
																handleDeleteCartItem(
																	c.id
																)
															}>
															<small>
																<i className="fa fa-trash me-2" />
																Remove
															</small>
														</button>
													</p>
												</div>
												<div className="col-md-2 mb-4 mb-md-0">
													<div className="d-flex justify-content-center align-items-center">
														<div className="form-outline">
															<input
																type="number"
																className="form-control"
																value={
																	productQuantities[
																		c
																			.product
																			?.id
																	] || c.qty
																}
																min={1}
																onChange={(e) =>
																	handleQtyChange(
																		e,
																		c
																			.product
																			?.id
																	)
																}
															/>
														</div>
														<button
															onClick={() =>
																updateCart(
																	c.product
																		?.id,
																	c.product
																		?.price,
																	c.product
																		?.shipping_amount,
																	c.color,
																	c.size
																)
															}
															className="ms-2 btn btn-primary">
															<i className="fa fa-rotate-right"></i>
														</button>
													</div>
													<h5 className="mt-3 mb-2 text-left">
														{/* <s className="text-muted small align-middle">
															$119.00
														</s> */}
														<span className="ms-2 align-middle">
															${c.sub_total}
														</span>
													</h5>
													{/* <p className="text-danger mb-0">
														<small>
															You save 15%
														</small>
													</p> */}
												</div>
											</div>
										))}
										{/* Single Item End*/}
										{cart.length < 1 && (
											<>
												<h5>Your Cart Is Empty</h5>
												<Link to="/">
													{" "}
													<i className="fa fa-shopping-cart"></i>{" "}
													Continue Shopping
												</Link>
											</>
										)}
									</section>

									{cart.length > 0 && (
										<div>
											<h5 className="mb-4 mt-4">
												Personal Information
											</h5>
											{/* 2 column grid layout with text inputs for the first and last names */}
											<div className="row mb-4">
												<div className="col">
													<div className="form-outline">
														<label
															className="form-label"
															htmlFor="full_name">
															{" "}
															<i className="fa fa-user"></i>{" "}
															Full Name
														</label>
														<input
															type="text"
															id=""
															name="fullName"
															className="form-control"
															onChange={
																handleShippingDetailChange
															}
														/>
													</div>
												</div>
											</div>

											<div className="row mb-4">
												<div className="col">
													<div className="form-outline">
														<label
															className="form-label"
															htmlFor="form6Example1">
															<i className="fa fa-envelope"></i>{" "}
															Email
														</label>
														<input
															type="text"
															id="form6Example1"
															className="form-control"
															onChange={
																handleShippingDetailChange
															}
															name="email"
														/>
													</div>
												</div>
												<div className="col">
													<div className="form-outline">
														<label
															className="form-label"
															htmlFor="form6Example1">
															<i className="fa fa-phone"></i>{" "}
															Mobile
														</label>
														<input
															type="text"
															id="form6Example1"
															className="form-control"
															onChange={
																handleShippingDetailChange
															}
															name="mobile"
														/>
													</div>
												</div>
											</div>

											<h5 className="mb-1 mt-4">
												Shipping address
											</h5>

											<div className="row mb-4">
												<div className="col-lg-6 mt-3">
													<div className="form-outline">
														<label
															className="form-label"
															htmlFor="form6Example1">
															{" "}
															Address
														</label>
														<input
															type="text"
															id="form6Example1"
															className="form-control"
															onChange={
																handleShippingDetailChange
															}
															name="address"
														/>
													</div>
												</div>
												<div className="col-lg-6 mt-3">
													<div className="form-outline">
														<label
															className="form-label"
															htmlFor="form6Example1">
															{" "}
															City
														</label>
														<input
															type="text"
															id="form6Example1"
															className="form-control"
															onChange={
																handleShippingDetailChange
															}
															name="city"
														/>
													</div>
												</div>

												<div className="col-lg-6 mt-3">
													<div className="form-outline">
														<label
															className="form-label"
															htmlFor="form6Example1">
															{" "}
															State
														</label>
														<input
															type="text"
															id="form6Example1"
															className="form-control"
															onChange={
																handleShippingDetailChange
															}
															name="state"
														/>
													</div>
												</div>
												<div className="col-lg-6 mt-3">
													<div className="form-outline">
														<label
															className="form-label"
															htmlFor="form6Example1">
															{" "}
															Country
														</label>
														<input
															type="text"
															id="form6Example1"
															className="form-control"
															onChange={
																handleShippingDetailChange
															}
															name="country"
														/>
													</div>
												</div>
											</div>
										</div>
									)}
								</div>

								{cart.length > 0 && (
									<div className="col-lg-4 mb-4 mb-md-0">
										{/* Section: Summary */}
										<section className="shadow-4 p-4 rounded-5 mb-4">
											<h5 className="mb-3">
												Cart Summary
											</h5>
											<div className="d-flex justify-content-between mb-3">
												<span>Subtotal </span>
												<span>
													$
													{cartTotal.total_sub_total?.toFixed(
														2
													)}
												</span>
											</div>
											<div className="d-flex justify-content-between">
												<span>Shipping </span>
												<span>
													$
													{cartTotal.total_shipping?.toFixed(
														2
													)}
												</span>
											</div>
											<div className="d-flex justify-content-between">
												<span>Tax </span>
												<span>
													$
													{cartTotal.total_tax?.toFixed(
														2
													)}
												</span>
											</div>
											<div className="d-flex justify-content-between">
												<span>Servive Fee </span>
												<span>
													$
													{cartTotal.total_service_fee?.toFixed(
														2
													)}
												</span>
											</div>
											<hr className="my-4" />
											<div className="d-flex justify-content-between fw-bold mb-5">
												<span>Total </span>
												<span>
													$
													{cartTotal.total_total?.toFixed(
														2
													)}
												</span>
											</div>
											<button
												className="btn btn-primary btn-rounded w-100"
												onClick={createOrder}>
												Got to checkout
											</button>
										</section>
										<section className="mx-4 shadow card p-4 rounded-2">
											<h5 className="mb-4">Promo Code</h5>
											<div className="d-flex align-items-center">
												<input
													type="text"
													name=""
													id=""
													placeholder="Promo code"
													className="form-control rounded me-1"
												/>
												<button
													type="button"
													className="btn btn-success btn-rounded overflow-visible">
													Apply
												</button>
											</div>
										</section>
									</div>
								)}
							</div>
						</section>
					</div>
				</main>
			</div>
		</main>
	);
}

export default Cart;
