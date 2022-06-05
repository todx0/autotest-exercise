import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { getLength } from '../scripts.js'

chai.use(chaiHttp)

/**
 * !!!
 * Most tests were done for PUT method. I didn't want to repeat same tests and covered only basics
 * since they're mostly the same.
 */
var lenBefore
describe('DELETE', () => {
	before(async () => {
		lenBefore = await getLength()
	})

	it('delete a key & check response', async () => {
		chai.request(api.url)
			.delete(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'key_0',
			})
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('object')
				expect(res.body).to.have.all.keys('main_key')
				expect(res.body['main_key']).to.be.a('string')
				expect(res).to.have.header('content-type', 'application/json')
				chai.request(api.url)
					.get(api.exercise)
					.set('content-type', 'application/json')
					.end((err, res) => {
						expect(res.body.length).to.be.equal(lenBefore - 1)
						expect(res.body).to.not.include({ main_key: 'key_0', value: 'value_0' })
					})
			})
	})

	/**
	 * It's not mentioned in the requirements that the server should return an error if the key doesn't exist
	 * but seems like bug to me. Added positive assertions to prove it. Endpoint should probably return 400
	 * with proper error message that the key doesn't exist.
	 */
	it('delete non-existing value', done => {
		chai.request(api.url)
			.delete(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'key_that_doesnt_exist',
			})
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('object')
				expect(res.body).to.have.all.keys('main_key')
				expect(res.body['main_key']).to.be.a('string')
				expect(res.body['main_key']).to.be.equal('key_that_doesnt_exist')
				expect(res).to.have.header('content-type', 'application/json')
				done()
			})
	})

	/**
	 * I's anti-pattern to combine different tests in one as they should be isolated and idependent.
	 * This was done to speed up the process and for simplicity.
	 */
	it('Negative checks', done => {
		const testData = [, {}, { value: 'test' }]
		for (let el of testData) {
			chai.request(api.url)
				.delete(api.exercise)
				.set('content-type', 'application/json')
				.send(el)
				.end((err, res) => {
					expect(err.rawResponse)
				})
		}
		done()
	})
})
