import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Collection from './pages/Collection';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import Shipping from './pages/Shipping';
import Returns from './pages/Returns';
import CorporatePage from './pages/CorporatePage';
import Logo3DPage from './pages/Logo3DPage';

// Components
import Layout from './components/Layout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AIChatAssistant from './components/AIChatAssistant';
import ErrorBoundary from './components/ErrorBoundary';

// Protected Route Component
const ProtectedRoute = ({ children, requireAuth = true, requireAdmin = false }) => {
  const { isAuthenticated, user } = useAuth();

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    // Redirect based on user role
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

// Main App Layout
const AppLayout = ({ children }) => {
  return (
    <Layout>
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
      <AIChatAssistant />
    </Layout>
  );
};

// App Component
const App = () => {
  console.log('🏗️ App component rendering...');
  
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />

              {/* Protected Routes */}
              <Route path="/" element={
                <AppLayout>
                  <Home />
                </AppLayout>
              } />

              <Route path="/collection" element={
                <AppLayout>
                  <Collection />
                </AppLayout>
              } />

              <Route path="/logo-3d" element={
                <Logo3DPage />
              } />

              <Route path="/product/:id" element={
                <AppLayout>
                  <ProductDetail />
                </AppLayout>
              } />

              <Route path="/cart" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Cart />
                  </AppLayout>
                </ProtectedRoute>
              } />

              <Route path="/checkout" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Checkout />
                  </AppLayout>
                </ProtectedRoute>
              } />

              <Route path="/orders" element={
                <ProtectedRoute>
                  <AppLayout>
                    <Orders />
                  </AppLayout>
                </ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute requireAdmin={true}>
                  <AppLayout>
                    <AdminDashboard />
                  </AppLayout>
                </ProtectedRoute>
              } />

              {/* Footer Pages */}
              <Route path="/contact" element={
                <AppLayout>
                  <Contact />
                </AppLayout>
              } />

              <Route path="/shipping" element={
                <AppLayout>
                  <Shipping />
                </AppLayout>
              } />

              <Route path="/returns" element={
                <AppLayout>
                  <Returns />
                </AppLayout>
              } />

              {/* Corporate Pages */}
              <Route path="/about" element={
                <AppLayout>
                  <CorporatePage />
                </AppLayout>
              } />

              <Route path="/careers" element={
                <AppLayout>
                  <CorporatePage />
                </AppLayout>
              } />

              <Route path="/press" element={
                <AppLayout>
                  <CorporatePage />
                </AppLayout>
              } />

              <Route path="/sustainability" element={
                <AppLayout>
                  <CorporatePage />
                </AppLayout>
              } />

              <Route path="/investors" element={
                <AppLayout>
                  <CorporatePage />
                </AppLayout>
              } />

              {/* Catch all route */}
              <Route path="*" element={
                <AppLayout>
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        404 - Page Not Found
                      </h1>
                      <p className="text-gray-600 dark:text-gray-400 mb-8">
                        The page you're looking for doesn't exist.
                      </p>
                      <a
                        href="/"
                        className="btn-primary"
                      >
                        Go Home
                      </a>
                    </div>
                  </div>
                </AppLayout>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </Provider>
    </ErrorBoundary>
  );
};

export default App;

