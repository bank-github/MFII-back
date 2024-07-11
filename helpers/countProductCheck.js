const cron = require('node-cron');
const counterModel = require('../server/project/service/management/models/counterModel');

// Define session timeout duration (e.g., 1 day)
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;

const cornJob = () => {
    cron.schedule('0 0 * * *', async () => {  // Runs every day at midnight
        try {
            const visit = await counterModel.findOne();

            if (visit) {
                const currentTime = new Date();
                const updatedProductSessionIds = new Map();

                visit.productSessionIds.forEach((sessionIds, productId) => {
                    const validSessions = sessionIds.filter(entry => {
                        const sessionAge = currentTime - new Date(entry.createdAt);
                        return sessionAge <= SESSION_TIMEOUT;
                    });
                    if (validSessions.length > 0) {
                        updatedProductSessionIds.set(productId, validSessions);
                    }
                });

                visit.productSessionIds = updatedProductSessionIds;
                await visit.save();
            }

            console.log('Expired sessions cleaned up successfully.');
        } catch (error) {
            console.error('Error cleaning up expired sessions:', error);
        }
    });
};

module.exports = cornJob;