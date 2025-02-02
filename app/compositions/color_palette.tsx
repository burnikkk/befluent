import { ChakraProvider, extendTheme } from '@chakra-ui/react';

export const colorPalettes = extendTheme({
  colors: {
    brand: {
      50: '#e3fdfd',  // Lightest
      100: '#cbf1f5',
      200: '#a6e3e9',
      300: '#71c9ce',
      400: '#45b5c6',
      500: '#2d9db4',  // Base color
      600: '#247891',
      700: '#1a5467',
      800: '#0f333e',
      900: '#05171d',  // Darkest
    },
  },
});

function App() {
  return (
    <ChakraProvider>
      <div>
        <button style={{ backgroundColor: colorPalettes.colors.brand[500], color: 'white' }}>
          Custom Button
        </button>
      </div>
    </ChakraProvider>
  );
}

export default App;