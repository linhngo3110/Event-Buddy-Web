import api from "./api";

/**
 * Real login request.
 * @param {string} email
 * @param {string} password
 */
export const loginUser = async (email, password) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // returns { success, token, user }
};

/**
 * Real register request.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @param {string} role
 */
export const registerUser = async (name, email, password, role) => {
  const response = await api.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data; // returns { success, token, user }
};

/**
 * Real logout request.
 */
export const logoutUser = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

/**
 * Get profile details for logged in user.
 */
export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data; // { success, user }
};

/**
 * Update user interests (Quiz results).
 * @param {Array} interests
 */
export const updateInterests = async (interests) => {
  const response = await api.put("/users/interests", { interests });
  return response.data; // { success, user }
};

/**
 * Toggle favorite event.
 * @param {string} eventId
 */
export const toggleSavedEvent = async (eventId) => {
  const response = await api.post(`/users/favorites/${eventId}`);
  return response.data; // { success, savedEvents }
};

/**
 * Handles developer/testing role simulation switcher.
 * Autodetects and logs in using real DB accounts, falls back to mock if network/DB is down.
 */
export const simulateRole = async (roleType) => {
  if (roleType === "guest") {
    return {
      currentUser: null,
      userInterest: null,
      savedEvents: [],
      redirectPath: "/",
      toastMessage: "Chuyển sang chế độ: Khách vãng lai 👤",
      toastType: "info",
    };
  } else if (roleType === "user") {
    try {
      // Try to login using real user test account
      const result = await loginUser("user.test@school.edu.vn", "password123");
      return {
        currentUser: result.user,
        userInterest: result.user.interests[0] || null,
        savedEvents: result.user.savedEvents || [],
        token: result.token,
        redirectPath: "/",
        toastMessage: "Chuyển sang chế độ: Người dùng (Tài khoản thật) 🎓",
        toastType: "success",
      };
    } catch {
      // Fallback simulated user
      return {
        currentUser: {
          id: "user-sim",
          name: "Lê Minh Tuấn (Mô phỏng)",
          email: "user.test@school.edu.vn",
          role: "user",
          interests: ["music"],
        },
        userInterest: "music",
        savedEvents: [],
        redirectPath: "/",
        toastMessage: "Mô phỏng Người dùng (Chưa có DB) 🎓",
        toastType: "success",
      };
    }
  } else if (roleType === "admin") {
    try {
      // Try to login using real admin test account
      const result = await loginUser("admin.test@school.edu.vn", "password123");
      return {
        currentUser: result.user,
        userInterest: null,
        savedEvents: [],
        token: result.token,
        redirectPath: "/admin/manage",
        toastMessage: "Chuyển sang chế độ: Quản trị viên (Tài khoản thật) 🛡️",
        toastType: "success",
      };
    } catch {
      // Fallback simulated admin user
      return {
        currentUser: {
          id: "admin-sim",
          name: "Admin Hệ Thống (Mô phỏng)",
          email: "admin.test@school.edu.vn",
          role: "admin",
          interests: [],
        },
        userInterest: null,
        savedEvents: [],
        redirectPath: "/admin/manage",
        toastMessage: "Mô phỏng Quản trị viên (Chưa có DB) 🛡️",
        toastType: "success",
      };
    }
  }
  return null;
};
