import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header";
import ClubModal from "./components/ClubModal";
import ProtectedRoute from "./components/ProtectedRoute";

// Import Page Views
import Home from "./pages/Home";
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import QuizInterests from "./pages/QuizInterests";
import RecommendedEvents from "./pages/RecommendedEvents";
import Auth from "./pages/Auth";
import FavoriteEvents from "./pages/FavoriteEvents";
import Profile from "./pages/Profile";
import AdminManage from "./pages/AdminManage";
import AdminEdit from "./pages/AdminEdit";

import { useApp } from "./context/AppContext";

const App = () => {
  const location = useLocation();
  const { isClubOpen, setIsClubOpen } = useApp();

  // Scroll to top on page navigations
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 flex flex-col font-sans overflow-x-hidden">
      {/* Header component */}
      <Header />

      {/* Main Pages Switcher Content with React Router DOM */}
      <main className="flex-grow">
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<EventList />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/quiz" element={<QuizInterests />} />
          <Route path="/recommendations" element={<RecommendedEvents />} />

          {/* Authentic login / Auth routes */}
          <Route path="/login" element={<Auth />} />
          <Route path="/admin-login" element={<Auth />} />

          {/* Protected Student Pages */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute allowedRole="user">
                <FavoriteEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRole="user">
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin/Club Pages */}
          <Route
            path="/admin/manage"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminManage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/edit/:id"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminEdit />
              </ProtectedRoute>
            }
          />

          {/* Fallback Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* --- CLUB REGISTRATION FOOTER MODAL --- */}
      <ClubModal isOpen={isClubOpen} onClose={() => setIsClubOpen(false)} />
    </div>
  );
};

export default App;
