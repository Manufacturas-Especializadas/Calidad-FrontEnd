import React from "react";

interface Props {
    fallback: React.ReactNode;
    children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error("ErrorBoundary caught: ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }

        return this.props.children;
    }
}

export default ErrorBoundary;