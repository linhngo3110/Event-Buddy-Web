import React from "react";

const EventCard = ({ event, onAddToCalendar, isSaved }) => {
  const { title, image, date, location, categories, matchScore, averageRating } = event;

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 border border-slate-200/50 transition-all duration-300 premium-card-hover select-none">
      
      {/* AI Match Badge */}
      {matchScore && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black rounded-full shadow-lg border border-amber-400/20 animate-pulse-slow">
          <span>✨ AI Match</span>
          <span className="bg-white/20 px-1.5 py-0.5 rounded text-[9px]">{matchScore}%</span>
        </div>
      )}

      {/* Rating Badge */}
      {averageRating > 0 && (
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-black rounded-full shadow-md border border-slate-100/50">
          <span className="text-amber-500">⭐</span>
          <span>{Number(averageRating).toFixed(1)}</span>
        </div>
      )}

      {/* Event Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Event Details */}
      <div className="flex flex-col flex-grow p-5 justify-between">
        <div>
          {/* Title */}
          <h3 className="text-sm sm:text-base font-extrabold text-slate-800 line-clamp-1 group-hover:text-primary-blue transition-colors duration-200 mb-3 uppercase tracking-tight">
            {title}
          </h3>

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
            <svg
              className="w-4 h-4 text-slate-400"
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
            <span className="font-semibold">{date}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-slate-500 text-xs mb-4">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="font-semibold line-clamp-1">{location}</span>
          </div>
        </div>

        <div>
          {/* Categories */}
          <div className="flex flex-wrap gap-1.5 mb-4 mt-2">
            {categories.map((cat, idx) => (
              <span
                key={idx}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase rounded-lg tracking-wider ${
                  idx === 0
                    ? "bg-orange-50/70 text-orange-600 border border-orange-100/50"
                    : "bg-blue-50/70 text-primary-blue border border-blue-100/50"
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Add to Calendar Button */}
          <button
            onClick={() => onAddToCalendar(event)}
            className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
              isSaved
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100/50"
                : "bg-accent-orange text-white hover:bg-accent-orange-hover glow-orange"
            }`}
          >
            {isSaved ? (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Saved to Calendar</span>
              </>
            ) : (
              <>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Add to Calendar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
