import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const { currentUser, savedEvents, removeSavedEvent, logout } = useApp();

  const [showCalendar, setShowCalendar] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
    setShowProfileMenu(false);
    setShowCalendar(false);
  };

  const isUser = currentUser && currentUser.role === "user";
  const isAdmin = currentUser && currentUser.role === "admin";

  const getLinkClass = (path) => {
    const isActive = pathname === path;
    return `text-xs font-bold uppercase tracking-wider transition-all relative py-2.5 px-1 flex flex-col items-center gap-1.5 select-none ${
      isActive ? "text-primary-blue font-extrabold" : "text-slate-500 hover:text-slate-900"
    }`;
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 px-4 sm:px-6 lg:px-8 pt-4">
      <div className="max-w-7xl mx-auto glass-panel rounded-2xl sm:rounded-3xl shadow-sm border border-white/50 px-6 sm:px-8 flex justify-between items-center h-16 sm:h-20">
        {/* Logo with Mascot */}
        <div
          onClick={() => handleNavClick("/")}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-orange-100 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-inner">
            <svg
              viewBox="0 0 100 100"
              className="w-7 h-7 sm:w-8 sm:h-8 text-accent-orange"
              fill="currentColor"
            >
              <path d="M50 5 L63 36 L95 38 L70 60 L78 92 L50 74 L22 92 L30 60 L5 38 L37 36 Z" />
              <circle cx="40" cy="48" r="4" fill="white" />
              <circle cx="60" cy="48" r="4" fill="white" />
              <circle cx="40" cy="48" r="2" fill="black" />
              <circle cx="60" cy="48" r="2" fill="black" />
              <ellipse
                cx="34"
                cy="54"
                rx="4"
                ry="2"
                fill="#F43F5E"
                opacity="0.6"
              />
              <ellipse
                cx="66"
                cy="54"
                rx="4"
                ry="2"
                fill="#F43F5E"
                opacity="0.6"
              />
              <path
                d="M46 56 Q50 60 54 56"
                stroke="black"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-800">
            Event <span className="text-primary-blue">Buddy</span>
          </span>
        </div>

        {/* Dynamic Navigation Links based on role */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {!isAdmin ? (
            // Public / Student links
            <>
              <button
                onClick={() => handleNavClick("/")}
                className={getLinkClass("/")}
              >
                <span>Home</span>
                {pathname === "/" && (
                  <span className="w-1.5 h-1.5 bg-primary-blue rounded-full absolute bottom-0.5" />
                )}
              </button>
              <button
                onClick={() => handleNavClick("/explore")}
                className={getLinkClass("/explore")}
              >
                <span>Explore Events</span>
                {pathname === "/explore" && (
                  <span className="w-1.5 h-1.5 bg-primary-blue rounded-full absolute bottom-0.5" />
                )}
              </button>
              <button
                onClick={() => handleNavClick("/recommendations")}
                className={getLinkClass("/recommendations")}
              >
                <span>AI Matches</span>
                {pathname === "/recommendations" && (
                  <span className="w-1.5 h-1.5 bg-primary-blue rounded-full absolute bottom-0.5" />
                )}
              </button>
            </>
          ) : (
            // Admin links
            <>
              <button
                onClick={() => handleNavClick("/admin/manage")}
                className={getLinkClass("/admin/manage")}
              >
                <span>Manage Events</span>
                {pathname === "/admin/manage" && (
                  <span className="w-1.5 h-1.5 bg-primary-blue rounded-full absolute bottom-0.5" />
                )}
              </button>
            </>
          )}
        </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Virtual Calendar drawer (only for Student or Guest views) */}
            {!isAdmin && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowCalendar(!showCalendar);
                    setShowProfileMenu(false);
                  }}
                  className={`p-2.5 rounded-xl border border-slate-200/80 flex items-center justify-center transition-all ${
                    savedEvents.length > 0
                      ? "bg-blue-50/50 border-blue-200 text-primary-blue"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                  title="Virtual Calendar"
                >
                  <svg
                    className="w-5.5 h-5.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {savedEvents.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent-orange text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-bounce">
                      {savedEvents.length}
                    </span>
                  )}
                </button>

                {/* Calendar dropdown list */}
                {showCalendar && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 animate-fade-in-up z-50">
                    <div className="flex justify-between items-center pb-2.5 border-b border-slate-100 mb-3">
                      <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <span>📅</span> Saved Calendar
                      </h4>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {savedEvents.length}
                      </span>
                    </div>

                    {savedEvents.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs font-medium">
                        No events added yet. Add events to populate your
                        personal calendar!
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {savedEvents.map((evt) => (
                          <div
                            key={evt.id}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-50 hover:bg-slate-100/80 transition-colors group"
                          >
                            <div
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleNavClick(`/event/${evt.id}`)}
                            >
                              <img
                                src={evt.image}
                                alt={evt.title}
                                className="w-10 h-10 object-cover rounded-lg"
                              />
                              <div className="text-left">
                                <p className="text-xs font-bold text-slate-800 line-clamp-1">
                                  {evt.title}
                                </p>
                                <p className="text-[10px] text-slate-500 line-clamp-1">
                                  {evt.date.split(" - ")[0]}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => removeSavedEvent(evt.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                              title="Remove from Calendar"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Profile Dropdown or Login buttons */}
            {currentUser ? (
              /* --- STATE: LOGGED IN USER AVATAR --- */
              <div className="relative">
                <button
                  onClick={() => {
                    setShowProfileMenu(!showProfileMenu);
                    setShowCalendar(false);
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-md transition-all select-none hover:scale-103 ${
                    isAdmin
                      ? "bg-gradient-to-tr from-orange-500 to-amber-500"
                      : "bg-gradient-to-tr from-primary-blue to-indigo-600 shadow-blue-100/50"
                  }`}
                >
                  {currentUser.name.charAt(0)}
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 p-2.5 animate-fade-in-up z-50 text-left">
                    <div className="px-3.5 py-2 border-b border-slate-100 mb-2">
                      <p className="text-xs font-bold text-slate-800 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                        {currentUser.email}
                      </p>
                    </div>

                    <div className="space-y-0.5">
                      {isUser && (
                        <>
                          <button
                            onClick={() => handleNavClick("/profile")}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-primary-blue font-semibold rounded-xl transition-colors"
                          >
                            👦 My Profile
                          </button>

                          <button
                            onClick={() => handleNavClick("/favorites")}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-primary-blue font-semibold rounded-xl transition-colors"
                          >
                            ❤️ Favorites
                          </button>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleNavClick("/admin/manage")}
                            className="w-full text-left px-3.5 py-2 text-xs text-slate-600 hover:bg-slate-50 hover:text-primary-blue font-semibold rounded-xl transition-colors"
                          >
                            🛡️ Manage Events
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => logout(navigate)}
                        className="w-full text-left px-3.5 py-2 text-xs text-rose-500 hover:bg-rose-50 font-bold rounded-xl transition-colors mt-1.5 pt-1.5 border-t border-slate-100"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* --- STATE: GUEST AUTH ACTIONS --- */
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleNavClick("/login")}
                  className="text-xs font-bold text-slate-600 hover:text-primary-blue px-3.5 py-2.5 rounded-xl transition-colors"
                >
                  Đăng Nhập
                </button>
                <button
                  onClick={() => handleNavClick("/quiz")}
                  className="bg-accent-orange text-white hover:bg-accent-orange-hover text-xs font-bold py-2.5 px-4.5 rounded-full shadow-md shadow-orange-100 hover:scale-105 active:scale-95 transition-all"
                >
                  Quiz Đề xuất
                </button>
              </div>
            )}
          </div>
        </div>
    </header>
  );
};

export default Header;
