/* Routes for retrieving all industries, adding a new industry, associating an industry with a company, and retrieving companies associated with a specific industry. 
*/

const express = require('express'); 
// Import the ExpressError for customized error handeling via middleware
const ExpressError = require('../expressError'); 
// import database interaction module
const db = require('../db'); 

// Create a new router instance
let router = new express.Router();


/* Route hadlers to handle the following routes:*/


// GET request to retrieve all industries
router.get('/', async (req, res, next) => {
    try {
        // Get all industries from the database
        const results = await db.query(`SELECT * FROM industries`);
        // Return the industries list in JSON format
        return res.json({ industries: results.rows });
    } catch (e) {
        // Pass the error to the error handling middleware
        return next(e);
    }
});

// POST request to add a new industry
router.post('/', async (req, res, next) => {
    try {
        // Get the name from the request body
        let { name } = req.body;
        // Add the new industry to the database
        const result = await db.query(
            `INSERT INTO industries (name) 
           VALUES ($1) 
           RETURNING name`,
            [name]
        );
        // Return the new industry in JSON format
        return res.status(201).json({ industry: result.rows[0] });
    } catch (e) {
        // Pass the error to the error handling middleware
        return next(e);
    }
});

// POST request to add a new industry along with a company
router.post('/:industry', async (req, res, next) => {
    try {
        // Get the industry code abd industry name from the request body
        let { code, industry } = req.body;
// Add the new industry to the database
        const result = await db.query(
            `INSERT INTO industries_companies (industry_name, company_code) 
           VALUES ($1, $2) 
           RETURNING industry_name, company_code`,
            [code, industry]
        );
    
        // Return the new industry in JSON format
        return res.status(201).json({ industry: result.rows[0] });
    } catch (e) {
        // Pass the error to the error handling middleware
        return next(e);
    }
}
);

// Retrieve all companies in a specific industry
router.get('/:industry', async (req, res, next) => {
    try {
        // Get the industry name from the request parameters
        let industryCode = req.params.industryCode;
// Get all companies in the industry from the database
        const results = await db.query(
            `SELECT c.code, c.name, c.description 
           FROM companies AS c
           JOIN industries_companies AS ic
           ON c.code = ic.company_code
           WHERE ic.industry_code = $1`,
            [industryCode]
        );
        // Return the companies list in JSON format
        return res.json({ companies: results.rows });
    }
    catch (e) {
        // Pass the error to the error handling middleware
        return next(e);
    }
}
);
 module.exports = router;


// router.post('/:industry', async (req, res, next) => {
//     try {
//         // Get the industry name from the request parameters
//         let industry = req.params.industry;
//         // Get the company code from the request body
//         let { code } = req.body;
//         // Add the new industry to the database
//         const result = await db.query(
//             `INSERT INTO industries_companies (industry_name, company_code) 
//            VALUES ($1, $2) 
//            RETURNING industry_name, company_code`,
//             [industry, code]
//         );
//         // Return the new industry in JSON format
//         return res.status(201).json({ industry: result.rows[0] });
//     } catch (e) {
//         // Pass the error to the error handling middleware
//         return next(e);
//     }
// });