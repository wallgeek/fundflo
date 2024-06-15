const { order } = require("../../src/services/orders")
const DB = require("../../src/utils/db")
const { GeneralError } = require("../../src/errors/custom")

jest.mock("../../src/utils/db")

describe("Service Orders", function(){
    const user_id = 1
    const item = "blah"
    const quantity = 10

    beforeEach(() => {
        DB.query.mockClear()
    })

    test("Should throw General Error if Item is not found", async function(){
        DB.query.mockResolvedValueOnce({ rows: []})

        expect(order(user_id, item, quantity)).rejects.toThrow(GeneralError)
    })
})