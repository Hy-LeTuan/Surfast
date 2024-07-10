import { useEffect } from "react";
import { logout } from "../../utils/auth";
import { Link } from "react-router-dom";

const Logout = () => {
	useEffect(() => {
		logout();
	}, []);

	return (
		<main className="my-5">
			<div className="container">
				<section>
					<div className="row d-flex justify-content-center">
						<div className="col-xl-5 col-md-8">
							<div className="card rounded-2">
								<div className="card-body p-4 text-center">
									<h2 className="mb-4 h2 card-title">
										You have been logged out
									</h2>
									<Link
										className="btn btn-primary fw-bold"
										to={"/register"}>
										Register{" "}
										<i className="ms-2 fa fa-user-plus"></i>
									</Link>
									<Link
										className="ms-4 btn btn-primary fw-bold"
										to={"/login"}>
										Login
										<i className="ms-2 fa fa-sign-in"></i>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
};

export default Logout;
