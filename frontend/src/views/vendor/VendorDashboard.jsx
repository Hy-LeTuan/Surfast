import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function VendorDashboard() {
	const [stats, setStats] = useState({});
	const [orderChartData, setOrderChartData] = useState([]);
	const [productChartData, setProductChartData] = useState([]);
	const [products, setProducts] = useState([]);

	const userData = UserData();

	const fetchStats = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/stats/${userData?.vendor_id}`
			);

			setStats(response.data[0]);
		} catch (e) {
			console.log(e);
		}
	};

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

	// fetch vendor statistics, vendor products
	useEffect(() => {
		fetchStats();
		fetchProducts();
	}, []);

	// fetch order chart data
	useEffect(() => {
		(async () => {
			try {
				const response = await axios.api_instance.get(
					`vendor/vendor-orders-chart/${userData?.vendor_id}`
				);
				setOrderChartData(response.data);
			} catch (e) {
				console.log(e);
			}
		})();
	}, []);

	// fetch products chart data
	useEffect(() => {
		(async () => {
			try {
				const response = await axios.api_instance.get(
					`vendor/vendor-products-chart/${userData?.vendor_id}`
				);
				setProductChartData(response.data);
			} catch (e) {
				console.log(e);
			}
		})();
	}, []);

	const order_months = orderChartData?.map((item, index) => {
		return item.month;
	});

	const order_counts = orderChartData?.map((item, index) => {
		return item.orders;
	});

	const product_months = productChartData?.map((item, index) => {
		return item.month;
	});

	const product_counts = productChartData?.map((item, index) => {
		return item.products;
	});

	const order_data = {
		labels: order_months,
		datasets: [
			{
				label: "Total Orders",
				data: order_counts,
				fill: true,
				backgroundColor: "green",
			},
		],
	};

	const product_data = {
		labels: product_months,
		datasets: [
			{
				label: "Total Products",
				data: product_counts,
				fill: true,
				backgroundColor: "blue",
			},
		],
	};

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />

				<div className="col-md-9 col-lg-10 main mt-4">
					<div className="row mb-3">
						<div className="col-xl-3 col-lg-6 mb-2">
							<div className="card card-inverse card-success">
								<div className="card-block bg-success p-3">
									<div className="rotate">
										<i className="bi bi-grid fa-5x" />
									</div>
									<h6 className="text-uppercase">Products</h6>
									<h1 className="display-1 fw-bold">
										{stats?.products}
									</h1>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-lg-6 mb-2">
							<div className="card card-inverse card-danger">
								<div className="card-block bg-danger p-3">
									<div className="rotate">
										<i className="bi bi-cart-check fa-5x" />
									</div>
									<h6 className="text-uppercase">Orders</h6>
									<h1 className="display-1 fw-bold">
										{stats?.orders}
									</h1>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-lg-6 mb-2">
							<div className="card card-inverse card-info">
								<div className="card-block bg-info p-3">
									<div className="rotate">
										<i className="bi bi-people fa-5x" />
									</div>
									<h6 className="text-uppercase">
										Customers
									</h6>
									<h1 className="display-1 fw-bold">125</h1>
								</div>
							</div>
						</div>
						<div className="col-xl-3 col-lg-6 mb-2">
							<div className="card card-inverse card-warning">
								<div className="card-block bg-warning p-3">
									<div className="rotate">
										<i className="bi bi-currency-dollar fa-5x" />
									</div>
									<h6 className="text-uppercase">Revenue</h6>
									<h1 className="display-1 fw-bold">
										${stats?.revenue}
									</h1>
								</div>
							</div>
						</div>
					</div>
					{/*/row*/}
					<hr />
					<div className="container">
						<div className="row my-3">
							<div className="col">
								<h4>Chart Analytics</h4>
							</div>
						</div>
						<div className="row my-2">
							<div className="col-lg-6 py-1">
								<div className="card">
									<div className="card-body">
										<Line data={order_data} />
									</div>
								</div>
							</div>
							<div className="col-lg-6 py-1">
								<div className="card">
									<div className="card-body">
										<Line data={product_data} />
									</div>
								</div>
							</div>
						</div>
					</div>
					<a id="layouts" />
					<hr />
					<div className="row mb-3 container">
						<div
							className="col-lg-12"
							style={{ marginBottom: 100 }}>
							{/* Nav tabs */}
							<ul className="nav nav-tabs" role="tablist">
								<li className="nav-item">
									<a
										className="nav-link active"
										href="#home1"
										role="tab"
										data-toggle="tab">
										Products
									</a>
								</li>
								<li className="nav-item">
									<a
										className="nav-link"
										href="#profile1"
										role="tab"
										data-toggle="tab">
										Orders
									</a>
								</li>
							</ul>
							{/* Tab panes */}
							<div className="tab-content">
								<br />
								<div
									role="tabpanel"
									className="tab-pane active"
									id="home1">
									<h4>Products</h4>
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
													<th scope="row">
														#{p?.pid}
													</th>
													<td>{p?.title}</td>
													<td>${p?.price}</td>
													<td>{p?.stock_qty}</td>
													<td>{p?.orders}</td>
													<td>
														{p?.status?.toUpperCase()}
													</td>
													<td>
														<a
															href=""
															className="btn btn-primary mb-1">
															<i className="fa fa-eye" />
														</a>
														<a
															href=""
															className="btn btn-success mb-1">
															<i className="fa fa-edit" />
														</a>
														<a
															href=""
															className="btn btn-danger mb-1">
															<i className="fa fa-trash" />
														</a>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
								<div
									role="tabpanel"
									className="tab-pane"
									id="profile1">
									<h4>Orders</h4>
									<table className="table">
										<thead className="table-dark">
											<tr>
												<th scope="col">#Order ID</th>
												<th scope="col">Total</th>
												<th scope="col">
													Payment Status
												</th>
												<th scope="col">
													Delivery Status
												</th>
												<th scope="col">Date</th>
												<th scope="col">Action</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<th scope="row">#trytrr</th>
												<td>$100.90</td>
												<td>Paid</td>
												<td>Shipped</td>
												<td>20th June, 2023</td>
												<td>
													<a
														href=""
														className="btn btn-primary mb-1">
														<i className="fa fa-eye" />
													</a>
												</td>
											</tr>
											<tr>
												<th scope="row">#hjkjhkhk</th>
												<td>$210.90</td>
												<td>Pending</td>
												<td>Not Shipped</td>
												<td>21th June, 2023</td>
												<td>
													<a
														href=""
														className="btn btn-primary mb-1">
														<i className="fa fa-eye" />
													</a>
												</td>
											</tr>
											<tr>
												<th scope="row">#retrey</th>
												<td>$260.90</td>
												<td>Failed</td>
												<td>Not Shipped</td>
												<td>25th June, 2023</td>
												<td>
													<a
														href=""
														className="btn btn-primary mb-1">
														<i className="fa fa-eye" />
													</a>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VendorDashboard;
