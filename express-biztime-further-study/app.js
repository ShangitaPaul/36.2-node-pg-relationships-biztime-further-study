/** BizTime express application. */

// Import modules
const slugify = require("slugify");
const express = require("express");


const ExpressError = require("./expressError")
const companiesRoutes = require("./routes/companies");
const invoicesRoutes = require("./routes/invoices");
const industriesRoutes = require("./routes/industries");

// Create express app
const app = express();
// Middleware to parse request body in JSON format
app.use(express.json());
// Routes for companies and invoices and industries
app.use("/companies", companiesRoutes);
app.use("/invoices", invoicesRoutes);
app.use("/industries", industriesRoutes);

/** 404 handler */

// Middleware to handle 404 errors
// If no other route is matched, this will give a 404 error
  // This creates a new ExpressError with a 404 status and passes it to the next function
app.use(function(req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */
// Middleware to handle all errors
// If an error is passed to next, this will return a JSON error message; otherwise, it will return a 500 status error
app.use((err, req, res, next) => {
  res.status(err.status || 500);

  return res.json({
    error: err,
    message: err.message
  });
});



module.exports = app;
