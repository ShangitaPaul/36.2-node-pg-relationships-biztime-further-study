const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');

// Rou for handling company-related routes
let router = new express.Router();

// Route for receiving a list of all companies

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows });
    } catch (e) {
        return next(e);
    }
}
);  

// Route for receiving a single company by code
router.get('/:code', async (req, res, next) => {
    try {
        let code = req.params.code;
        const compResult = await db.query(
            `SELECT * FROM companies WHERE code = $1`,
            [code]
        );
        const invResult = await db.query(
            `SELECT id FROM invoices WHERE comp_code = $1`,
            [code]
        );

        if (compResult.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        }

        const company = compResult.rows[0];
        const invoices = invResult.rows;

        company.invoices = invoices.map(inv => inv.id);

        return res.json({ company: company });
    } catch (e) {
        return next(e);
    }
}
);
// Route for adding a new company
router.post('/', async (req, res, next) => {
    try {
        let { code, name, description } = req.body;

        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
           VALUES ($1, $2, $3) 
           RETURNING code, name, description`,
            [code, name, description]
        );

        return res.status(201).json({ company: result.rows[0] });
    } catch (e) {
        return next(e);
    }
}
);
// Route for updating a company
router.put('/:code', async (req, res, next) => {
    try {
        let { name, description } = req.body;
        let code = req.params.code;

        const result = await db.query(
            `UPDATE companies 
           SET name=$1, description=$2
           WHERE code = $3
           RETURNING code, name, description`,
            [name, description, code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        } else {
            return res.json({ company: result.rows[0] });
        }
    } catch (e) {
        return next(e);
    }
}
);
// Route for deleting a company

router.delete('/:code', async (req, res, next) => {
    try {
        let code = req.params.code;
        const result = await db.query(
            `DELETE FROM companies
           WHERE code = $1
           RETURNING code`,
            [code]
        );

        if (result.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        } else {
            return res.json({ status: "deleted" });
        }
    } catch (e) {
        return next(e);
    }
}
);
module.exports = router;