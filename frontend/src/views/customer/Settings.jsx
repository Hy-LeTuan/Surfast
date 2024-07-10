import React, { useState, useEffect, useRef } from "react";
import Sidebar from "./Sidebar";
import moment from "moment";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import Swal from "sweetalert2";

function Settings() {
	const [profile, setProfile] = useState({});

	const userData = UserData();
	const originalImage = useRef("");

	const fetchProfileData = async () => {
		try {
			const response = await axios.api_instance.get(
				`user/profile/${userData.user_id}`
			);
			console.log(response.data);
			setProfile(response.data);

			originalImage.current = response.data.image;
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchProfileData();
	}, []);

	const handleInputChange = (event) => {
		setProfile({
			...profile,
			[event.target.name]: event.target.value,
		});
	};

	const handleImageChange = (event) => {
		setProfile({
			...profile,
			[event.target.name]: event.target.files[0],
		});
	};

	const handleFormSubmit = async (event) => {
		event.preventDefault();
		console.log("profile updated");
		console.log("Profile: ");
		console.log(profile);

		const formdata = new FormData();

		formdata.append(
			"full_name",
			profile.full_name == "null" || !profile.full_name
				? "None"
				: profile.full_name
		);

		formdata.append(
			"address",
			profile.address == "null" || !profile.address
				? "None"
				: profile.address
		);

		formdata.append(
			"city",
			profile.city == "null" || !profile.city ? "None" : profile.city
		);

		formdata.append(
			"state",
			profile.state == "null" || !profile.state ? "None" : profile.state
		);

		formdata.append(
			"country",
			profile.country == "null" || !profile.country
				? "None"
				: profile.country
		);

		if (profile.image && profile.image !== originalImage.current) {
			formdata.append("image", profile.image);
		}

		try {
			const response = await axios.api_instance.patch(
				`user/profile/${userData.user_id}`,
				formdata,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			fetchProfileData();
			console.log(response);
			Swal.fire({
				title: "Profile updated successfully",
				icon: "success",
			});
		} catch (e) {
			console.log(e);
			Swal.fire({
				title: "Error occured when updating profile",
				icon: "error",
			});
		}
	};

	return (
		<main className="mt-5">
			<div className="container">
				<section className="">
					<div className="row">
						<Sidebar />

						<div className="col-lg-9 mt-1">
							<section className="">
								<main className="mb-5" style={{}}>
									<div className="container px-4">
										<section className="">
											<h3 className="mb-3">
												{" "}
												<i className="fa fa-gear fa-spin" />{" "}
												Settings{" "}
											</h3>
											<form encType="multipart/form-data">
												<div className="row">
													<div className="col-lg-12">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															Profile Image
														</label>
														<input
															type="file"
															className="form-control"
															aria-describedby="imageHelp"
															name="image"
															onChange={
																handleImageChange
															}
														/>
													</div>
													<div className="col-lg-12">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															Full Name
														</label>
														<input
															type="text"
															className="form-control"
															aria-describedby="emailHelp"
															value={
																profile?.full_name ||
																"None"
															}
															name="full_name"
															onChange={
																handleInputChange
															}
														/>
													</div>
													<div className="col-lg-6 mt-3">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															Email address
														</label>
														<input
															type="email"
															className="form-control"
															aria-describedby="emailHelp"
															value={
																profile?.user
																	?.email ||
																"None"
															}
															name="full_name"
															onChange={
																handleInputChange
															}
															readOnly
														/>
													</div>
													<div className="col-lg-6 mt-3">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															Mobile
														</label>
														<input
															type="text"
															className="form-control"
															aria-describedby="emailHelp"
															value={
																profile?.user
																	?.phone ||
																"None"
															}
															readOnly
														/>
													</div>
												</div>
												<br />
												<div className="row">
													<div className="col-lg-6">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															Address
														</label>
														<input
															type="text"
															className="form-control"
															aria-describedby="emailHelp"
															value={
																profile?.address !==
																	null &&
																profile?.address !==
																	"null"
																	? profile.address
																	: "None"
															}
															name="address"
															onChange={
																handleInputChange
															}
														/>
													</div>
													<div className="col-lg-6">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															City
														</label>
														<input
															type="text"
															className="form-control"
															aria-describedby="emailHelp"
															value={
																profile?.city ||
																"None"
															}
															name="city"
															onChange={
																handleInputChange
															}
														/>
													</div>
													<div className="col-lg-6 mt-3">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															State
														</label>
														<input
															type="text"
															className="form-control"
															aria-describedby="emailHelp"
															value={
																profile?.state ||
																"None"
															}
															name="state"
															onChange={
																handleInputChange
															}
														/>
													</div>
													<div className="col-lg-6 mt-3">
														<label
															htmlFor="exampleInputEmail1"
															className="form-label">
															Country
														</label>
														<input
															type="text"
															className="form-control"
															aria-describedby="emailHelp"
															value={
																profile?.country ||
																"None"
															}
															name="country"
															onChange={
																handleInputChange
															}
														/>
													</div>
												</div>
												<button
													type="submit"
													className="btn btn-primary mt-5"
													onClick={handleFormSubmit}>
													Save Changes
												</button>
											</form>
										</section>
									</div>
								</main>
							</section>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}

export default Settings;
