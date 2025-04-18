import React, { useState, useEffect } from 'react';
import './global.css';
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
import CheetahPath from './pages/CheetahPath';
// import BlackMambaPath from './pages/blackMambaPath';
// import LionPath from './pages/lionPath';
import { RecoilRoot } from 'recoil';
import { Oracle } from './pages/Oracle';
import { SoundtrackManager } from "./components/SoundtrackManager";
import Trail from './pages/Trail';
import { useWindowSize } from './hooks/useWindowSize';

const Routes = () => {
	const width = useWindowSize();

	return (
		<RecoilRoot>
			<HashRouter basename="/">
				<SoundtrackManager />
				<AuthProvider>
					{/*{*/}
					{/*	height < 400 || width < 450 ? (*/}
					{/*		<CantUseApplication/>*/}
					{/*	) : null*/}
					{/*}*/}
					<Switch>
						<Route path='/' exact component={Home}/>
						<Route path='/login' component={Login}/>
						<Route path='/forgotPassword' component={ForgotPassword}/>
						<Route path="/resetPassword/:id" component={ResetPassword}/>
						<Route path='/register' component={Register}/>
						<ProtectedRoute path='/mainPage' component={MainPage}/>
						<ProtectedRoute path='/trilha-cheetah' component={CheetahPath}/>
						{/*
							<ProtectedRoute path='/finalTrail' component={BlackMambaPath} />
							<ProtectedRoute path='/trilha-leao' component={LionPath} />
						*/}
						<ProtectedRoute path='/oracle' component={Oracle}/>
						<ProtectedRoute path='/trail' component={Trail} />
					</Switch>
				</AuthProvider>
			</HashRouter>
		</RecoilRoot>
	);
};

export default Routes;
