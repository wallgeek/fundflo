module.exports = `CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    enterprise_id INT NOT NULL,
    unit_amount NUMERIC(15, 2) NOT NULL,
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
)`