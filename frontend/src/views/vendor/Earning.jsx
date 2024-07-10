import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import { Link } from "react-router-dom";
import moment from "moment";
import { Bar, Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function Earning() {
	const [earningStats, setEarningStats] = useState({});
	const [earningStatsTracker, setEarningStatsTracker] = useState([]);
	const [earningChart, setEarningChart] = useState([]);

	const userData = UserData();

	const fetchEarning = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-earning/${userData?.vendor_id}`
			);
			setEarningStats(response.data[0]);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchStatsTracker = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-monthly-earning/${userData?.vendor_id}`
			);
			setEarningStatsTracker(response.data);
			setEarningChart(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const getMonthName = (monthNumber) => {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		if (monthNumber >= 1 && monthNumber <= 12) {
			return months[monthNumber - 1];
		} else {
			return "Invalid month number";
		}
	};

	const months = earningChart?.map((item, index) => {
		return item.month;
	});
	const sales = earningChart?.map((item, index) => {
		return item.sales_count;
	});
	const revenue = earningChart?.map((item, index) => {
		return item.total_earning;
	});

	console.log(months, sales, revenue);

	const revenue_data = {
		labels: months,
		datasets: [
			{
				label: "Total Sales Revenue",
				data: revenue,
				fill: true,
				backgroundColor: "green",
			},
		],
	};

	const sales_count_data = {
		labels: months,
		datasets: [
			{
				label: "Total Sales Count",
				data: sales,
				fill: true,
				backgroundColor: "blue",
			},
		],
	};

	useEffect(() => {
		fetchEarning();
		fetchStatsTracker();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />
				<div className="col-md-9 col-lg-10 main mt-4">
					<div className="row mb-3">
						<div className="col-xl-6 col-lg-6 mb-2">
							<div className="card card-inverse card-success">
								<div className="card-block bg-success p-3">
									<div className="rotate">
										<i className="bi bi-currency-dollar fa-5x" />
									</div>
									<h6 className="text-uppercase">
										Total Sales
									</h6>
									<h1 className="display-1 fw-bold">
										${earningStats?.total_revenue}
									</h1>
								</div>
							</div>
						</div>
						<div className="col-xl-6 col-lg-6 mb-2">
							<div className="card card-inverse card-danger">
								<div className="card-block bg-danger p-3">
									<div className="rotate">
										<i className="bi bi-currency-dollar fa-5x" />
									</div>
									<h6 className="text-uppercase">
										Monthly Earning
									</h6>
									<h1 className="display-1 fw-bold">
										${earningStats?.monthly_revenue}
									</h1>
								</div>
							</div>
						</div>
					</div>
					<hr />
					<div className="row  container">
						<div className="col-lg-12">
							<h4 className="mt-3 mb-4">Revenue Tracker</h4>
							<table className="table">
								<thead className="table-dark">
									<tr>
										<th scope="col">Month</th>
										<th scope="col">Orders</th>
										<th scope="col">Revenue</th>
										<th scope="col">Action</th>
									</tr>
								</thead>
								<tbody>
									{earningStatsTracker?.map((e, index) => (
										<tr key={index}>
											<th scope="row">
												{getMonthName(e.month)}
											</th>
											<td>{e.sales_count}</td>
											<td>${e.total_earning}</td>
											<td>
												<Link
													to={""}
													className="btn btn-primary mb-1">
													<i className="fa fa-eye" />
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
						<div className="container">
							<div className="row ">
								<div className="col">
									<h4 className="mt-4">Revenue Analytics</h4>
								</div>
							</div>
							<div className="row my-2">
								<div className="col-md-6 py-1">
									<div className="card">
										<div className="card-body">
											<Line data={revenue_data} />
										</div>
									</div>
								</div>
								<div className="col-md-6 py-1">
									<div className="card">
										<div className="card-body">
											<Line data={sales_count_data} />
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

export default Earning;
