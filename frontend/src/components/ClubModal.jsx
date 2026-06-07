import React, { useState } from "react";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

const ClubModal = ({ isOpen, onClose }) => {
  const { triggerToast } = useToast();
  const [formData, setFormData] = useState({
    clubName: "",
    email: "",
    title: "",
    category: "academic",
    date: "",
    location: "",
    imageFile: null,
    imagePreview: "",
    description: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("clubName", formData.clubName);
      payload.append("email", formData.email);
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("date", formData.date);
      payload.append("location", formData.location);
      payload.append("description", formData.description);
      if (formData.imageFile) {
        payload.append("image", formData.imageFile);
      }

      const response = await api.post("/users/register-club", payload, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        setIsSubmitted(true);
        triggerToast("🎉 Đã gửi đề xuất sự kiện thành công!");
      } else {
        triggerToast(response.data.message || "Đã xảy ra lỗi khi gửi đề xuất.", "error");
      }
    } catch (error) {
      console.error("Lỗi đề xuất sự kiện CLB:", error);
      triggerToast(
        error.response?.data?.message || "Không thể kết nối đến máy chủ. Vui lòng thử lại sau.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setFormData({
      clubName: "",
      email: "",
      title: "",
      category: "academic",
      date: "",
      location: "",
      imageFile: null,
      imagePreview: "",
      description: ""
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop blur */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-y-auto max-h-[90vh] shadow-2xl border border-slate-100 z-10 transition-all transform animate-fade-in-up">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-655 hover:bg-slate-50 rounded-xl z-20 cursor-pointer"
          title="Đóng"
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

        {/* --- FORM STATE --- */}
        {!isSubmitted ? (
          <div className="p-8">
            {/* Header */}
            <div className="mb-5">
              <span className="text-[10px] font-bold tracking-widest text-primary-blue bg-blue-50 border border-blue-100 px-3 py-1 rounded-full uppercase">
                Đề xuất sự kiện CLB
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-3 mb-1.5">
                Chia sẻ & Đăng tải Sự kiện
              </h2>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                Đề xuất sự kiện của Câu lạc bộ bạn để tiếp cận hơn 10,000+ sinh viên năng động trên campus!
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              
              {/* Grid 2 Columns: Club Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Tên CLB đề xuất *
                  </label>
                  <input
                    type="text"
                    name="clubName"
                    value={formData.clubName}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: GDSC, CLB Sách"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs font-medium"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Email liên hệ *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="clb@school.edu.vn"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs font-medium"
                  />
                </div>
              </div>

              {/* Event Title */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Tên Sự kiện đề xuất *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: TechTalk 2026: GenAI in Action"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs font-medium"
                />
              </div>

              {/* Grid 2 Columns: Category & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Phân loại hoạt động *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs bg-white font-medium"
                  >
                    <option value="academic">Học thuật & Nghiên cứu 🎓</option>
                    <option value="career">Kỹ năng & Sự nghiệp 💼</option>
                    <option value="music">Nghệ thuật & Âm nhạc 🎵</option>
                    <option value="volunteer">Tình nguyện vì cộng đồng 🤝</option>
                    <option value="workshop">Công nghệ & Workshop 💻</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                    Thời gian diễn ra *
                  </label>
                  <input
                    type="text"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    placeholder="Ví dụ: Nov 25, 2026 - 7:30pm"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs font-medium"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Địa điểm tổ chức *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Ví dụ: Hội trường A1, Campus Main Building"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs font-medium"
                />
              </div>

              {/* Image File Selector */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Upload ảnh Banner sự kiện (Tùy chọn)
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs font-medium file:mr-3 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-blue-50 file:text-primary-blue hover:file:bg-blue-100 cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400 font-semibold mt-1">
                      💡 Hỗ trợ định dạng JPG, PNG, WEBP.
                    </p>
                  </div>
                  
                  {/* Image Preview */}
                  {formData.imagePreview && (
                    <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center shadow-inner">
                      <img 
                        src={formData.imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Mô tả chi tiết sự kiện *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  placeholder="Mô tả nội dung chương trình, agenda, khách mời và cách thức tham gia cho sinh viên..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-xs resize-none leading-relaxed font-medium"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-3 py-2.5 bg-accent-orange hover:bg-accent-orange-hover text-white text-xs font-bold rounded-xl shadow-lg glow-orange transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Đang gửi đề xuất...
                  </>
                ) : (
                  "Đề xuất đăng tải Sự kiện ngay"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* --- SUCCESS STATE --- */
          <div className="p-10 text-center flex flex-col items-center">
            {/* Success Checkmark Anim */}
            <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl text-emerald-600 shadow-md shadow-emerald-100 mb-6 animate-bounce">
              ✓
            </div>

            <h3 className="text-xl font-extrabold text-slate-800 mb-2">
              Đề xuất Thành Công! 🎉
            </h3>

            <p className="text-xs text-slate-500 font-semibold mb-6">
              Đề xuất sự kiện <span className="text-primary-blue font-bold">{formData.title}</span> của CLB <span className="text-primary-blue font-bold">{formData.clubName}</span> đã được gửi đi!
            </p>

            <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed max-w-sm mb-8 text-left space-y-2">
              <p className="font-medium">📬 **Bước tiếp theo:**</p>
              <p className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue">
                Yêu cầu tạo sự kiện của bạn đã được chuyển tới Bảng điều khiển kiểm duyệt của **Quản trị viên**.
              </p>
              <p className="pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary-blue">
                Khi được Quản trị viên duyệt phê duyệt, sự kiện sẽ tự động được xuất bản và xuất hiện ngay tại trang khám phá của hệ thống!
              </p>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Đồng ý & Đóng
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ClubModal;
