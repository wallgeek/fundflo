const Users = require("./users")
const Enterprises = require("./enterprises")
const Items = require("./items")
const Moderators = require("./moderators")
const Orders = require("./orders")
const Approvals = require("./approvals")
const DB = require("../utils/db")

const createTables = async function(){
    await DB.query(Users)
    await DB.query(Enterprises)
    await DB.query(Items)
    await DB.query(Moderators)
    await DB.query(Orders)
    await DB.query(Approvals)
}

const dropTables = async function() {
    return await DB.query(`
        DROP TABLE IF EXISTS approvals;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS items;
        DROP TABLE IF EXISTS moderators;
        DROP TABLE IF EXISTS enterprises;
        DROP TABLE IF EXISTS users;`
    )
}

const Data = {
    "users": [
        {
            "name": "client"
        },
        {
            "name": "L1"
        },
        {
            "name": "L2"
        },
        {
            "name": "LFinal"
        }
    ],
    "enterprises": [{
        "name": "Touchwood enterprise"
    }],
    "moderators": [
        {
            "user": "L1",
            "minOrderValue": 200000,
            "enterprise": "Touchwood enterprise",
            "isFinal": false,
            "isActive": true
        },
        {
            "user": "L2",
            "minOrderValue": 300000,
            "enterprise": "Touchwood enterprise",
            "isFinal": false,
            "isActive": true
        },
        {
            "user": "LFinal",
            "minOrderValue": 200000,
            "enterprise": "Touchwood enterprise",
            "isFinal": true,
            "isActive": true
        }
    ],
    "items": [
        {
            "name": "Wood",
            "enterprise": "Touchwood enterprise",
            "unitAmount": 100000
        }
    ]
}

const fillData = async function () {
    const { users, enterprises, moderators, items } = Data

    for (let user of users) {
        const res = await DB.query(
            'INSERT INTO users (name) VALUES ($1) RETURNING id',
            [user.name]
        );
        user.id = res.rows[0].id;
    }

    await DB.query('COMMIT');
    console.log('User Data inserted successfully');

    // Insert enterprise
    for (let enterprise of enterprises) {
        const res = await DB.query(
            'INSERT INTO enterprises (name) VALUES ($1) RETURNING id',
            [enterprise.name]
        );
        enterprise.id = res.rows[0].id;
    }

    await DB.query('COMMIT');
    console.log('Enterprise Data inserted successfully');

    // Insert moderators
    for (let moderator of moderators) {
        const userRes = await DB.query(
            'SELECT id FROM users WHERE name = $1',
            [moderator.user]
        );
        const userId = userRes.rows[0].id;

        const enterpriseRes = await DB.query(
            'SELECT id FROM enterprises WHERE name = $1',
            [moderator.enterprise]
        );
        const enterpriseId = enterpriseRes.rows[0].id;

        await DB.query(
            'INSERT INTO moderators (user_id, min_order_value, enterprise_id, is_final, is_active) VALUES ($1, $2, $3, $4, $5)',
            [userId, moderator.minOrderValue, enterpriseId, moderator.isFinal, moderator.isActive]
        );
    }
    
    await DB.query('COMMIT');
    console.log('Moderator Data inserted successfully');

    // Insert items
    for (let item of items) {
        const enterpriseRes = await DB.query(
            'SELECT id FROM enterprises WHERE name = $1',
            [item.enterprise]
        );
        const enterpriseId = enterpriseRes.rows[0].id;

        await DB.query(
            'INSERT INTO items (name, description, enterprise_id, unit_amount) VALUES ($1, $2, $3, $4)',
            [item.name, '', enterpriseId, item.unitAmount]
        );
    }

    await DB.query('COMMIT');
    console.log('Item Data inserted successfully');
}

;(async () => {
    await DB.connect()

    await dropTables()
    await createTables()
    // await fillData()

    process.exit(1)
})()
