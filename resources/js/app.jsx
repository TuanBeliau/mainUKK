import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DashboardGuru from '@/pages/guru/dashboard';
import DashboardSiswa from '@/pages/siswa/dashboard';
import PKL from '@/pages/siswa/pkl';
import Industri from '@/pages/siswa/industri';
import Login from '@/pages/auth/login';
import Register from '@/pages/auth/register';
import { initializeTheme } from './hooks/use-appearance';

const isAuthenticated = () => {
    const token = !!sessionStorage.getItem('token');
    const role = sessionStorage.getItem('role');

    return token && role ? role : null;
};

function ProtectedRoute({ children, allowedRoles }) {
    const role = isAuthenticated();

    if (!role) {
        return <Navigate to="/" replace/>
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" replace/>
    }

    return children
}

function App() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        initializeTheme();
        setReady(true);
    }, []);

    if (!ready) return <Login />;

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/siswa/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['siswa']}>
                            <DashboardSiswa />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/siswa/industri"
                    element={
                        <ProtectedRoute allowedRoles={['siswa']}>
                            <Industri />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/siswa/pkl"
                    element={
                        <ProtectedRoute allowedRoles={['siswa']}>
                            <PKL />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/guru/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={['guru']}>
                            <DashboardGuru />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
