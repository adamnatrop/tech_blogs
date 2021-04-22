const User = require('./User');
const Post = require('./Post');
const Comments = require('./Comments');

User.hasMany(Post, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Post.belongsTo(User, {
  foreignKey: 'user_id'
});

Comments.belongsTo(User, {
  foreignKey: 'user_id',
});

Post.hasMany(Comments, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
})

module.exports = { User, Post, Comments };
