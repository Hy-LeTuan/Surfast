import React from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axios";

function CreatePassword() {
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const [searchParam] = useSearchParams();
	const otp = searchParam.get("otp");
	const uidb64 = searchParam.get("uidb64");

	const navigate = useNavigate();

	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		console.log(password);
		console.log(passwordConfirm);
		const formData = new FormData();

		if (password === passwordConfirm) {
			formData.append("otp", otp);
			formData.append("uidb64", uidb64);
			formData.append("password", password);
		} else {
			alert("Password does not match");
		}

		try {
			const response = await axios.api_instance.post(
				"/user/password-change",
				formData
			);
			console.log(response.data);
			alert("Password changed successfully");

			navigate("/login");
		} catch (error) {
			console.log("enter error loop");
			alert("An error occured when trying to change the password.");
		}
	};

	return (
		<div>
			<h1>CreatePassword</h1>
			<form onSubmit={handlePasswordSubmit}>
				<input
					type="password"
					name=""
					id=""
					placeholder="Enter new password"
					onChange={(e) => setPassword(e.target.value)}
				/>
				<br />
				<br />
				<input
					type="password"
					name=""
					id=""
					placeholder="Confirm new password"
					onChange={(e) => setPasswordConfirm(e.target.value)}
				/>

				<button type="submit">Save new password</button>
			</form>
		</div>
	);
}

export default CreatePassword;
