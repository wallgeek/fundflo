module.exports = `CREATE TABLE IF NOT EXISTS approvals (
    order_id INT NOT NULL,
    moderator_id INT NOT NULL,
    time TIMESTAMP NOT NULL,
    PRIMARY KEY (order_id, moderator_id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (moderator_id) REFERENCES moderators(id)
)`