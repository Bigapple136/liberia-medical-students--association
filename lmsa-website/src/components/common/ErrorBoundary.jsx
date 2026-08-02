import { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '@components/common/Button';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log to error tracking service in production
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-8">
              <AlertTriangle size={48} className="text-red-600" strokeWidth={1.5} />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight">Something Went Wrong</h1>
            <p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto text-balance">
              We encountered an unexpected error. Please try refreshing the page or contact support if the issue persists.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button variant="primary" size="lg" leftIcon={<RefreshCw size={20} />} onClick={this.handleReload}>
                Refresh Page
              </Button>
              <Link to="/">
                <Button variant="secondary" size="lg" leftIcon={<Home size={20} />}>
                  Go Home
                </Button>
              </Link>
            </div>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-white rounded-lg border border-gray-200 p-6">
                <summary className="font-semibold mb-2 cursor-pointer">Error Details (Development)</summary>
                <pre className="text-sm text-red-600 overflow-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            {/* Help Text */}
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Need help?</strong> Contact us at{' '}
                <a href="mailto:support@lmsa.org.lr" className="text-lmsa-600 hover:underline">
                  support@lmsa.org.lr
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
