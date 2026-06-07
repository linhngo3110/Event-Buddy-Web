import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import { useToast } from "../context/ToastContext";
import EventCard from "../components/EventCard";
import {
  apiFetchEvents,
  calculateEventScores
} from "../services/eventService";
import api from "../services/api";

const categoryMap = {
  academic: { name: "Học thuật & Nghiên cứu 🎓", bg: "bg-blue-50 text-blue-600 border border-blue-100" },
  career: { name: "Kỹ năng & Sự nghiệp 💼", bg: "bg-indigo-50 text-indigo-600 border border-indigo-100" },
  music: { name: "Nghệ thuật & Âm nhạc 🎵", bg: "bg-pink-50 text-pink-600 border border-pink-100" },
  volunteer: { name: "Tình nguyện vì cộng đồng 🤝", bg: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
  workshop: { name: "Công nghệ & Workshop 💻", bg: "bg-violet-50 text-violet-600 border border-violet-100" },
};

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { triggerToast } = useToast();
  const { currentUser, savedEvents, addToCalendar, userInterest } = useApp();

  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch server database events
  const { data: events = [], isLoading, refetch } = useQuery({
    queryKey: ["events"],
    queryFn: apiFetchEvents
  });

  // Attach match scores reactively
  const eventsWithScores = useMemo(() => {
    return calculateEventScores(events, userInterest);
  }, [events, userInterest]);

  const event = useMemo(() => {
    return eventsWithScores.find((e) => e.id === id) || eventsWithScores.find((e) => e.id === "evt-1") || eventsWithScores[0];
  }, [eventsWithScores, id]);

  const relatedEvents = useMemo(() => {
    if (!event) return [];
    return eventsWithScores
      .filter((e) => e.id !== event.id && e.categories.some((c) => event.categories.includes(c)))
      .slice(0, 3);
  }, [eventsWithScores, event]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    try {
      const response = await api.post(`/events/${event.id}/reviews`, {
        rating: userRating,
      });

      if (response.data.success) {
        triggerToast(response.data.message || "🎉 Đã gửi đánh giá của bạn thành công!");
        refetch();
      } else {
        triggerToast(response.data.message || "Không thể lưu đánh giá.", "error");
      }
    } catch (error) {
      console.error("Lỗi đánh giá sự kiện:", error);
      triggerToast(
        error.response?.data?.message || "Không thể gửi đánh giá. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <span className="text-4xl animate-spin">⏳</span>
        <p className="text-slate-500 font-bold">Đang tải thông tin chi tiết sự kiện...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 font-semibold">Event not found.</p>
        <button onClick={() => navigate("/")} className="mt-4 text-xs text-primary-blue font-bold">
          Back to Home
        </button>
      </div>
    );
  }

  const isSaved = savedEvents.some((e) => e.id === event.id);

  return (
    <div className="w-full min-h-screen pb-20 bg-transparent">
      
      {/* Banner image with cover overlay */}
      <div className="relative w-full h-[380px] bg-slate-950 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover opacity-40 scale-105 transition-transform duration-10000 ease-out"
        />
        {/* Decorative ambient glow inside banner */}
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[80%] bg-primary-blue/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[80%] bg-accent-orange/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#fafbfd] via-slate-950/60 to-slate-950/20" />
        
        {/* Breadcrumbs and Basic Title */}
        <div className="absolute bottom-8 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
            
            {/* Breadcrumb nav */}
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-3.5 uppercase tracking-wider">
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/")}>Home</span>
              <span>/</span>
              <span className="hover:text-white cursor-pointer transition-colors" onClick={() => navigate("/explore")}>Events</span>
              <span>/</span>
              <span className="text-white truncate max-w-[200px] sm:max-w-sm">{event.title}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white leading-tight uppercase tracking-tight filter drop-shadow-md">
              {event.title}
            </h1>

            {/* Rating Stars under title in banner */}
            <div className="flex items-center gap-2.5 mt-5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel-dark bg-slate-900/40 border-slate-500/20 backdrop-blur-md shadow-sm">
                <div className="flex text-amber-400 text-xs">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className="filter drop-shadow-[0_0_4px_rgba(251,191,36,0.3)]">
                      {star <= Math.round(event.averageRating || 0) ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-extrabold text-white">
                  {event.averageRating ? event.averageRating.toFixed(1) : "0.0"}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-300">
                ({event.numOfReviews || 0} đánh giá)
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info Columns (8 cols) */}
          <div className="lg:col-span-8 space-y-8 text-left">
            
            {/* Details Panel */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-200/50 shadow-xl shadow-slate-100/30 space-y-6">
              
              {/* Category tag pills */}
              <div className="flex flex-wrap gap-2">
                {event.categories.map((cat, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg tracking-wider transition-all duration-300 ${
                      idx === 0
                        ? "bg-orange-500/10 text-accent-orange border border-accent-orange/20 hover:bg-orange-500/20"
                        : "bg-primary-blue/10 text-primary-blue border border-primary-blue/20 hover:bg-primary-blue/20"
                    }`}
                  >
                    {cat}
                  </span>
                ))}
                {event.matchScore && (
                  <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-md shadow-orange-500/20 animate-pulse-slow">
                    ✨ AI Match {event.matchScore}%
                  </span>
                )}
              </div>

              {/* Event description */}
              <div className="space-y-4 pb-6 border-b border-slate-200/60">
                <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-primary-blue"></span>
                  Giới thiệu sự kiện
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Premium Review Section */}
              <div className="space-y-6 pt-2">
                <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                  <span className="w-1.5 h-6 rounded-full bg-amber-500"></span>
                  Đánh giá sự kiện này ({event.numOfReviews || 0} lượt)
                </h3>

                {/* Rating Form (For Logged-in Users) */}
                {currentUser ? (
                  <form 
                    onSubmit={handleReviewSubmit} 
                    className="bg-gradient-to-br from-slate-50/60 to-slate-100/40 border border-slate-200/50 rounded-3xl p-6 shadow-inner space-y-5"
                  >
                    <div className="flex flex-col gap-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                          Chọn mức đánh giá của bạn
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Đóng góp ý kiến của bạn về sự kiện này thông qua số lượng sao.
                        </p>
                      </div>

                      {/* Star Selection */}
                      <div className="flex flex-wrap items-center gap-6 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-2 text-4xl">
                            {[1, 2, 3, 4, 5].map((star) => {
                              const isLit = hoverRating !== null ? star <= hoverRating : star <= userRating;
                              return (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setUserRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(null)}
                                  className={`cursor-pointer transition-all duration-200 ease-out transform hover:scale-125 hover:rotate-6 ${
                                    isLit 
                                      ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]" 
                                      : "text-slate-200 hover:text-amber-200"
                                  }`}
                                >
                                  ★
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        
                        <div className="flex items-center transition-all duration-300">
                          <span className="text-xs font-extrabold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl shadow-sm animate-fade-in-up">
                            {userRating === 5
                              ? "Tuyệt vời! 😍"
                              : userRating === 4
                              ? "Rất tốt! 😊"
                              : userRating === 3
                              ? "Bình thường. 🙂"
                              : userRating === 2
                              ? "Kém. 🙁"
                              : "Rất kém. 😡"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-3 border-t border-slate-200/60">
                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="px-6 py-3 bg-gradient-to-r from-primary-blue to-blue-600 hover:from-primary-blue-hover hover:to-blue-700 glow-blue text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                      >
                        {isSubmittingReview ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            Đang gửi...
                          </>
                        ) : (
                          "Gửi đánh giá sao"
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="bg-gradient-to-br from-slate-50/50 to-slate-100/30 rounded-2xl p-6 border border-slate-200/40 text-center text-xs text-slate-500 font-semibold leading-relaxed shadow-sm">
                    🔑 Vui lòng <span className="text-primary-blue font-bold cursor-pointer hover:underline" onClick={() => navigate("/login")}>Đăng nhập</span> ngay để gửi đánh giá sao cho sự kiện này.
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* Sidebar Actions Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6 text-left lg:sticky lg:top-24 select-none">
            
            {/* Quick action card */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl p-6 border border-slate-200/50 shadow-xl shadow-slate-100/30 space-y-6">
              
              {/* Time block */}
              <div className="flex items-center gap-3.5 group">
                <span className="text-lg w-11 h-11 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">📅</span>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Thời gian</p>
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">{event.date}</p>
                </div>
              </div>

              {/* Location block */}
              <div className="flex items-center gap-3.5 group">
                <span className="text-lg w-11 h-11 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">📍</span>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Địa điểm</p>
                  <p className="text-xs font-extrabold text-slate-800 mt-0.5">{event.location}</p>
                </div>
              </div>

              {/* Rating block */}
              <div className="flex items-center gap-3.5 group">
                <span className="text-lg w-11 h-11 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">⭐</span>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Đánh giá sao</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div className="flex text-amber-400 text-xs">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="filter drop-shadow-[0_0_3px_rgba(251,191,36,0.2)]">
                          {star <= Math.round(event.averageRating || 0) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-slate-800">
                      {event.averageRating ? `${event.averageRating.toFixed(1)}` : "0.0"} ({event.numOfReviews || 0} lượt)
                    </span>
                  </div>
                </div>
              </div>

              {/* Add Calendar CTA */}
              <button
                onClick={() => addToCalendar(event)}
                className={`w-full py-4 px-4 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                  isSaved
                    ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/20"
                    : "bg-gradient-to-r from-accent-orange to-orange-500 text-white hover:from-accent-orange-hover hover:to-orange-600 glow-orange"
                }`}
              >
                {isSaved ? "✓ Saved to Calendar" : "Add to Calendar"}
              </button>
            </div>

          </div>

        </div>

        {/* --- RELATED EVENTS (Same Category) --- */}
        {relatedEvents.length > 0 && (
          <div className="mt-20 pt-10 border-t border-slate-200 text-center">
            <h3 className="text-xl font-extrabold uppercase mb-8 text-gradient-primary tracking-tight">
              Sự kiện liên quan có thể bạn quan tâm
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
              {relatedEvents.map((evt) => (
                <div key={evt.id} className="cursor-pointer" onClick={(e) => {
                  if (e.target.closest("button")) return;
                  navigate(`/event/${evt.id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}>
                  <EventCard
                    event={evt}
                    onAddToCalendar={addToCalendar}
                    isSaved={savedEvents.some((e) => e.id === evt.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EventDetail;
