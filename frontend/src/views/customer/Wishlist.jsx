import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import UserData from "../plugins/UserData";
import axios from "../../utils/axios";
import moment from "moment";
import Swal from "sweetalert2";

function Wishlist() {
	const [wishlist, setWishlist] = useState([]);

	const userData = UserData();

	const getWishlistItems = async () => {
		try {
			const response = await axios.api_instance.get(
				`customer/wishlist/${userData?.user_id}`
			);
			setWishlist(response.data);
			console.log(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		getWishlistItems();
	}, []);

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
			getWishlistItems();
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div>
			<main className="mt-5">
				<div className="container">
					<section className="">
						<div className="row">
							<Sidebar />
							<div className="col-lg-9 mt-1">
								<section className="">
									<main className="mb-5" style={{}}>
										<div className="container">
											{/* Section: Summary */}
											<section className="">
												<div className="row">
													<h3 className="mb-3">
														{" "}
														<i className="fa fa-heart text-danger" />{" "}
														Wishlist{" "}
													</h3>
													{wishlist?.map(
														(w, index) => (
															<div
																className="col-lg-4 col-md-12 mb-4"
																key={index}>
																<div className="card">
																	<div
																		className="bg-image hover-zoom ripple"
																		data-mdb-ripple-color="light">
																		<Link
																			to={`/detail/${w.product.slug}`}>
																			<img
																				src={
																					w
																						.product
																						.image
																				}
																				className="w-100"
																				style={{
																					width: "100px",
																					height: "300px",
																					objectFit:
																						"cover",
																				}}
																			/>
																		</Link>
																		<a href="#!">
																			<div className="mask">
																				<div className="d-flex justify-content-start align-items-end h-100">
																					<h5>
																						<span className="badge badge-primary ms-2">
																							New
																						</span>
																					</h5>
																				</div>
																			</div>
																			<div className="hover-overlay">
																				<div
																					className="mask"
																					style={{
																						backgroundColor:
																							"rgba(251, 251, 251, 0.15)",
																					}}
																				/>
																			</div>
																		</a>
																	</div>
																	<div className="card-body">
																		<a
																			href=""
																			className="text-reset">
																			<h6 className="card-title mb-3 ">
																				{w?.product?.title.slice(
																					0,
																					30
																				)}
																			</h6>
																		</a>
																		<a
																			href=""
																			className="text-reset">
																			<p>
																				{
																					w
																						.product
																						?.category
																						?.title
																				}
																			</p>
																		</a>
																		<h6 className="mb-3">
																			$
																			{
																				w
																					.product
																					.price
																			}
																		</h6>

																		<button
																			onClick={() =>
																				handleAddToWishlist(
																					w
																						.product
																						.id,
																					userData.user_id
																				)
																			}
																			type="button"
																			className="btn btn-danger px-3 me-1 mb-1">
																			<i className="fa fa-heart" />
																		</button>
																	</div>
																</div>
															</div>
														)
													)}

													{wishlist.length < 1 && (
														<h6 className="container">
															Your wishlist is
															Empty{" "}
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

export default Wishlist;
