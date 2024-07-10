import { useEffect, useState } from "react";
import { setUser } from "../utils/auth";

const MainWrapper = ({ children }) => {
	const [loading, setLoading] = useState(true);

	// Define a useEffect hook to handle side effects after component mounting
	useEffect(() => {
		// Define an asynchronous function 'handler'
		const handler = async () => {
			// Set the 'loading' state to 'true' to indicate the component is loading
			setLoading(true);

			// Perform an asynchronous user authentication action
			try {
				const response = await setUser();
				setLoading(false);
			} catch (e) {
				setLoading(false);
			}

			// Set the 'loading' state to 'false' to indicate the loading process has completed
		};

		// Call the 'handler' function immediately after the component is mounted
		handler();
	}, []);

	return <>{loading ? null : children}</>;
};

export default MainWrapper;
