import React, { useState, useEffect } from "react";
import { login } from "../../utils/auth";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

	const [isError, setIsError] = useState(false);

	useEffect(() => {
		if (isLoggedIn()) {
			navigate("/");
		}
	});

	const resetForm = () => {
		setEmail("");
		setPassword("");
	};

	const handleLogin = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		const response = await login(email, password);

		if (response.error != null) {
			setIsError(true);
			setIsLoading(false);
			// alert(`Request error with code: ${response.error}`);
		} else {
			navigate("/");
			resetForm();
			setIsLoading(false);
			console.log("successful navigation");
		}
	};

	return (
		<div className="container-fluid d-flex justify-content-center align-items-center px-5 py-5 my-5 mx-auto">
			<div className="d-flex flex-column justify-content-center align-items-center gap-4 border border-dark rounded-2 py-4 px-4 w-50">
				<div className="container d-flex justify-content-center align-items-center">
					<h1 className="h2 mb-0">Account Login</h1>
				</div>
				<div className="container d-flex justify-content-begin align-items-center p-0">
					<form
						onSubmit={handleLogin}
						className="container-fluid p-0">
						<div className="mb-4">
							<label htmlFor="emailInput" className="form-label">
								Email address
							</label>
							<input
								type="text"
								name="email"
								id="emailInput"
								className="form-control"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label
								htmlFor="passwordInput"
								className="form-label">
								Enter password
							</label>
							<input
								type="password"
								name="password"
								id="passwordInput"
								className="form-control"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						{isError == true ? (
							<div class="alert alert-danger" role="alert">
								Wrong username or password.
							</div>
						) : null}
						{isLoading == true ? (
							<button
								disabled
								type="submit"
								className="mb-4 w-100 btn btn-primary fw-bold">
								Processing{" "}
								<i className="ms-2 fa fa-spinner fa-spin" />
							</button>
						) : (
							<button
								type="submit"
								className="mb-4 w-100 btn btn-primary fw-bold">
								Login to account
								<i className="ms-2 fa fa-sign-in" />
							</button>
						)}
						<div id="passwordHelpBlock" className="text-center">
							<p>
								Forgot your password?
								<Link className="ms-2" to={"/forgot-password"}>
									Reset password!
								</Link>
							</p>
						</div>
						<div id="registerblock" className="text-center">
							<p>
								Not a member?
								<Link className="ms-2" to={"/register"}>
									Register here!
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}

export default Login;
