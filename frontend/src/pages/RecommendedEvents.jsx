import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import EventCard from "../components/EventCard";
import {
  apiFetchEvents,
  calculateEventScores
} from "../services/eventService";

const RecommendedEvents = () => {
  const navigate = useNavigate();
  const { savedEvents, addToCalendar, userInterest, resetInterests } = useApp();

  // Fetch events list asynchronously
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiFetchEvents
  });

  // Calculate matching scores reactively
  const eventsWithScores = useMemo(() => {
    return calculateEventScores(events, userInterest);
  }, [events, userInterest]);

  const matchingEvents = useMemo(() => {
    if (!userInterest) return [];
    return [...eventsWithScores]
      .filter((e) => e.matchScore !== null)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [eventsWithScores, userInterest]);

  const interestName = useMemo(() => {
    const names = {
      academic: "Academic & Science",
      career: "Business & Career",
      music: "Art & Live Music",
      volunteer: "Green Volunteer",
      workshop: "Tech & DIY Workshop"
    };
    return names[userInterest] || "Workshop";
  }, [userInterest]);

  return (
    <section className="bg-slate-50 py-12 min-h-[70vh] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-[10px] font-bold tracking-widest text-primary-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
            AI Matching Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2 uppercase">
            Recommended Events For You
          </h2>
          <div className="w-16 h-1 bg-accent-orange mx-auto my-2.5 rounded-full" />
          <p className="text-xs text-slate-500 font-semibold max-w-lg mx-auto">
            Các hoạt động được thuật toán thông minh thiết lập khớp theo nhu cầu học tập, kỹ năng mềm và sở thích của riêng bạn.
          </p>
        </div>

        {/* Conditional Rendering */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white border border-slate-100 rounded-3xl max-w-xl mx-auto">
            <span className="text-4xl animate-spin">⏳</span>
            <p className="text-sm font-bold">Đang tải đề xuất sự kiện...</p>
          </div>
        ) : !userInterest ? (
          /* --- STATE: NO QUIZ COMPLETED --- */
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-lg text-center space-y-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-blue-50 text-primary-blue text-3xl rounded-2xl flex items-center justify-center mx-auto shadow-inner select-none">
              🧠
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-800">Khám phá tiềm năng cá nhân hóa!</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-sm mx-auto">
                Bạn chưa thực hiện trắc nghiệm phân tích sở thích. Hãy dành ra 30 giây làm bài test ngắn để kích hoạt tính năng đề cử tự động cực đỉnh này!
              </p>
            </div>

            <button
              onClick={() => navigate("/quiz")}
              className="px-6 py-3 bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 hover:scale-105 transition-all flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>Làm trắc nghiệm sở thích ngay</span>
              <span>🚀</span>
            </button>
          </div>
        ) : (
          /* --- STATE: DISPLAY MATCHES --- */
          <div className="space-y-8 text-left animate-fade-in-up">
            
            {/* Interest Profile display */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl bg-blue-50 border border-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center">🎯</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Hồ sơ sở thích hoạt động của bạn</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    Định hướng chính: <span className="text-primary-blue font-bold">{interestName}</span>
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate("/quiz")}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all"
                >
                  Làm lại Quiz
                </button>
                <button
                  onClick={resetInterests}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 border-rose-100 text-xs font-bold rounded-xl transition-all"
                >
                  Xóa bộ lọc AI
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            {matchingEvents.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center shadow-sm">
                <span className="text-3xl">🔍</span>
                <p className="text-xs text-slate-400 font-semibold mt-2">Hiện tại chưa có sự kiện mới nào hoàn toàn khớp với danh mục này.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {matchingEvents.map((evt) => (
                  <div key={evt.id} className="cursor-pointer" onClick={(e) => {
                    if (e.target.closest("button")) return;
                    navigate(`/event/${evt.id}`);
                  }}>
                    <EventCard
                      event={evt}
                      onAddToCalendar={addToCalendar}
                      isSaved={savedEvents.some((e) => e.id === evt.id)}
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
};

export default RecommendedEvents;
