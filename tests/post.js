import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { createData, deleteData } from '../scripts.js'

chai.use(chaiHttp)

/**
 * !!!
 * Most tests were done for PUT method. I didn't wanted to repeat same tests and covered only basics
 * since they're mostly the same.
 */
describe('POST', () => {
	before(async () => {
		await deleteData()
		await createData(1)
	})
	after(async () => {
		await deleteData()
	})

	it('should update value', done => {
		chai.request(api.url)
			.post(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'key_0',
				value: 'post_value',
			})
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('object')
				expect(res.body).to.have.keys('main_key', 'value')
				expect(res.body['main_key']).to.be.equal('key_0')
				expect(res.body['value']).to.be.equal('post_value')
				expect(res).to.have.header('content-type', 'application/json')
				done()
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
				main_key: 'key_0',
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
		chai.request(api.url)
			.post(api.exercise)
			.set('content-type', 'application/json')
			.send({
				main_key: 'key_0',
				value: 'value_0',
				another_key: 'another_value',
			})
			.end((err, res) => {
				/**
				 * It seems that endpoint returns body that was sent and I'm not sure what happens
				 * inside the backend and how it's handled.
				 * */
				expect(res.body).to.have.keys('main_key', 'value', 'another_key')
				expect(res).to.have.header('content-type', 'application/json')
				done()
			})
	})
})
