import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import * as React from 'react';
import ReactDOM from 'react-dom';
import Routes from './routes';
import theme from './theme';

ReactDOM.render(
	<React.StrictMode>
		<ColorModeScript />
		<ChakraProvider resetCSS theme={theme}>
			<Routes />
		</ChakraProvider>
	</React.StrictMode>,
	document.getElementById('root'),
);