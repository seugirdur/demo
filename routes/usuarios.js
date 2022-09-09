const express = require('express');
const router = express.Router();
const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { response } = require('express');

// router.get('/', (req, res, next) => {
//     // res.status(200).send({
//     //     mensagem: 'Usando o GET dentro da rota de usuarios'
//     // });
//     mysql.getConnection((error, conn) => {

//     if (error) {
//         return res.status(500).send({error: error});
//     }
//     conn.query(
//         'SELECT * FROM funcionarios',
//         (error, resultado, fields) => {
//             conn.release();
//         if (error) {
//             return res.status(500).send({
//                 error: error
//             });
            
//         }
//         return res.status(200).send({
//             response: resultado
//         });
//     }
//     )});
// });

router.post('/cadastro', (req, res, next) => {

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
        
        conn.query("SELECT * FROM funcionarios WHERE chave = ?",
        [req.body.chave], (error, resultado) => {


            if (error) {
                return res.status(500).send({error: error});
                
            }
            if (resultado.length > 0) {
                res.status(200).send({
                    mensagem: "Usuário já cadastrado",
                    situation: 0
                })
            } else {

                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if (errBcrypt) {
                        return res.status(500).send({
                            error: errBcrypt
                        });
                    }
        
                    conn.query(
                        `INSERT INTO funcionarios 
                            (nome, email, tel, dataNasc, chave, senha) 
                        values 
                            (?,?,?,?,?,?)`,
                        [req.body.nome,
                        req.body.email,
                        req.body.tel,
                        req.body.dataNasc,
                        req.body.chave,
                        hash],
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
                                situation: 1
                            });
                        }
                    );
        
                });
                
            }
            
        })

        
        

    });

    
});

router.get('/:chave', (req, res, next) => {
    mysql.getConnection((error, conn) => {

        if (error) {
            return res.status(500).send({error: error});
        }
        conn.query(
            'SELECT * FROM funcionarios WHERE chave = ?;',
            [req.params.chave],
            (error, resultado, fields) => {
                conn.release();
            if (error) {
                return res.status(500).send({
                    error: error
                });
                
            }

            if (resultado.length == 0) {
                return res.status(404).send ({
                    mensagem: "Usuario não encontrado"
                })
                
            }
            return res.status(200).send({
                response: resultado
            });
        }
        )});
    });

    router.post('/login', (req, res, next) => {
        mysql.getConnection((error, conn) => {
            if (error) {
                return res.status(500).send({
                    error: error
                })
            }
            const query = `SELECT * FROM funcionarios WHERE chave = ?;`;
            conn.query(query, [req.body.chave], (error, resultado, fields) => {
                conn.release();
                

                
                if (error) {
                    return res.status(500).send({
                            error: error
                    });
                }

                if (resultado.length < 1 ) {
                    return res.status(200).send({
                        //error: "Falha na autenticação",
                        //situation: 0,
                        "error":true,
                        "message":"Falha na autenticação",
                        
                    });
                } 

                

                //bcrypt.compare(req.body.senha, resultado[0].senha, (err, resultado) => {
                    // if (err) {
                    //     return res.status(200).send({
                    //         // error: "Falha na autenticação",
                    //         //situation: 0,
                    //         "error":true,
                    //         "message":"Falha no login",
                    //     });
                    // }
                    if (resultado) {
                        let token = jwt.sign({
                            batata:"batata"
                        }, 
                        process.env.JWT_KEY
                        )

                        
                            resultado.map(prod => {
                                return {
                                    "nombre": prod.nome,
                                }
                            })
                        
                        
                        return res.status(200).send({
                            // mensagem:"Autenticado com sucesso",
                            //situation:1,
                            "error":null,
                            "message":"Login feito com sucesso",
                            // "nome": resultado.nome,
                            // "email": resultado.email,
                            // "tel": resultado.tel,
                            // "dataNasc": resultado.dataNasc,
                            // "chave": req.body.chave,
                            // response: 
                            //"user":req.body.chave
                            "UserAPI":resultado
                            
                        });
                    }

                    return res.status(200).send({
                        // error: "Falha na autenticação",
                         //situation: 0,
                        "error":true,
                            "message":"Falha no Login, tente novamente",
                    });
                //})
            });

        });
    });


    
module.exports = router;