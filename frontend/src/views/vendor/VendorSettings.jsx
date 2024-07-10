import React, { useState, useEffect, useRef } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

function VendorSettings() {
	const [profileData, setProfileData] = useState([]);
	const [vendorData, setVendorData] = useState({});
	const originalProfileImage = useRef("");
	const originalVendorImage = useRef("");

	const userData = UserData();

	// fetch profile
	const fetchProfileData = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-settings/${userData?.user_id}`
			);
			setProfileData(response.data);
			originalProfileImage.current = response.data.image;
		} catch (e) {
			console.log(e);
		}
	};

	// fetch vendor data
	const fetchVendorData = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-shop-settings/${userData?.vendor_id}`
			);
			setVendorData(response.data);
			originalVendorImage.current = response.data.image;
		} catch (e) {
			console.log(e);
		}
	};

	// handle profile change and update
	const handleInputChange = (event) => {
		setProfileData({
			...profileData,
			[event.target.name]: event.target.value,
		});
	};

	const handleFileChange = (event) => {
		setProfileData({
			...profileData,
			[event.target.name]: event.target.files[0],
		});
	};

	const handleProfileSubmit = async (event) => {
		event.preventDefault();
		const formdata = new FormData();

		formdata.append(
			"full_name",
			profileData.full_name == "null" || !profileData.full_name
				? "None"
				: profileData.full_name
		);

		formdata.append(
			"about",
			profileData.about == "null" || !profileData.about
				? "No description"
				: profileData.about
		);

		if (
			profileData.image &&
			profileData.image !== originalProfileImage.current
		) {
			formdata.append("image", profileData.image);
		}

		try {
			const response = await axios.api_instance.patch(
				`vendor/vendor-settings/${userData?.user_id}`,
				formdata,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setProfileData(response.data);
			originalProfileImage.current = response.data.image;
			Swal.fire({
				title: "Profile updated successfully",
				icon: "success",
			});
		} catch (e) {
			Swal.fire({
				title: "Profile update failed due to unknown error",
				icon: "error",
			});
		}
	};

	// handle shop change and update
	const handleShopInputChange = (event) => {
		setVendorData({
			...vendorData,
			[event.target.name]: event.target.value,
		});
	};

	const handleShopFileChange = (event) => {
		setVendorData({
			...vendorData,
			[event.target.name]: event.target.files[0],
		});
	};

	const handleShopSubmit = async (event) => {
		event.preventDefault();
		const formdata = new FormData();

		formdata.append(
			"name",
			vendorData.name == "null" || !vendorData.name
				? "None"
				: vendorData.name
		);

		formdata.append(
			"description",
			vendorData.description == "null" || !vendorData.description
				? "No description"
				: vendorData.description
		);

		formdata.append(
			"email",
			vendorData.email == "null" || !vendorData.email
				? "None"
				: vendorData.email
		);

		formdata.append(
			"mobile",
			vendorData.mobile == "null" || !vendorData.mobile
				? "None"
				: vendorData.mobile
		);

		if (
			vendorData.image &&
			vendorData.image !== originalVendorImage.current
		) {
			formdata.append("image", vendorData.image);
		}

		try {
			const response = await axios.api_instance.patch(
				`vendor/vendor-shop-settings/${userData?.user_id}`,
				formdata,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			setVendorData(response.data);
			originalVendorImage.current = response.data.image;
			Swal.fire({
				title: "Shop information updated successfully",
				icon: "success",
			});
		} catch (e) {
			Swal.fire({
				title: "Shop information update failed due to unknown error",
				icon: "error",
			});
		}
	};

	useEffect(() => {
		fetchProfileData();
		fetchVendorData();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				<div className="col-md-9 col-lg-10 main mt-4">
					<div className="container">
						<div className="main-body">
							<ul
								className="nav nav-pills mb-3"
								id="pills-tab"
								role="tablist">
								<li className="nav-item" role="presentation">
									<button
										className="nav-link active"
										id="pills-home-tab"
										data-bs-toggle="pill"
										data-bs-target="#pills-home"
										type="button"
										role="tab"
										aria-controls="pills-home"
										aria-selected="true">
										Profile
									</button>
								</li>
								<li className="nav-item" role="presentation">
									<button
										className="nav-link"
										id="pills-profile-tab"
										data-bs-toggle="pill"
										data-bs-target="#pills-profile"
										type="button"
										role="tab"
										aria-controls="pills-profile"
										aria-selected="false">
										Shop
									</button>
								</li>
							</ul>
							<div className="tab-content" id="pills-tabContent">
								<div
									className="tab-pane fade show active"
									id="pills-home"
									role="tabpanel"
									aria-labelledby="pills-home-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<div className="col-md-4 mb-3">
											<div className="card h-100">
												<div className="card-body">
													<div className="d-flex flex-column align-items-center text-center">
														<img
															src={
																originalProfileImage.current
															}
															style={{
																width: 160,
																height: 160,
																objectFit:
																	"cover",
															}}
															alt="Admin"
															className="rounded-circle"
															width={150}
														/>
														<div className="mt-3">
															<h4 className="text-dark">
																{
																	profileData?.full_name
																}
															</h4>
															<p className="text-secondary mb-1">
																{profileData?.about ||
																	"No description"}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-md-8">
											<div className="card mb-3">
												<div className="card-body">
													<form
														onSubmit={
															handleProfileSubmit
														}
														className="form-group"
														method="POST"
														noValidate=""
														encType="multipart/form-data">
														<div className="row text-dark">
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Profile
																	Image
																</label>
																<input
																	type="file"
																	className="form-control"
																	name="image"
																	id=""
																	onChange={
																		handleFileChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Full Name
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="full_name"
																	id=""
																	defaultValue={
																		profileData?.full_name ||
																		""
																	}
																	onChange={
																		handleInputChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Email
																</label>
																<input
																	type="text"
																	className="form-control"
																	name=""
																	id=""
																	value={
																		profileData
																			?.user
																			?.email ||
																		""
																	}
																	readOnly
																/>
															</div>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Phone Number
																</label>
																<input
																	type="text"
																	className="form-control"
																	name=""
																	id=""
																	value={
																		profileData
																			?.user
																			?.phone ||
																		""
																	}
																	readOnly
																/>
															</div>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Gender
																</label>
																<select
																	name="gender"
																	id=""
																	className="form-control"
																	onChange={
																		handleInputChange
																	}
																	defaultValue={
																		profileData?.gender ||
																		""
																	}>
																	<option value="male">
																		Male
																	</option>
																	<option value="female">
																		Female
																	</option>
																	<option value="female">
																		Female
																	</option>
																	<option value="not_specified">
																		Not
																		specified
																	</option>
																</select>
															</div>
															<div className="col-lg-12 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	About Me
																</label>
																<textarea
																	onChange={
																		handleInputChange
																	}
																	className="form-control"
																	name="about"
																	id=""
																	defaultValue={
																		profileData?.about ||
																		""
																	}
																	cols={30}
																	rows={10}
																/>
															</div>
															<div className="col-lg-6 mt-4 mb-3">
																<button
																	className="btn btn-success"
																	type="submit">
																	Update
																	Profile{" "}
																	<i className="fa fa-check-circle" />{" "}
																</button>
															</div>
														</div>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									className="tab-pane fade"
									id="pills-profile"
									role="tabpanel"
									aria-labelledby="pills-profile-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<div className="col-md-4 mb-3">
											<div className="card h-100">
												<div className="card-body">
													<div className="d-flex flex-column align-items-center text-center">
														<img
															src={
																originalVendorImage.current
															}
															style={{
																width: 160,
																height: 160,
																objectFit:
																	"cover",
															}}
															alt="Admin"
															className="rounded-circle"
															width={150}
														/>
														<div className="mt-3">
															<h4 className="text-dark">
																{
																	vendorData?.name
																}
															</h4>
															<p className="text-secondary mb-1">
																{
																	vendorData?.description
																}
															</p>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="col-md-8">
											<div className="card mb-3">
												<div className="card-body">
													<form
														onSubmit={
															handleShopSubmit
														}
														className="form-group"
														method="POST"
														noValidate=""
														encType="multipart/form-data">
														<div className="row text-dark">
															<div className="col-lg-12 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Shop Image
																</label>
																<input
																	onChange={
																		handleShopFileChange
																	}
																	type="file"
																	className="form-control"
																	name="image"
																	id=""
																/>
															</div>
															<div className="col-lg-12 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Shop Name
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="name"
																	id=""
																	defaultValue={
																		vendorData?.name ||
																		""
																	}
																	onChange={
																		handleShopInputChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Email
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="email"
																	id=""
																	onChange={
																		handleShopInputChange
																	}
																	defaultValue={
																		vendorData?.email ||
																		""
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Phone Number
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="mobile"
																	id=""
																	defaultValue={
																		vendorData?.mobile ||
																		""
																	}
																	onChange={
																		handleShopInputChange
																	}
																/>
															</div>
															<div className="col-lg-12 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Shop
																	description
																</label>
																<textarea
																	className="form-control"
																	name="description"
																	id=""
																	defaultValue={
																		vendorData?.description ||
																		""
																	}
																	cols={30}
																	rows={10}
																	onChange={
																		handleShopInputChange
																	}
																/>
															</div>
															<div className="col mt-4 mb-3">
																<button
																	className="btn btn-success"
																	type="submit">
																	Update Shop{" "}
																	<i className="fa fa-check-circle" />{" "}
																</button>
																<Link
																	to={`/vendor/${vendorData.slug}`}
																	className="ms-3 btn btn-primary"
																	type="submit">
																	View Shop{" "}
																	<i className="fa fa-shopping-cart" />{" "}
																</Link>
															</div>
														</div>
													</form>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VendorSettings;
