import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../context/ToastContext";
import { apiFetchEvents, apiUpdateEvent } from "../services/eventService";

const AdminEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { triggerToast } = useToast();

  // Fetch events list asynchronously
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: apiFetchEvents
  });

  const event = useMemo(() => {
    return events.find((e) => e.id === id);
  }, [events, id]);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    image: "",
    imageFile: null,
    imagePreview: "",
    categories: [],
    description: ""
  });

  const availableCategories = ["Academic", "Career", "Music", "Volunteer", "Workshop"];

  // Populate form with existing event values
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        location: event.location,
        image: event.image,
        imageFile: null,
        imagePreview: event.image, // Show existing image as preview initially
        categories: event.categories,
        description: event.description || `Chi tiết lịch trình hoạt động ${event.title} vô cùng bổ ích, mang lại nhiều giá trị phát triển kỹ năng mềm, kiến thức thực hành thực tế cho sinh viên campus.`
      });
    }
  }, [event]);

  // TanStack Query Mutation to update event
  const updateMutation = useMutation({
    mutationFn: ({ eventId, updatedData }) => apiUpdateEvent(eventId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      triggerToast("✏️ Cập nhật thông tin sự kiện thành công!");
      navigate("/admin/manage");
    },
    onError: (error) => {
      console.error("Update event error:", error.response?.data || error);
      triggerToast(`Lỗi: ${error.response?.data?.message || error.message}`, "error");
    }
  });

  if (isLoading) {
    return (
      <div className="py-20 text-center flex flex-col items-center justify-center gap-3">
        <span className="text-4xl animate-spin">⏳</span>
        <p className="text-slate-500 font-bold">Đang tải thông tin sự kiện sửa đổi...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 font-semibold">Event to edit not found.</p>
        <button
          onClick={() => navigate("/admin/manage")}
          className="mt-4 px-4 py-2 bg-primary-blue text-white rounded-xl text-xs font-bold"
        >
          Quay lại quản lý
        </button>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryToggle = (cat) => {
    setFormData((prev) => {
      const exists = prev.categories.includes(cat);
      const updated = exists
        ? prev.categories.filter((c) => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: updated };
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.categories.length === 0) {
      alert("Vui lòng chọn ít nhất một danh mục phân loại sự kiện.");
      return;
    }

    updateMutation.mutate({
      eventId: event.id,
      updatedData: {
        ...formData,
        category: formData.categories[0] // Trích danh mục đầu tiên
      }
    });
  };

  return (
    <section className="bg-slate-50 py-12 min-h-[80vh] w-full text-left">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        
        {/* Form Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-6 sm:p-10 animate-fade-in-up">
          
          {/* Header */}
          <div className="mb-8 pb-4 border-b border-slate-100">
            <span className="text-[10px] font-bold tracking-widest text-accent-orange bg-orange-50 border border-orange-100 px-3 py-1 rounded-full uppercase">
              Club Editor
            </span>
            <h2 className="text-xl font-extrabold text-slate-800 mt-3 mb-1">
              Chỉnh Sửa Sự Kiện Campus
            </h2>
            <p className="text-xs text-slate-400 font-semibold">
              Cập nhật thông tin chi tiết sự kiện của bạn tại form bên dưới.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                Tên Sự kiện *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Ví dụ: Tọa Đàm Hướng Nghiệp Công Nghệ"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
              />
            </div>

            {/* Grid Date & Place */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date & Time */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                  Thời gian diễn ra *
                </label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                  placeholder="Ví dụ: Nov 25, 2026 - 1:30pm"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                  Địa điểm tổ chức *
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="Ví dụ: Hội trường A, CS Lab 402"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm"
                />
              </div>
            </div>

            {/* Banner image upload */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                Thay đổi ảnh Banner (Cloudinary)
              </label>
              
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    name="imageFile"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-primary-blue hover:file:bg-blue-100"
                  />
                  <p className="text-[10px] text-slate-400 font-semibold mt-1">💡 Hỗ trợ JPG, PNG, WEBP. Chọn file mới để thay thế ảnh hiện tại.</p>
                </div>
                
                {/* Image Preview */}
                {formData.imagePreview && (
                  <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                    <img 
                      src={formData.imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Categories checklist */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                Danh mục Phân loại (Chọn ít nhất 1) *
              </label>
              <div className="flex flex-wrap gap-2 pt-1">
                {availableCategories.map((cat) => {
                  const isSelected = formData.categories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => handleCategoryToggle(cat)}
                      className={`px-3 py-1.5 border rounded-xl text-xs font-bold transition-all ${
                        isSelected
                          ? "bg-blue-50 border-primary-blue text-primary-blue shadow-inner"
                          : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1.5 uppercase">
                Mô tả chi tiết chương trình *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Mô tả chi tiết nội dung chương trình..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue text-sm resize-none"
              />
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={updateMutation.isPending}
                onClick={() => navigate("/admin/manage")}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 py-3 bg-primary-blue hover:bg-primary-blue-hover text-white text-xs font-bold rounded-xl shadow-lg glow-blue transition-all disabled:opacity-50"
              >
                {updateMutation.isPending ? "Đang lưu..." : "Lưu Thay đổi"}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};

export default AdminEdit;
