import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Auth = () => {
  const { currentUser, logout, login, register } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminLogin = location.pathname === "/admin-login";

  const [activeTab, setActiveTab] = useState("login"); // 'login' or 'register'
  const [role, setRole] = useState("user"); // 'user' or 'admin'
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    clubCategory: "academic",
  });

  // Sync role based on the route path accessed and handle redirection/logout for existing sessions
  useEffect(() => {
    if (isAdminLogin) {
      setRole("admin");
      setActiveTab("login");
      if (currentUser) {
        if (currentUser.role === "user") {
          // Log out student if they want to access admin login
          logout();
        } else if (currentUser.role === "admin") {
          // Redirect to admin dashboard if already logged in as admin
          navigate("/admin/manage");
        }
      }
    } else {
      setRole("user");
      if (currentUser) {
        if (currentUser.role === "admin") {
          // Log out admin if they access student login
          logout();
        } else if (currentUser.role === "user") {
          // Redirect to home if already logged in as student
          navigate("/");
        }
      }
    }
  }, [isAdminLogin, currentUser, navigate, logout]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === "login") {
        const user = await login(formData.email, formData.password);
        if (user.role === "admin") {
          navigate("/admin/manage");
        } else {
          navigate("/");
        }
      } else {
        // Register
        const user = await register(
          formData.name,
          formData.email,
          formData.password,
          role === "user" ? "user" : "admin",
        );
        if (user.role === "admin") {
          navigate("/admin/manage");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Auth action failed:", error);
    }
  };

  return (
    <div className="w-full bg-[#fafbfc] min-h-[80vh] flex items-center justify-center py-12">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-10 animate-fade-in-up">
        {/* Logo Icon */}
        <div className="text-center mb-8 flex flex-col items-center">
          <div
            className={`w-12 h-12 text-2xl rounded-2xl flex items-center justify-center font-extrabold select-none mb-3 ${
              isAdminLogin
                ? "bg-orange-100 text-accent-orange"
                : "bg-blue-100 text-primary-blue"
            }`}
          >
            {isAdminLogin ? "🛡️" : "🎓"}
          </div>
          <h2 className="text-xl font-extrabold text-slate-800">
            {isAdminLogin
              ? "Cổng Đăng Nhập Quản Trị Viên"
              : "Đăng Nhập Người Dùng"}
          </h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">
            {isAdminLogin
              ? "Cổng điều phối dành riêng cho Quản trị viên"
              : "Khám phá đời sống campus và kết nối bạn bè cùng khóa"}
          </p>
        </div>

        {/* Auth Tab Switcher */}
        {!isAdminLogin && (
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                activeTab === "login"
                  ? "border-primary-blue text-primary-blue"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-all ${
                activeTab === "register"
                  ? "border-primary-blue text-primary-blue"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              Đăng Ký
            </button>
          </div>
        )}

        {/* Locked Active Role Display Badge (Shows who they login as) */}
        <div className="w-full mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-600 flex items-center justify-center gap-2">
          <span>{role === "user" ? "🎓" : "🛡️"}</span>
          <span>
            Vai trò tích cực:{" "}
            <span
              className={
                role === "user"
                  ? "text-primary-blue font-extrabold"
                  : "text-accent-orange font-extrabold"
              }
            >
              {role === "user" ? "NGƯỜI DÙNG" : "QUẢN TRỊ VIÊN"}
            </span>
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Register Name field */}
          {activeTab === "register" && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                {role === "user" ? "Họ và Tên *" : "Tên Quản trị viên *"}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder={
                  role === "user"
                    ? "Ví dụ: Nguyễn Văn A"
                    : "Ví dụ: Admin Hệ Thống"
                }
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
              />
            </div>
          )}

          {/* Student ID field (User mode register only) */}
          {activeTab === "register" && role === "user" && (
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                Mã số (Tùy chọn)
              </label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleInputChange}
                placeholder="Ví dụ: B20DCCN001"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
              />
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
              Email đăng nhập *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder={
                role === "user" ? "user@example.com" : "admin@example.com"
              }
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
              Mật khẩu *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Nhập ít nhất 6 ký tự..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
            />
          </div>

          {/* Register Checkbox terms */}
          {activeTab === "register" && (
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-500 font-semibold pt-1">
              <input
                type="checkbox"
                required
                className="mt-0.5 w-3.5 h-3.5 text-primary-blue rounded border-slate-350 accent-primary-blue cursor-pointer"
              />
              <span>
                Tôi đồng ý với các Điều khoản dịch vụ và Chính sách sinh viên
                của Event Buddy.
              </span>
            </label>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            className={`w-full mt-3 py-3 text-white text-xs font-bold rounded-xl shadow-lg transition-all ${
              role === "user"
                ? "bg-primary-blue hover:bg-primary-blue-hover glow-blue"
                : "bg-accent-orange hover:bg-accent-orange-hover glow-orange"
            }`}
          >
            {activeTab === "login" ? "Đăng Nhập" : "Đăng Ký Tài Khoản"}
          </button>
        </form>

        {/* Demo instructions */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center font-medium leading-relaxed">
          💡 **Gợi ý kiểm thử nhanh:** Hãy nhấn Đăng nhập trực tiếp (không cần
          mật khẩu) để tự động đăng nhập tài khoản mô phỏng vai trò đã chọn.
        </div>
      </div>
    </div>
  );
};

export default Auth;
