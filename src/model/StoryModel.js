const mongoose = require('mongoose');

const userStorySchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: { type: Number, default: 0 },
    like: { type: Number, default: 0 },
    publicationDate: { type: Date, default: Date.now },
    status: { type: String, default: 'active', enum: ["active", "inactive"] },
    stories: [{
        thumbnail: { type: String, require: false },
        video: { type: String, require: false }
    }]
});

// Middleware для автоматического обновления статуса перед запросом
userStorySchema.pre('find', function (next) {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    this.updateMany({ publicationDate: { $lt: oneDayAgo } }, { status: 'inactive' }).exec();
    next();
});

module.exports = mongoose.model('UserStory', userStorySchema);
