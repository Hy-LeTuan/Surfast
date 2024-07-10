import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import Swal from "sweetalert2";

function AddProduct() {
	const userData = UserData();

	const [product, setProduct] = useState({
		title: "",
		image: null,
		description: "",
		category: "",
		price: "",
		old_price: "",
		shipping_amount: "",
		stock_qty: "",
		vendor: userData?.vendor_id,
		in_stock: true,
	});

	const [specifications, setSpecifications] = useState([
		{
			title: "",
			content: "",
		},
	]);

	const [colors, setColors] = useState([{ name: "", color_code: "" }]);
	const [sizes, setSizes] = useState([{ name: "", price: "" }]);
	const [gallery, setGallery] = useState([{ image: "" }]);
	const [category, setCategory] = useState([]);

	const handleAddMore = (setStateFunction) => {
		setStateFunction((prevState) => [...prevState, {}]);
	};

	const handleRemove = (index, setStateFunction) => {
		setStateFunction((prevState) => {
			const newState = [...prevState];
			newState.splice(index, 1);
			return newState;
		});
	};

	const handleInputChange = (index, field, value, setStateFunction) => {
		setStateFunction((prevState) => {
			const newState = [...prevState];
			newState[index][field] = value;
			console.log(newState);
			return newState;
		});
	};

	const handleImageChange = (index, event, setStateFunction) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setStateFunction((prevState) => {
					const newState = [...prevState];
					newState[index].image = { file, preview: reader.result };

					return newState;
				});
			};

			reader.readAsDataURL(file);
		} else {
			setStateFunction((prevState) => {
				const newState = [...prevState];
				newState[index].image = null;
				newState[index].preview = null;

				return newState;
			});
		}
	};

	const handleProductInputChange = (event) => {
		setProduct({
			...product,
			[event.target.name]: event.target.value,
		});
	};

	const handleProductFileChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setProduct({
					...product,
					image: {
						file: file,
						preview: reader.result,
					},
				});
			};

			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		const formdata = new FormData();

		Object.entries(product).forEach(([key, value]) => {
			if (key === "image" && value) {
				formdata.append(key, value.file);
			} else {
				formdata.append(key, value);
			}
		});

		specifications.forEach((spec, index) => {
			Object.entries(spec).forEach(([key, value]) => {
				formdata.append(`specifications[${index}][${key}]`, value);
			});
		});

		colors.forEach((color, index) => {
			Object.entries(color).forEach(([key, value]) => {
				formdata.append(`colors[${index}][${key}]`, value);
			});
		});

		sizes.forEach((size, index) => {
			Object.entries(size).forEach(([key, value]) => {
				formdata.append(`sizes[${index}][${key}]`, value);
			});
		});

		gallery.forEach((item, index) => {
			if (item.image) {
				console.log("added image in gallery");
				formdata.append(`gallery[${index}][image]`, item.image.file);
			}
		});

		try {
			const response = await axios.api_instance.post(
				`vendor/vendor-create-product`,
				formdata,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			Swal.fire({
				title: "Product created successfully",
				icon: "success",
			});
			console.log(response.data);
		} catch (e) {
			Swal.fire({
				title: "Product creation failed due to unknown error",
				icon: "error",
			});
		}
	};

	// fetch available categories
	const fetchCategory = async () => {
		try {
			const response = await axios.api_instance.get(`category`);
			setCategory(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchCategory();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />

				<div className="col-md-9 col-lg-10 main mt-4">
					<div className="container">
						<form onSubmit={handleSubmit} className="main-body">
							<div className="tab-content" id="pills-tabContent">
								{/* Basic information */}
								<div
									className="tab-pane fade show active"
									id="pills-home"
									role="tabpanel"
									aria-labelledby="pills-home-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<h4 className="mb-4">
											Product Details
										</h4>
										<div className="col-md-12">
											<div className="card mb-3">
												<div className="card-body">
													<div className="form-group">
														<div className="row text-dark">
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Product
																	Thumbnail
																</label>
																<input
																	type="file"
																	className="form-control"
																	name="image"
																	id=""
																	onChange={
																		handleProductFileChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Title
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="title"
																	id=""
																	defaultValue={
																		product?.title ||
																		""
																	}
																	onChange={
																		handleProductInputChange
																	}
																/>
															</div>
															<div className="col-lg-12 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Description
																</label>
																<textarea
																	name="description"
																	className="form-control"
																	id=""
																	cols={30}
																	rows={10}
																	defaultValue={
																		product?.description ||
																		""
																	}
																	onChange={
																		handleProductInputChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Category
																</label>
																<select
																	name="category"
																	className="select form-control"
																	id=""
																	defaultValue={
																		product?.category ||
																		""
																	}
																	onChange={
																		handleProductInputChange
																	}>
																	<option value="">
																		Select
																	</option>
																	{category?.map(
																		(
																			c,
																			index
																		) => (
																			<option
																				key={
																					index
																				}
																				value={
																					c.id
																				}>
																				{
																					c.title
																				}
																			</option>
																		)
																	)}
																</select>
															</div>
															<div className="col-lg-6 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Brand
																</label>
																<input
																	type="text"
																	className="form-control"
																	name=""
																	id=""
																/>
															</div>
															<div className="col-lg-6 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Sale Price
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="price"
																	id=""
																	defaultValue={
																		product?.price ||
																		""
																	}
																	onChange={
																		handleProductInputChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Regular
																	Price
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="old_price"
																	id=""
																	defaultValue={
																		product?.old_price ||
																		""
																	}
																	onChange={
																		handleProductInputChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Shipping
																	Amount
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="shipping_amount"
																	id=""
																	defaultValue={
																		product?.shipping_amount ||
																		""
																	}
																	onChange={
																		handleProductInputChange
																	}
																/>
															</div>
															<div className="col-lg-6 mb-2 ">
																<label
																	htmlFor=""
																	className="mb-2">
																	Stock Qty
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="stock_qty"
																	id=""
																	defaultValue={
																		product?.stock_qty ||
																		""
																	}
																	onChange={
																		handleProductInputChange
																	}
																/>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Gallery */}
								<div
									className="tab-pane fade"
									id="pills-profile"
									role="tabpanel"
									aria-labelledby="pills-profile-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<h4 className="mb-4">Product Image</h4>
										<div className="col-md-12">
											<div className="card mb-3">
												<div className="card-body">
													{gallery.length < 1 && (
														<div className="fluid text-center">
															<h4 className="text-danger">
																No images
																uploaded
															</h4>
														</div>
													)}
													{gallery?.map(
														(item, index) => (
															<div
																className="row text-dark mb-3"
																key={index}>
																<div className="col-lg-6 mb-2">
																	<label
																		htmlFor=""
																		className="mb-2">
																		Product
																		Image
																	</label>
																	<input
																		type="file"
																		className="form-control"
																		name=""
																		id=""
																		onChange={(
																			event
																		) =>
																			handleImageChange(
																				index,
																				event,
																				setGallery
																			)
																		}
																	/>
																	<button
																		onClick={() =>
																			handleRemove(
																				index,
																				setGallery
																			)
																		}
																		type="button"
																		className="btn btn-danger mt-3">
																		Remove
																		image
																	</button>
																</div>
																<div className="col-lg-6 mb-2">
																	{item.image ? (
																		<img
																			src={
																				item
																					.image
																					?.preview
																			}
																			alt={`Product image number ${
																				index +
																				1
																			}`}
																			style={{
																				width: "100%",
																				height: "150px",
																				objectFit:
																					"cover",
																				borderRadius:
																					"10px",
																			}}
																		/>
																	) : (
																		<img
																			src="https://www.eclosio.ong/wp-content/uploads/2018/08/default.png"
																			alt="Default product image"
																			style={{
																				width: "100%",
																				objectFit:
																					"cover",
																				borderRadius:
																					"10px",
																			}}
																		/>
																	)}
																</div>
															</div>
														)
													)}
													<button
														className="btn btn-primary mt-5"
														type="button"
														onClick={() =>
															handleAddMore(
																setGallery
															)
														}>
														<i className="fa fa-plus" />{" "}
														Add Image
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Specifications */}
								<div
									className="tab-pane fade"
									id="pills-contact"
									role="tabpanel"
									aria-labelledby="pills-contact-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<h4 className="mb-4">Specifications</h4>
										<div className="col-md-12">
											<div className="card mb-3">
												<div className="card-body">
													{specifications.length <
														1 && (
														<div className="container-fluid text-center">
															<h4 className="text-danger">
																No
																specifications
																written
															</h4>
														</div>
													)}
													{specifications?.map(
														(spec, index) => (
															<div
																className="row text-dark mb-3"
																key={index}>
																<div className="col-lg-6 mb-2">
																	<label
																		htmlFor=""
																		className="mb-2">
																		Title
																	</label>
																	<input
																		type="text"
																		className="form-control"
																		name="title"
																		id=""
																		defaultValue={
																			spec.title ||
																			""
																		}
																		onChange={(
																			event
																		) =>
																			handleInputChange(
																				index,
																				"title",
																				event
																					.target
																					.value,
																				setSpecifications
																			)
																		}
																	/>
																	<button
																		className="btn btn-danger mt-3"
																		type="button"
																		onClick={() =>
																			handleRemove(
																				index,
																				setSpecifications
																			)
																		}>
																		Remove
																		specs
																	</button>
																</div>
																<div className="col-lg-6 mb-2">
																	<label
																		htmlFor=""
																		className="mb-2">
																		Content
																	</label>
																	<input
																		type="text"
																		className="form-control"
																		name="content"
																		id=""
																		defaultValue={
																			spec.content ||
																			""
																		}
																		onChange={(
																			event
																		) =>
																			handleInputChange(
																				index,
																				"content",
																				event
																					.target
																					.value,
																				setSpecifications
																			)
																		}
																	/>
																</div>
															</div>
														)
													)}
													<button
														className="btn btn-primary mt-5"
														type="button"
														onClick={() =>
															handleAddMore(
																setSpecifications
															)
														}>
														<i className="fa fa-plus" />{" "}
														Add Specifications
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div
									className="tab-pane fade"
									id="pills-contact"
									role="tabpanel"
									aria-labelledby="pills-contact-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<h4 className="mb-4">Size</h4>
										<div className="col-md-12">
											<div className="card mb-3">
												<div className="card-body">
													<div className="row text-dark">
														<div className="col-lg-6 mb-2">
															<label
																htmlFor=""
																className="mb-2">
																Title
															</label>
															<input
																type="text"
																className="form-control"
																name=""
																id=""
															/>
														</div>
														<div className="col-lg-6 mb-2">
															<label
																htmlFor=""
																className="mb-2">
																Content
															</label>
															<input
																type="text"
																className="form-control"
																name=""
																id=""
															/>
														</div>
													</div>
													<button className="btn btn-primary mt-5">
														<i className="fa fa-plus" />{" "}
														Add Specifications
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Sizes */}
								<div
									className="tab-pane fade"
									id="pills-size"
									role="tabpanel"
									aria-labelledby="pills-size-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<h4 className="mb-4">Size</h4>
										<div className="col-md-12">
											<div className="card mb-3">
												<div className="card-body">
													{sizes.length < 1 && (
														<div className="container-fluid text-center">
															<h4 className="text-danger">
																No sizes added
															</h4>
														</div>
													)}
													{sizes?.map((s, index) => (
														<div
															className="row text-dark mb-3"
															key={index}>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Size
																</label>
																<input
																	type="text"
																	className="form-control"
																	name="name"
																	placeholder="XXL"
																	defaultValue={
																		s.name ||
																		""
																	}
																	onChange={(
																		event
																	) =>
																		handleInputChange(
																			index,
																			"name",
																			event
																				.target
																				.value,
																			setSizes
																		)
																	}
																/>
																<button
																	className="btn btn-danger mt-3"
																	type="button"
																	onClick={() =>
																		handleRemove(
																			index,
																			setSizes
																		)
																	}>
																	Remove size
																</button>
															</div>
															<div className="col-lg-6 mb-2">
																<label
																	htmlFor=""
																	className="mb-2">
																	Price
																</label>
																<input
																	type="number"
																	placeholder="$20"
																	className="form-control"
																	name="price"
																	defaultValue={
																		s.price ||
																		""
																	}
																	onChange={(
																		event
																	) =>
																		handleInputChange(
																			index,
																			"price",
																			event
																				.target
																				.value,
																			setSizes
																		)
																	}
																/>
															</div>
														</div>
													))}
													<button
														className="btn btn-primary mt-5"
														type="button"
														onClick={() =>
															handleAddMore(
																setSizes
															)
														}>
														<i className="fa fa-plus" />{" "}
														Add Size
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>

								{/* Colors */}
								<div
									className="tab-pane fade"
									id="pills-color"
									role="tabpanel"
									aria-labelledby="pills-color-tab">
									<div className="row gutters-sm shadow p-4 rounded">
										<h4 className="mb-4">Color</h4>
										<div className="col-md-12">
											<div className="card mb-3">
												<div className="card-body">
													{colors.length < 1 && (
														<div className="container-fluid text-center">
															<h4 className="text-danger">
																No colors
																created
															</h4>
														</div>
													)}
													{colors?.map(
														(color, index) => (
															<div
																className="row text-dark mb-3"
																key={index}>
																<div className="col-lg-6 mb-2">
																	<label
																		htmlFor=""
																		className="mb-2">
																		Name
																	</label>
																	<input
																		type="text"
																		className="form-control"
																		name="name"
																		placeholder="Green"
																		defaultValue={
																			color.name ||
																			""
																		}
																		onChange={(
																			event
																		) =>
																			handleInputChange(
																				index,
																				"name",
																				event
																					.target
																					.value,
																				setColors
																			)
																		}
																	/>
																	<button
																		className="btn btn-danger mt-3"
																		type="button"
																		onClick={() =>
																			handleRemove(
																				index,
																				setColors
																			)
																		}>
																		Remove
																		color
																	</button>
																</div>
																<div className="col-lg-6 mb-2">
																	<label
																		htmlFor=""
																		className="mb-2">
																		Code
																	</label>
																	<input
																		type="text"
																		placeholder="#f4f7f6"
																		className="form-control"
																		name="color_code"
																		defaultValue={
																			color.color_code ||
																			""
																		}
																		onChange={(
																			event
																		) =>
																			handleInputChange(
																				index,
																				"color_code",
																				event
																					.target
																					.value,
																				setColors
																			)
																		}
																	/>
																</div>
															</div>
														)
													)}
													<button
														className="btn btn-primary mt-5"
														type="button"
														onClick={() =>
															handleAddMore(
																setColors
															)
														}>
														<i className="fa fa-plus" />{" "}
														Add Color
													</button>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div>
									<ul
										className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
										id="pills-tab"
										role="tablist">
										<li
											className="nav-item"
											role="presentation">
											<button
												className="nav-link active"
												id="pills-home-tab"
												data-bs-toggle="pill"
												data-bs-target="#pills-home"
												type="button"
												role="tab"
												aria-controls="pills-home"
												aria-selected="true">
												Basic Information
											</button>
										</li>
										<li
											className="nav-item"
											role="presentation">
											<button
												className="nav-link"
												id="pills-profile-tab"
												data-bs-toggle="pill"
												data-bs-target="#pills-profile"
												type="button"
												role="tab"
												aria-controls="pills-profile"
												aria-selected="false">
												Gallery
											</button>
										</li>
										<li
											className="nav-item"
											role="presentation">
											<button
												className="nav-link"
												id="pills-contact-tab"
												data-bs-toggle="pill"
												data-bs-target="#pills-contact"
												type="button"
												role="tab"
												aria-controls="pills-contact"
												aria-selected="false">
												Specifications
											</button>
										</li>
										<li
											className="nav-item"
											role="presentation">
											<button
												className="nav-link"
												id="pills-size-tab"
												data-bs-toggle="pill"
												data-bs-target="#pills-size"
												type="button"
												role="tab"
												aria-controls="pills-size"
												aria-selected="false">
												Size
											</button>
										</li>
										<li
											className="nav-item"
											role="presentation">
											<button
												className="nav-link"
												id="pills-color-tab"
												data-bs-toggle="pill"
												data-bs-target="#pills-color"
												type="button"
												role="tab"
												aria-controls="pills-color"
												aria-selected="false">
												Color
											</button>
										</li>
									</ul>
									<div className="d-flex justify-content-center mb-5">
										<button
											className="btn btn-success w-50"
											type="submit">
											Create Product{" "}
											<i className="fa fa-check-circle" />{" "}
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default AddProduct;
