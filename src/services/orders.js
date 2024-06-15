const DB = require("../utils/db")
const { GeneralError } = require("../errors/custom")
const ErrorMessages = require("../errors/messages")
const StatusCodes = require("../utils/status-codes")

module.exports.order = async function(user_id, item, quantity) {
    // Get item id from item name and calculate total amount
    const itemData = await DB.query(`
        SELECT id, unit_amount, enterprise_id 
        FROM items 
        WHERE name = $1`, [item]
    )
    const itemDataRows = itemData.rows
    
    if (itemDataRows.length === 0) throw new GeneralError(ErrorMessages.ITEM_NOT_FOUND, StatusCodes.NOT_FOUND)

    const item_id = itemDataRows[0].id
    const item_unit_amount = parseFloat(itemDataRows[0].unit_amount)
    const item_enterprise_id = itemDataRows[0].enterprise_id

    const total_amount = item_unit_amount * quantity

    // Search for appropriate moderator for this amount
    const moderatorRes = await DB.query(`
        (SELECT id 
        FROM moderators 
        WHERE enterprise_id = $1 AND (min_order_value <= $2) AND is_final = $4
        ORDER BY min_order_value DESC 
        LIMIT 1)
        UNION
        (SELECT id 
        FROM moderators 
        WHERE enterprise_id = $1 AND is_final = $3 AND min_order_value <= $2)`, 
        [item_enterprise_id, total_amount, true, false]
    )

    const moderatorDataRows = moderatorRes.rows

    let status = "PENDING"

    if (moderatorDataRows.length === 0) status = "SUCCESSFUL"

    // Start transaction
    await DB.query("BEGIN")

    const orderRes = await DB.query(`
        INSERT INTO orders 
        (user_id, item_id, quantity, amount, status, time) 
        VALUES 
        ($1, $2, $3, $4, $5, $6) RETURNING id`, 
        [user_id, item_id, quantity, total_amount, status, new Date()]
    )

    const order_id = orderRes.rows[0].id

    for (let moderator of moderatorDataRows) {
        await DB.query(`
            INSERT INTO approvals 
            (order_id, moderator_id, time) 
            VALUES 
            ($1, $2, $3)`, 
            [order_id, moderator.id, new Date()]
        )
    }

    try {
        await DB.query(`COMMIT`)
    } catch (err) {
        await DB.query('ROLLBACK');
        throw err; // Re-throw the error after rollback
    }
}