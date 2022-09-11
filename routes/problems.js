const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const { response } = require('express');

router.get('/', (req, res, next) => {

    mysql.getConnection((error, conn) => {
        
    if (error) {
        return res.status(500).send({error: error});
    }
    conn.query(
        'SELECT * FROM Internet',
        (error, resultado, fields) => {
            conn.release();
            result = resultado.map(prod => {
                return {
                    "nombre": prod.idTitulo,
                }
            })
        if (error) {
            return res.status(500).send({
                error: error
            });
            
        }
        return res.status(200).json(resultado)
    }
    )});
});
    
module.exports = router;