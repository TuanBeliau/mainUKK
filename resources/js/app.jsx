import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from '@/pages/siswa/dashboard';
import PKL from '@/pages/siswa/pkl';
import Industri from '@/pages/siswa/industri';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import { initializeTheme } from './hooks/use-appearance';

const isAuthenticated = () => {
    return !!localStorage.getItem('token');
};

function ProtectedRoute({ children }) {
    return isAuthenticated() ? children : <Navigate to="/" replace />;
}

function App() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initializeTheme(); // Dark/light mode setup
        setReady(true);
    }, []);

    if (!ready) return <div>Loading...</div>;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/siswa/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/siswa/industri"
                    element={
                        <ProtectedRoute>
                            <Industri />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/siswa/pkl"
                    element={
                        <ProtectedRoute>
                            <PKL />
                        </ProtectedRoute>
                    }
                />
                {/* Tambahkan route lainnya sesuai kebutuhan */}
            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
