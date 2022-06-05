import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import chaiSubset from 'chai-subset'
import { createData, deleteData } from '../scripts.js'

chai.use(chaiHttp)
chai.use(chaiSubset)

/**
 * !!!
 * Most tests were done for PUT method. I didn't want to repeat same tests and covered only basics
 * since they're mostly the same.
 */
describe('POST', () => {
	before(async () => {
		await createData(3)
	})

	it('should update value', done => {
		const data = {
			value: 'post_value',
			main_key: 'key_1',
		}
		chai.request(api.url)
			.post(api.exercise)
			.set('content-type', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('object')
				expect(res.body).to.have.keys('main_key', 'value')
				expect(res.body['main_key']).to.be.equal(data.main_key)
				expect(res.body['value']).to.be.equal(data.value)
				expect(res).to.have.header('content-type', 'application/json')
				chai.request(api.url)
					.get(api.exercise)
					.set('content-type', 'application/json')
					.end((err, res) => {
						expect(res.body).to.containSubset([data])
						done()
					})
			})
	})

	/**
	 * Despite grammar issues the error message still doesn't make any sense since it's about 'value', not 'main_key'
	 */
	it('attempts to update non existing main_key', done => {
		chai.request(api.url)
			.post(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'key_that_doesnt_exist',
				value: 'post_value',
			})
			.end((err, res) => {
				expect(err).to.have.status(400)
				expect(err.rawResponse).to.be.equal('value dose not exist')
				done()
			})
	})

	/**
	 * Another non-informative error message but overall behavior is ok.
	 */
	it('attempts to update key without value', done => {
		chai.request(api.url)
			.post(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'key_2',
			})
			.end((err, res) => {
				expect(err).to.have.status(400)
				expect(err.rawResponse).to.be.equal("'value'")
				done()
			})
	})

	/**
	 * Again as I mentioned in the comment in PUT test, endpoint returns value with a new key,
	 * although new key is not present when trying to access is with GET request.
	 */
	it('attempts to update key with another key', done => {
		const data = {
			main_key: 'key_2',
			value: 'value_2',
			another_key: 'another_value',
		}
		chai.request(api.url)
			.post(api.exercise)
			.set('content-type', 'application/json')
			.send(data)
			.end((err, res) => {
				/**
				 * Response returns 'another_key, asserting with GET that is's not returned.
				 */
				expect(res.body).to.have.keys('main_key', 'value', 'another_key')
				expect(res).to.have.header('content-type', 'application/json')
				chai.request(api.url)
					.get(api.exercise)
					.set('content-type', 'application/json')
					.end((err, res) => {
						expect(res.body).to.containSubset([data])
						done()
					})
				done()
			})
	})
})
