import React from 'react';
import './global.css';
import { BrowserRouter as HashRouter, Route, Switch } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';
import { AuthProvider } from './contexts/authContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MainPage from './pages/MainPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { RecoilRoot } from 'recoil';
import { Oracle } from './pages/Oracle';
import { SoundtrackManager } from "./components/SoundtrackManager";
import Trail from './pages/Trail';
import { useMediaQuery } from '@chakra-ui/react';
import MediaQueriesEnum from './utils/enums/mediaQueries';
import CantUseApplication from './components/CantUseApplication';
import CertificateDisplay from './pages/CertificateDisplay';
import PremiumPurchase from './pages/PremiumPurchase';

const Routes = () => {
	const [isMaxHeight] = useMediaQuery(MediaQueriesEnum.MAX_HEIGHT)

	return (
		<RecoilRoot>
			<HashRouter basename="/">
				<SoundtrackManager />
				<AuthProvider>
					{
						isMaxHeight ? (
							<CantUseApplication/>
						) : null
					}
					<Switch>
						<Route path='/' exact component={Home}/>
						<Route path='/login' component={Login}/>
						<Route path='/eduzz' component={PremiumPurchase}/>
						<Route path='/forgotPassword' component={ForgotPassword}/>
						<Route path="/resetPassword/:id" component={ResetPassword}/>
						<Route path='/register' component={Register}/>
						<Route path='/certificate/:hash' component={CertificateDisplay} />
						<ProtectedRoute path='/mainPage' component={MainPage}/>
						<ProtectedRoute path='/oracle' component={Oracle}/>
						<ProtectedRoute path='/trail' component={Trail} />
					</Switch>
				</AuthProvider>
			</HashRouter>
		</RecoilRoot>
	);
};

export default Routes;
