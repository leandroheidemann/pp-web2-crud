
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const { omit } = require('lodash');
const { v4: uuid } = require('uuid');

const app = express();

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'pp-web2-crud'
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/users', (req, res) => {
    var userFindAllQuery = 'SELECT * FROM users';

    if (req.query) {
        userFindAllQuery += ' WHERE 1 = 1';

        if (!!req.query.id) {
            userFindAllQuery += ' AND id = ' + req.query.id;
        }

        if (!!req.query.name) {
            // create where with ignore case
            userFindAllQuery += ' AND LOWER(name) LIKE LOWER(\'%' + req.query.name + '%\')';
        }

        if (!!req.query.email) {
            userFindAllQuery += ' AND LOWER(email) LIKE LOWER(\'%' + req.query.email + '%\')';
        }
    }

    userFindAllQuery += ' ORDER BY id ASC';

    pool.query(userFindAllQuery, (error, results) => {
        if (error) {
            throw error;
        }

        const users = results.rows.map(user => omit(user, 'password'));

        res.status(200).json(users);
    });
});

app.get('/users/:id', (req, res) => {
    pool.query('SELECT * FROM users WHERE id = $1', [req.params.id], (error, results) => {
        if (error) {
            throw error;
        }

        const user = results.rows[0];

        if (!user) {
            res.status(404).send('Usuário não encontrado!');
        }

        res.status(200).json(omit(user, 'password'));
    });
});

app.post('/users', (req, res) => {
    const { name, email, username } = req.body;

    pool.query('INSERT INTO users (id, name, email, username) VALUES ($1, $2, $3, $4)', [uuid() ,name, email, username], (error, results) => {
        if (error) {
            throw error;
        }

        res.status(201).send('Usuário adicionado com sucesso!');
    });
});

app.put('/users/:id', (req, res) => {
    const { name, email, username } = req.body;

    pool.query('UPDATE users SET name = $1, email = $2, username = $3 WHERE id = $4', [name, email, username, req.params.id], (error, results) => {
        if (error) {
            throw error;
        }

        res.status(200).send('Usuário alterado com sucesso!');
    });
});

app.delete('/users/:id', (req, res) => {
    pool.query('DELETE FROM users WHERE id = $1', [req.params.id], (error, results) => {
        if (error) {
            throw error;
        }

        res.status(200).send('Usuário removido com sucesso!');
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});