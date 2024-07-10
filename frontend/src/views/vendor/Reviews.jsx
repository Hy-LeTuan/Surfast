import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Link } from "react-router-dom";
import moment from "moment";

function Reviews() {
	const [reviews, setReviews] = useState([]);

	const userData = UserData();

	const fetchReviews = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-reviews/${userData?.vendor_id}`
			);
			setReviews(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const generateReviewStars = (count) => {
		const iTags = [];

		for (let i = 0; i < count; i++) {
			iTags.push(
				<i
					key={i}
					className="fa fa-star ms-1"
					style={{ color: "orange" }}></i>
			);
		}

		return <>{iTags}</>;
	};

	useEffect(() => {
		fetchReviews();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				{/*/col*/}
				<div className="ms-4 col-md-8 col-lg-9 main mt-4">
					<h4>
						<i className="fa fa-star" /> Reviews and Rating
					</h4>

					<section
						className="p-4 p-md-5 text-center text-lg-start shadow-1-strong rounded"
						style={{
							backgroundImage:
								"url(https://mdbcdn.b-cdn.net/img/Photos/Others/background2.webp)",
						}}>
						<div className="row d-flex justify-content-center align-items-center">
							<div className="col-md-10">
								{reviews?.map((review, index) => (
									<div className="card mt-3 mb-3" key={index}>
										<div className="card-body m-3">
											<div className="row">
												<div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
													<img
														src={
															review.profile
																?.image
														}
														className="rounded-circle img-fluid shadow-1"
														alt={
															review.profile
																?.full_name
														}
														width={200}
														height={200}
													/>
												</div>
												<div className="col-lg-8">
													<p className="text-dark fw-bold mb-4">
														Review:{" "}
														<i>{review.review}</i>
													</p>
													<p className="text-dark fw-bold mb-4">
														Reply:{" "}
														{review.reply == null ||
														review.reply ==
															"null" ||
														review.reply == "" ? (
															<i className="text-danger">
																No reply yet
															</i>
														) : (
															<i>
																{review.reply}
															</i>
														)}
													</p>
													<p className="fw-bold text-dark mb-2">
														<strong>
															Name:{" "}
															{
																review.profile
																	?.full_name
															}
														</strong>
													</p>
													<p className="fw-bold text-muted mb-0">
														Product:{" "}
														{review.product?.title}
													</p>
													<p className="fw-bold text-muted mb-0">
														Rating:{" "}
														{generateReviewStars(
															review.rating
														)}
													</p>
													<div className="d-flex mt-3">
														<p className="fw-bold text-muted mb-0">
															<Link
																to={`/vendor/reviews/${review?.id}`}
																className="btn btn-primary">
																Reply{" "}
																<i className="fa fa-pen" />
															</Link>
														</p>
													</div>
												</div>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

export default Reviews;
