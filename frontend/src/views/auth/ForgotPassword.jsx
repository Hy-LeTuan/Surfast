import { useState } from "react";
import axios from "../../utils/axios";
import { useNavigate, Link } from "react-router-dom";

function ForgotPassword() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async () => {
		setIsLoading(true);
		try {
			const response = await axios.api_instance.get(
				`user/password-reset/${email}`
			);

			setIsLoading(false);
			console.log(response);
		} catch (error) {
			console.log("error");
			console.log(error);
			alert("Email does not exist");
			setIsLoading(false);
		}
	};

	return (
		<main className="my-5">
			<div className="container">
				<div className="row d-flex justify-content-center">
					<div className="col-xl-5 col-md-8">
						<div className="card rounded-2">
							<div className="card-body p-4">
								<h2 className="text-center mb-4 h2 card-title">
									Reset Password
								</h2>
								<div className="mb-4">
									<label
										for="emailResetPasswordInput"
										className="form-label">
										Email address
									</label>
									<input
										type="text"
										name="emailResetPasswordInput"
										id="emailResetPasswordInput"
										className="form-control"
										onChange={(e) =>
											setEmail(e.target.value)
										}
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
										class="mb-4 w-100 btn btn-primary fw-bold"
										onClick={handleSubmit}>
										Reset Password
										<i className="ms-2 fa fa-paper-plane" />
									</button>
								)}
								<div id="registerblock" class="text-center">
									<p>
										Want to sign in?
										<Link className="ms-2" to={"/login"}>
											Login
										</Link>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

export default ForgotPassword;
