import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
	toast: true,
	position: "top",
	showConfirmButton: false,
	timer: 1500,
	timerProgressBar: true,
});

function Coupon() {
	const [stats, setStats] = useState([]);
	const [coupons, setCoupons] = useState([]);
	const [createCoupon, setCreateCoupon] = useState({
		code: "",
		discount: "",
		active: true,
	});

	const userData = UserData();

	const fetchCouponData = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-coupon-list/${userData?.vendor_id}`
			);
			setCoupons(response.data);
			console.log(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchCouponStats = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-coupon-stats/${userData?.vendor_id}`
			);
			setStats(response.data[0]);
		} catch (e) {
			console.log(e);
		}
	};

	const handleDeleteCoupon = async (couponID) => {
		try {
			const response = await axios.api_instance.delete(
				`vendor/vendor-coupon-detail/${userData?.vendor_id}/${couponID}`
			);
			console.log(response.data);
			Toast.fire({
				icon: "success",
				title: "Coupon deleted successfully",
			});
			fetchCouponData();
			fetchCouponStats();
		} catch (e) {
			console.log(e);
		}
	};

	const handleCouponChange = (event) => {
		setCreateCoupon({
			...createCoupon,
			[event.target.name]:
				event.target.type === "checkbox"
					? event.target.checked
					: event.target.value,
		});
	};

	const handleCouponCreate = async (event) => {
		event.preventDefault();

		const formdata = new FormData();

		formdata.append("vendor_id", userData?.vendor_id);
		formdata.append("code", createCoupon?.code);
		formdata.append("discount", createCoupon.discount);
		formdata.append("active", createCoupon?.active);

		try {
			const response = await axios.api_instance.post(
				`vendor/vendor-coupon-list/${userData?.vendor_id}`,
				formdata
			);
			console.log(response.data);
			Toast.fire({
				icon: "success",
				title: "Coupon created successfully",
			});
			fetchCouponData();
			fetchCouponStats();
		} catch (e) {
			Toast.fire({
				icon: "error",
				title: "Coupon creation failed due to unknown error",
			});
		}
	};

	useEffect(() => {
		fetchCouponData();
		fetchCouponStats();
	}, []);

	return (
		<>
			<div className="container-fluid" id="main">
				<div className="row row-offcanvas row-offcanvas-left h-100">
					<VendorSidebar />
					<div className="col-md-9 col-lg-10 main mt-4">
						<div className="row mb-3">
							<div className="col-xl-6 col-lg-6 mb-2">
								<div className="card card-inverse card-success">
									<div className="card-block bg-success p-3">
										<h6 className="text-uppercase">
											Total Coupons
										</h6>
										<h1 className="display-1 fw-bold ">
											{stats?.total_coupons}
										</h1>
									</div>
								</div>
							</div>
							<div className="col-xl-6 col-lg-6 mb-2">
								<div className="card card-inverse card-danger">
									<div className="card-block bg-danger p-3">
										<div className="rotate"></div>
										<h6 className="text-uppercase fw-bold">
											Active Coupons
										</h6>
										<h1 className="display-1 fw-bold">
											{stats?.active_coupons}
										</h1>
									</div>
								</div>
							</div>
						</div>
						<hr />
						<div className="row">
							<div className="col-lg-12">
								<div className="d-flex align-items-center gap-3">
									<h4 className="mt-3 mb-4">
										<i className="fa fa-tag"> Coupons</i>
									</h4>
									<div className="container">
										<button
											type="button"
											className="btn btn-primary"
											data-bs-toggle="modal"
											data-bs-target="#exampleModal">
											<span>Create new coupon</span>
											<i className="ms-2 fa fa-plus"></i>
										</button>
										<div
											className="modal fade"
											id="exampleModal"
											tabIndex="-1"
											role="dialog"
											aria-labelledby="exampleModalLabel"
											aria-hidden={true}>
											<div
												className="modal-dialog"
												role="document">
												<div className="modal-content">
													<div className="modal-header">
														<h5
															className="modal-title"
															id="exampleModalLabel">
															Create new coupon
														</h5>
													</div>
													<div className="modal-body">
														<form
															onSubmit={
																handleCouponCreate
															}>
															<div className="form-group mb-3">
																<label htmlFor="couponCode">
																	Coupon Code
																</label>
																<input
																	type="text"
																	className="form-control mt-2"
																	id="couponCode"
																	name="code"
																	onChange={
																		handleCouponChange
																	}
																	aria-describedby="couponHelp"
																	placeholder="Enter coupon code"
																/>
															</div>
															<div className="form-group mb-3">
																<label htmlFor="discountAmount">
																	Discount
																</label>
																<input
																	type="text"
																	className="form-control mt-2"
																	id="discountAmount"
																	placeholder="Discount amount"
																	name="discount"
																	onChange={
																		handleCouponChange
																	}
																/>
															</div>
															<div className="form-check mb-3">
																<input
																	checked={
																		createCoupon?.active ||
																		false
																	}
																	onChange={
																		handleCouponChange
																	}
																	name="active"
																	type="checkbox"
																	className="form-check-input"
																	id="exampleCheck1"
																/>
																<label
																	className="form-check-label"
																	htmlFor="exampleCheck1">
																	Active
																</label>
															</div>
															<button
																type="submit"
																className="btn btn-primary">
																Create coupon
															</button>
														</form>
													</div>
													<div className="modal-footer">
														<button
															type="button"
															className="btn btn-secondary"
															data-bs-dismiss="modal"
															aria-label="Close">
															Close
														</button>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<table className="table w-100">
									<thead className="table-dark">
										<tr>
											<th scope="col">S/N</th>
											<th scope="col">Code</th>
											<th scope="col">Type</th>
											<th scope="col">Discount</th>
											<th scope="col">Redemption</th>
											<th scope="col">Status</th>
											<th scope="col">Action</th>
										</tr>
									</thead>
									<tbody>
										{coupons?.map((c, index) => (
											<tr key={index}>
												<th>{index + 1}</th>
												<td>{c.code}</td>
												<td>Percentage</td>
												<td>{c.discount}%</td>
												<td>{c.used_by.length}</td>
												{c.active ? (
													<td className="fw-bold">
														Active
													</td>
												) : (
													<td className="fw-bold">
														Not active
													</td>
												)}
												<td>
													<Link
														to={`/vendor/coupon/${c.id}`}
														className="me-3 btn btn-primary mb-1">
														<i className="fa fa-edit"></i>
													</Link>
													<button
														onClick={() =>
															handleDeleteCoupon(
																c.id
															)
														}
														className="btn btn-danger mb-1">
														<i className="fa fa-trash"></i>
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
								<hr />
								<div className="container-fluid p-0"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default Coupon;
