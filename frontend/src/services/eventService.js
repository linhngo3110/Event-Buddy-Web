import api from "./api";

/**
 * Maps backend Event structure to the property names expected by the Frontend.
 * - Converts mongoose `_id` to `id`.
 * - Capitalizes `category` (e.g., "music" -> "Music") and wraps in `categories` array.
 */
export const mapEvent = (evt) => {
  if (!evt) return null;
  const categoryCapitalized = evt.category
    ? evt.category.charAt(0).toUpperCase() + evt.category.slice(1)
    : "Workshop";

  return {
    ...evt,
    id: evt._id || evt.id,
    categories: [categoryCapitalized], // frontend page and card layouts expect array of strings
  };
};

/**
 * Fetch all events from database.
 */
export const apiFetchEvents = async () => {
  const response = await api.get("/events");
  return (response.data.events || []).map(mapEvent);
};

/**
 * Fetch recommended events from database.
 */
export const apiFetchRecommendedEvents = async () => {
  const response = await api.get("/events/recommended");
  return (response.data.events || []).map(mapEvent);
};

/**
 * Publish a new event (Supports both multipart file upload and JSON).
 */
export const apiCreateEvent = async (eventObj) => {
  const { title, description, category, date, location, imageFile, image } = eventObj;
  
  let response;
  if (imageFile) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category.toLowerCase());
    formData.append("date", date);
    formData.append("location", location);
    formData.append("image", imageFile); // Multipart image file upload
    
    response = await api.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    response = await api.post("/events", {
      title,
      description,
      category: category.toLowerCase(),
      date,
      location,
      image,
    });
  }
  
  return mapEvent(response.data.event);
};

/**
 * Update an existing event.
 */
export const apiUpdateEvent = async (eventId, eventObj) => {
  const { title, description, category, date, location, imageFile, image } = eventObj;
  
  let response;
  if (imageFile) {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category.toLowerCase());
    formData.append("date", date);
    formData.append("location", location);
    formData.append("image", imageFile);
    
    response = await api.put(`/events/${eventId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    response = await api.put(`/events/${eventId}`, {
      title,
      description,
      category: category.toLowerCase(),
      date,
      location,
      image,
    });
  }
  
  return mapEvent(response.data.event);
};

/**
 * Delete an event.
 */
export const apiDeleteEvent = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data; // { success, message, eventId }
};

/**
 * Pure calculation utility to score events based on student interest.
 * (Also remains here for frontend-side fallback score calculations).
 */
export const calculateEventScores = (events, userInterest) => {
  if (!userInterest) {
    return events.map((evt) => ({ ...evt, matchScore: null }));
  }

  return events.map((evt) => {
    const hasExactMatch = (evt.categories || []).some(
      (cat) => cat.toLowerCase() === userInterest.toLowerCase()
    );

    let matchScore = null;
    if (hasExactMatch) {
      matchScore = 96;
    } else {
      const hasPartialMatch = (evt.categories || []).some((cat) =>
        ["workshop", "academic"].includes(cat.toLowerCase())
      );
      if (hasPartialMatch) {
        matchScore = 76;
      }
    }

    return { ...evt, matchScore };
  });
};

/**
 * Returns the top 4 recommended events.
 */
export const getTopRecommendations = (eventsWithScores, userInterest) => {
  if (!userInterest) {
    return eventsWithScores.slice(0, 4);
  }
  return [...eventsWithScores]
    .sort((a, b) => {
      const scoreA = a.matchScore || 0;
      const scoreB = b.matchScore || 0;
      return scoreB - scoreA;
    })
    .slice(0, 4);
};

/**
 * Filters events based on active category filters and query search.
 */
export const getFilteredExploreEvents = (eventsWithScores, selectedFilters, searchQuery) => {
  return eventsWithScores.filter((evt) => {
    const matchesFilters =
      selectedFilters.length === 0 ||
      evt.categories.some((cat) => selectedFilters.includes(cat));

    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.categories.some((cat) =>
        cat.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesFilters && matchesSearch;
  });
};

/**
 * Add/Remove calendar event local state updates.
 */
export const addEventToSaved = (savedEvents, event) => {
  const exists = savedEvents.some((e) => (e.id || e._id) === (event.id || event._id));
  if (exists) {
    return {
      savedEvents: savedEvents.filter((e) => (e.id || e._id) !== (event.id || event._id)),
      action: "removed"
    };
  } else {
    return {
      savedEvents: [...savedEvents, event],
      action: "added"
    };
  }
};

export const removeEventFromSaved = (savedEvents, eventId) => {
  return savedEvents.filter((e) => (e.id || e._id) !== eventId);
};
