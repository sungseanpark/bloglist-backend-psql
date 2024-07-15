const router = require('express').Router()
const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')


router.get('/', async (req, res) => {
    try {
        const authors = await Blog.findAll({
            attributes: [
                'author',
                [sequelize.fn('count', sequelize.col('id')), 'articles'],
                [sequelize.fn('sum', sequelize.col('likes')), 'likes']
            ],
            group: 'author',
            order: [[sequelize.fn('sum', sequelize.col('likes')), 'DESC']], // Order by likes in descending order
        });

        const result = authors.map(author => ({
            author: author.getDataValue('author'),
            articles: author.getDataValue('articles').toString(),
            likes: author.getDataValue('likes').toString()
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching authors:', error);
        res.status(500).send({ error: 'Internal server error' });
    }
});

module.exports = router