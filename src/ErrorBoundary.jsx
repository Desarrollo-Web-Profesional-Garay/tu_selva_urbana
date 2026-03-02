import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    padding: '20px',
                    color: '#d32f2f',
                    background: '#ffebee',
                    height: '100vh',
                    width: '100vw',
                    margin: 0,
                    fontFamily: 'monospace'
                }}>
                    <h2 style={{ fontSize: '24px' }}>🚨 React Runtime Error 🚨</h2>
                    <p>Por favor, copia este texto rojo y compártelo con el asistente de IA:</p>
                    <hr />
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: '20px' }}>
                        {this.state.error && this.state.error.toString()}
                    </pre>
                    <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#555', marginTop: '10px' }}>
                        {this.state.error && this.state.error.stack}
                    </pre>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
