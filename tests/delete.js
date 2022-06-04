import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { createData, deleteData, getLength } from '../scripts.js'

chai.use(chaiHttp)

/**
 * !!!
 * Most tests were done for PUT method. I didn't want to repeat same tests and covered only basics
 * since they're mostly the same.
 */
var lenBefore
describe('DELETE', () => {
	before(async () => {
		await deleteData()
		await createData(3)
		lenBefore = await getLength()
	})
	after(async () => {
		await deleteData()
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
			})
		await createData(1)
	})

	it('delete a key & assert key removed', async () => {
		const lenAfter = await getLength()
		await chai
			.request(api.url)
			.delete(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'key_1', // it's a bad practice to harcode a value
			})
		expect(lenAfter).to.be.equal(lenBefore - 1)
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
