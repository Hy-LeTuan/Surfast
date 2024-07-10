import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../utils/auth";
import { useAuthStore } from "../../store/auth";

const Register = () => {
	const [fullname, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [mobile, setMobile] = useState("");
	const [password, setPassword] = useState("");
	const [password2, setPassword2] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();
	const isLoggedIn = useAuthStore((state) => state.isLoggedIn());

	console.log("isLoggedIn value: " + isLoggedIn);

	useEffect(() => {
		if (isLoggedIn == true) {
			navigate("/");
		}
	}, []);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setIsLoading(true);

		const response = await register(
			fullname,
			email,
			mobile,
			password,
			password2
		);

		if (response.error != null) {
			alert(`Request error with code: ${response.error}`);
		} else {
			console.log("success");
			setIsLoading(false);
			navigate("/");
		}
	};

	return (
		<div className="container-fluid d-flex justify-content-center align-items-center px-5 py-5 my-5 mx-auto">
			<div className="d-flex flex-column justify-content-center align-items-center gap-4 border border-dark rounded-2 py-4 px-4 w-50">
				<div className="container d-flex justify-content-center align-items-center">
					<h1 className="h2 mb-0">Register Account</h1>
				</div>
				<div className="container d-flex justify-content-begin align-items-center p-0">
					<form
						onSubmit={handleSubmit}
						className="container-fluid p-0">
						<div className="mb-4">
							<label for="fullnameInput" className="form-label">
								Full name
							</label>
							<input
								type="text"
								name=""
								id="fullnameInput"
								className="form-control"
								onChange={(e) => setFullName(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label for="emailInput" class="form-label">
								Email address
							</label>
							<input
								type="email"
								name=""
								id="emailInput"
								className="form-control"
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label for="mobileInput" class="form-label">
								Mobile number
							</label>
							<input
								type="text"
								name=""
								id="mobileInput"
								className="form-control"
								onChange={(e) => setMobile(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label for="passwordInput" class="form-label">
								Enter password
							</label>
							<input
								type="password"
								name=""
								id="passwordInput"
								className="form-control"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="mb-4">
							<label
								for="confirmPasswordInput"
								class="form-label">
								Confirm password
							</label>
							<input
								type="password"
								name=""
								id="confirmPasswordInput"
								className="form-control"
								onChange={(e) => setPassword2(e.target.value)}
							/>
						</div>
						{isLoading == true ? (
							<button
								disabled
								type="submit"
								class="mb-4 w-100 btn btn-primary fw-bold">
								Processing{" "}
								<i className="ms-2 fa fa-spinner fa-spin" />
							</button>
						) : (
							<button
								type="submit"
								class="mb-4 w-100 btn btn-primary fw-bold">
								Sign Up <i className="ms-2 fa fa-user-plus" />
							</button>
						)}

						<div id="passwordHelpBlock" class="text-center">
							<p>
								Already an account?
								<Link className="ms-2" to="/login">
									Login
								</Link>
							</p>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
