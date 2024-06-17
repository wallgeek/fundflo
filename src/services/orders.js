const DB = require("../utils/db")
const { GeneralError } = require("../errors/custom")
const ErrorMessages = require("../errors/messages")
const statusCodes = require("../utils/status-codes")

const GetModeratorId = async function(user_id){
    const result = await DB.query(`
        SELECT id
        FROM moderators
        WHERE user_id = $1`, 
        [user_id]
    )

    if(result.rows.length === 0) throw new GeneralError(ErrorMessages.USER_NOT_MODERATOR, StatusCodes.UNAUTHORIZED)
    else return result.rows[0].id
}

const ApprovalExist = async function(moderator_id, order_id){
    const approvalRes = await DB.query(`
        SELECT count(*) as count
        FROM approvals
        WHERE order_id = $1 AND moderator_id = $2`,
        [order_id, moderator_id]    
    )
    
    if(approvalRes.rows[0].count == 0) throw new GeneralError(ErrorMessages.NO_APPROVAL_REQUEST, StatusCodes.NOT_FOUND)

    return true
}

const GetOrderStatus = async function(order_id){
    const orderRes = await DB.query(`
        SELECT status 
        FROM orders 
        WHERE id = $1`, 
        [order_id]
    )

    if(orderRes.rows.length === 0) throw new GeneralError(ErrorMessages.ORDER_DOES_NOT_EXIST, statusCodes.NOT_FOUND)
    else return orderRes.rows[0].status
}

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

module.exports.approve = async function(user_id, order_id) {
    // get moderator id from the user id
    const moderator_id = await GetModeratorId(user_id)
        
    await ApprovalExist(moderator_id, order_id)

    const status = await GetOrderStatus(order_id)

    if (status !== "PENDING" && status !== "SUCCESSFUL" ) return false

    await DB.query(`
        UPDATE orders 
        SET status = $1 
        WHERE id = $2`, 
        ["APPROVED", order_id]
    )

    return true
}

module.exports.reject = async function(user_id, order_id) {
    // get moderator id from the user id
    const moderator_id = await GetModeratorId(user_id)
        
    await ApprovalExist(moderator_id, order_id)

    const status = await GetOrderStatus(order_id)

    if (status !== "PENDING" && status !== "SUCCESSFUL" ) return false

    await DB.query(`
        UPDATE orders 
        SET status = $1 
        WHERE id = $2`, 
        ["REJECTED", order_id]
    )

    return true
}

module.exports.get = async function(user_id, order_id) {
    const orderRes = await DB.query(`
    SELECT
        o.id AS order_id,
        o.amount,
        o.time,
        i.name AS item_name,
        u.name as user_name
    FROM
        orders o
    JOIN
        items i ON o.item_id = i.id
    JOIN
        users u ON o.user_id = u.id
    WHERE o.user_id = $1 AND o.id = $2`, 
    [user_id, order_id]
    )

    if(orderRes.rows.length === 0) throw new GeneralError(ErrorMessages.ORDER_DOES_NOT_EXIST, statusCodes.NOT_FOUND)
    else return orderRes.rows[0]
}