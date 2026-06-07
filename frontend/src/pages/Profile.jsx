import React from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, savedEvents, userInterest, logout } = useApp();

  const user = currentUser || {
    name: "Nguyễn Văn A",
    email: "sv@school.edu.vn",
    role: "student",
  };

  const getResultInfo = (cat) => {
    const info = {
      academic: {
        title: "Academic & Science Scholar",
        desc: "Bạn thích khám phá tri thức mới và thử thách bản thân qua các cuộc thi học thuật!",
        color: "from-blue-500 to-indigo-500",
        icon: "🎓",
        stats: {
          Academic: 98,
          Career: 75,
          Music: 40,
          Volunteer: 65,
          Workshop: 70,
        },
      },
      career: {
        title: "Future Business & Tech Leader",
        desc: "Bạn cực kỳ năng động và định hướng nghề nghiệp xuất sắc. Bạn đang sẵn sàng bước ra thế giới!",
        color: "from-emerald-500 to-teal-500",
        icon: "💼",
        stats: {
          Academic: 70,
          Career: 98,
          Music: 50,
          Volunteer: 55,
          Workshop: 80,
        },
      },
      music: {
        title: "Creative Art & Music Enthusiast",
        desc: "Bạn sở hữu tinh thần tự do, đam mê âm nhạc và luôn lan tỏa năng lượng tích cực!",
        color: "from-pink-500 to-rose-500",
        icon: "🎵",
        stats: {
          Academic: 40,
          Career: 60,
          Music: 98,
          Volunteer: 75,
          Workshop: 65,
        },
      },
      volunteer: {
        title: "Warm-hearted Community Hero",
        desc: "Bạn mang trong mình tấm lòng nhân ái, mong muốn sẻ chia và giúp đỡ mọi người xung quanh!",
        color: "from-orange-500 to-amber-500",
        icon: "❤️",
        stats: {
          Academic: 65,
          Career: 50,
          Music: 70,
          Volunteer: 98,
          Workshop: 55,
        },
      },
      workshop: {
        title: "Hands-on Innovator & Tech Maker",
        desc: "Bạn thích học hỏi kỹ năng mới thông qua các buổi thực hành thực tế, sáng tạo sản phẩm!",
        color: "from-violet-500 to-purple-500",
        icon: "⚙️",
        stats: {
          Academic: 75,
          Career: 80,
          Music: 50,
          Volunteer: 60,
          Workshop: 98,
        },
      },
    };
    return (
      info[cat] || {
        title: "Chưa phân tích sở thích",
        desc: "Hãy thực hiện Quiz sở thích để xem phân tích AI chuyên sâu!",
        color: "from-slate-400 to-slate-500",
        icon: "🧠",
        stats: {
          Academic: 50,
          Career: 50,
          Music: 50,
          Volunteer: 50,
          Workshop: 50,
        },
      }
    );
  };

  const parseEventDate = (dateStr) => {
    if (!dateStr) return new Date(0);
    const firstPart = dateStr.split(" - ")[0].trim();
    const parsed = Date.parse(firstPart);
    if (!isNaN(parsed)) {
      return new Date(parsed);
    }
    const dateObj = new Date(firstPart);
    if (!isNaN(dateObj.getTime())) {
      return dateObj;
    }
    return new Date();
  };

  const now = new Date();
  const upcomingEvents = savedEvents.filter(
    (evt) => parseEventDate(evt.date) >= now,
  );
  const pastEvents = savedEvents.filter(
    (evt) => parseEventDate(evt.date) < now,
  );

  const profileInfo = getResultInfo(userInterest);

  return (
    <section className="bg-slate-50 py-12 min-h-[80vh] w-full text-left">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Info & Logout (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-md flex flex-col items-center text-center space-y-6">
            {/* Avatar & Details */}
            <div className="space-y-3 flex flex-col items-center">
              <div className="w-24 h-24 bg-gradient-to-tr from-primary-blue to-indigo-600 text-white rounded-full flex items-center justify-center text-3xl font-extrabold shadow-lg shadow-blue-100 select-none">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {user.name}
                </h3>
                <p className="text-xs text-slate-400 font-semibold">
                  {user.email}
                </p>
              </div>
              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">
                Vai trò: {user.role === "user" ? "Sinh viên" : "Ban tổ chức"}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={() => logout(navigate)}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-150 border-rose-100 text-xs font-bold rounded-xl transition-all"
            >
              Đăng Xuất Tài Khoản
            </button>
          </div>

          {/* Right panel: AI Interest & History (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* AI Profile breakdown */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-md space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h4 className="text-base font-extrabold text-slate-800">
                  Hồ sơ phân tích xu hướng sở thích AI
                </h4>
                {userInterest && (
                  <button
                    onClick={() => navigate("/quiz")}
                    className="text-[10px] text-primary-blue hover:underline font-bold"
                  >
                    Làm lại Quiz
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Visual Icon Badge */}
                <div
                  className={`shrink-0 w-20 h-20 bg-gradient-to-tr ${profileInfo.color} rounded-2xl flex items-center justify-center text-4xl text-white shadow-md shadow-blue-100/50`}
                >
                  {profileInfo.icon}
                </div>

                <div className="text-left flex-1">
                  <h5 className="text-base font-bold text-slate-800">
                    {profileInfo.title}
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold mt-1">
                    {profileInfo.desc}
                  </p>
                </div>
              </div>

              {/* Stats Bar chart */}
              <div className="space-y-3 pt-4 border-t border-slate-100 text-left">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Interest Analysis breakdown
                </h5>

                {Object.entries(profileInfo.stats).map(([category, value]) => (
                  <div key={category} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{category}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${profileInfo.color} transition-all duration-500 rounded-full`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Join history & Upcoming events */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-md text-left space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h4 className="text-base font-extrabold text-slate-800">
                  Hoạt động tham gia của bạn
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Section 1: Upcoming Joined */}
                <div className="space-y-3 border-b sm:border-b-0 sm:border-r border-slate-100 pb-4 sm:pb-0 sm:pr-6">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Sắp diễn ra ({upcomingEvents.length})
                  </h5>
                  {upcomingEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 font-semibold py-4">
                      Chưa có lịch sự kiện sắp tới.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {upcomingEvents.slice(0, 3).map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => navigate(`/event/${evt.id}`)}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl flex items-center gap-2.5 cursor-pointer transition-colors"
                        >
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-800 truncate">
                              {evt.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {evt.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Section 2: Joined past history */}
                <div className="space-y-3 sm:pl-2">
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Đã tham gia ({pastEvents.length})
                  </h5>
                  {pastEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 font-semibold py-4">
                      Chưa tham gia sự kiện nào trước đây.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {pastEvents.slice(0, 3).map((evt) => (
                        <div
                          key={evt.id}
                          onClick={() => navigate(`/event/${evt.id}`)}
                          className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl flex items-center gap-2.5 opacity-80 cursor-pointer transition-colors"
                        >
                          <img
                            src={evt.image}
                            alt={evt.title}
                            className="w-10 h-10 object-cover rounded-lg filter grayscale"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-slate-650 truncate">
                              {evt.title}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              ✅ Đã check-in • {evt.date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Profile;
