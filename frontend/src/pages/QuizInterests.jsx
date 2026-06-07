import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

const QUESTIONS = [
  {
    id: 1,
    title: "Mục tiêu lớn nhất hiện tại của bạn là gì?",
    options: [
      { text: "Nâng cao thành tích học tập & nghiên cứu khoa học", category: "academic", icon: "🎓" },
      { text: "Tìm kiếm cơ hội thực tập & xây dựng lộ trình sự nghiệp", category: "career", icon: "💼" },
      { text: "Giải trí, kết nối bạn bè & tận hưởng không gian nghệ thuật", category: "music", icon: "🎵" },
      { text: "Đóng góp cho cộng đồng & rèn luyện kỹ năng mềm", category: "volunteer", icon: "❤️" },
      { text: "Học hỏi công nghệ mới, thực hành workshop thực tế", category: "workshop", icon: "⚙️" }
    ]
  },
  {
    id: 2,
    title: "Bạn thích dành những ngày nghỉ cuối tuần của mình như thế nào?",
    options: [
      { text: "Tham gia các buổi hội thảo khoa học hoặc ôn tập nhóm", category: "academic", icon: "🏫" },
      { text: "Tham dự các ngày hội tuyển dụng, sửa CV & networking", category: "career", icon: "👔" },
      { text: "Cháy hết mình tại đêm nhạc hội hoặc câu lạc bộ acoustic", category: "music", icon: "🎸" },
      { text: "Tham gia chiến dịch dọn dẹp môi trường hoặc hiến máu nhân đạo", category: "volunteer", icon: "🌱" },
      { text: "Tự tay làm đồ handmade hoặc code side-project tại workshop", category: "workshop", icon: "🛠️" }
    ]
  },
  {
    id: 3,
    title: "Đâu là định dạng hoạt động thu hút bạn nhất?",
    options: [
      { text: "Các cuộc thi học thuật, nghiên cứu mang tính thử thách", category: "academic", icon: "🏆" },
      { text: "Tọa đàm chia sẻ từ chuyên gia doanh nghiệp đầu ngành", category: "career", icon: "🎯" },
      { text: "Lễ hội âm nhạc, liveshow sinh viên đầy sôi động", category: "music", icon: "🎤" },
      { text: "Các hoạt động thiện nguyện, hỗ trợ các hoàn cảnh khó khăn", category: "volunteer", icon: "🤝" },
      { text: "Buổi thực hành kỹ thuật chuyên sâu (Coding, Design, DIY)", category: "workshop", icon: "💻" }
    ]
  },
  {
    id: 4,
    title: "Nếu có cơ hội gia nhập một câu lạc bộ sinh viên, bạn sẽ ưu tiên chọn CLB nào?",
    options: [
      { text: "CLB Nghiên cứu khoa học & Học thuật ứng dụng", category: "academic", icon: "🧬" },
      { text: "CLB Nhà khởi nghiệp trẻ & Kỹ năng phát triển sự nghiệp", category: "career", icon: "📈" },
      { text: "CLB Nghệ thuật, Vũ đạo & Ban nhạc sinh viên", category: "music", icon: "🎹" },
      { text: "CLB Tình nguyện xanh & Hoạt động xã hội vì cộng đồng", category: "volunteer", icon: "🏥" },
      { text: "CLB Lập trình viên GDG hoặc Thiết kế đồ họa & IoT", category: "workshop", icon: "🤖" }
    ]
  },
  {
    id: 5,
    title: "Dự án hoặc thành tích nào dưới đây khiến bạn cảm thấy tự hào nhất?",
    options: [
      { text: "Đề tài nghiên cứu khoa học hoặc bài báo học thuật đạt giải", category: "academic", icon: "📝" },
      { text: "Bản CV ấn tượng & nhận offer thực tập từ doanh nghiệp lớn", category: "career", icon: "📄" },
      { text: "Biểu diễn một tiết mục văn nghệ hoành tráng trước toàn trường", category: "music", icon: "🎻" },
      { text: "Tổ chức thành công chuyến đi thiện nguyện giúp đỡ trẻ em nghèo", category: "volunteer", icon: "🏡" },
      { text: "Tự lập trình một app di động hoặc chế tạo mô hình thông minh", category: "workshop", icon: "📱" }
    ]
  }
];

const QuizInterests = () => {
  const navigate = useNavigate();
  const { quizComplete } = useApp();

  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2 for questions, 3 for loading, 4 for result
  const [answers, setAnswers] = useState({});
  const [loadingText, setLoadingText] = useState("Analyzing your selections...");
  const [interestResult, setInterestResult] = useState("");

  const handleOptionClick = (questionId, category) => {
    const updatedAnswers = { ...answers, [questionId]: category };
    setAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      setCurrentStep(QUESTIONS.length); // loading state
      simulateAIAnalysis(updatedAnswers);
    }
  };

  const simulateAIAnalysis = (finalAnswers) => {
    const texts = [
      "Gathering campus event directory...",
      "Analyzing your hobby profile with AI model...",
      "Comparing matching scores with active events...",
      "Generating custom recommendations..."
    ];

    let count = 0;
    const interval = setInterval(() => {
      if (count < texts.length - 1) {
        count++;
        setLoadingText(texts[count]);
      } else {
        clearInterval(interval);
        
        // Calculate major category from answers
        const categoriesCount = {};
        Object.values(finalAnswers).forEach((cat) => {
          categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
        });

        let topCategory = "workshop";
        let maxVotes = 0;
        Object.entries(categoriesCount).forEach(([cat, votes]) => {
          if (votes > maxVotes) {
            maxVotes = votes;
            topCategory = cat;
          }
        });

        setInterestResult(topCategory);
        setCurrentStep(QUESTIONS.length + 1); // result state
      }
    }, 850);
  };

  const handleApplyResult = () => {
    quizComplete(interestResult);
    navigate("/recommendations");
  };

  const getResultInfo = (cat) => {
    const info = {
      academic: { title: "Academic & Science Scholar", desc: "Bạn thích khám phá tri thức mới và thử thách bản thân qua các cuộc thi học thuật!", color: "from-blue-500 to-indigo-500", icon: "🎓" },
      career: { title: "Future Business & Tech Leader", desc: "Bạn cực kỳ năng động và định hướng nghề nghiệp xuất sắc. Bạn đang sẵn sàng bước ra thế giới!", color: "from-emerald-500 to-teal-500", icon: "💼" },
      music: { title: "Creative Art & Music Enthusiast", desc: "Bạn sở hữu tinh thần tự do, đam mê âm nhạc và luôn lan tỏa năng lượng tích cực!", color: "from-pink-500 to-rose-500", icon: "🎵" },
      volunteer: { title: "Warm-hearted Community Hero", desc: "Bạn mang trong mình tấm lòng nhân ái, mong muốn sẻ chia và giúp đỡ mọi người xung quanh!", color: "from-orange-500 to-amber-500", icon: "❤️" },
      workshop: { title: "Hands-on Innovator & Tech Maker", desc: "Bạn thích học hỏi kỹ năng mới thông qua các buổi thực hành thực tế, sáng tạo sản phẩm!", color: "from-violet-500 to-purple-500", icon: "⚙️" }
    };
    return info[cat] || info.workshop;
  };

  return (
    <div className="w-full bg-[#fafbfc] min-h-[80vh] flex items-center justify-center py-12">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-10 animate-fade-in-up">
        
        {/* Left column (Visual intro) */}
        <div className="md:col-span-5 flex flex-col text-left space-y-6 bg-gradient-to-br from-primary-blue to-indigo-900 text-white rounded-[2rem] p-8 h-full min-h-[380px] justify-between relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          
          <div className="space-y-4 z-10">
            <span className="text-[10px] font-bold tracking-widest text-blue-200 bg-white/10 px-3 py-1 rounded-full uppercase">
              AI Interests Quiz
            </span>
            <h2 className="text-2xl font-extrabold leading-tight">
              30 Giây tìm sự kiện hoàn hảo
            </h2>
            <p className="text-xs text-blue-100 font-semibold leading-relaxed">
              Trả lời 3 câu hỏi trắc nghiệm ngắn để thuật toán AI của Event Buddy tự động phân tích và kết nối bạn với những hoạt động lý tưởng nhất trên giảng đường học đường!
            </p>
          </div>

          <div className="flex justify-between items-center z-10 pt-8 border-t border-white/10">
            <span className="text-[10px] font-bold text-blue-200">EVENT BUDDY AI ENGINE v1.0</span>
            <span className="text-lg">🧠</span>
          </div>
        </div>

        {/* Right column (Quiz Steps Container) */}
        <div className="md:col-span-7 p-2 relative">
          
          {/* QUESTION STEPS (0, 1, 2) */}
          {currentStep < QUESTIONS.length && (
            <div className="text-left">
              
              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-1.5 uppercase">
                  <span>Tiến trình</span>
                  <span>{currentStep + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-blue transition-all duration-300 rounded-full"
                    style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h3 className="text-lg font-bold text-slate-800 mb-5 leading-snug">
                {QUESTIONS[currentStep].title}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {QUESTIONS[currentStep].options.map((opt, idx) => {
                  const isSelected = answers[QUESTIONS[currentStep].id] === opt.category;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(QUESTIONS[currentStep].id, opt.category)}
                      className={`w-full p-4 text-left rounded-xl border transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? "bg-blue-50/50 border-primary-blue text-primary-blue font-semibold"
                          : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-350 hover:bg-slate-50/50"
                      }`}
                    >
                      <span className="text-xl w-9 h-9 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg group-hover:scale-105">
                        {opt.icon}
                      </span>
                      <span className="text-xs leading-relaxed font-semibold">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Back */}
              {currentStep > 0 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="mt-6 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
                >
                  ← Quay lại câu trước
                </button>
              )}
            </div>
          )}

          {/* SIMULATED AI LOADING STATE (Step 3) */}
          {currentStep === QUESTIONS.length && (
            <div className="text-center flex flex-col items-center justify-center py-10 min-h-[300px]">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-accent-orange border-r-primary-blue rounded-full animate-spin" />
                <div className="absolute inset-3.5 bg-orange-50 rounded-full flex items-center justify-center text-2xl animate-bounce">
                  🧠
                </div>
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">Analyzing your Interests...</h3>
              <p className="text-xs text-slate-400 font-semibold animate-pulse">{loadingText}</p>
            </div>
          )}

          {/* RESULTS STATE (Step 4) */}
          {currentStep === QUESTIONS.length + 1 && (
            <div className="text-center flex flex-col items-center py-6">
              
              <div className={`w-16 h-16 bg-gradient-to-tr ${getResultInfo(interestResult).color} rounded-2xl flex items-center justify-center text-3xl text-white shadow-lg mb-4 rotate-3 animate-bounce`}>
                {getResultInfo(interestResult).icon}
              </div>

              <span className="text-[9px] font-bold tracking-widest text-primary-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase mb-2">
                Phân tích Sở thích Thành công
              </span>

              <h3 className="text-xl font-extrabold text-slate-800 mb-2">
                {getResultInfo(interestResult).title}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mb-6 font-semibold">
                {getResultInfo(interestResult).desc}
              </p>

              <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-[11px] font-bold text-slate-500 mb-6 flex items-center justify-center gap-1.5">
                <span>🚀</span> Đã cập nhật đề xuất AI!
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => {
                    setCurrentStep(0);
                    setAnswers({});
                  }}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-all"
                >
                  Làm lại Quiz
                </button>
                <button
                  onClick={handleApplyResult}
                  className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold rounded-xl shadow-lg glow-blue transition-all"
                >
                  Xem Sự Kiện Phù Hợp
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default QuizInterests;
