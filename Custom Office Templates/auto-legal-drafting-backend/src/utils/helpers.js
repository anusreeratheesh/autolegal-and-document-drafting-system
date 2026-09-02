const PRICING_TIERS = {
    quick: {
        name: 'Quick',
        price: 199,
        sla: 360 // 6 hours in minutes
    },
    standard: {
        name: 'Standard',
        price: 499,
        sla: 1440 // 24 hours
    },
    premium: {
        name: 'Premium',
        price: 999,
        sla: 120 // 2 hours
    }
};

// Calculate SLA deadline from now
const calculateSLADeadline = (tier) => {
    const slaMinutes = PRICING_TIERS[tier]?.sla || PRICING_TIERS.standard.sla;
    return new Date(Date.now() + slaMinutes * 60 * 1000);
};

// Get price for tier
const getPriceForTier = (tier) => {
    return PRICING_TIERS[tier]?.price || PRICING_TIERS.standard.price;
};

// Format date to DD/MM/YYYY
const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};

// Pagination helper
const getPagination = (page = 1, limit = 10) => {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    return {
        page: pageNum > 0 ? pageNum : 1,
        limit: limitNum > 0 && limitNum <= 100 ? limitNum : 10,
        skip: (pageNum - 1) * limitNum
    };
};

// Success response formatter
const successResponse = (res, statusCode, data, message = 'Success') => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Check if user has role
const hasRole = (user, roles) => {
    if (!Array.isArray(roles)) {
        roles = [roles];
    }
    return roles.includes(user.role);
};

module.exports = {
    PRICING_TIERS,
    calculateSLADeadline,
    getPriceForTier,
    formatDate,
    getPagination,
    successResponse,
    hasRole
};
