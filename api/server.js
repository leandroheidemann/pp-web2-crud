
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

        if (!!req.query.username) {
            userFindAllQuery += ' AND LOWER(username) LIKE LOWER(\'%' + req.query.username + '%\')';
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
            res.status(404).json({ message: 'Usuário não encontrado!' });
        }

        res.status(200).json(omit(user, 'password'));
    });
});

app.post('/users', (req, res) => {
    const { name, email, username } = req.body;

    pool.query('INSERT INTO users (id, name, email, username) VALUES ($1, $2, $3, $4) RETURNING *', [uuid(), name, email, username], (error, results) => {
        if (error) {
            throw error;
        }

        res.status(201).json(results.rows[0]);
    });
});

app.put('/users/:id', (req, res) => {
    const { name, email, username } = req.body;

    pool.query('UPDATE users SET name = $1, email = $2, username = $3 WHERE id = $4', [name, email, username, req.params.id], (error, results) => {
        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Usuário alterado com sucesso!' });
    });
});

app.delete('/users/:id', (req, res) => {
    pool.query('DELETE FROM users WHERE id = $1', [req.params.id], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Erro ao remover usuário!', error: error });
            return;
        }

        res.status(200).json({ message: 'Usuário removido com sucesso!' });
    });
});

app.get('/cars', (req, res) => {
    var carFindAllQuery = 'SELECT c.id, c.model, c.color, c.year, u.name as "owner" FROM cars c INNER JOIN users u ON c.user_id = u.id ';

    if (req.query) {
        carFindAllQuery += ' WHERE 1 = 1';

        if (!!req.query.id) {
            carFindAllQuery += ' AND c.id = ' + req.query.id;
        }

        if (!!req.query.brand) {
            carFindAllQuery += ' AND LOWER(c.brand) LIKE LOWER(\'%' + req.query.brand + '%\')';
        }

        if (!!req.query.model) {
            carFindAllQuery += ' AND LOWER(c.model) LIKE LOWER(\'%' + req.query.model + '%\')';
        }

        if (!!req.query.year) {
            carFindAllQuery += ' AND c.year = ' + req.query.year;
        }

        if (!!req.query.ownerName) {
            carFindAllQuery += ' AND LOWER(u.name) LIKE LOWER(\'%' + req.query.ownerName + '%\')';
        }
    }

    carFindAllQuery += ' ORDER BY c.id ASC';

    pool.query(carFindAllQuery, (error, results) => {
        if (error) {
            throw error;
        }

        const cars = results.rows;

        res.status(200).json(cars);
    });
});

app.get('/cars/:id', (req, res) => {
    pool.query('SELECT * FROM cars WHERE id = $1', [req.params.id], (error, results) => {
        if (error) {
            throw error;
        }

        const car = results.rows[0];

        if (!car) {
            res.status(404).json({ message: 'Carro não encontrado!' });
        }

        res.status(200).json(car);
    });
});

app.post('/cars', (req, res) => {
    const { model, color, year, user_id } = req.body;

    pool.query('INSERT INTO cars (id, model, color, year, user_id) VALUES ($1, $2, $3, $4, $5)', [uuid(), model, color, year, user_id], (error, results) => {
        if (error) {
            throw error;
        }

        res.status(201).json({ message: 'Carro adicionado com sucesso!' });
    });
});

app.put('/cars/:id', (req, res) => {
    const { model, color, year, user_id } = req.body;

    pool.query('UPDATE cars SET model = $1, color = $2, year = $3, user_id = $4 WHERE id = $5', [model, color, year, user_id, req.params.id], (error, results) => {
        if (error) {
            throw error;
        }

        res.status(200).json({ message: 'Carro alterado com sucesso!' });
    });
});

app.delete('/cars/:id', (req, res) => {
    pool.query('DELETE FROM cars WHERE id = $1', [req.params.id], (error, results) => {
        if (error) {
            res.status(500).json({ message: 'Erro ao remover carro!', error: error });
        }

        res.status(200).json({ message: 'Carro removido com sucesso!' });
    });
});

app.listen(3000, () => {
    console.log('Servidor iniciado na porta 3000');
});