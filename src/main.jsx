import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { GlobalProvider } from './context/GlobalContext.jsx'
import ErrorBoundary from './ErrorBoundary.jsx'
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

const initialOptions = {
    "client-id": "AU-KMwNSKqAVrG7xnPVJpt8sVGKozKb-7IG8GkJgCmDiC6jHb6DfNAdoTq3SRNLGr5Qod34xVZrBsQS7",
    currency: "MXN",
    intent: "capture",
};

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <GlobalProvider>
                <PayPalScriptProvider options={initialOptions}>
                    <App />
                </PayPalScriptProvider>
            </GlobalProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
