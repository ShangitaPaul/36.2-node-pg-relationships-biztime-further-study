\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;

CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

-- --`industries` table
-- CREATE TABLE industries (
--     code text PRIMARY KEY,
--     industry text NOT NULL UNIQUE
-- );
-- --`company_industries` table
-- CREATE TABLE company_industries (
--     comp_code text REFERENCES companies ON DELETE CASCADE,
--     ind_code text REFERENCES industries ON DELETE CASCADE,
--     PRIMARY KEY (comp_code, ind_code)
-- );


-- INSERT INTO industries (code, industry)
--   VALUES ("acc", "Accounting"),
--          ("tech", "Technology");
-- INSERT INTO companies (code, name, description)
--   VALUES ("apple", "Apple", "Maker of OSX.");
-- INSERT INTO company_industries (code, industrycode)
--     VALUES ("apple", "tech");

CREATE TABLE industries (
    code VARCHAR(10) PRIMARY KEY,
    industry VARCHAR(100) NOT NULL
);

CREATE TABLE company_industries (
    company_id INT
    industry_code VARCHAR(10),
    FOREIGN KEY (company_id) REFERENCES companies (id),
    FOREIGN KEY (industry_code) REFERENCES industries (code),
    PRIMARY KEY (company_id, industry_code)
);

-- Sample data
INSERT INTO industries (code, industry)
  VALUES ('tech', 'Technology'),
         ('acc', 'Accounting');

INSERT INTO company_industries (company_id, industry_code) 
  VALUES (1, 'tech'),
         (2, 'acc');
--- ie; Apple, tech, HRBlock, acc
