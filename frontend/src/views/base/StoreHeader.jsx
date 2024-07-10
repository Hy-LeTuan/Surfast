import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import { CartContext } from "../plugins/Context";

function StoreHeader() {
	const navigate = useNavigate();
	const [cartCount, setCartCount] = useContext(CartContext);

	const [isLoggedIn, user] = useAuthStore((state) => [
		state.isLoggedIn,
		state.user,
	]);

	const [search, setSearch] = useState("");

	const handleSearchChange = (event) => {
		setSearch(event.target.value);
		console.log(search);
	};

	const handleSearchSubmit = () => {
		navigate(`/search?query=${search}`);
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<Link className="navbar-brand" to="/">
					Surfast {}
				</Link>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation">
					<span className="navbar-toggler-icon" />
				</button>
				<div
					className="collapse navbar-collapse"
					id="navbarSupportedContent">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								Account
							</a>
							<ul
								className="dropdown-menu"
								aria-labelledby="navbarDropdown">
								<li>
									<Link
										to={"/customer/account"}
										className="dropdown-item">
										<i className="fa fa-user"></i> Account
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to={`/customer/orders`}>
										<i className="fa fa-shopping-cart"></i>{" "}
										Orders
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to={`/customer/wishlist`}>
										<i className="fa fa-heart"></i> Wishlist
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to={`/customer/notifications`}>
										<i className="fa fa-bell fa-shake"></i>{" "}
										Notifications
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to={`/customer/settings/`}>
										<i className="fa fa-gear fa-spin"></i>{" "}
										Settings
									</Link>
								</li>
							</ul>
						</li>

						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								id="navbarDropdown"
								role="button"
								data-bs-toggle="dropdown"
								aria-expanded="false">
								Vendor
							</a>
							<ul
								className="dropdown-menu"
								aria-labelledby="navbarDropdown">
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/dashboard">
										{" "}
										<i className="fa fa-user"></i> Dashboard
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/products">
										{" "}
										<i className="fa fa-th"></i> Products
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/add-product">
										{" "}
										<i className="fa fa-plus-circle"></i>{" "}
										Add Products
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/orders">
										{" "}
										<i className="fa fa-shopping-cart"></i>{" "}
										Orders
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/earning">
										{" "}
										<i className="fa fa-usd"></i> Earning
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/reviews/">
										{" "}
										<i className="fa fa-star"></i> Reviews
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/coupon/">
										{" "}
										<i className="fa fa-tag"></i> Coupon
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/notifications/">
										{" "}
										<i className="fa fa-bell fa-shake"></i>{" "}
										Notifications
									</Link>
								</li>
								<li>
									<Link
										className="dropdown-item"
										to="/vendor/settings/">
										{" "}
										<i className="fa fa-gear fa-spin"></i>{" "}
										Settings
									</Link>
								</li>
							</ul>
						</li>
					</ul>
					<div className="d-flex">
						<input
							name="search"
							className="form-control me-2"
							type="text"
							placeholder="Search"
							aria-label="Search"
							onChange={handleSearchChange}
						/>
						<button
							className="btn btn-outline-success me-2"
							type="button"
							onClick={handleSearchSubmit}>
							Search
						</button>
					</div>
					{isLoggedIn() ? (
						<>
							<Link
								className="btn btn-primary me-2"
								to="/dashboard">
								Dashboard
							</Link>
							<Link className="btn btn-primary me-2" to="/logout">
								Logout
							</Link>
						</>
					) : (
						<>
							<Link className="btn btn-primary me-2" to="/login">
								Login
							</Link>
							<Link
								className="btn btn-primary me-2"
								to="/register">
								Register
							</Link>
						</>
					)}
					<Link className="btn btn-danger" to="/cart">
						<i className="fa fa-shopping-cart"></i>{" "}
						<span id="cart-total-items">{cartCount || 0}</span>
					</Link>
				</div>
			</div>
		</nav>
	);
}

export default StoreHeader;
