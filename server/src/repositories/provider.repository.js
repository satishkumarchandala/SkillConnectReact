const mongoose = require("mongoose");
const User = require("../models/User");
const { findNextOpenSlotByProvider, findNextOpenSlotsByProviders } = require("./availabilityPublic.repository");

const searchProviders = async ({
  q,
  skills,
  lat,
  lng,
  radiusKm,
  priceMin,
  priceMax,
  ratingMin,
  page,
  limit,
}) => {
  const pipeline = [];
  const profileMatch = {};

  const useAtlasSearch =
    process.env.ATLAS_SEARCH_ENABLED === "true" && q && q.trim();

  if (useAtlasSearch) {
    pipeline.push({
      $search: {
        index: process.env.ATLAS_SEARCH_INDEX || "default",
        text: {
          query: q.trim(),
          path: ["profile.name"],
        },
      },
    });
  }

  if (skills && skills.length) {
    profileMatch.skills = { $all: skills };
  }

  if (priceMin !== undefined || priceMax !== undefined) {
    profileMatch.hourlyRate = {
      ...(priceMin !== undefined ? { $gte: priceMin } : {}),
      ...(priceMax !== undefined ? { $lte: priceMax } : {}),
    };
  }

  if (ratingMin !== undefined) {
    profileMatch.ratingAvg = { $gte: ratingMin };
  }

  if (lat !== undefined && lng !== undefined && radiusKm !== undefined) {
    if (useAtlasSearch) {
      pipeline.push({ $match: { role: "provider", status: "active" } });
    } else {
      pipeline.push({
        $geoNear: {
          near: { type: "Point", coordinates: [lng, lat] },
          distanceField: "distanceMeters",
          maxDistance: radiusKm * 1000,
          spherical: true,
          query: { role: "provider", status: "active" },
        },
      });
    }
  } else {
    pipeline.push({ $match: { role: "provider", status: "active" } });
  }

  pipeline.push(
    {
      $lookup: {
        from: "providerprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "providerProfile",
      },
    },
    { $unwind: "$providerProfile" }
  );

  if (Object.keys(profileMatch).length) {
    pipeline.push({ $match: profileMatch });
  }

  pipeline.push(
    {
      $project: {
        _id: 1,
        role: 1,
        profile: 1,
        location: 1,
        distanceMeters: 1,
        providerProfile: 1,
      },
    },
    { $sort: { "providerProfile.ratingAvg": -1 } },
    { $skip: (page - 1) * limit },
    { $limit: limit }
  );

  const results = await User.aggregate(pipeline);

  const providerIds = results.map((provider) => provider._id);
  const nextSlots = providerIds.length
    ? await findNextOpenSlotsByProviders(providerIds)
    : {};

  return results.map((provider) => ({
    ...provider,
    nextAvailableSlot: nextSlots[provider._id.toString()] || null,
  }));
};

const getProviderById = async (id) => {
  const objectId = mongoose.Types.ObjectId.isValid(id)
    ? new mongoose.Types.ObjectId(id)
    : null;

  if (!objectId) {
    return null;
  }

  const results = await User.aggregate([
    { $match: { _id: objectId, role: "provider", status: "active" } },
    {
      $lookup: {
        from: "providerprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "providerProfile",
      },
    },
    { $unwind: "$providerProfile" },
    {
      $project: {
        _id: 1,
        role: 1,
        profile: 1,
        location: 1,
        providerProfile: 1,
      },
    },
  ]);

  if (!results[0]) return null;

  const nextSlot = await findNextOpenSlotByProvider(objectId);
  return { ...results[0], nextAvailableSlot: nextSlot?.startAt || null };
};

module.exports = { searchProviders, getProviderById };
