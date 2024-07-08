const errorHandler = (error, request, response, next) => {
    console.error(error.name)
  
    if (error.name === 'SyntaxError') {
      return response.status(400).send({ error: 'malformatted input' })
    } 
    else if (error.name === 'SequelizeValidationError') {
      return response.status(400).json({
        error: 'malformatted input'
      })
    }
  
    next(error)
  }

module.exports = {
    errorHandler
}