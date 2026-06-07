import User from "../models/User.js";
import Event from "../models/Event.js";
import ClubRegistration from "../models/ClubRegistration.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Get current user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("savedEvents");
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        savedEvents: user.savedEvents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update user interests (Quiz result)
// @route   PUT /api/users/interests
// @access  Private
export const updateInterests = async (req, res) => {
  const { interests } = req.body;

  try {
    if (!Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: "Interests must be an array of strings",
      });
    }

    const user = await User.findById(req.user._id);
    user.interests = interests;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Interests updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        savedEvents: user.savedEvents,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle saved/favorite event
// @route   POST /api/users/favorites/:eventId
// @access  Private
export const toggleSavedEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const user = await User.findById(req.user._id);
    
    // Check if already in savedEvents
    const isSaved = user.savedEvents.some((id) => id.toString() === eventId);

    if (isSaved) {
      // Remove
      user.savedEvents = user.savedEvents.filter(
        (id) => id.toString() !== eventId
      );
    } else {
      // Add
      user.savedEvents.push(eventId);
    }

    await user.save();
    
    // Populate saved events to return
    const updatedUser = await User.findById(req.user._id).populate("savedEvents");

    res.status(200).json({
      success: true,
      message: isSaved ? "Event removed from favorites" : "Event added to favorites",
      savedEvents: updatedUser.savedEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// @desc    Register a new proposed club event and store request in database
// @route   POST /api/users/register-club
// @access  Public
export const registerClub = async (req, res) => {
  const { clubName, email, title, category, date, location, description } = req.body;
  let { image } = req.body;

  if (!clubName || !email || !title || !category || !date || !location || !description) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng điền đầy đủ các trường bắt buộc để đề xuất sự kiện.",
    });
  }

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      image = result.secure_url;
    }

    const registration = await ClubRegistration.create({
      clubName,
      email,
      title,
      category,
      date,
      location,
      image: image || "",
      description,
    });

    res.status(201).json({
      success: true,
      message: "Đề xuất sự kiện thành công! Yêu cầu đã được chuyển tới Admin để phê duyệt.",
      registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all club registration requests
// @route   GET /api/users/club-registrations
// @access  Private/Admin
export const getClubRegistrations = async (req, res) => {
  try {
    const registrations = await ClubRegistration.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete a club registration request
// @route   DELETE /api/users/club-registrations/:id
// @access  Private/Admin
export const deleteClubRegistration = async (req, res) => {
  try {
    const registration = await ClubRegistration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Yêu cầu đề xuất không tồn tại.",
      });
    }
    res.status(200).json({
      success: true,
      message: "Đã từ chối/xóa yêu cầu đề xuất sự kiện thành công.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Approve a club proposed event and publish it
// @route   POST /api/users/club-registrations/:id/approve
// @access  Private/Admin
export const approveClubEvent = async (req, res) => {
  try {
    const reg = await ClubRegistration.findById(req.params.id);

    if (!reg) {
      return res.status(404).json({
        success: false,
        message: "Yêu cầu đề xuất sự kiện không tồn tại hoặc đã được phê duyệt.",
      });
    }

    // Create the real Event
    const event = await Event.create({
      title: reg.title,
      description: reg.description,
      category: reg.category,
      date: reg.date,
      location: reg.location,
      image: reg.image || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
      createdBy: req.user._id, // The Admin who approved it
    });

    // Delete the proposed event request
    await reg.deleteOne();

    res.status(201).json({
      success: true,
      message: "Đã phê duyệt và đăng tải sự kiện thành công! 🎉",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
