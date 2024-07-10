import React, { useState, useEffect, useContext } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { CartContext } from "../plugins/Context";
import CartID from "../plugins/CartID";
import GetCurrentAddress from "../plugins/UserCountry";

const Toast = Swal.mixin({
	toast: true,
	position: "top",
	showConfirmButton: false,
	timer: 1500,
	timerProgressBar: true,
});

function Shop() {
	const [vendor, setVendor] = useState({});
	const [products, setProducts] = useState([]);
	const [colorValue, setColorValue] = useState("No color");
	const [sizeValue, setSizeValue] = useState("No size");
	const [qtyValue, setQtyValue] = useState(1);

	const [selectedProduct, setSelectedProduct] = useState(null);

	const [selectedColors, setSelectedColors] = useState({});
	const [selectedSize, setSelectedSize] = useState({});

	const [cartCount, setCartCount] = useContext(CartContext);

	const currentAddress = GetCurrentAddress();
	const userData = UserData();
	const cart_id = CartID();
	const params = useParams();

	// fetch vendor
	const fetchVendor = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/shop/${params?.slug}`
			);
			setVendor(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	// fetch shop products
	const fetchShopProducts = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-products/${params?.slug}`
			);
			console.log(response.data);
			setProducts(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleColorButtonClick = (event, product_id, colorName) => {
		setColorValue(colorName);
		setSelectedProduct(product_id);

		setSelectedColors((prevSelectedColor) => ({
			...prevSelectedColor,
			[product_id]: colorName,
		}));
	};

	const handleSizeButtonClick = (event, product_id, sizeName) => {
		setSizeValue(sizeName);
		setSelectedProduct(product_id);

		setSelectedSize((prevSelectedSize) => ({
			...prevSelectedSize,
			[product_id]: sizeName,
		}));
	};

	const handleQtyChange = (event, product_id) => {
		setQtyValue(event.target.value);
		setSelectedProduct(product_id);
	};

	const handleAddToCart = async (product_id, price, shipping_amount) => {
		const formdata = new FormData();

		formdata.append("product_id", product_id);
		formdata.append("user_id", userData.user_id);
		formdata.append("qty", qtyValue);
		formdata.append("price", price);
		formdata.append("shipping_amount", shipping_amount);
		formdata.append("country", currentAddress.country);
		formdata.append("size", selectedSize[product_id]);
		formdata.append("color", selectedColors[product_id]);
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

			const url = userData?.user_id
				? `cart-list/${cart_id}/${userData.user_id}`
				: `cart-list/${cart_id}`;

			try {
				const cartListResponse = await axios.api_instance.get(url);
				setCartCount(cartListResponse.data.length);
			} catch (e) {
				console.log(e);
			}
		} catch (e) {
			console.log(e);
		}
	};
	const handleAddToWishlist = async (productID, userID) => {
		console.log("Added to wishlist ");
		console.log(productID);
		console.log(userID);

		const formdata = new FormData();

		formdata.append("product_id", productID);
		formdata.append("user_id", userID);

		try {
			const response = await axios.api_instance.post(
				`customer/wishlist/${userID}`,
				formdata
			);
			console.log(response.data);

			Swal.fire({
				title: response.data.message,
				icon: "success",
			});
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchVendor();
		fetchShopProducts();
	}, []);

	return (
		<div className="container-fluid">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				<div className="text-center col-md-9 col-lg-10 main mt-4">
					<section className="">
						<img
							src={vendor?.image}
							style={{
								width: 100,
								height: 100,
								objectFit: "cover",
								borderRadius: "50%",
							}}
							alt=""
						/>
						<h1 className="fw-light">{vendor?.name}</h1>
						<p className="lead text-muted">{vendor?.description}</p>
					</section>
					<section className="text-center">
						<h4 className="mb-4">{products.length} Product(s) </h4>
						<div className="row">
							{/* Run the .map() function here */}
							{products?.map((p, index) => (
								<div key={index} className="col-md-4">
									<div className="card shadow border rounded-2 p-2 m-3">
										<Link to={`/detail/${p.slug}`}>
											<img
												src={p.image}
												alt=""
												className="card-img-top mb-3"
												style={{
													height: "18rem",
													objectFit: "cover",
												}}
											/>
										</Link>
										<div className="card-body">
											<Link
												to={`/detail/${p.slug}`}
												style={{
													color: "black",
													textDecoration: "none",
												}}>
												<h5
													className="card-title"
													key={p.id}>
													{p.title}
												</h5>
											</Link>

											{p.category ? (
												<h6 className="card-subtitle mb-3 text-muted">
													{p.category.title}
												</h6>
											) : (
												<h6 className="card-subtitle mb-3 text-muted">
													No Category
												</h6>
											)}

											<div className="card-text">
												<p>{p.description}</p>
												<p>
													<span className="fw-bold">
														Price:{" "}
													</span>
													<strike className="mx-2 fst-italic">
														${p.old_price}
													</strike>
													<span className="fw-bold">
														${p.price}
													</span>
												</p>
											</div>

											<div className="btn-group">
												<button
													className="btn btn-primary dropdown-toggle"
													type="button"
													id="dropdownMenuClickable"
													data-bs-toggle="dropdown"
													data-bs-auto-close="false"
													aria-expanded="false">
													Variation
												</button>
												<ul
													className="dropdown-menu"
													aria-labelledby="dropdownMenuClickable">
													<div className="d-flex flex-column">
														<li className="p-1">
															<b>Quantity</b>:{" "}
															{qtyValue}
														</li>
														<div className="p-1 mt-0 pt-0 d-flex flex-wrap">
															<li>
																<input
																	type="number"
																	className="form-control"
																	name=""
																	id=""
																	onChange={(
																		e
																	) => {
																		handleQtyChange(
																			e,
																			p.id
																		);
																	}}
																/>
															</li>
														</div>
													</div>
													<hr className="hr hr-blurry" />

													{p.size?.length > 0 && (
														<>
															<div className="d-flex flex-column">
																<li className="p-1">
																	<b>Size</b>:{" "}
																	{selectedSize[
																		p.id
																	] ||
																		"Select a size"}
																</li>
																<div className="p-1 mt-0 pt-0 d-flex flex-wrap">
																	{p.size?.map(
																		(
																			size,
																			index
																		) => (
																			<li
																				key={
																					index
																				}>
																				<button
																					className="btn btn-secondary btn-sm me-2 mb-1"
																					onClick={(
																						e
																					) => {
																						handleSizeButtonClick(
																							e,
																							p.id,
																							size.name
																						);
																					}}>
																					{
																						size.name
																					}
																				</button>
																			</li>
																		)
																	)}
																</div>
															</div>
															<hr className="hr hr-blurry" />
														</>
													)}
													{p.color?.length > 0 && (
														<>
															<div className="d-flex flex-column mt-3">
																<li className="p-1">
																	<b>Color</b>
																	:{" "}
																	{selectedColors[
																		p.id
																	] ||
																		"Select a color"}
																</li>
																<div className="p-1 mt-0 pt-0 d-flex flex-wrap">
																	{p.color?.map(
																		(
																			color,
																			index
																		) => (
																			<li
																				key={
																					index
																				}>
																				<button
																					className="btn btn-sm me-2 mb-1 p-3"
																					style={{
																						backgroundColor: `${color.color_code}`,
																					}}
																					onClick={(
																						e
																					) => {
																						handleColorButtonClick(
																							e,
																							p.id,
																							color.name
																						);
																					}}
																				/>
																			</li>
																		)
																	)}
																</div>
															</div>
															<hr className="hr hr-blurry" />
														</>
													)}
													<div className="d-flex p-1 align-items-center ">
														<button
															type="button"
															className="btn btn-primary px-3 me-1"
															onClick={() => {
																handleAddToCart(
																	p.id,
																	p.price,
																	p.shipping_amount
																);
															}}>
															<i className="fa fa-shopping-cart" />
														</button>
														<button
															type="button"
															className="btn btn-danger px-3 me-1 ms-2">
															<i className="fa fa-heart" />
														</button>
													</div>
												</ul>
												<button
													type="button"
													className="btn btn-danger px-3 me-1 ms-2"
													onClick={() =>
														handleAddToWishlist(
															p.id,
															userData?.user_id
														)
													}>
													<i className="fa fa-heart" />
												</button>
											</div>
										</div>
									</div>
								</div>
							))}
							{/* .map() function end here */}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

export default Shop;
