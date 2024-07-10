import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Link, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
	toast: true,
	position: "top",
	showConfirmButton: false,
	timer: 1500,
	timerProgressBar: true,
});

function EditCoupon() {
	const [coupon, setCoupon] = useState({});

	const userData = UserData();
	const params = useParams();

	const fetchCouponDetail = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-coupon-detail/${userData?.vendor_id}/${params?.coupon_id}`
			);
			console.log(response.data);
			setCoupon(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleCouponChange = (event) => {
		setCoupon({
			...coupon,
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
		formdata.append("code", coupon?.code);
		formdata.append("discount", coupon.discount);
		formdata.append("active", coupon?.active);

		try {
			const response = await axios.api_instance.patch(
				`vendor/vendor-coupon-detail/${userData?.vendor_id}/${params?.coupon_id}`,
				formdata
			);
			Toast.fire({
				icon: "success",
				title: "Coupon updated successfully!",
			});
			fetchCouponDetail();
		} catch (e) {
			Toast.fire({
				icon: "error",
				title: "Coupon updated failed due to unknown error",
			});
		}
	};

	// set specific coupon detail
	useEffect(() => {
		fetchCouponDetail();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				<div className="col-md-9 col-lg-10 main mt-4">
					<h4 className="mt-3 mb-4">
						<i className="bi bi-tag" /> Coupons
					</h4>
					<form
						className="card shadow p-3"
						onSubmit={handleCouponCreate}>
						<div className="mb-3">
							<label
								htmlFor="exampleInputEmail1"
								className="form-label">
								Code
							</label>
							<input
								type="text"
								className="form-control"
								id="exampleInputEmail1"
								aria-describedby="emailHelp"
								name="code"
								placeholder="Enter Coupon Code"
								defaultValue={coupon?.code}
								onChange={handleCouponChange}
							/>
						</div>
						<div className="mb-3 mt-2">
							<label
								htmlFor="exampleInputPassword1"
								className="form-label">
								Discount
							</label>
							<input
								type="number"
								className="form-control"
								id="exampleInputPassword1"
								name="discount"
								placeholder="Enter Discount"
								defaultValue={coupon?.discount}
								onChange={handleCouponChange}
							/>
							<div id="emailHelp" className="form-text">
								NOTE: Discount is in <b>percentage</b>
							</div>
						</div>
						<div className="mb-3 mt-2 form-check">
							<input
								name="active"
								type="checkbox"
								className="form-check-input"
								id="exampleCheck1"
								defaultChecked={coupon?.active}
								onChange={handleCouponChange}
							/>
							<label
								className="form-check-label"
								htmlFor="exampleCheck1">
								Activate Coupon
							</label>
						</div>
						<div className="mt-2 d-flex">
							<Link
								to="/vendor/coupon/"
								className="btn btn-secondary">
								<i className="fa fa-arrow-left"></i> Go Back
							</Link>
							<button
								type="submit"
								className="btn btn-success ms-2">
								Update Coupon{" "}
								<i className="fa fa-check-circle"></i>
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default EditCoupon;
