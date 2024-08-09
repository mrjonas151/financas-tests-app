const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const secret = 'Segredo!'; //segredo deve estar no .env
const ValidationError = require('../errors/ValidationError');
const express = require('express');

module.exports = (app) => {
    const router = express.Router();

    router.post('/signin',  (req, res, next) => {
        app.services.user.findOne({ mail: req.body.mail })
    .then((user) => {
        if (!user) throw new ValidationError('Usuário ou senha invalido');

        if (bcrypt.compareSync(req.body.passwd, user.passwd)) {
            const payload = { id: user.id, name: user.name, mail: user.mail };
            const token = jwt.encode(payload, secret);
            return res.status(200).json({
                id: user.id,
                name: user.name,
                mail: user.mail,
                token
            });
        } else throw new ValidationError('Usuário ou senha invalido');

    })
    .catch(err => {
    if (err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
    }
    next(err);
});
});   

    router.post('/signup', async (req, res, next) => {
        try{
            const result = await app.services.user.save(req.body);
            return res.status(201).json(result[0]);
        }catch(err){
            return next(err);
        }
    });

    return router;
}