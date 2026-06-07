import React, { createContext, useState, useEffect, useContext } from "react";
import { useToast } from "./ToastContext";
import {
  loginUser,
  registerUser,
  logoutUser,
  simulateRole,
  updateInterests,
  toggleSavedEvent,
} from "../services/authService";
import { mapEvent } from "../services/eventService";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const { triggerToast } = useToast();

  // Persistent Session states
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem("eb_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [userInterest, setUserInterest] = useState(() => {
    return localStorage.getItem("eb_interest") || null;
  });

  const [savedEvents, setSavedEvents] = useState(() => {
    try {
      const stored = localStorage.getItem("eb_saved_events");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Global search & active filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [explorePage, setExplorePage] = useState(1);
  const [isClubOpen, setIsClubOpen] = useState(false);

  // Auto-persist states on changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("eb_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("eb_user");
    }
  }, [currentUser]);

  useEffect(() => {
    if (userInterest) {
      localStorage.setItem("eb_interest", userInterest);
    } else {
      localStorage.removeItem("eb_interest");
    }
  }, [userInterest]);

  useEffect(() => {
    localStorage.setItem("eb_saved_events", JSON.stringify(savedEvents));
  }, [savedEvents]);

  // Auth Handlers (Real Backend API Async)
  const handleLogin = async (email, password) => {
    try {
      const result = await loginUser(email, password);
      setCurrentUser(result.user);

      const primaryInterest =
        result.user.interests && result.user.interests.length > 0
          ? result.user.interests[0]
          : null;
      setUserInterest(primaryInterest);

      const mappedSaved = (result.user.savedEvents || [])
        .map(mapEvent)
        .filter(Boolean);
      setSavedEvents(mappedSaved);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      triggerToast(`Chào mừng quay lại, ${result.user.name}! 👋`, "success");
      return result.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";
      triggerToast(message, "error");
      throw error;
    }
  };

  const handleRegister = async (name, email, password, role) => {
    try {
      const result = await registerUser(name, email, password, role);
      setCurrentUser(result.user);
      setUserInterest(null);
      setSavedEvents([]);

      if (result.token) {
        localStorage.setItem("token", result.token);
      }

      triggerToast(
        `Đăng ký thành công! Chào mừng ${result.user.name}! 🎉`,
        "success",
      );
      return result.user;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng kiểm tra lại!";
      triggerToast(message, "error");
      throw error;
    }
  };

  const handleLogout = async (navigateFn) => {
    try {
      await logoutUser();
    } catch (e) {
      console.error("Server logout request error", e);
    }
    setCurrentUser(null);
    setUserInterest(null);
    setSavedEvents([]);
    localStorage.removeItem("eb_user");
    localStorage.removeItem("eb_interest");
    localStorage.removeItem("eb_saved_events");
    localStorage.removeItem("token");
    if (navigateFn) navigateFn("/");
    triggerToast("Đã đăng xuất tài khoản thành công.", "info");
  };

  // Profile Interests handlers
  const handleQuizComplete = async (interestProfile) => {
    try {
      if (currentUser) {
        const result = await updateInterests([interestProfile]);
        setUserInterest(interestProfile);
      } else {
        // Fallback for guests
        setUserInterest(interestProfile);
      }

      // Automatically filter explore page as well
      const displayNames = {
        academic: "Academic",
        career: "Career",
        music: "Music",
        volunteer: "Volunteer",
        workshop: "Workshop",
      };
      const filterName = displayNames[interestProfile] || "Workshop";
      setSelectedFilters([filterName]);
      setExplorePage(1);

      triggerToast(
        `AI matches updated: ${filterName}! View recommendations.`,
        "ai",
      );
    } catch (error) {
      triggerToast("Cập nhật kết quả trắc nghiệm thất bại!", "error");
    }
  };

  const handleResetInterests = async () => {
    try {
      if (currentUser) {
        await updateInterests([]);
      }
      setUserInterest(null);
      setSelectedFilters([]);
      triggerToast(
        "Reset AI recommendations to default campus listings.",
        "info",
      );
    } catch {
      setUserInterest(null);
      setSelectedFilters([]);
    }
  };

  // Favorites Calendar handlers
  const handleAddToCalendar = async (event) => {
    if (!currentUser) {
      triggerToast("Vui lòng đăng nhập để lưu sự kiện vào lịch!", "info");
      return;
    }
    try {
      const dbEventId = event._id || event.id;
      const result = await toggleSavedEvent(dbEventId);

      const mappedFavorites = (result.savedEvents || [])
        .map(mapEvent)
        .filter(Boolean);
      setSavedEvents(mappedFavorites);

      const isSavedNow = mappedFavorites.some(
        (e) => (e.id || e._id) === dbEventId,
      );
      if (isSavedNow) {
        triggerToast(
          `📅 Saved "${event.title}" to your Calendar successfully!`,
        );
      } else {
        triggerToast(`Removed "${event.title}" from your Calendar.`, "info");
      }
    } catch (error) {
      triggerToast(
        error.response?.data?.message || "Không thể thực hiện lưu sự kiện!",
        "error",
      );
    }
  };

  const handleRemoveSavedEvent = async (eventId) => {
    try {
      const result = await toggleSavedEvent(eventId);
      const mappedFavorites = (result.savedEvents || [])
        .map(mapEvent)
        .filter(Boolean);
      setSavedEvents(mappedFavorites);
      triggerToast("Đã xóa sự kiện khỏi lịch cá nhân.", "info");
    } catch (error) {
      triggerToast("Không thể xóa sự kiện!", "error");
    }
  };

  // Simulation Role Switcher
  const handleRoleSimulation = async (roleType, navigateFn) => {
    const result = await simulateRole(roleType);
    if (result) {
      setCurrentUser(result.currentUser);
      setUserInterest(result.userInterest);
      setSavedEvents(result.savedEvents);
      if (result.token) {
        localStorage.setItem("token", result.token);
      } else {
        localStorage.removeItem("token");
      }
      if (navigateFn) navigateFn(result.redirectPath);
      triggerToast(result.toastMessage, result.toastType);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        userInterest,
        savedEvents,
        searchQuery,
        selectedFilters,
        explorePage,
        isClubOpen,
        setCurrentUser,
        setUserInterest,
        setSavedEvents,
        setSearchQuery,
        setSelectedFilters,
        setExplorePage,
        setIsClubOpen,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        quizComplete: handleQuizComplete,
        resetInterests: handleResetInterests,
        addToCalendar: handleAddToCalendar,
        removeSavedEvent: handleRemoveSavedEvent,
        simulateRole: handleRoleSimulation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
