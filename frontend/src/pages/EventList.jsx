import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "../context/AppContext";
import EventCard from "../components/EventCard";
import {
  apiFetchEvents,
  calculateEventScores,
  getFilteredExploreEvents
} from "../services/eventService";

const ITEMS_PER_PAGE = 6;

const EventList = () => {
  const navigate = useNavigate();
  const {
    searchQuery,
    setSearchQuery,
    selectedFilters,
    setSelectedFilters,
    explorePage,
    setExplorePage,
    savedEvents,
    addToCalendar,
    userInterest
  } = useApp();

  // Fetch events from mock database server
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiFetchEvents
  });

  // Attach match scores for user recommendations
  const eventsWithScores = useMemo(() => {
    return calculateEventScores(events, userInterest);
  }, [events, userInterest]);

  // Compute final filtered list
  const filteredEvents = useMemo(() => {
    return getFilteredExploreEvents(eventsWithScores, selectedFilters, searchQuery);
  }, [eventsWithScores, selectedFilters, searchQuery]);

  const totalExplorePages = Math.max(1, Math.ceil(filteredEvents.length / ITEMS_PER_PAGE));

  const paginatedEvents = useMemo(() => {
    const startIndex = (explorePage - 1) * ITEMS_PER_PAGE;
    return filteredEvents.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEvents, explorePage]);

  const handleFilterToggle = (cat) => {
    setSelectedFilters((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
    setExplorePage(1);
  };

  const handleClearFilters = () => {
    setSelectedFilters([]);
    setSearchQuery("");
    setExplorePage(1);
  };

  return (
    <section className="bg-[#f8fafc] py-12 min-h-[70vh] w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight uppercase">
              Explore All Events
            </h2>
            <div className="w-16 h-1 bg-accent-orange my-2.5 rounded-full" />
            <p className="text-xs text-slate-500 font-semibold">
              Khám phá toàn diện hàng trăm sự kiện campus thú vị và hấp dẫn.
            </p>
          </div>

          {/* Inline search input */}
          <div className="w-full md:max-w-sm relative flex items-center bg-white rounded-xl border border-slate-200 p-2 shadow-sm focus-within:ring-2 focus-within:ring-primary-blue/30 focus-within:border-primary-blue transition-all">
            <span className="pl-2 text-slate-400">🔍</span>
            <input
              type="text"
              placeholder="Tìm kiếm sự kiện, địa điểm..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setExplorePage(1);
              }}
              className="w-full pl-2.5 pr-2 py-1 text-xs text-slate-800 bg-transparent placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={handleClearFilters}
                className="absolute right-3 text-slate-400 hover:text-slate-600 text-sm font-bold"
                title="Xóa bộ lọc & tìm kiếm"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Filters (3 cols) */}
          <div className="lg:col-span-3 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col space-y-6">
            
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Filters
              </h3>
              
              {/* Checkbox Category Filters */}
              <div className="space-y-2.5">
                {["Academic", "Career", "Music", "Volunteer", "Workshop"].map((cat) => {
                  const isChecked = selectedFilters.includes(cat);
                  return (
                    <label
                      key={cat}
                      className="flex items-center gap-3 cursor-pointer group text-sm font-semibold text-slate-600 hover:text-primary-blue transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleFilterToggle(cat)}
                        className="w-4 h-4 text-primary-blue bg-slate-100 border-slate-300 rounded focus:ring-primary-blue/30 focus:ring-2 cursor-pointer accent-primary-blue"
                      />
                      <span>{cat}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Active Filters list */}
            {(selectedFilters.length > 0 || searchQuery !== "") && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Filters</span>
                  <button
                    onClick={handleClearFilters}
                    className="text-[10px] text-rose-500 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedFilters.map((flt) => (
                    <span
                      key={flt}
                      onClick={() => handleFilterToggle(flt)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      {flt} <span>×</span>
                    </span>
                  ))}
                  {searchQuery && (
                    <span
                      onClick={() => setSearchQuery("")}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition-colors max-w-xs truncate"
                    >
                      🔍 "{searchQuery}" <span>×</span>
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Grid display + Pagination (9 cols) */}
          <div className="lg:col-span-9 flex flex-col space-y-8">
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white border border-slate-100 rounded-2xl">
                <span className="text-4xl animate-spin">⏳</span>
                <p className="text-sm font-bold">Đang tải danh sách sự kiện...</p>
              </div>
            ) : paginatedEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
                <span className="text-4xl">🔍</span>
                <h3 className="text-base font-bold text-slate-700 mt-4 mb-1">
                  Không tìm thấy sự kiện nào phù hợp
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm của bạn để tìm thêm kết quả.
                </p>
              </div>
            ) : (
              <>
                {/* Event grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedEvents.map((evt) => (
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

                {/* Pagination */}
                {totalExplorePages > 1 && (
                  <div className="flex justify-center items-center gap-2 pt-6">
                    {/* Prev page */}
                    <button
                      onClick={() => setExplorePage(Math.max(1, explorePage - 1))}
                      disabled={explorePage === 1}
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      ←
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalExplorePages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isCurrent = explorePage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setExplorePage(pageNum)}
                          className={`w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                            isCurrent
                              ? "bg-primary-blue text-white shadow-md shadow-blue-100"
                              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next page */}
                    <button
                      onClick={() => setExplorePage(Math.min(totalExplorePages, explorePage + 1))}
                      disabled={explorePage === totalExplorePages}
                      className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default EventList;
