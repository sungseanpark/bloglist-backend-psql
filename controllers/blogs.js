const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { Blog, User } = require('../models')
const { SECRET } = require('../util/config')
const { validateToken } = require('../util/middleware')

const { Op } = require('sequelize')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

router.get('/', async (req, res) => {
  let where = {}

  if (req.query.search) {
    where = {
      [Op.or]:[
        {
          title: {
            [Op.substring]: req.query.search
          }
        },
        {
          author: {
            [Op.substring]: req.query.search
          }
        }
      ]
    }
  }

    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      },
      where,
      order: [['likes','DESC']]
    })

    console.log(JSON.stringify(blogs, null, 2))

    res.json(blogs)
})


router.post('/', tokenExtractor, validateToken, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  if(!user.disabled){
    const blog = await Blog.create({...req.body, userId: user.id})
    return res.json(blog)
  }
  else{
    return res.status(403).send({ error: 'You are not authorized to create a blog' });
  }
  
    
})

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    next()
}

router.get('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  })
  
router.delete('/:id', blogFinder, tokenExtractor, validateToken, async (req, res) => {
   // Assuming the blogFinder middleware has already attached the blog to the request
   if (req.blog) {
    const user = await User.findByPk(req.decodedToken.id);
    // Check if the logged-in user is the creator of the blog
    if (req.blog.userId === user.id && !user.disabled) {
      await req.blog.destroy();
      res.status(204).end();
    } else {
      // If the user is not the creator, return a 403 Forbidden status
      res.status(403).send({ error: 'You are not authorized to delete this blog' });
    }
  } else {
    // If no blog is found with the given ID
    res.status(404).end();
  }
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json({
        likes: req.blog.likes,
      })
  } else {
      res.status(404).end()
  }
  })
  


module.exports = router