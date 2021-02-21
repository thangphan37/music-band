/**@jsx jsx */
import {jsx, ThemeProvider} from '@emotion/react'
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import {BrowserRouter as Router} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import reportWebVitals from './reportWebVitals'
import * as colors from 'styles/colors'
import './bootstrap'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})

const theme = {
  crawl: colors.bgCrawl,
  discover: colors.bgDiscover,
  song: colors.bgSong,
}

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
