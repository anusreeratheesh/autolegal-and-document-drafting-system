import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';

// Common Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';

function AppLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // SECURITY: Do NOT auto-restore auth on app load
  // Users must explicitly login after logout or browser close
  // This prevents accidental re-login from stale tokens

  // Don't show sidebar on login/signup pages
  const hideSidebar = ['/login', '/signup', '/forgot-password'].includes(location.pathname);

  return (
    <>
      <Toaster position="top-right" />
      <div className="flex flex-col min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}

        <div className="flex flex-1 relative">
          {isAuthenticated && !hideSidebar && <Sidebar />}

          <main className="flex-grow w-full overflow-x-hidden">
            <div className="min-h-[calc(100vh-4rem-200px)]">
              <Outlet />
            </div>
          </main>
        </div>

        {isAuthenticated && <Footer />}
      </div>
    </>
  );
}

export default AppLayout;
