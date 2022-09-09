const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const { response } = require('express');

router.get('/', (req, res, next) => {
    // res.status(200).send({
    //     mensagem: 'Usando o GET dentro da rota de usuarios'
    // });
    mysql.getConnection((error, conn) => {

    if (error) {
        return res.status(500).send({error: error});
    }
    conn.query(
        'SELECT * FROM Internet',
        (error, resultado, fields) => {
            conn.release();
        if (error) {
            return res.status(500).send({
                error: error
            });
            
        }
        return res.status(200).send({
            response: resultado
        });
    }
    )});
});
    
module.exports = router;