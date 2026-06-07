import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import { apiFetchEvents, apiDeleteEvent } from "../services/eventService";
import api from "../services/api";

const categoryMap = {
  academic: {
    name: "Học thuật & Nghiên cứu 🎓",
    bg: "bg-blue-50 text-blue-600 border border-blue-100",
  },
  career: {
    name: "Kỹ năng & Sự nghiệp 💼",
    bg: "bg-indigo-50 text-indigo-600 border border-indigo-100",
  },
  music: {
    name: "Nghệ thuật & Âm nhạc 🎵",
    bg: "bg-pink-50 text-pink-600 border border-pink-100",
  },
  volunteer: {
    name: "Tình nguyện vì cộng đồng 🤝",
    bg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  },
  workshop: {
    name: "Công nghệ & Workshop 💻",
    bg: "bg-violet-50 text-violet-600 border border-violet-100",
  },
};

const AdminManage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { triggerToast } = useToast();
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState("events"); // 'events' or 'registrations'

  const clubName = currentUser ? currentUser.name : "GDSC Club";

  // Fetch events list asynchronously
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiFetchEvents,
  });

  // Calculate average rating dynamically from events
  const avgRating = useMemo(() => {
    const ratedEvents = events.filter((e) => e.averageRating && e.averageRating > 0);
    if (ratedEvents.length === 0) return "5.0 / 5.0 ★";
    const total = ratedEvents.reduce((acc, curr) => acc + curr.averageRating, 0);
    return `${(total / ratedEvents.length).toFixed(1)} / 5.0 ★`;
  }, [events]);

  // Fetch club registrations notifications
  const { data: registrations = [], isLoading: isRegsLoading } = useQuery({
    queryKey: ["clubRegistrations"],
    queryFn: async () => {
      const response = await api.get("/users/club-registrations");
      return response.data.registrations || [];
    },
  });

  // React Query Mutation to delete event asynchronously
  const deleteMutation = useMutation({
    mutationFn: apiDeleteEvent,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });

  // React Query Mutation to delete registration request
  const deleteRegMutation = useMutation({
    mutationFn: async (regId) => {
      const response = await api.delete(`/users/club-registrations/${regId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubRegistrations"] });
      triggerToast("🗑️ Đã từ chối đề xuất sự kiện thành công!", "info");
    },
    onError: (err) => {
      triggerToast(
        `Lỗi: ${err.response?.data?.message || err.message}`,
        "error",
      );
    },
  });

  // React Query Mutation to approve and publish club proposed event
  const approveRegMutation = useMutation({
    mutationFn: async (regId) => {
      const response = await api.post(`/users/club-registrations/${regId}/approve`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clubRegistrations"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      triggerToast("🎉 Đã duyệt & đăng tải sự kiện thành công!", "success");
    },
    onError: (err) => {
      triggerToast(
        `Lỗi: ${err.response?.data?.message || err.message}`,
        "error",
      );
    },
  });

  const handleDeleteClick = (eventId, title) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sự kiện "${title}" không?`)) {
      deleteMutation.mutate(eventId, {
        onSuccess: () => {
          triggerToast(`🗑️ Đã xóa sự kiện "${title}" thành công!`, "info");
        },
      });
    }
  };

  const handleDeleteRegClick = (regId, clubName) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn từ chối đề xuất sự kiện của CLB "${clubName}" không?`,
      )
    ) {
      deleteRegMutation.mutate(regId);
    }
  };

  return (
    <section className="bg-slate-50 py-12 min-h-[80vh] w-full text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <span className="text-[10px] font-bold tracking-widest text-accent-orange bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase">
              Club Dashboard
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2 uppercase">
              Manage Events
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              Kênh quản lý hoạt động chính thức của ban tổ chức{" "}
              <span className="text-primary-blue font-bold">{clubName}</span>.
            </p>
          </div>
        </div>

        {/* Premium Dashboard Metrics Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            {
              label: "Tổng sự kiện",
              val: events.length,
              icon: "📅",
              color: "bg-blue-50 text-primary-blue",
            },
            {
              label: "Yêu cầu đăng ký CLB",
              val: `${registrations.length} thông báo`,
              icon: "🔔",
              color: "bg-amber-50 text-amber-600 shadow-inner",
            },
            {
              label: "Đánh giá trung bình",
              val: avgRating,
              icon: "⭐",
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4"
            >
              <span
                className={`text-2xl w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} shadow-inner`}
              >
                {stat.icon}
              </span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">
                  {stat.label}
                </p>
                <p className="text-sm font-extrabold text-slate-800 mt-1">
                  {stat.val}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("events")}
            className={`pb-4 text-sm font-extrabold transition-all border-b-2 px-1 relative flex items-center gap-2 cursor-pointer ${
              activeTab === "events"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-slate-400 hover:text-slate-655"
            }`}
          >
            📅 Sự kiện của tôi ({events.length})
          </button>

          <button
            onClick={() => setActiveTab("registrations")}
            className={`pb-4 text-sm font-extrabold transition-all border-b-2 px-1 relative flex items-center gap-2 cursor-pointer ${
              activeTab === "registrations"
                ? "border-primary-blue text-primary-blue"
                : "border-transparent text-slate-400 hover:text-slate-655"
            }`}
          >
            🔔 Thông báo Đăng ký CLB
            {registrations.length > 0 && (
              <span className="bg-rose-500 text-white rounded-full flex items-center justify-center px-2 py-0.5 text-[9px] font-extrabold shadow-sm animate-pulse">
                {registrations.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Box */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
          {activeTab === "events" ? (
            /* --- EVENTS TAB PANEL --- */
            <div>
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800">
                  Danh sách sự kiện đang quản lý
                </h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {events.length} Items
                </span>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                  <span className="text-4xl animate-spin">⏳</span>
                  <p className="text-sm font-bold">
                    Đang tải danh sách sự kiện quản lý...
                  </p>
                </div>
              ) : events.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs font-bold">
                  Chưa có sự kiện nào được phê duyệt & đăng tải. Hãy duyệt các đề xuất từ CLB ở tab tiếp theo để bắt đầu!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase bg-slate-50/20">
                        <th className="py-4 px-6">Sự kiện</th>
                        <th className="py-4 px-6">Phân loại</th>
                        <th className="py-4 px-6">Thời gian & Địa điểm</th>
                        <th className="py-4 px-6">Trạng thái</th>
                        <th className="py-4 px-6 text-center">Thao tác</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {events.map((evt, idx) => {
                        const statuses = ["Active", "Finished", "Draft"];
                        const status = statuses[idx % 3];
                        return (
                          <tr
                            key={evt.id}
                            className="hover:bg-slate-50/40 text-xs text-slate-700 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3.5">
                                <img
                                  src={evt.image}
                                  alt={evt.title}
                                  className="w-10 h-10 object-cover rounded-lg shrink-0 border border-slate-100"
                                />
                                <span className="font-bold text-slate-800 line-clamp-1 max-w-[200px]">
                                  {evt.title}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-6">
                              <div className="flex flex-wrap gap-1">
                                {evt.categories.map((cat, cidx) => (
                                  <span
                                    key={cidx}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>
                            </td>

                            <td className="py-4 px-6 leading-relaxed">
                              <p className="font-semibold text-slate-800">
                                {evt.date.split(" - ")[0]}
                              </p>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                {evt.location}
                              </p>
                            </td>

                            <td className="py-4 px-6">
                              <span
                                className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                                  status === "Active"
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    : status === "Finished"
                                      ? "bg-slate-100 text-slate-500"
                                      : "bg-blue-50 text-primary-blue border border-blue-100"
                                }`}
                              >
                                {status}
                              </span>
                            </td>

                            <td className="py-4 px-6 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  disabled={deleteMutation.isPending}
                                  onClick={() =>
                                    navigate(`/admin/edit/${evt.id}`)
                                  }
                                  className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold rounded-lg transition-all disabled:opacity-50"
                                >
                                  Sửa
                                </button>
                                <button
                                  disabled={deleteMutation.isPending}
                                  onClick={() =>
                                    handleDeleteClick(evt.id, evt.title)
                                  }
                                  className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 text-[10px] font-bold rounded-lg transition-all disabled:opacity-50"
                                >
                                  {deleteMutation.isPending &&
                                  deleteMutation.variables === evt.id
                                    ? "..."
                                    : "Xóa"}
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            /* --- NOTIFICATIONS / REGISTRATIONS TAB PANEL --- */
            <div>
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h4 className="text-sm font-bold text-slate-800">
                  Đề xuất đăng tải Sự kiện từ Câu lạc bộ
                </h4>
                <span className="text-[10px] text-slate-400 font-bold uppercase">
                  {registrations.length} Yêu cầu
                </span>
              </div>

              <div className="p-6">
                {isRegsLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                    <span className="text-4xl animate-spin">⏳</span>
                    <p className="text-sm font-bold">
                      Đang tải danh sách đề xuất sự kiện...
                    </p>
                  </div>
                ) : registrations.length === 0 ? (
                  <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400 gap-4">
                    <span className="text-5xl">📬</span>
                    <p className="text-sm font-extrabold text-slate-500">
                      Chưa có đề xuất sự kiện nào từ các Câu lạc bộ.
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Khi các câu lạc bộ điền biểu mẫu đề xuất sự kiện ở trang chủ, các yêu cầu kiểm duyệt sự kiện sẽ hiển thị ngay tại đây để bạn phê duyệt và đăng tải trực tiếp lên hệ thống.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {registrations.map((reg) => {
                      const regCategory = categoryMap[reg.category] || {
                        name: reg.category,
                        bg: "bg-slate-100 text-slate-655 border border-slate-200",
                      };
                      const formattedDate = new Date(
                        reg.createdAt,
                      ).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      });

                      return (
                        <div
                          key={reg._id}
                          className="bg-slate-50 rounded-3xl border border-slate-200/80 hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between"
                        >
                          {/* Banner Image or Default Gradient */}
                          <div className="relative h-44 w-full overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shrink-0">
                            {reg.image ? (
                              <img
                                src={reg.image}
                                alt={reg.title}
                                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center text-white/20 font-black text-2xl tracking-widest select-none bg-slate-900">
                                EVENT BUDDY PROPOSAL
                              </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            <div className="absolute bottom-3 left-4 right-4">
                              <span
                                className={`px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase tracking-wide shadow-sm inline-block mb-1.5 ${regCategory.bg}`}
                              >
                                {regCategory.name}
                              </span>
                              <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                                {reg.title}
                              </h3>
                            </div>
                          </div>

                          <div className="p-5 flex-grow flex flex-col justify-between">
                            <div className="space-y-4">
                              {/* Metadata Grid */}
                              <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-600">
                                <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                    ♣️ Câu lạc bộ đề xuất
                                  </p>
                                  <p className="font-extrabold text-slate-800 truncate">
                                    {reg.clubName}
                                  </p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                    ⏱️ Ngày diễn ra
                                  </p>
                                  <p className="font-extrabold text-slate-800 truncate">
                                    {reg.date}
                                  </p>
                                </div>
                                <div className="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm col-span-2">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                                    📍 Địa điểm tổ chức
                                  </p>
                                  <p className="font-extrabold text-slate-800 truncate">
                                    {reg.location}
                                  </p>
                                </div>
                              </div>

                              {/* Contact Details */}
                              <div className="bg-white border border-slate-100 rounded-xl p-3 text-[11px] text-slate-655 shadow-sm flex items-center justify-between">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                    ✉️ Email liên hệ
                                  </span>
                                  <a
                                    href={`mailto:${reg.email}`}
                                    className="text-primary-blue hover:underline font-extrabold text-[11px]"
                                  >
                                    {reg.email}
                                  </a>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">
                                  Gửi {formattedDate}
                                </span>
                              </div>

                              {/* Event Description */}
                              <div>
                                <p className="text-[9px] text-slate-400 font-extrabold uppercase mb-1 tracking-wider">
                                  📝 Mô tả chi tiết sự kiện:
                                </p>
                                <div className="bg-white border border-slate-100 rounded-xl p-3 text-[11px] text-slate-700 leading-relaxed max-h-[100px] overflow-y-auto whitespace-pre-line font-medium shadow-inner">
                                  {reg.description}
                                </div>
                              </div>
                            </div>

                            {/* Actions Group */}
                            <div className="flex gap-2 pt-4 border-t border-slate-100 mt-5">
                              <button
                                disabled={approveRegMutation.isPending || deleteRegMutation.isPending}
                                onClick={() => approveRegMutation.mutate(reg._id)}
                                className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md hover:shadow-emerald-100 disabled:opacity-50 cursor-pointer"
                              >
                                {approveRegMutation.isPending && approveRegMutation.variables === reg._id ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>Đang duyệt...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>✓</span>
                                    <span>Duyệt & Đăng tải</span>
                                  </>
                                )}
                              </button>
                              
                              <button
                                disabled={approveRegMutation.isPending || deleteRegMutation.isPending}
                                onClick={() => handleDeleteRegClick(reg._id, reg.clubName)}
                                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0"
                              >
                                {deleteRegMutation.isPending && deleteRegMutation.variables === reg._id ? (
                                  "..."
                                ) : (
                                  <>
                                    <span>✕</span>
                                    <span>Từ chối</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminManage;
