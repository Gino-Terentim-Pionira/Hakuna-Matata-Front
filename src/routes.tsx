import React, { useState, useEffect } from 'react';
import { BrowserRouter as HashRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import { AuthProvider } from './contexts/authContext';
import CantUseApplication from './components/CantUseApplication';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Shop from './pages/Shop';
import Inventory from './pages/Inventory';
import CheetahPath from './pages/CheetahPath';
import BlackMambaPath from './pages/blackMambaPath';
import LionPath from './pages/lionPath';
import PaymentPage from './pages/PaymentPage';
import { RecoilRoot } from 'recoil';

const useWindowSize = () => {
	const [size, setSize] = useState([window.innerHeight, window.innerWidth]);
	useEffect(() => {
		const handleResize = () => {
			setSize([window.innerHeight, window.innerWidth]);
		}
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		}
	}, []);
	return size;
}

const Routes = () => {

	const [height, width] = useWindowSize();

	return (
		<RecoilRoot>
			<HashRouter basename="/">
				<AuthProvider>
					{
						height < 550 || width < 600 ? (
							<CantUseApplication />
						) : null
					}
					<Switch>
						<Route path='/' exact component={Home} />
						<Route path='/login' component={Login} />
						<Route path='/forgotPassword' component={ForgotPassword} />
						<Route path="/resetPassword/:id" component={ResetPassword} />
						<Route path='/register' component={Register} />
						<ProtectedRoute path='/shop' component={Shop} />
						<ProtectedRoute path='/inventory' component={Inventory} />
						<ProtectedRoute path='/mainPage' component={MainPage} />
						<ProtectedRoute path='/trilha-cheetah' component={CheetahPath} />
						<ProtectedRoute path='/finalTrail' component={BlackMambaPath} />
						<ProtectedRoute path='/trilha-leao' component={LionPath} />
						<ProtectedRoute path='/payment' component={PaymentPage} />
						{/* <ProtectedRoute path='/premium' component={Premium} /> */}
					</Switch>

				</AuthProvider >
			</HashRouter >
		</RecoilRoot>
	);
};

export default Routes;
