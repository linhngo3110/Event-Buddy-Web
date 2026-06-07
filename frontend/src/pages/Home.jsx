import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import EventCard from "../components/EventCard";
import heroImg from "../assets/hero.png";
import {
  apiFetchEvents,
  calculateEventScores,
  getTopRecommendations
} from "../services/eventService";

const Home = () => {
  const navigate = useNavigate();
  const {
    userInterest,
    savedEvents,
    addToCalendar,
    quizComplete,
    resetInterests,
    searchQuery,
    setSearchQuery,
    setIsClubOpen
  } = useApp();

  // TanStack Query to fetch server-side events database
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiFetchEvents
  });

  // Calculate scores reactively based on fetched events & user's quiz interest
  const eventsWithScores = useMemo(() => {
    return calculateEventScores(events, userInterest);
  }, [events, userInterest]);

  // AI-powered recommendations (based on userInterest matchScore)
  const topAIRecommendations = useMemo(() => {
    return getTopRecommendations(eventsWithScores, userInterest);
  }, [eventsWithScores, userInterest]);

  // Rating-based recommendations (sorted by averageRating descending)
  const topRatedRecommendations = useMemo(() => {
    return [...events]
      .sort((a, b) => {
        const ratingB = b.averageRating || 0;
        const ratingA = a.averageRating || 0;
        if (ratingB !== ratingA) {
          return ratingB - ratingA;
        }
        return (b.numOfReviews || 0) - (a.numOfReviews || 0); // tie-breaker
      })
      .slice(0, 4);
  }, [events]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate("/explore");
  };

  return (
    <div className="w-full relative overflow-hidden">
      
      {/* Ambient background orbs for Hero */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-orb-spin" />
      <div className="absolute bottom-1/2 right-20 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 w-full relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Mascot Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-bold text-primary-blue animate-pulse-slow shadow-sm">
              <span>🚀</span>
              <span>Chào mừng bạn đến với Event Buddy</span>
            </div>

            {/* Main Catchphrase */}
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.1] uppercase">
              Missing campus events? <br />
              <span className="text-gradient-primary">
                Find your perfect event
              </span> <br />
              on Event Buddy.
            </h1>

            {/* Subtext description */}
            <p className="text-slate-500 max-w-lg text-sm sm:text-base font-medium leading-relaxed">
              Bạn thường bỏ lỡ các hoạt động hấp dẫn trên giảng đường? Khám phá ngay hàng trăm sự kiện học thuật, câu lạc bộ, ca nhạc và workshop thông qua đề xuất thông minh của chúng tôi.
            </p>

            {/* Quick search input */}
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-xl relative flex items-center bg-white rounded-full border border-slate-200 p-2.5 shadow-md focus-within:ring-4 focus-within:ring-primary-blue/10 focus-within:border-primary-blue transition-all"
            >
              <div className="pl-3.5 text-slate-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện, câu lạc bộ hoặc chủ đề..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3.5 pr-14 py-2 text-xs sm:text-sm text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="absolute right-2 bg-accent-orange text-white p-3 rounded-full hover:bg-accent-orange-hover focus:scale-95 transition-all shadow-md glow-orange flex items-center justify-center cursor-pointer"
                title="Tìm kiếm & Khám phá"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>

          {/* Hero Right Graphic */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="absolute -inset-4 bg-blue-100 rounded-full blur-3xl opacity-35 -z-10 animate-pulse-slow" />
            <div className="absolute top-20 right-10 w-16 h-16 bg-orange-100 rounded-full blur-2xl opacity-40 -z-10" />

            <div className="relative max-w-md w-full animate-float">
              <img
                src={heroImg}
                alt="Sinh viên trao đổi học tập Event Buddy"
                className="w-full h-auto drop-shadow-2xl"
              />
              
              {/* Overlay dynamic campus badges */}
              <div className="absolute -top-4 -left-4 glass-panel rounded-2xl p-3.5 border border-white/60 shadow-lg flex items-center gap-2.5">
                <span className="text-xl bg-orange-100 p-2 rounded-xl">🎓</span>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Học Thuật</p>
                  <p className="text-xs font-extrabold text-slate-800">50+ Hội Thảo</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 glass-panel rounded-2xl p-3.5 border border-white/60 shadow-lg flex items-center gap-2.5">
                <span className="text-xl bg-blue-100 p-2 rounded-xl">🎵</span>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Sự Kiện Hot</p>
                  <p className="text-xs font-extrabold text-slate-800">Đêm nhạc Acoustic</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- SECTION 1: TOP EVENT RECOMMENDATIONS BY RATING --- */}
      <section className="bg-white py-24 w-full border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold tracking-widest text-amber-600 bg-amber-50 border border-amber-200 px-3.5 py-1.5 rounded-full uppercase shadow-sm">
              ⭐ Highly Rated Events
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase mt-4">
              Top Rated Event Recommendations
            </h2>
            <div className="w-16 h-1 bg-amber-500 mx-auto my-3.5 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
              Khám phá những sự kiện có điểm đánh giá xuất sắc nhất từ cộng đồng sinh viên tại campus!
            </p>
          </div>

          {/* Event cards grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
              <span className="text-4xl animate-spin">⏳</span>
              <p className="text-sm font-bold">Đang tải các sự kiện được đánh giá cao...</p>
            </div>
          ) : topRatedRecommendations.length === 0 ? (
            <p className="text-xs text-slate-400 font-semibold py-8">Chưa có đánh giá nào cho các sự kiện.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topRatedRecommendations.map((evt) => (
                <div key={evt.id} className="cursor-pointer text-left" onClick={(e) => {
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
      </section>

      {/* --- SECTION 2: AI-POWERED EVENT RECOMMENDATIONS (DARK MODE CONTRAST) --- */}
      <section className="bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950 border-y border-slate-900 py-24 w-full relative overflow-hidden">
        {/* Glow elements in dark panel */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl -z-10 animate-orb-spin" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="max-w-xl mx-auto mb-16">
            <span className="text-[10px] font-extrabold tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full uppercase shadow-sm">
              ✨ AI Match Engine
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mt-4">
              AI-Powered Recommendations For You
            </h2>
            <div className="w-16 h-1 bg-accent-orange mx-auto my-3.5 rounded-full" />
            <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
              {userInterest ? (
                <span className="flex items-center justify-center gap-2 text-blue-400 font-bold">
                  <span>🤖 Đề xuất AI riêng theo sở thích của bạn!</span>
                  <button
                    onClick={resetInterests}
                    className="text-[9px] bg-white/10 hover:bg-white/20 text-white font-extrabold px-2 py-0.5 rounded uppercase transition-all cursor-pointer"
                    title="Xóa bộ lọc AI"
                  >
                    Reset
                  </button>
                </span>
              ) : (
                "Các sự kiện được AI gợi ý dựa trên sở thích của bạn. Hãy thực hiện Quiz sở thích để cá nhân hóa danh sách này!"
              )}
            </p>
          </div>

          {/* Event cards recommendations grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 gap-3">
              <span className="text-4xl animate-spin">⏳</span>
              <p className="text-sm font-bold">Đang tính toán đề xuất AI...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topAIRecommendations.map((evt) => (
                <div key={evt.id} className="cursor-pointer text-left" onClick={(e) => {
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
      </section>

      {/* --- INTERESTS QUIZ INTERACTIVE HUB --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full text-center">
        <div className="max-w-xl mx-auto mb-16">
          <span className="text-[10px] font-extrabold tracking-widest text-orange-600 bg-orange-50 border border-orange-200 px-3.5 py-1.5 rounded-full uppercase shadow-sm">
            🎯 Discovery Hub
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase mt-4">
            Interests Quiz: Uncover Your Passion
          </h2>
          <div className="w-16 h-1 bg-accent-orange mx-auto my-3.5 rounded-full" />
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
            Chọn nhanh nhóm chủ đề bạn thích hoặc làm bài trắc nghiệm thông minh để tìm thấy sở thích tiềm ẩn phù hợp nhất!
          </p>
        </div>

        {/* Categories circles grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 max-w-4xl mx-auto mb-14">
          
          {[
            { id: "academic", label: "Academic", icon: "🎓", color: "bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-100/60" },
            { id: "career", label: "Career", icon: "💼", color: "bg-emerald-50/50 border-emerald-100 text-emerald-600 hover:bg-emerald-100/60" },
            { id: "music", label: "Music", icon: "🎵", color: "bg-pink-50/50 border-pink-100 text-pink-600 hover:bg-pink-100/60" },
            { id: "volunteer", label: "Volunteer", icon: "❤️", color: "bg-orange-50/50 border-orange-100 text-orange-600 hover:bg-orange-100/60" },
            { id: "workshop", label: "Workshop", icon: "⚙️", color: "bg-purple-50/50 border-purple-100 text-purple-600 hover:bg-purple-100/60" }
          ].map((cat) => {
            const isActive = userInterest === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => quizComplete(cat.id)}
                className={`p-6 rounded-3xl border flex flex-col items-center justify-center gap-3.5 transition-all duration-300 group hover:-translate-y-1.5 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-b from-blue-500 to-indigo-600 border-primary-blue text-white shadow-xl shadow-blue-500/25 scale-105"
                    : `${cat.color} bg-white shadow-sm hover:shadow-md border-slate-200/60`
                }`}
              >
                <span className={`text-2xl sm:text-3xl w-14 h-14 flex items-center justify-center rounded-full transition-transform duration-300 group-hover:rotate-12 ${
                  isActive ? "bg-white/20" : "bg-slate-50 shadow-inner"
                }`}>
                  {cat.icon}
                </span>
                <span className={`text-[10px] font-bold tracking-widest uppercase ${
                  isActive ? "text-white" : "text-slate-700"
                }`}>
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quiz CTA banner */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="text-left">
            <h3 className="text-sm sm:text-base font-bold text-slate-800">Bạn muốn nhận kết quả phân tích AI chi tiết?</h3>
            <p className="text-xs text-slate-500 font-semibold mt-1">Trả lời 5 câu hỏi nhanh trong 30 giây để tìm thấy sở thích tiềm ẩn!</p>
          </div>
          <button
            onClick={() => navigate("/quiz")}
            className="whitespace-nowrap px-6 py-3.5 bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-extrabold rounded-xl shadow-md glow-blue hover:scale-103 transition-all flex items-center gap-2 cursor-pointer"
          >
            <span>TAKE THE QUIZ</span>
            <span>🚀</span>
          </button>
        </div>

      </section>

      {/* --- CLUB ENGAGEMENT SECTION (DARK PREMIUM BANNER) --- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 w-full">
        <div className="bg-slate-950 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-slate-900 via-indigo-950 to-slate-950 rounded-[2.5rem] border border-slate-800 p-8 sm:p-12 relative overflow-hidden shadow-xl shadow-slate-950/20 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          
          <div className="absolute top-6 left-6 text-indigo-500/10 text-5xl select-none">🛡️</div>
          <div className="absolute bottom-6 right-6 text-indigo-500/10 text-5xl select-none">🏫</div>

          <div className="text-left space-y-4 max-w-lg z-10">
            <span className="text-[10px] font-extrabold tracking-widest text-accent-orange bg-orange-500/10 border border-orange-500/20 px-3.5 py-1 rounded-full uppercase">
              Clubs & Organizations
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase">
              Clubs & Organizations: Share Your Events
            </h2>
            
            <p className="text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed">
              Bạn có câu lạc bộ, đội nhóm học thuật hay nghệ thuật? Đăng ký làm đối tác ngay hôm nay để nhận đặc quyền đề xuất, xuất bản và lan tỏa mọi sự kiện campus đến hàng nghìn sinh viên hoàn toàn miễn phí!
            </p>
          </div>

          <div className="z-10 shrink-0">
            <button
              onClick={() => setIsClubOpen(true)}
              className="px-8 py-4 bg-accent-orange hover:bg-accent-orange-hover text-white text-xs sm:text-sm font-extrabold rounded-2xl shadow-lg glow-orange transition-all hover:scale-105 active:scale-95 uppercase tracking-wider cursor-pointer"
            >
              Hợp tác & Đăng ký ngay
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
