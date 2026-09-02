const AuditLog = require('../models/AuditLog');

// Middleware to log critical operations
const auditLogger = (action) => {
    return async (req, res, next) => {
        // Store original methods
        const originalJson = res.json;
        const startTime = Date.now();

        // Override res.json to capture response
        res.json = function (data) {
            const duration = Date.now() - startTime;

            // Only log if operation was successful
            if (data.success) {
                // Don't await - log asynchronously
                AuditLog.create({
                    user: req.user?._id,
                    action,
                    resource: req.baseUrl + req.path,
                    resourceId: req.params.id || data.data?._id,
                    method: req.method,
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.get('user-agent'),
                    duration,
                    metadata: {
                        body: req.body,
                        query: req.query
                    }
                }).catch(err => {
                    console.error('Audit log error:', err);
                });
            }

            // Call original json method
            return originalJson.call(this, data);
        };

        next();
    };
};

module.exports = auditLogger;
