const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { ReadingList, User } = require('../models')
const { SECRET } = require('../util/config')

const { validateToken } = require('../util/middleware')

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

// router.get('/', async (req, res) => {
//     const users = await User.findAll({
//         include: {
//           model: Blog,
//           attributes: { exclude: ['userId'] }
//         }
//       })
//   res.json(users)
// })

router.post('/', async (req, res) => {
    const reading_list = await ReadingList.create(req.body)
    res.json(reading_list)
})

router.put('/:id', tokenExtractor, validateToken, async (req, res) => {
    const reading_list = await ReadingList.findByPk(req.params.id)
    if(reading_list){
        const user = await User.findByPk(req.decodedToken.id);
        if(reading_list.userId === user.id && !user.disabled){
            reading_list.read = req.body.read
            await reading_list.save()
            res.json(reading_list)
        }
        else{
            res.status(403).send({ error: 'You are not authorized to modify this reading list' });
        }
    }
    else{
        res.status(404).end()
    }
})

// router.put('/:username', async (req, res) => {
//   const user = await User.findOne({
//     where: {
//       username: req.params.username
//     }
//   })
//     if (user) {
//         user.username = req.body.username
//         await user.save()
//         res.json(user)
//     }
//     else {
//         res.status(404).end()
//     }
// })

// router.get('/:id', async (req, res) => {
//   const user = await User.findByPk(req.params.id)
//   if (user) {
//     res.json(user)
//   } else {
//     res.status(404).end()
//   }
// })

module.exports = router