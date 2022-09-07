const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;

router.get('/', (req, res, next) => {
    // res.status(200).send({
    //     mensagem: 'Usando o GET dentro da rota de usuarios'
    // });
    mysql.getConnection((error, conn) => {

    if (error) {
        return res.status(500).send({error: error});
    }
    conn.query(
        'SELECT * FROM funcionarios',
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

router.post('/', (req, res, next) => {

    const usuario = {
        nome: req.body.nome,
        email: req.body.email,
        tel: req.body.tel,
        dataNasc: req.body.dataNasc,
        chave: req.body.chave,
        senha: req.body.senha
    };

    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({error: error});
        }
        conn.query(
            'INSERT INTO funcionarios (nome, email, tel, dataNasc, chave, senha) values (?,?,?,?,?,?)',
            [req.body.nome,
            req.body.email,
            req.body.tel,
            req.body.dataNasc,
            req.body.chave,
            req.body.senha],
            (error, resultado, field) => {
                conn.release();


                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    });
                    
                }
                res.status(201).send({
                    mensagem: 'Usuario cadastrado com sucesso',
                    usuarioCriado: resultado.insertId
                });
            }
        );

    });

    
});

router.get('/:id_usuario', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM funcionarios WHERE id = ?;',
            [req.params.id_usuario],
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