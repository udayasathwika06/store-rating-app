const bcrypt = require('bcryptjs');
const prisma = require('../config/db');
const { sendResponse } = require('../utils/response');

const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalStores = await prisma.store.count();
    const totalRatings = await prisma.rating.count();

    // Fetch recent activities
    const recentUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, role: true, createdAt: true },
    });

    const recentStores = await prisma.store.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, createdAt: true },
    });

    const recentRatings = await prisma.rating.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true } },
        store: { select: { name: true } },
      },
    });

    const activities = [];
    recentUsers.forEach(u => {
      activities.push({
        type: 'user_register',
        description: `New user "${u.name}" registered as ${u.role}`,
        timestamp: u.createdAt,
      });
    });
    recentStores.forEach(s => {
      activities.push({
        type: 'store_add',
        description: `New store "${s.name}" was added`,
        timestamp: s.createdAt,
      });
    });
    recentRatings.forEach(r => {
      activities.push({
        type: 'rating_submit',
        description: `User "${r.user.name}" rated "${r.store.name}" with ${r.rating} stars`,
        timestamp: r.createdAt,
      });
    });

    // Sort combined activities descending
    activities.sort((a, b) => b.timestamp - a.timestamp);

    return sendResponse(res, 200, true, 'Dashboard stats retrieved', {
      stats: {
        totalUsers,
        totalStores,
        totalRatings,
      },
      recentActivities: activities.slice(0, 10),
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return sendResponse(res, 400, false, 'Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        address,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return sendResponse(res, 201, true, 'User created successfully', user);
  } catch (error) {
    next(error);
  }
};

const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerName, ownerEmail, ownerPassword } = req.body;

    // Check store email
    const existingStore = await prisma.store.findUnique({ where: { email } });
    if (existingStore) {
      return sendResponse(res, 400, false, 'Store email is already registered');
    }

    // Check owner email
    let owner = await prisma.user.findUnique({ where: { email: ownerEmail } });
    if (owner) {
      if (owner.role !== 'Store Owner') {
        return sendResponse(res, 400, false, 'The user exists but is not a Store Owner');
      }

      // Owner exists and role is correct
    } else {
      // Create new owner
      const hashedPassword = await bcrypt.hash(ownerPassword, 10);
      owner = await prisma.user.create({
        data: {
          name: ownerName,
          email: ownerEmail,
          password: hashedPassword,
          address: address, // Default to store address
          role: 'Store Owner',
        },
      });
    }

    // Create the store
    const store = await prisma.store.create({
      data: {
        name,
        email,
        address,
        ownerId: owner.id,
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return sendResponse(res, 201, true, 'Store and owner created successfully', store);
  } catch (error) {
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    // Build filters
    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      orderBy: { [sortBy]: sortOrder.toLowerCase() },
      skip,
      take: parsedLimit,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    return sendResponse(res, 200, true, 'Users list retrieved', {
      users,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'name', sortOrder = 'asc' } = req.query;

    const parsedPage = parseInt(page);
    const parsedLimit = parseInt(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    const total = await prisma.store.count({ where });

    const stores = await prisma.store.findMany({
      where,
      skip,
      take: parsedLimit,
      include: {
        ratings: { select: { rating: true } },
      },
    });

    // Format output and calculate overall rating
    let formattedStores = stores.map(store => {
      const totalRatings = store.ratings.length;
      const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
      const overallRating = totalRatings > 0 ? parseFloat((sum / totalRatings).toFixed(2)) : 0;
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.ownerId,
        overallRating,
        totalRatings,
        createdAt: store.createdAt,
      };
    });

    // Handle manual sorting for overall rating if needed, or sort on name/email/etc
    if (sortBy === 'overallRating') {
      formattedStores.sort((a, b) => {
        return sortOrder === 'desc' 
          ? b.overallRating - a.overallRating 
          : a.overallRating - b.overallRating;
      });
    } else {
      formattedStores.sort((a, b) => {
        let valA = a[sortBy] ? a[sortBy].toString().toLowerCase() : '';
        let valB = b[sortBy] ? b[sortBy].toString().toLowerCase() : '';
        if (valA < valB) return sortOrder === 'desc' ? 1 : -1;
        if (valA > valB) return sortOrder === 'desc' ? -1 : 1;
        return 0;
      });
    }

    return sendResponse(res, 200, true, 'Stores list retrieved', {
      stores: formattedStores,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        pages: Math.ceil(total / parsedLimit),
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUserDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    const result = { ...user };

    if (user.role === 'Store Owner') {
      const store = await prisma.store.findFirst({
        where: { ownerId: user.id },
        include: {
          ratings: { select: { rating: true } },
        },
      });

      if (store) {
        const totalRatings = store.ratings.length;
        const sum = store.ratings.reduce((acc, r) => acc + r.rating, 0);
        result.storeName = store.name;
        result.storeAddress = store.address;
        result.storeEmail = store.email;
        result.averageStoreRating = totalRatings > 0 ? parseFloat((sum / totalRatings).toFixed(2)) : 0;
        result.totalRatingsCount = totalRatings;
      } else {
        result.averageStoreRating = 0;
        result.totalRatingsCount = 0;
      }
    }

    return sendResponse(res, 200, true, 'User details retrieved', result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  createUser,
  createStore,
  getUsers,
  getStores,
  getUserDetails,
};
