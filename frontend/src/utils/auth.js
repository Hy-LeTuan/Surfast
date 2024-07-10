import { useAuthStore } from "../store/auth";
import axios from "./axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
	toast: true,
	position: "top",
	showConfirmButton: false,
	timer: 1500,
	timerProgressBar: true,
});

export const login = async (email, password) => {
	try {
		const { data, status } = await axios.api_instance.post("user/token", {
			email,
			password,
		});

		if (status == 200) {
			setAuthUser(data.access, data.refresh);
		}

		Toast.fire({
			icon: "success",
			title: "Login successful!",
		});

		return { data, error: null };
	} catch (error) {
		console.log(`Error print: ${error}`);

		return {
			data: null,
			error: error.response.status,
		};
	}
};

export const register = async (
	full_name,
	email,
	phone,
	password,
	password2
) => {
	try {
		const { data, status } = await axios.api_instance.post(
			"user/register",
			{
				full_name,
				email,
				phone,
				password,
				password2,
			}
		);

		const login_response = await login(email, password);

		// Alert sign up succesfully
		Toast.fire({
			icon: "success",
			title: "Register successful!",
		});

		if (login_response.error != null) {
			return { data: null, error: login_response.error };
		}

		return { data, error: null };
	} catch (error) {
		console.log("Register error");
		console.log(error);

		return {
			data: null,
			error: error.response.status,
		};
	}
};

export const logout = () => {
	Cookies.remove("access_token");
	Cookies.remove("refresh_token");
	useAuthStore.getState().setUser(null);

	// Alert for signing out
	Toast.fire({
		icon: "success",
		title: "You have been logged out.",
	});
};

export const setUser = async () => {
	const accessToken = Cookies.get("access_token");
	const refreshToken = Cookies.get("refresh_token");

	if (
		accessToken === undefined ||
		refreshToken === undefined ||
		accessToken == null ||
		refreshToken == null ||
		accessToken == "undefined" ||
		refreshToken == "undefined"
	) {
		return;
	}

	if (isAccessTokenExpired(accessToken)) {
		const response = await getRefreshToken(refreshToken);
		setAuthUser(response.access, response.refresh);
	} else {
		setAuthUser(accessToken, refreshToken);
	}
};

export const setAuthUser = (access_token, refresh_token) => {
	Cookies.set("access_token", access_token, {
		expires: 1,
		secure: true,
	});

	Cookies.set("refresh_token", refresh_token, {
		expires: 7,
		secure: true,
	});

	const user = jwtDecode(access_token) ?? null;

	if (user) {
		useAuthStore.getState().setUser(user);
	}
	useAuthStore.getState().setLoading(false);
};

export const getRefreshToken = async () => {
	const refreshToken = Cookies.get("refresh_token");

	try {
		const response = await axios.api_instance.post("user/token/refresh", {
			refresh: refreshToken,
		});
		response.data["refresh"] = refreshToken;
		return response.data;
	} catch (e) {
		console.log("Error in refresh token function");
		console.log(e);
	}
};

export const isAccessTokenExpired = (accessToken) => {
	try {
		const decodedToken = jwtDecode(accessToken);
		return decodedToken.exp < Date.now() / 100;
	} catch (error) {
		console.log(error);
		return true;
	}
};
