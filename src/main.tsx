import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Import API Debug utilities for console debugging
import './utils/apiDebug'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found')
}

ReactDOM.createRoot(rootElement).render(<App />)
