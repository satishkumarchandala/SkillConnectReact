const mongoose = require("mongoose");
const User = require("../models/User");
const Review = require("../models/Review");
const auditRepository = require("../repositories/audit.repository");
const providerProfileRepository = require("../repositories/providerProfile.repository");

const suspendProvider = async ({ providerId, adminId }) => {
  if (!mongoose.Types.ObjectId.isValid(providerId)) {
    const err = new Error("Invalid provider");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(providerId);
  if (!user || user.role !== "provider") {
    const err = new Error("Provider not found");
    err.statusCode = 404;
    throw err;
  }

  user.status = "suspended";
  await user.save();

  await auditRepository.createAuditLog({
    actorId: adminId,
    action: "provider.suspend",
    targetType: "User",
    targetId: user._id,
  });

  return user;
};

const reinstateProvider = async ({ providerId, adminId }) => {
  if (!mongoose.Types.ObjectId.isValid(providerId)) {
    const err = new Error("Invalid provider");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(providerId);
  if (!user || user.role !== "provider") {
    const err = new Error("Provider not found");
    err.statusCode = 404;
    throw err;
  }

  user.status = "active";
  await user.save();

  await auditRepository.createAuditLog({
    actorId: adminId,
    action: "provider.reinstate",
    targetType: "User",
    targetId: user._id,
  });

  return user;
};

const removeReview = async ({ reviewId, adminId }) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    const err = new Error("Invalid review");
    err.statusCode = 400;
    throw err;
  }

  const review = await Review.findById(reviewId);
  if (!review) {
    const err = new Error("Review not found");
    err.statusCode = 404;
    throw err;
  }

  await Review.findByIdAndDelete(reviewId);

  const profile = await providerProfileRepository.findProviderProfileByUserId(
    review.providerId
  );

  if (profile) {
    const nextCount = Math.max(profile.ratingCount - 1, 0);
    const nextAvg =
      nextCount === 0
        ? 0
        : (profile.ratingAvg * profile.ratingCount - review.rating) /
          nextCount;
    profile.ratingCount = nextCount;
    profile.ratingAvg = Number(nextAvg.toFixed(2));
    await profile.save();
  }

  await auditRepository.createAuditLog({
    actorId: adminId,
    action: "review.remove",
    targetType: "Review",
    targetId: review._id,
    metadata: { providerId: review.providerId },
  });

  return review;
};

module.exports = {
  suspendProvider,
  reinstateProvider,
  removeReview,
};
