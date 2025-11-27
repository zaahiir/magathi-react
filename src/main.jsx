import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary';

// Proper global error handling (development only - for debugging)
if (import.meta.env.DEV) {
  // Log unhandled errors in development
  window.addEventListener('error', (event) => {
    console.error('Unhandled error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  });
} else {
  // In production, you can integrate with error tracking service here
  // Example: Sentry, LogRocket, etc.
  window.addEventListener('error', (event) => {
    // Send to error tracking service
    // errorTrackingService.captureException(event.error);
  });

  window.addEventListener('unhandledrejection', (event) => {
    // Send to error tracking service
    // errorTrackingService.captureException(event.reason);
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);