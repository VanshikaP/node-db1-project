const express = require('express');

// db access using knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
    db.select().from('accounts')
    .then(accounts => {
        res.json(accounts);
    })
    .catch(err => {
        res.status(500).json({ message: 'Error', err});
    });
});

router.get('/:id', (req, res) => {
    db('accounts')
        .where({ id: req.params.id})
        .first()
        .then(account => {
            if (account) {
                res.status(200).json({ data: account });
            } else {
                res.status(404).json({ message: 'account not found'});
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error', err});
        })
});

// Stretch - Limit number of Accounts

router.get('/limit/:limit', (req, res) => {
    db('accounts')
        .limit(req.params.limit)
        .then(accounts => {
            if (accounts) {
                res.status(200).json(accounts)
            } else {
                res.status(404).json({ message: 'No accounts found' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error', err });
        });
});

// Sorted Accounts
router.get('/sortBy/:field/:order', (req, res) => {
    db('accounts')
        .orderBy(req.params.field, req.params.order)
        .then(accounts => {
            if (accounts) {
                res.status(200).json(accounts)
            } else {
                res.status(404).json({ message: 'No accounts found' })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'Error', err });
        });
})

// Search Account Names
// router.get('/') 


router.post('/', (req, res) => {
    const accountData = req.body;
    db('accounts')
        .insert(accountData)
        .then(account => {
            res.status(200).json({newAccountID: account});
        })
        .catch(err => {
            res.status(500).json({ message: 'Error', err});
        })
});

router.put('/:id', (req, res) => {
    const newData = req.body;
    db('accounts')
        .where({ id: req.params.id })
        .first()
        .update(newData)
        .then(account => {
            if (account) {
                res.status(200).json({ dataUpdated: account });
            } else {
                res.status(404).json({ message: 'account not found'});
            }
        }).catch(err => {
            res.status(500).json({ message: 'Error', err});
        })
});

router.delete('/:id', (req, res) => {
    db('accounts')
    .where({ id: req.params.id })
    .delete()
    .then(count => {
        if (count > 0) {
            res.status(200).json({ message: 'record deleted successfully' });
        } else {
            res.status(200).json({ message: 'account id not found' });
        }
    })
    .catch(err => {
        res.status(500).json({ message: 'Error', err });
    })
});

module.exports = router;