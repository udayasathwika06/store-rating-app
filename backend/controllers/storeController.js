const prisma = require('../config/db');
const { sendResponse } = require('../utils/response');

const getStores = async (req, res, next) => {
  try {
    const { search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;
    const userId = req.user.id; // From authenticate middleware

    // Build filter
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: {
          select: {
            rating: true,
            userId: true,
          }
        }
      }
    });

    // Process stores to add ratings stats and current user's specific rating
    let processedStores = stores.map(store => {
      const ratings = store.ratings;
      const count = ratings.length;
      const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
      const overallRating = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
      
      const myRatingObj = ratings.find(r => r.userId === userId);
      const myRating = myRatingObj ? myRatingObj.rating : null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating,
        myRating,
        totalRatings: count,
      };
    });

    // Sorting
    if (sortBy === 'overallRating') {
      processedStores.sort((a, b) => {
        return sortOrder === 'desc' 
          ? b.overallRating - a.overallRating 
          : a.overallRating - b.overallRating;
      });
    } else {
      processedStores.sort((a, b) => {
        let valA = a.name.toLowerCase();
        let valB = b.name.toLowerCase();
        if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
        if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return sendResponse(res, 200, true, 'Stores retrieved successfully', processedStores);
  } catch (error) {
    next(error);
  }
};

const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const store = await prisma.store.findUnique({
      where: { id },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          }
        }
      }
    });

    if (!store) {
      return sendResponse(res, 404, false, 'Store not found');
    }

    const count = store.ratings.length;
    const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
    const overallRating = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;
    const myRatingObj = store.ratings.find(r => r.userId === userId);
    
    // Check if the current user is the owner of this store
    const isOwner = store.ownerId === userId;

    const storeDetails = {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      overallRating,
      totalRatings: count,
      myRating: myRatingObj ? myRatingObj.rating : null,
      myRatingId: myRatingObj ? myRatingObj.id : null,
      isOwner,
      ratings: isOwner ? store.ratings.map(r => ({
        id: r.id,
        userName: r.user.name,
        userEmail: r.user.email,
        rating: r.rating,
        createdAt: r.createdAt,
      })) : []
    };

    return sendResponse(res, 200, true, 'Store details retrieved', storeDetails);
  } catch (error) {
    next(error);
  }
};

// Owner specific endpoint to get their own store stats directly
const getOwnerStoreStats = async (req, res, next) => {
  try {
    const userId = req.user.id; // The Store Owner's ID

    const store = await prisma.store.findFirst({
      where: { ownerId: userId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!store) {
      return sendResponse(res, 404, false, 'No store associated with this owner account');
    }

    const count = store.ratings.length;
    const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = count > 0 ? parseFloat((sum / count).toFixed(2)) : 0;

    return sendResponse(res, 200, true, 'Store owner stats retrieved', {
      storeId: store.id,
      storeName: store.name,
      averageRating,
      totalRatings: count,
      ratingsList: store.ratings.map(r => ({
        id: r.id,
        userName: r.user.name,
        userEmail: r.user.email,
        rating: r.rating,
        createdAt: r.createdAt,
      }))
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStores,
  getStoreById,
  getOwnerStoreStats,
};
