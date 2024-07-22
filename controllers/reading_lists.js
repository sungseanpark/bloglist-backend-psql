const router = require('express').Router()

const { ReadingList } = require('../models')

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