const prisma = require('../config/db');
const { sendResponse } = require('../utils/response');

const submitRating = async (req, res, next) => {
  try {
    const { rating, storeId } = req.body;
    const userId = req.user.id;

    // Check if store exists
    const store = await prisma.store.findUnique({ where: { id: storeId } });
    if (!store) {
      return sendResponse(res, 404, false, 'Store not found');
    }

    // Upsert rating (if already exists, update it, otherwise create)
    const updatedRating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId,
        }
      },
      update: {
        rating: parseInt(rating),
      },
      create: {
        rating: parseInt(rating),
        userId,
        storeId,
      }
    });

    return sendResponse(res, 200, true, 'Rating submitted successfully', updatedRating);
  } catch (error) {
    next(error);
  }
};

const updateRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;
    const userId = req.user.id;

    // Find rating and ensure it belongs to the user
    const existingRating = await prisma.rating.findUnique({ where: { id } });
    if (!existingRating) {
      return sendResponse(res, 404, false, 'Rating not found');
    }

    if (existingRating.userId !== userId) {
      return sendResponse(res, 403, false, 'You can only edit your own ratings');
    }

    const updatedRating = await prisma.rating.update({
      where: { id },
      data: { rating: parseInt(rating) },
    });

    return sendResponse(res, 200, true, 'Rating updated successfully', updatedRating);
  } catch (error) {
    next(error);
  }
};

const getStoreRatings = async (req, res, next) => {
  try {
    const { storeId } = req.params;

    const ratings = await prisma.rating.findMany({
      where: { storeId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return sendResponse(res, 200, true, 'Store ratings retrieved', ratings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitRating,
  updateRating,
  getStoreRatings,
};
