import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import Header from './components/Header';
import { useEffect, useState } from 'react';

function AppContent() {
  const location = useLocation();
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [location]);

  return (
    <>
      {token && !isLoginPage && <Header />}
      <Routes>
        <Route 
          path="/login" 
          element={!token ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={token ? <Home /> : <Navigate to="/login" />} 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
