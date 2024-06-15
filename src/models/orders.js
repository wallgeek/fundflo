module.exports = `CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    item_id INT NOT NULL,
    quantity INT NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED', 'SUCCESSFUL')) NOT NULL,
    time TIMESTAMP NOT NULL,
    FOREIGN KEY (item_id) REFERENCES items(id)
)`