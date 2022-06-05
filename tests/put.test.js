import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import chaiSubset from 'chai-subset'
import { deleteData } from '../scripts.js'

chai.use(chaiHttp)
chai.use(chaiSubset)

describe('PUT', () => {
	describe('create element checks', () => {
		it('should create one element', done => {
			const data = {
				main_key: 'put_key',
				value: 'put_value',
			}
			chai.request(api.url)
				.put(api.exercise)
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
		 * Requirement for PUT states that 'value' should be a string but it accepts
		 * an empty string which why I consider a bug until proven otherwise.
		 * It's also possible to pass object, boolean, and an array to a 'value'
		 * and receive a valid response. Checked this in Postman. I didn't bother writing tests to an incorrect behavior.
		 */
		it('creates another element with empty value', done => {
			const data = {
				main_key: 'put_key_empty_value',
				value: '',
			}
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send(data)
				.end((err, res) => {
					// thus I'm not sure what are we expecting from the response.
					// 400 and and a message about 'value' shouldn't be an empty string?
					// adding test to prove that it indeed creates an element with an empty value
					expect(res).to.have.status(200)
					expect(res.body).to.be.a('object')
					expect(res.body).to.have.keys('main_key', 'value')
					expect(res.body['main_key']).to.be.equal(data.main_key)
					expect(res.body['value']).to.be.equal(data.value)
					expect(res).to.have.header('content-type', 'application/json') /
						chai
							.request(api.url)
							.get(api.exercise)
							.set('content-type', 'application/json')
							.end((err, res) => {
								expect(res.body).to.containSubset([data])
								done()
							})
				})
		})

		/**
		 * Another unexpected behavior I found was that when you pass a number to a value
		 * it accepts it and return a valid response. However when accesing this element
		 * with GET method the number will be converted to a string.
		 */
		it('converts numerical value to a string', done => {
			const data = {
				main_key: 'numerical_value',
				value: 123,
			}
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send(data)
				.end((err, res) => {
					// returns value as number
					expect(res.body['value']).to.be.a('number').and.equal(data.value)
					expect(res).to.have.header('content-type', 'application/json')
					chai.request(api.url)
						.get(api.exercise)
						.set('content-type', 'application/json')
						.end((err, res) => {
							expect(res.body).to.not.containSubset([data])
							// find and check that value is indeed converted to a string
							let result = res.body.find(e => e.value === '123')
							expect(result.value).to.be.a('string')
							expect(result.main_key).to.be.equal(data.main_key)
							done()
						})
				})
		})

		/**
		 * I consider this as a bug since it allows us to send fields that are not in the schema.
		 * And we receive them in return which might be an issue.
		 * I'm not sure if they're added to the database or not since GET request doesn't return them.
		 */
		it('returns values that are not added', done => {
			const data = {
				main_key: 'main_key_that_doesnt_exist',
				value: 'test_value',
				some_field: 'value',
				another_field: 'value',
			}
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send(data)
				.end((err, res) => {
					chai.request(api.url)
						.get(api.exercise)
						.end((err, res) => {
							expect(res.body).to.not.containSubset([data])
							done()
						})
				})
		})
	})

	/**
	 * Questionable error message since it means 'value', not 'main_key'
	 */
	describe('400 errors', () => {
		it('400 error check. Duplicate.', done => {
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send({
					main_key: 'put_key',
					value: 'value_0',
				})
				.end((err, res) => {
					expect(err).to.have.status(400)
					expect(err.rawResponse).to.be.equal('value already exist')
					done()
				})
		})

		/**
		 * I'm not sure about the meaning of response text "'list' object has no attribute 'get'"
		 * Doesn't seem like a proper response.
		 */
		it('400 error check. Incosistent data.', done => {
			const testData = [
				{
					main_key: '', // empty string
					value: '', // empty value
				},
				{
					main_key: 0, // numeral value
					value: '',
				},
			]
			testData.forEach(data => {
				chai.request(api.url)
					.put(api.exercise)
					.set('content-type', 'application/json')
					.send(data)
					.end((err, res) => {
						expect(err).to.have.status(400)
						expect(err.rawResponse).to.be.equal("'list' object has no attribute 'get'")
					})
			})
			done()
		})

		/**
		 * Response result of this test seems like a bug to me since it's returning different error message for true and false.
		 * Although since we're not accepting anything except string do we need to check for that?
		 */
		it('400 error check. Booleans.', done => {
			const testData = [
				{
					main_key: true,
					value: 'str',
				},
				{
					main_key: false,
					value: 'str',
				},
			]
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send(testData[0])
				.end((err, res) => {
					expect(err).to.have.status(400)
					expect(err.rawResponse).to.be.equal("'NoneType' object has no attribute 'get'") // this is the error message for true
				})
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send(testData[1])
				.end((err, res) => {
					expect(err).to.have.status(400)
					expect(err.rawResponse).to.be.equal("'list' object has no attribute 'get'") // this is the error message for false
					done()
				})
		})

		/**
		 * Doesn't look like a proper response for missing value. I'd change the error message to be more descriptive.
		 */
		it('400 error check. No value.', done => {
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send({ main_key: 'only_key' })
				.end((err, res) => {
					expect(err).to.have.status(400)
					expect(err.rawResponse).to.be.equal("'value'")
					done()
				})
		})

		/**
		 * Seems like backend is written in Python since it's a classic error message.
		 * Doesn't look like a bug to me.
		 */
		it('400 error check. Void.', done => {
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send()
				.end((err, res) => {
					expect(err).to.have.status(400)
					expect(err.rawResponse).to.be.equal(
						'the JSON object must be str, bytes or bytearray, not NoneType'
					)
					done()
				})
		})

		/**
		 * Not really a descriptive error message but it does it's job.
		 */
		it('400 error check. Empty object.', done => {
			chai.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send({})
				.end((err, res) => {
					expect(err).to.have.status(400)
					expect(err.rawResponse).to.be.equal("'main_key'")
					done()
				})
		})
	})
})
