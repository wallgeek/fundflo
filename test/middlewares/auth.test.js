const DB = require("../../src/utils/db")
const Auth = require("../../src/middlewares/auth");
const StatusCodes = require("../../src/utils/status-codes")
const { GeneralError } = require("../../src/errors/custom")

jest.mock('../../src/utils/db');

describe("Auth", function(){
    let req, res, next
    let unauthorizedCode = StatusCodes.UNAUTHORIZED

    beforeEach(() => {
        req = {headers: {}}
        next = jest.fn()
    })

    test(`Should call with General error if Authorization in headers is missing`, async function(){
        await Auth(req, res, next)
        
        expect(next).toHaveBeenCalledWith(expect.any(GeneralError))
        expect(next.mock.calls[0][0].statusCode).toBe(unauthorizedCode)
    })

    test(`Should call with General Error if user is not found`, async function(){
        req.headers["authorization"] = "blah"
        DB.query.mockResolvedValueOnce({ rows: [] })
        
        await Auth(req, res, next)
        
        expect(next).toHaveBeenCalledWith(expect.any(GeneralError))
        expect(next.mock.calls[0][0].statusCode).toBe(unauthorizedCode)
    })

    test('should set req.user and call next if user is found', async function(){
        req.headers["authorization"] = "testuser";
        DB.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

        await Auth(req, res, next)

        expect(req.user).toEqual({ id: 1 })
        expect(next).toHaveBeenCalled()
        expect(next).not.toHaveBeenCalledWith(expect.any(GeneralError))
    })
})