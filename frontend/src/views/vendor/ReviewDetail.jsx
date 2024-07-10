import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";

function ReviewDetail() {
	const [review, setReview] = useState({});
	const [updateReview, setUpdateReview] = useState({ reply: "" });

	const userData = UserData();
	const params = useParams();

	const fetchReviewDetail = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-review-detail/${userData?.vendor_id}/${params.review_id}`
			);
			setReview(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleReplyChange = (event) => {
		setUpdateReview({
			...updateReview,
			[event.target.name]: event.target.value,
		});
	};

	const handleReplySubmit = async (event) => {
		event.preventDefault();

		const formdata = new FormData();
		formdata.append("reply", updateReview.reply);
		console.log(updateReview.reply);

		try {
			const response = await axios.api_instance.patch(
				`vendor/vendor-review-detail/${userData?.vendor_id}/${params.review_id}`,
				formdata
			);

			Swal.fire({
				title: "Replied successfully",
				icon: "success",
			});

			fetchReviewDetail();
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
		fetchReviewDetail();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				<div className="col-md-9 col-lg-10 main mt-4">
					<h4 className="mb-4">
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
								<div className="card mt-3 mb-3">
									<div className="card-body m-3">
										<div className="row">
											<div className="col-lg-4 d-flex justify-content-center align-items-center mb-4 mb-lg-0">
												<img
													src={review?.profile?.image}
													className="rounded-circle img-fluid shadow-1"
													alt={
														review?.profile
															?.full_name
													}
													style={{
														width: 200,
														height: 200,
														objectFit: "cover",
													}}
												/>
											</div>
											<div className="col-lg-8">
												<p className="text-dark  mb-2">
													<b>Review: </b>
													{review?.review}
												</p>
												<p className="text-dark mb-2 d-flex">
													<b>Reply: {""} </b>
													{review.reply === null ? (
														<span className="ms-2">
															{" "}
															No Response
														</span>
													) : (
														<span className="ms-2">
															{" "}
															{review.reply}
														</span>
													)}
												</p>
												<p className="text-dark mb-2">
													<strong>Name: </strong>
													{review?.profile?.full_name}
												</p>
												<p className=" mb-2">
													<b>Product</b>:{" "}
													{review?.product?.title}
												</p>
												<p className=" mb-0">
													Rating:
													{generateReviewStars(
														review.rating
													)}
												</p>
												<div className="= mt-3">
													<p>
														<a
															className="btn btn-primary"
															data-bs-toggle="collapse"
															href="#collapseExample"
															role="button"
															aria-expanded="false"
															aria-controls="collapseExample">
															<i className="fa fa-reply"></i>{" "}
															Reply
														</a>
													</p>
													<div
														className="collapse"
														id="collapseExample">
														<div className="card card-body">
															<form
																onSubmit={
																	handleReplySubmit
																}
																method="POST"
																className="d-flex">
																<input
																	onChange={
																		handleReplyChange
																	}
																	type="text"
																	className="form-control"
																	placeholder="Write Reply"
																	name="reply"
																	id=""
																/>
																<button
																	type="submit"
																	className="btn btn-success ms-2">
																	<i className="fa fa-paper-plane"></i>
																</button>
															</form>{" "}
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
			</div>
		</div>
	);
}

export default ReviewDetail;
