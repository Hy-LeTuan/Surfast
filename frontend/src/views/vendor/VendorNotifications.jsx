import React, { useState, useEffect } from "react";
import VendorSidebar from "./VendorSidebar";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";
import moment from "moment";

function VendorNotifications() {
	const [notifications, setNotifications] = useState([]);
	const [stats, setStats] = useState([]);

	const userData = UserData();

	// fetch all notifications
	const fetchNotifications = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-notification-list/${userData?.vendor_id}`
			);
			setNotifications(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	const fetchStats = async () => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-notification-summary/${userData?.vendor_id}`
			);
			setStats(response.data[0]);
		} catch (e) {
			console.log(e);
		}
	};

	const markNotificationAsSeen = async (notiID) => {
		try {
			const response = await axios.api_instance.get(
				`vendor/vendor-notification-mark-as-seen/${userData?.vendor_id}/${notiID}`
			);
			fetchNotifications();
			fetchStats();
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		fetchNotifications();
		fetchStats();
	}, []);

	return (
		<div className="container-fluid" id="main">
			<div className="row row-offcanvas row-offcanvas-left h-100">
				<VendorSidebar />

				<div className="col-md-9 col-lg-10 main mt-4">
					<div className="row mb-3">
						<div className="col-xl-4 col-lg-6 mb-2">
							<div className="card card-inverse card-success">
								<div className="card-block bg-danger p-3">
									<div className="rotate">
										<i className="bi bi-tag fa-5x" />
									</div>
									<h6 className="text-uppercase">
										Un-read Notification
									</h6>
									<h1 className="display-1 fw-bold">
										{stats?.unread_notifications}
									</h1>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-lg-6 mb-2">
							<div className="card card-inverse card-success">
								<div className="card-block bg-success p-3">
									<div className="rotate">
										<i className="bi bi-tag fa-5x" />
									</div>
									<h6 className="text-uppercase">
										Read Notification
									</h6>
									<h1 className="display-1 fw-bold">
										{stats?.read_notifications}
									</h1>
								</div>
							</div>
						</div>
						<div className="col-xl-4 col-lg-6 mb-2">
							<div className="card card-inverse card-success">
								<div className="card-block bg-primary p-3">
									<div className="rotate">
										<i className="bi bi-tag fa-5x" />
									</div>
									<h6 className="text-uppercase">
										All Notification
									</h6>
									<h1 className="display-1 fw-bold">
										{stats?.all_notifications}
									</h1>
								</div>
							</div>
						</div>
					</div>
					<hr />
					<div className="row  container">
						<div className="col-lg-12">
							<h4 className="mt-3 mb-1">
								{" "}
								<i className="fa fa-bell" /> Notifications
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
											Date: Latest
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Date: Oldest
										</a>
									</li>
									<hr />
									<li>
										<a className="dropdown-item" href="#">
											Status: Read
										</a>
									</li>
									<li>
										<a className="dropdown-item" href="#">
											Status: UnRead
										</a>
									</li>
								</ul>
							</div>
							<table className="table">
								<thead className="table-dark">
									<tr>
										<th scope="col">S/N</th>
										<th scope="col">Type</th>
										<th scope="col">Order ID</th>
										<th scope="col">Message</th>
										<th scope="col">Status</th>
										<th scope="col">Date</th>
										<th scope="col">Action</th>
									</tr>
								</thead>
								<tbody>
									{notifications?.map((noti, index) => (
										<tr key={index}>
											<th>{index + 1}</th>
											<td>New Order</td>
											<td>#{noti.order?.oid}</td>
											<td>
												You've got a new order for{" "}
												<b>
													{
														noti.order_item?.product
															?.title
													}
												</b>
											</td>
											{noti.seen ? (
												<td>
													Read{" "}
													<i className="fa fa-eye" />
												</td>
											) : (
												<td>
													Unread{" "}
													<i className="fa fa-eye-slash" />
												</td>
											)}
											<td>
												{moment(noti.date).format(
													"MMM DD, YYYY"
												)}
											</td>
											<td>
												<button
													onClick={() =>
														markNotificationAsSeen(
															noti.id
														)
													}
													className="btn btn-secondary mb-1">
													<i className="fa fa-eye" />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VendorNotifications;
