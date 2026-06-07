import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import EventCard from "../components/EventCard";

const FavoriteEvents = () => {
  const navigate = useNavigate();
  const { savedEvents, addToCalendar } = useApp();

  return (
    <section className="bg-slate-50 py-12 min-h-[70vh] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <span className="text-[10px] font-bold tracking-widest text-primary-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
            Student Dashboard
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2 uppercase">
            Your Favorite Events
          </h2>
          <div className="w-16 h-1 bg-accent-orange mx-auto my-2.5 rounded-full" />
          <p className="text-xs text-slate-500 font-semibold">
            Danh sách các sự kiện bạn quan tâm và đã thêm vào Lịch lưu trữ cá nhân.
          </p>
        </div>

        {/* List Content */}
        {savedEvents.length === 0 ? (
          /* --- EMPTY STATE --- */
          <div className="max-w-xl mx-auto bg-white rounded-3xl border border-slate-100 p-8 sm:p-10 shadow-lg text-center space-y-6 animate-fade-in-up">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 text-3xl rounded-2xl flex items-center justify-center mx-auto shadow-inner select-none animate-pulse">
              ❤️
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-800">Danh sách yêu thích trống</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed max-w-xs mx-auto">
                Bạn chưa lưu sự kiện nào vào mục yêu thích. Hãy quay lại trang Khám phá để tìm những sự kiện phù hợp nhất!
              </p>
            </div>

            <button
              onClick={() => navigate("/explore")}
              className="px-6 py-3 bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 hover:scale-105 transition-all flex items-center justify-center gap-1.5 mx-auto"
            >
              <span>Khám phá sự kiện ngay</span>
              <span>🔍</span>
            </button>
          </div>
        ) : (
          /* --- DISPLAY FAVORITED GRID --- */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
            {savedEvents.map((evt) => (
              <div key={evt.id} className="cursor-pointer text-left" onClick={(e) => {
                if (e.target.closest("button")) return;
                navigate(`/event/${evt.id}`);
              }}>
                <EventCard
                  event={evt}
                  onAddToCalendar={addToCalendar}
                  isSaved={true}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FavoriteEvents;
