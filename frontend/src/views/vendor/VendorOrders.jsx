import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import moment from "moment";
import { Link } from "react-router-dom";

function VendorOrders() {
	const [orders, setOrders] = useState([]);

	const userData = UserData();

	const handleFilterOrders = async (filter) => {
		const url = `vendor/orders/filter/${userData.vendor_id}?filter=${filter}`;
		console.log(url);
		try {
			const response = await axios.api_instance.get(url);
			console.log(response.data);
			setOrders(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	// fetch orders
	useEffect(() => {
		(async () => {
			try {
				const response = await axios.api_instance.get(
					`vendor/orders/${userData.vendor_id}`
				);
				console.log(response.data);
				setOrders(response.data);
			} catch (e) {
				console.log(e);
			}
		})();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				<div className="col-md-9 col-lg-10 main mt-4 ">
					<h4>
						<i className="bi bi-cart-check-fill"> All Orders </i>
					</h4>
					<i className="bi bi-cart-check-fill">
						<div className="dropdown">
							<button
								className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4"
								type="button"
								id="dropdownMenuClickable"
								data-bs-toggle="dropdown"
								data-bs-autoclose="false"
								aria-expanded="false">
								Filter <i className="ms-2 fa fa-sliders"></i>
							</button>
							<ul
								className="dropdown-menu"
								aria-labelledby="dropdownMenuButton1">
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("all")
										}>
										All Orders
									</a>
								</li>
								<hr />
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("paid")
										}>
										Payment Status: Paid
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("processing")
										}>
										Payment Status: Processing
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("pending")
										}>
										Payment Status: Pending
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("cancelled")
										}>
										Payment Status: Cancelled
									</a>
								</li>
								<hr />
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("latest")
										}>
										Date: Latest
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("oldest")
										}>
										Date: Oldest
									</a>
								</li>
								<hr />
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("Fulfilled")
										}>
										Order Status: Fulfilled
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("Pending")
										}>
										Order Status: Pending
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										onClick={() =>
											handleFilterOrders("Cancelled")
										}>
										Order Status: Cancelled
									</a>
								</li>
							</ul>
						</div>
						<table className="table">
							<thead className="table-dark">
								<tr>
									<th scope="col">Order ID #</th>
									<th scope="col">Total</th>
									<th scope="col">Payment Status</th>
									<th scope="col">Delivery Status</th>
									<th scope="col">Date</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								{orders?.map((o, index) => (
									<tr key={index}>
										<th scope="row">#{o?.oid}</th>
										<td>${o?.total}</td>
										<td>
											{o?.payment_status.toUpperCase()}
										</td>
										<td>{o?.order_status.toUpperCase()}</td>
										<td>
											{moment(o?.date).format(
												"MMM DD, YYYY"
											)}
										</td>
										<td>
											<Link
												to={`/vendor/orders/${o.oid}`}
												className="btn btn-primary mb-1">
												<i className="fa fa-eye"></i>
											</Link>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</i>
				</div>
				<i className="bi bi-cart-check-fill">
					<i className="fas fa-sliders"></i>
				</i>
			</div>
			<i className="bi bi-cart-check-fill">
				<i className="fas fa-sliders"></i>
			</i>
		</div>
	);
}

export default VendorOrders;
