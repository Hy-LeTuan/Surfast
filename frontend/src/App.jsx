import { useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./views/auth/Login";
import Register from "./views/auth/Register";
import Dashboard from "./views/auth/Dashboard";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreatePassword from "./views/auth/CreatePassword";
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import MainWrapper from "./layout/MainWrapper";
import Products from "./views/store/Products";
import ProductDetails from "./views/store/ProductDetails";
import Cart from "./views/store/Cart";
import Checkout from "./views/store/Checkout";
import PaymentSuccess from "./views/store/PaymentSuccess";
import Search from "./views/store/Search";
import { CartContext } from "./views/plugins/Context";
import CartID from "./views/plugins/CartID";
import UserData from "./views/plugins/UserData";
import axios from "./utils/axios";
import Account from "./views/customer/Account";
import PrivateRoute from "./layout/PrivateRoute";
import Orders from "./views/customer/Orders";
import OrderDetails from "./views/customer/OrderDetails";
import Wishlist from "./views/customer/Wishlist";
import CustomerNotification from "./views/customer/CustomerNotification";
import CustomerSettings from "./views/customer/Settings";
import Invoice from "./views/customer/Invoice";
import VendorDashboard from "./views/vendor/VendorDashboard";
import VendorProduct from "./views/vendor/VendorProduct";
import VendorOrders from "./views/vendor/VendorOrders";
import VendorOrderDetails from "./views/vendor/VendorOrderDetails";
import Earning from "./views/vendor/Earning";
import Reviews from "./views/vendor/Reviews";
import ReviewDetail from "./views/vendor/ReviewDetail";
import Coupon from "./views/vendor/Coupon";
import EditCoupon from "./views/vendor/EditCoupon";
import VendorNotifications from "./views/vendor/VendorNotifications";
import VendorSettings from "./views/vendor/VendorSettings";
import Shop from "./views/vendor/Shop";
import AddProduct from "./views/vendor/AddProduct";
import UpdateProduct from "./views/vendor/UpdateProduct";

function App() {
	const [cartCount, setCartCount] = useState(0);

	const cartID = CartID();
	const userData = UserData();

	useEffect(() => {
		const fetchCartData = async () => {
			const url = userData?.user_id
				? `cart-list/${cartID}/${userData.user_id}`
				: `cart-list/${cartID}`;

			try {
				const response = await axios.api_instance.get(url);
				setCartCount(response.data.length);
			} catch (e) {
				console.log(e);
			}
		};

		fetchCartData();
	});

	return (
		<CartContext.Provider value={[cartCount, setCartCount]}>
			<BrowserRouter>
				<StoreHeader />
				<MainWrapper>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Register />} />
						<Route path="/logout" element={<Logout />} />
						<Route
							path="/forgot-password"
							element={<ForgotPassword />}
						/>
						<Route
							path="/create-new-password"
							element={<CreatePassword />}
						/>
						<Route path="/dashboard" element={<Dashboard />} />
						{/* Store Routes */}
						<Route path="/" element={<Products />} />
						<Route
							path="/detail/:slug"
							element={<ProductDetails />}
						/>
						<Route path="/cart" element={<Cart />} />
						<Route
							path="/checkout/:order_oid"
							element={<Checkout />}
						/>
						<Route
							path="/payment-success/:order_oid"
							element={<PaymentSuccess />}
						/>
						<Route path="/search" element={<Search />} />

						{/* Customer Routes */}
						<Route
							path="/customer/account"
							element={
								<PrivateRoute>
									<Account />
								</PrivateRoute>
							}
						/>
						<Route path="/customer/orders" element={<Orders />} />
						<Route
							path="/customer/orders/:order_oid"
							element={
								<PrivateRoute>
									<OrderDetails />
								</PrivateRoute>
							}
						/>
						<Route
							path="/customer/wishlist"
							element={
								<PrivateRoute>
									<Wishlist />
								</PrivateRoute>
							}
						/>
						<Route
							path="/customer/notifications"
							element={
								<PrivateRoute>
									<CustomerNotification />
								</PrivateRoute>
							}
						/>
						<Route
							path="/customer/settings"
							element={
								<PrivateRoute>
									<CustomerSettings />
								</PrivateRoute>
							}
						/>
						<Route
							path="/customer/invoice/:order_oid"
							element={
								<PrivateRoute>
									<Invoice />
								</PrivateRoute>
							}
						/>

						{/* Vendor Routes */}
						<Route
							path="/vendor/dashboard"
							element={
								<PrivateRoute>
									<VendorDashboard />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/products"
							element={
								<PrivateRoute>
									<VendorProduct />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/orders"
							element={
								<PrivateRoute>
									<VendorOrders />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/orders/:order_oid"
							element={
								<PrivateRoute>
									<VendorOrderDetails />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/earning"
							element={
								<PrivateRoute>
									<Earning />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/reviews"
							element={
								<PrivateRoute>
									<Reviews />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/reviews/:review_id"
							element={
								<PrivateRoute>
									<ReviewDetail />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/coupon"
							element={
								<PrivateRoute>
									<Coupon />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/coupon/:coupon_id"
							element={
								<PrivateRoute>
									<EditCoupon />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/notifications"
							element={
								<PrivateRoute>
									<VendorNotifications />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/settings"
							element={
								<PrivateRoute>
									<VendorSettings />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/:slug"
							element={
								<PrivateRoute>
									<Shop />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/add-product"
							element={
								<PrivateRoute>
									<AddProduct />
								</PrivateRoute>
							}
						/>
						<Route
							path="/vendor/product/update/:pid"
							element={
								<PrivateRoute>
									<UpdateProduct />
								</PrivateRoute>
							}
						/>
					</Routes>
				</MainWrapper>
				<StoreFooter />
			</BrowserRouter>
		</CartContext.Provider>
	);
}

export default App;
