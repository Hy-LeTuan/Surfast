import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

const Dashboard = () => {
	const [isLoggedIn, setIsLoggedIn] = useAuthStore((state) => [
		state.isLoggedIn,
		state.user,
	]);

	return (
		<>
			{isLoggedIn() ? (
				<div>
					<h1>Dashboard</h1>
					<Link to={"/logout"}>Logout</Link>
				</div>
			) : (
				<div>
					<h1>Homepage</h1>
					<Link className="btn btn-primary" to={"/register"}>
						Register
					</Link>
					<Link className="btn btn-success ms-4" to={"/login"}>
						Login
					</Link>
				</div>
			)}
		</>
	);
};

export default Dashboard;
