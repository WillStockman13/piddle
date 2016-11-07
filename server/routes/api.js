const express = require('express');
const apiHandler = require('../handlers/apiHandler');
const authHandler = require('../handlers/authHandler');

const router = express.Router(); // eslint-disable-line


/**
 * @api {get} /api/bill/:id Retrieve a bill
 * @apiName GetBill
 * @apiGroup Bill
 *
 * @apiPermission user
 *
 * @apiHeader (Authroization) {string} authorization JWT generated by
 * the user login preceded by the string 'JWT'
 *
 * @apiHeaderExample {json} Header-Example
 * {
 *  "authorization": "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI..."
 * }
 *
 * @apiParam (Path) {string} shortId The short id of the bill.
 *
 * @apiSuccess (200) {Object} data Data associated with the bill.
 * @apiSuccess (200) {string} data.shortId Short id associated with the bill.
 * @apiSuccess (200) {string} data.description Description of the bill.
 * @apiSuccess (200) {number} data.tax Tax in local currency.
 * @apiSuccess (200) {number} data.tip Tip in local currency.
 * @apiSuccess (200) {Object[]} data.items Items on the bill.
 * @apiSuccess (200) {number} data.items.id The id of the item.
 * @apiSuccess (200) {string} data.items.description Description of the item.
 * @apiSuccess (200) {number} data.items.price Price of the item in local currency.
 * @apiSuccess (200) {boolean} data.items.claimed True if a debtor has claimed the item.
 * @apiSuccess (200) {boolean} data.items.paid True if the item has
 * been paid for (reserved for future use).
 * @apiSuccess (200) {Object} data.items.debtor Person responsible for paying for the item.
 * @apiSuccess (200) {string} data.items.debtor.emailAddress The email address of the debtor.
 * @apiSuccess (200) {string} data.items.debtor.displayName Name of the debtor to display.
 * @apiSuccess (200) {Object} data.payer The payer of the bill; presumably who
 * created the bill in the app.
 * @apiSuccess (200) {string} data.payer.emailAddress Email address of the payer.
 * @apiSuccess (200) {string} data.payer.displayName Name of the payer to display.
 * @apiSuccess (200) {string} data.payer.squareId SquareCash www.cash.me 'cashtag' of the payer
 * @apiSuccess (200) {string} data.payer.paypalId PayPal paypal.me id of the payer.
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *   data: {
 *     shortId: "s5y26",
 *     description: "Tu Lan lunch",
 *     tax: 2.46,
 *     tip: 9.50,
 *     items: [
 *       {
 *         id: 45,
 *         description: "#27 Dragon Roll",
 *         price: 10.99,
 *         claimed: true,
 *         debtor: {
 *           emailAddress: "charding@gmail.com",
 *           displayName: "Carl Harding"
 *         }
 *       },
 *       {
 *         id: 89,
 *         description: '#8 Curry Rice',
 *         price: 6.50,
 *         claimed: false
 *       }
 *     ],
 *     payer: {
 *       emailAddress: "sample-payer@gmail.com",
 *       displayName: "Lindsie Tanya"
 *       squareId: "$LindsieT",
 *       paypalId: "LTanya"
 *     }
 *   }
 * }
 */
router.get('/bill/:shortId', authHandler.ensureAuthenticated, apiHandler.getBill);

/**
 * @api {get} /api/bills Retrieve user's bills
 * @apiName RetrieveBills
 * @apiGroup Bill
 * @apiDescription Retrieves all the bills that the authenticated user is the payer of.
 *
 * @apiPermission user
 *
 * @apiHeader (Authroization) {string} authorization JWT generated by
 * the user login preceded by the string 'JWT'
 *
 * @apiHeaderExample {json} Header-Example
 * {
 *  "authorization": "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI..."
 * }
 *
 * @apiSuccess {Object[]} data An array of bills
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * { data:
 *    [ { id: 1,
 *        shortId: '3MRqJ',
 *        description: 'Tu Lan lunch',
 *        tax: 2.46,
 *        tip: 9.5,
 *        createdAt: '2016-10-29T23:02:36.987Z',
 *        updatedAt: '2016-10-29T23:02:36.991Z',
 *        payerId: 1,
 *        items:
 *         [ { id: 4,
 *             description: 'Curry Rice',
 *             price: 6.5,
 *             paid: false,
 *             createdAt: '2016-10-29T23:02:36.995Z',
 *             updatedAt: '2016-10-29T23:02:36.995Z',
 *             billId: 1,
 *             debtorId: null,
 *             debtor: null },
 *           { id: 1,
 *             description: 'Dragon Roll',
 *             price: 10.99,
 *             paid: false,
 *             createdAt: '2016-10-29T23:02:36.995Z',
 *             updatedAt: '2016-10-29T23:02:36.995Z',
 *             billId: 1,
 *             debtorId: null,
 *             debtor: null } ] },
 *      { id: 2,
 *        shortId: 'bmVlJ',
 *        description: 'Chipogo',
 *        tax: 1.99,
 *        tip: 1,
 *        createdAt: '2016-10-29T23:02:37.010Z',
 *        updatedAt: '2016-10-29T23:02:37.012Z',
 *        payerId: 1,
 *        items:
 *         [ { id: 6,
 *             description: 'Burrito',
 *             price: 7.99,
 *             paid: false,
 *             createdAt: '2016-10-29T23:02:37.016Z',
 *             updatedAt: '2016-10-29T23:02:37.016Z',
 *             billId: 2,
 *             debtorId: null,
 *             debtor: null },
 *           { id: 7,
 *             description: 'Veggie Bowl',
 *             price: 6.5,
 *             paid: false,
 *             createdAt: '2016-10-29T23:02:37.016Z',
 *             updatedAt: '2016-10-29T23:02:37.016Z',
 *             billId: 2,
 *             debtorId: null,
 *             debtor: null } ]
 *        }
 *    ]
 *}
 *
 */
router.get('/bills', authHandler.ensureAuthenticated, apiHandler.getUserBills);

/**
 * @api {post} /api/bill Create a bill
 * @apiName CreateBill
 * @apiGroup Bill
 *
 * @apiPermission user
 *
 * @apiHeader (Authroization) {string} authorization JWT generated by
 * the user login preceded by the string 'JWT'
 *
 * @apiHeaderExample {json} Header-Example
 * {
 *  "authorization": "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI..."
 * }
 *
 * @apiParam {string} [description] Description of the bill.
 * @apiParam {number} [tax] Tax in local currency associated with the bill.
 * @apiParam {number} [tip] Tip amount in local currency
 * @apiParam {Object[]} items Individual items on the bill.
 * @apiParam {string} items.description Description of the item.
 * @apiParam {string} items.price Price of the item in local currency.
 * @apiParam {string} payerEmailAddress Email address of the bill payer.
 *
 * @apiSuccess (201) {Object} data Data associated with the new bill.
 * @apiSuccess (201) {string} data.shortId The short id of the bill.
 *
 * @apiError {Object} error Error information associated with the bill.
 * @apiError {string} error.message Human-readable description of the error.
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 201 CREATED
 * {
 *   data: {
 *     shortId: "s5y26"
 *   }
 * }
 *
 */
router.post('/bill', authHandler.ensureAuthenticated, apiHandler.saveBill);

/**
 * @api {put} /api/bill/:shortId Update a bill
 * @apiName UpdateBill
 * @apiGroup Bill
 * @apiDescription Update a bill's properties. The authenticated user must be the payer of the
 * bill. The user may update the description at any time. If none of the items have been marked
 * paid, then the user may also update the tax and tip.
 *
 * @apiPermission user
 *
 * @apiHeader (Authroization) {string} authorization JWT generated by
 * the user login preceded by the string 'JWT'
 *
 * @apiHeaderExample {json} Header-Example
 * {
 *  "authorization": "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI..."
 * }
 *
 * @apiParam (Path) {string} shortId Short id of the bill to be updated.
 *
 * @apiParam {String} [description] Description of the bill.
 * @apiParam {number} [tax] Tax on the bill in local currency.
 * @apiParam {number} [tip] Tip on the bill in local currency.
 *
 * @apiError {Object} error Error information associated with the bill.
 * @apiError {string} error.message Human-readable description of the error.
 *
 * @apiSuccess (200) {Object} data Data associated with the updated bill.
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *   data: {
 *      id: 15,
 *      shortId: '3JRqJ',
 *      description: 'A New Description',
 *      tax: 3.33,
 *      tip: 7.54,
 *      createdAt: '2016-10-31T13:48:27.452Z',
 *      updatedAt: '2016-10-31T18:48:27.509Z',
 *      payerId: 16
 *   }
 * }
 */
router.put('/bill/:shortId', authHandler.ensureAuthenticated, apiHandler.updateBill);

/**
 * @api {put} /api/item/:id Update a bill item
 * @apiName UpdateItem
 * @apiGroup Item
 * @apiDescription This endpoint updates a bill item. If the user verified by the
 * authentication token is the owner of the bill the item belongs to, then the user
 * may update any parameter of the item.
 *
 * If the authenticated user does not own the bill, then the user may only "claim" or "unclaim" the
 * item; that is, the user may only set the `debtorId` to her own id if the `debtorId` is null,
 * or the user may set the `debtorId` to `null` if it is currently their id.
 * The user may also change the `paid` attribute.
 *
 * @apiPermission user
 *
 * @apiHeader (Authroization) {string} authorization JWT generated by
 * the user login preceded by the string 'JWT'
 *
 * @apiHeaderExample {json} Header-Example
 * {
 *  "authorization": "JWT eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpZCI..."
 * }
 *
 * @apiParam (Path) {number} id Id of the item to be updated.
 *
 * @apiParam {String} [description] Description of the item.
 * @apiParam {number} [price] Price of the item in local currency.
 * @apiParam {number} [debtorId] Id of the person responsible for paying the item.
 * @apiParam {boolean} [paid] Whether the item has been paid for or not.
 *
 * @apiError {Object} error Error information associated with the bill.
 * @apiError {string} error.message Human-readable description of the error.
 *
 * @apiSuccessExample Success-Response
 * HTTP/1.1 200 OK
 * {
 *  data: {
 *    id: 25,
 *    description: 'Dragon Roll',
 *    price: 12.05,
 *    paid: false,
 *    createdAt: '2016-10-29T08:20:54.261Z',
 *    updatedAt: '2016-10-29T08:20:54.318Z',
 *    billId: 1,
 *    debtorId: 2,
 *    debtor: {
 *      id: 2,
 *      emailAddress: 'debtor@gmail.com',
 *      name: 'Hambone',
 *      squareId: '$hammy',
 *      paypalId: 'hbone',
 *      createdAt: '2016-10-29T08:22:32.054Z',
 *      updatedAt: '2016-10-29T08:22:32.146Z'
 *    }
 *  }
 * }
 */
router.put('/item/:id', authHandler.ensureAuthenticated, apiHandler.updateItem);

router.post('/receipt', apiHandler.uploadReceipt);


module.exports = router;
