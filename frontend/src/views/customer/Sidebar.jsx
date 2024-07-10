import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import UserData from "../plugins/UserData";

// import UseProfileData from "../plugin/UseProfileData";

function Sidebar() {
	const [profile, setProfile] = useState({});

	const userData = UserData();

	useEffect(() => {
		(async () => {
			try {
				const response = await axios.api_instance.get(
					`user/profile/${userData?.user_id}`
				);

				setProfile(response.data);
			} catch (e) {
				console.log(e);
			}
		})();
	}, []);

	return (
		<div className="col-lg-3">
			{/* {loading === false && ( */}
			<>
				<div className="d-flex justify-content-center align-items-center flex-column mb-4 shadow rounded-3">
					<img
						src={profile?.image}
						style={{
							width: 120,
							height: 120,
							borderRadius: "50%",
							objectFit: "cover",
						}}
						alt=""
					/>{" "}
					<div className="mt-3 text-center">
						<h6 className="mb-0 h6">{profile?.full_name}</h6>
						<p className="mt-0">
							<Link to="/customer/settings/">
								<i className="fa fa-edit me-2"></i> Edit Account
							</Link>
						</p>
					</div>
				</div>
				<ol className="list-group">
					<li className="list-group-item d-flex justify-content-between align-items-start">
						<div className="ms-2 me-auto">
							<Link
								to={"/customer/account"}
								className="fw-bold text-dark">
								{" "}
								<i className="fa fa-user me-2"></i> Account
							</Link>
						</div>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-start">
						<div className="ms-2 me-auto">
							<Link
								to={"/customer/orders/"}
								className="fw-bold text-dark">
								<i className="fa fa-shopping-cart me-2"></i>
								Orders
							</Link>
						</div>
						<span className="badge bg-primary rounded-pill">
							14
						</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-start">
						<div className="ms-2 me-auto">
							<Link
								to={"/customer/wishlist"}
								className="fw-bold text-dark">
								<i className="fa fa-heart fa-fade me-2"></i>{" "}
								Wishlist
							</Link>
						</div>
						<span className="badge bg-primary rounded-pill">
							14
						</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-start">
						<div className="ms-2 me-auto">
							<Link
								to={"/customer/notifications"}
								className="fw-bold text-dark">
								<i className="fa fa-bell fa-shake me-2"></i>{" "}
								Notification
							</Link>
						</div>
						<span className="badge bg-primary rounded-pill">
							14
						</span>
					</li>
					<li className="list-group-item d-flex justify-content-between align-items-start">
						<div className="ms-2 me-auto">
							<Link
								to={"/customer/settings"}
								className="fw-bold text-dark">
								<i className="fa fa-gear fa-spin me-2"></i>{" "}
								Setting
							</Link>
						</div>
					</li>
					{/* <li className="list-group-item d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                                <Link to={'/customer/notifications/'} className="fw-bold text-dark"><i className='fa fa-truck me-2'></i> Track Order</Link>
                            </div>
                        </li> */}
					<li className="list-group-item d-flex justify-content-between align-items-start">
						<div className="ms-2 me-auto">
							<Link to="/logout" className="fw-bold text-danger">
								<i className="fa fa-sign-out me-2"></i> Logout
							</Link>
						</div>
					</li>
				</ol>
			</>
			{/* )} */}
		</div>
	);
}

export default Sidebar;
