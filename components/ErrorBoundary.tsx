import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "An unexpected error occurred.";
      let errorDetails = null;

      try {
        if (this.state.error?.message) {
          const parsed = JSON.parse(this.state.error.message);
          if (parsed.error && parsed.operationType) {
            errorMessage = "Database Permission Error";
            errorDetails = parsed;
          } else {
            errorMessage = this.state.error.message;
          }
        }
      } catch (e) {
        errorMessage = this.state.error?.message || errorMessage;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">{errorMessage}</p>
            
            {errorDetails && (
              <div className="bg-red-50 p-4 rounded-lg text-sm text-red-800 font-mono overflow-auto max-h-60">
                <p className="font-bold mb-2">Firestore Error Details:</p>
                <p><strong>Operation:</strong> {errorDetails.operationType}</p>
                <p><strong>Path:</strong> {errorDetails.path}</p>
                <p><strong>Message:</strong> {errorDetails.error}</p>
                <p className="mt-2 text-xs">
                  This usually means your Firebase Security Rules are denying access. 
                  Please update your rules in the Firebase Console to allow this operation.
                </p>
              </div>
            )}
            
            <button
              className="mt-6 w-full bg-bloom-DEFAULT text-white py-2 rounded-lg font-medium hover:bg-bloom-dark transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
