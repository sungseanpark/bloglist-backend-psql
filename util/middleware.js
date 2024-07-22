const { ActiveSession } = require('../models')

const errorHandler = (error, request, response, next) => {
    console.error(error.name)
  
    if (error.name === 'SyntaxError') {
      return response.status(400).send({ error: 'malformatted input' })
    } 
    else if (error.name === 'SequelizeValidationError') {
      const errorMessages = error.errors.map(e => e.message)
      return response.status(400).json({
        error: errorMessages
      })
    }
  
    next(error)
  }

  const validateToken = async (req, res, next) => {
    const authorization = req.get('Authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
  
      const token = authorization.substring(7)
      
      try {
        if (!token) {
          return res.status(401).send({ message: 'Missing token' })
        }
  
        const active_sessions = await ActiveSession.findOne({
          where: { token: token },
        })
  
        if (!active_sessions) {
          return res.status(401).send({ message: 'Invalid token' })
        }
  
        req.active_sessions = active_sessions
        
        next()
      } catch (error) {
        console.log(error)
        await ActiveSession.destroy({
          where: { token: token },
        })
        
        return res.status(401).json({ error: 'token invalid' })
      }
    }
  
  
  }

module.exports = {
    errorHandler, validateToken
}