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

function VendorProduct() {
	const [products, setProducts] = useState([]);

	const userData = UserData();

	const fetchProducts = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/products/${userData?.vendor_id}`
			);
			setProducts(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const handleDeleteProduct = async (productPID) => {
		try {
			const response = await axios.api_instance.delete(
				`vendor/vendor-delete-product/${userData?.vendor_id}/${productPID}`
			);

			Toast.fire({
				title: "Product deleted successfully",
				icon: "success",
			});

			fetchProducts();
		} catch (e) {
			console.log(e);
			Toast.fire({
				title: "Product not deleted due to unknown error",
				icon: "error",
			});
		}
	};
	// fetch vendor products
	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				<div className="col-md-9 col-lg-10 main mt-4">
					<div className="row mb-3 container">
						<h4>
							<i className="bi bi-grid" /> All Products
						</h4>
						<div className="dropdown">
							<button
								className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
								type="button"
								id="dropdownMenuButton1"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								Filter <i className="fa fa-sliders" />
							</button>
							<ul
								className="dropdown-menu"
								aria-labelledby="dropdownMenuButton1">
								<li>
									<a className="dropdown-item" href="#">
										Status: Live
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										Status: In-active
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										Status: In-review
									</a>
								</li>
								<hr />
								<li>
									<a className="dropdown-item" href="#">
										Date: Latest
									</a>
								</li>
								<li>
									<a className="dropdown-item" href="#">
										Date: Oldest
									</a>
								</li>
							</ul>
						</div>
						<table className="table">
							<thead className="table-dark">
								<tr>
									<th scope="col">#ID</th>
									<th scope="col">Name</th>
									<th scope="col">Price</th>
									<th scope="col">Quantity</th>
									<th scope="col">Orders</th>
									<th scope="col">Status</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								{products?.map((p, index) => (
									<tr key={index}>
										<th scope="row">#{p?.pid}</th>
										<td>{p?.title}</td>
										<td>${p?.price}</td>
										<td>{p?.stock_qty}</td>
										<td>{p?.orders}</td>
										<td>{p?.status?.toUpperCase()}</td>
										<td>
											<Link
												to={`/vendor/product/update/${p.pid}`}
												type="button"
												className="btn btn-success mb-1 me-2">
												<i className="fa fa-edit" />
											</Link>
											<Link
												type="button"
												className="btn btn-danger mb-1"
												onClick={() =>
													handleDeleteProduct(p?.pid)
												}>
												<i className="fa fa-trash" />
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VendorProduct;
