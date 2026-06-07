import React, { useState, useEffect } from "react";

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

const QuizModal = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0, 1, 2 for questions, 3 for loading, 4 for result
  const [answers, setAnswers] = useState({});
  const [loadingText, setLoadingText] = useState("Analyzing your selections...");
  const [interestResult, setInterestResult] = useState("");

  useEffect(() => {
    if (!isOpen) {
      // Reset state when modal is closed
      setCurrentStep(0);
      setAnswers({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOptionClick = (questionId, category) => {
    const updatedAnswers = { ...answers, [questionId]: category };
    setAnswers(updatedAnswers);

    if (currentStep < QUESTIONS.length - 1) {
      // Smoothly go to next question after a tiny delay for visual feedback
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      // Trigger AI recommendation loading simulation
      setCurrentStep(QUESTIONS.length); // step 3 (loading)
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

        // Get the category with maximum votes
        let topCategory = "workshop"; // default fallback
        let maxVotes = 0;
        Object.entries(categoriesCount).forEach(([cat, votes]) => {
          if (votes > maxVotes) {
            maxVotes = votes;
            topCategory = cat;
          }
        });

        setInterestResult(topCategory);
        setCurrentStep(QUESTIONS.length + 1); // step 4 (result)
      }
    }, 850);
  };

  const handleApplyResult = () => {
    onComplete(interestResult);
    onClose();
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

  const progressPercent = Math.round(((currentStep) / QUESTIONS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 z-10 transition-all transform animate-fade-in-up">
        
        {/* Close Button */}
        {currentStep !== QUESTIONS.length && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl z-20"
            title="Đóng Quiz"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {/* --- QUESTION STEPS (0, 1, 2) --- */}
        {currentStep < QUESTIONS.length && (
          <div className="p-8">
            {/* Header: Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                <span>Quiz Sở Thích</span>
                <span>Câu hỏi {currentStep + 1} / {QUESTIONS.length}</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-blue to-accent-orange transition-all duration-300 rounded-full"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Title */}
            <h2 className="text-xl font-extrabold text-slate-800 mb-6 leading-snug">
              {QUESTIONS[currentStep].title}
            </h2>

            {/* Options List */}
            <div className="space-y-3">
              {QUESTIONS[currentStep].options.map((opt, idx) => {
                const isSelected = answers[QUESTIONS[currentStep].id] === opt.category;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(QUESTIONS[currentStep].id, opt.category)}
                    className={`w-full p-4 text-left rounded-2xl border transition-all duration-200 flex items-center gap-4 ${
                      isSelected
                        ? "bg-blue-50/70 border-primary-blue text-primary-blue shadow-md font-semibold"
                        : "bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50"
                    }`}
                  >
                    <span className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl group-hover:scale-110">
                      {opt.icon}
                    </span>
                    <span className="text-sm leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Prev/Back actions */}
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

        {/* --- SIMULATED AI LOADING STATE (Step 3) --- */}
        {currentStep === QUESTIONS.length && (
          <div className="p-12 text-center flex flex-col items-center justify-center min-h-[380px]">
            {/* Spinning Radar Animation */}
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-accent-orange border-r-primary-blue rounded-full animate-spin" />
              <div className="absolute inset-4 bg-orange-50 rounded-full flex items-center justify-center">
                <span className="text-3xl animate-bounce">🧠</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">Analyzing your Interests...</h3>
            <p className="text-sm text-slate-500 font-medium animate-pulse">{loadingText}</p>
          </div>
        )}

        {/* --- RESULTS STATE (Step 4) --- */}
        {currentStep === QUESTIONS.length + 1 && (
          <div className="p-8 text-center flex flex-col items-center">
            {/* Mascot / Icon Badge */}
            <div className={`w-20 h-20 bg-gradient-to-tr ${getResultInfo(interestResult).color} rounded-3xl flex items-center justify-center text-4xl text-white shadow-xl shadow-blue-100/50 mb-6 rotate-6`}>
              {getResultInfo(interestResult).icon}
            </div>

            <span className="text-[10px] font-bold tracking-widest text-primary-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase mb-2.5">
              Phân tích Sở thích Thành công
            </span>

            <h3 className="text-2xl font-extrabold text-slate-800 mb-3">
              {getResultInfo(interestResult).title}
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed max-w-sm mb-8 font-medium">
              {getResultInfo(interestResult).desc}
            </p>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs font-semibold text-slate-600 mb-8 flex items-center justify-center gap-2">
              <span>🚀</span> Đã cá nhân hóa danh sách gợi ý sự kiện cho riêng bạn!
            </div>

            <button
              onClick={handleApplyResult}
              className="w-full py-4 bg-primary-blue hover:bg-primary-blue-hover text-white text-sm font-bold rounded-2xl shadow-lg glow-blue transition-all"
            >
              Xem Sự Kiện Phù Hợp
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default QuizModal;
