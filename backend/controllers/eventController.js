import Event from "../models/Event.js";
import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

// @desc    Get all events with optional filter & search
// @route   GET /api/events
// @access  Public
export const getAllEvents = async (req, res) => {
  const { category, search } = req.query;

  try {
    let query = {};

    // Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .sort({ date: 1 }); // Sort by date ascending

    res.status(200).json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get recommended events based on user interests
// @route   GET /api/events/recommended
// @access  Private
export const getRecommendedEvents = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userInterests = user.interests || [];

    // Fetch all events
    const events = await Event.find({}).populate("createdBy", "name email");

    // Dynamic scoring algorithm based on user interests
    const scoredEvents = events.map((event) => {
      let score = 0;

      // Direct category match: e.g., if user likes "music" and event is in "music" category
      if (userInterests.includes(event.category)) {
        score += 10;
      }

      // We could add more scoring parameters here in the future
      return { event, score };
    });

    // Sort by score descending, then by date ascending (sooner events first)
    scoredEvents.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return new Date(a.event.date) - new Date(b.event.date);
    });

    const recommendedList = scoredEvents.map((item) => item.event);

    res.status(200).json({
      success: true,
      count: recommendedList.length,
      events: recommendedList,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create new event (Admin only)
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  const { title, description, category, date, location } = req.body;
  let { image } = req.body;

  try {
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      image = result.secure_url;
    }

    const newEvent = await Event.create({
      title,
      description,
      category,
      date,
      location,
      image,
      createdBy: req.user._id, // Associated with logging admin
    });

    const populatedEvent = await Event.findById(newEvent._id).populate(
      "createdBy",
      "name email"
    );

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: populatedEvent,
    });
  } catch (error) {
    console.error("Create event error details:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update event (Admin only)
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Prepare update data
    const updateData = { ...req.body };

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
      });
      updateData.image = result.secure_url;
    }

    // Update event
    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("createdBy", "name email");

    res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("Update event error details:", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete event (Admin only)
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
      eventId: req.params.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create / Update review for an event
// @route   POST /api/events/:id/reviews
// @access  Private
export const createEventReview = async (req, res) => {
  const { rating, comment } = req.body;

  if (rating === undefined || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng chọn số sao từ 1 đến 5.",
    });
  }

  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện.",
      });
    }

    // Check if user already reviewed
    const alreadyReviewed = event.ratings.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      // Update existing review
      alreadyReviewed.rating = Number(rating);
      alreadyReviewed.comment = comment || "";
      alreadyReviewed.createdAt = Date.now();
    } else {
      // Add new review
      const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment: comment || "",
        createdAt: Date.now(),
      };
      event.ratings.push(review);
      event.numOfReviews = event.ratings.length;
    }

    // Calculate average rating
    event.averageRating =
      event.ratings.reduce((acc, item) => item.rating + acc, 0) /
      event.ratings.length;

    await event.save();

    res.status(200).json({
      success: true,
      message: alreadyReviewed ? "Đã cập nhật đánh giá thành công!" : "Đã gửi đánh giá thành công!",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
