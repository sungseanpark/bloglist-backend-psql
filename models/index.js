const Blog = require('./blog')
const User = require('./user')

Blog.sync()
User.sync()
Blog.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Blog, User
}