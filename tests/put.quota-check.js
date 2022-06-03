import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { createData, deleteData } from '../scripts.js'

chai.use(chaiHttp)

/**
 * I isolated the tests for checking quota since it takes time to generate data and slows other tests.
 * These tests are not isolated from each other so it's not possible to run them with it.only()
 * As it mentioned in requirements: "The key store quota is 10"
 * Generating 11 keys in before() script.
 */

describe('PUT quota checks', () => {
	before(async () => {
		await deleteData()
		await createData(11)
	})
	after(async () => {
		await deleteData()
	})

	/**
	 * And here we're checking with GET request that response body length in indeed more that 10
	 */
	it('checks that 11 keys created', () => {
		chai.request(api.url)
			.get(api.exercise)
			.end((err, res) => {
				expect(res.body.length).to.be.equal(11)
			})
	})
	/**
	 * Finally checking that at least we're handling the error right.
	 * Although response text is informative i'd fix grammar to make it more readable.
	 */
	it('should returns error', () => {
		chai.request(api.url)
			.put(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'KEY_12',
				value: 'VALUE',
			})
			.end((err, res) => {
				expect(err).to.have.status(400)
				expect(err.rawResponse).to.be.equal('you reached your quta')
			})
	})
})
