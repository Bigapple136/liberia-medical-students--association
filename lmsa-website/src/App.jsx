import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import ErrorBoundary from '@components/common/ErrorBoundary';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#1F2937',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
              },
              success: {
                iconTheme: {
                  primary: '#0C8950',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#DC143C',
                  secondary: '#fff',
                },
              },
            }}
          />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;