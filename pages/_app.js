import Router from 'next/router';
import withGA from 'next-ga';
import '../index.scss'

function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default withGA('UA-96166698-5', Router)(App);