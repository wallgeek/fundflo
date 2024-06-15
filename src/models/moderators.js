module.exports = `CREATE TABLE IF NOT EXISTS moderators (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    min_order_value NUMERIC(15, 2) NOT NULL,
    enterprise_id INT NOT NULL,
    is_final BOOLEAN NOT NULL,
    is_active BOOLEAN NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (enterprise_id) REFERENCES enterprises(id)
)`