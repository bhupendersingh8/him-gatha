import { Suspense, lazy, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import Home from './pages/Home';
import DeityDetail from './pages/DeityDetail';
import ScrollToTop from './components/ScrollToTop';
import { useTheme } from './hooks/useTheme';
import { RequireAdmin } from './components/auth/RequireAdmin';
import './App.css';
import { Loader2 } from 'lucide-react';

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const DevMelaCalendar = lazy(() => import('./pages/DevMelaCalendar'));
const Explore = lazy(() => import('./pages/Explore'));
const Contribute = lazy(() => import('./pages/Contribute'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  const { theme, toggleTheme } = useTheme();
  const [globalSearch, setGlobalSearch] = useState('');

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <SEOHead 
        title="HIM GATHA v2.0 - Cultural Archive" 
        description="A sacred digital archive mapping the Dev-Sanskriti of Himachal Pradesh."
      />
      
      <Navbar theme={theme} toggleTheme={toggleTheme} onSearch={setGlobalSearch} />
      
      <main className="flex-1" id="main-content">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center text-[var(--text-primary)]">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)]" aria-label="Loading archival record" />
          </div>
        }>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home globalSearch={globalSearch} />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/calendar" element={<DevMelaCalendar />} />
            <Route path="/contribute" element={<Contribute />} />
            <Route path="/deity/:id" element={<DeityDetail />} />
            <Route path="/him-admin/login" element={<AdminLogin />} />
            <Route 
              path="/him-admin" 
              element={
                <RequireAdmin>
                  <AdminDashboard />
                </RequireAdmin>
              } 
            />
            {/* Clean Archival 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default App;
