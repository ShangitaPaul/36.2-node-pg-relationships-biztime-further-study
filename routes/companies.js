const express = require('express');
const ExpressError = require('../expressError');
const db = require('../db');
const pool = require('../db');

let router = new express.Router();



router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows });
    } catch (e) {
        return next(e);
    }
});
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

router.post('/', async (req, res, next) => {
    try {
        let { name, description } = req.body;

        // SLugify the company code
        let code = slugify(name, { lower: true });

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

// /* PART 1 PUT
// // router.put('/:code', async (req, res, next) => {
// //     try {
// //         let { name, description } = req.body;
// //         let code = req.params.code;

// //         const result = await db.query(
// //             `UPDATE companies 
// //            SET name=$1, description=$2
// //            WHERE code = $3 
// //            RETURNING code, name, description`,
// //             [name, description, code]
// //         );

// //         if (result.rows.length === 0) {
// //             throw new ExpressError(`No such company: ${code}`, 404);
// //         } else {
// //             return res.json({ company: result.rows[0] });
// //         }
// //     } catch (e) {
// //         return next(e);
// //     }
// // }
// // );
// */

router.put ('/:code', async (req, res, next) => {
    try {
        // Get the invoice from the database
        const {id, paid, amount} = req.body;
        const companycode = req.params.code;    
        // Update the invoice in the database
        const result = await db.query(
            `UPDATE invoices
            SET paid=$1
            WHERE id = $2
            RETURNING id, comp_code, amt, paid, add_date, paid_date`,
            [id, paid, amount, companycode]
        );

        // Check if the invoice exists
        if (result.rows.length === 0) {
            throw new ExpressError(`No such invoice: ${id}`, 404);
        }
        // Return the updated invoice
        const updatedInvoice = updatedInvoice.rows[0];

        // Handle the case where the invoice is not paid
        if (paid === false) {
            updatedInvoice.paid_date = null;
        }
        // Return the updated invoice
        return res.json({ invoice: updatedInvoice });
    } catch (e) {
        return next(e);
    }
}
);




// //         // Check if the invoice exists
// //         if (result.rows.length === 0) {
// //             throw new ExpressError(`No such invoice: ${id}`, 404);
// //         } else {
// //             return res.json({ invoice: result.rows[0] });
// //         }
// //         const invoice = result.rows[0];
// //         // Action to update the invoice based on payment status
// //         if (paid === true) {
// //             // Update the date the invoice was paid to the current date
// //             invoice.paid_date = new Date();
// //         } else if (paid === false) {
// //             // If the invoice is not paid, set the paid_date to null
// //             invoice.paid_date = null;
// //         }
// //         else {
// //             invoice.paid_date = null;
// //         }

// //         // Update the invoice in the database
// //         const result = await db.query(
// //             `UPDATE invoices
// //             SET paid_date=$1
// //             WHERE id = $2
// //             RETURNING id, amount, paid, paid_date`,
// //             [invoice.paid_date, id]
// //         );
// //         // Return the updated invoice
// //         return res.json({ invoice: invoice });
// //     } catch (e) {
// //         return next(e);
// //     }
// // }
// // );


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


/* Further Study: Many to Many Relationships
* Inert new values to associatie industries to a specific company
* After fetching the details of a company, the industries associated with the company are also fetched from the database.
* The industries are then included in the company object and returned as a JSON object.
*   The user can then view the company details and the related industries of the selected company when accessing the route.
*/

router.get('/', async (req, res, next) => {
    try {
        let code = req.params.code;

// Fetch company details from the database
        const compResult = await db.query(
            `SELECT * FROM companies WHERE code = $1`,
        );
// Fetch industries associated with the company
        const indResult = await db.query(
            `SELECT industry_code FROM companies_industries WHERE company_code = $1`,
        );
        //  Throw an error if the company does not exist
        if (compResult.rows.length === 0) {
            throw new ExpressError(`No such company: ${code}`, 404);
        }
        // Obtain company details and realted industries
        const company = compResult.rows[0];
        const industries = indResult.rows;
        // Include the associated industries in the company object
        company.industries = industries.map(ind => ind.industry_code);
        // Return the company details with realted industries
        return res.json({ company: company });
    }   catch (e) {
        return next(e);
    }
}
);
