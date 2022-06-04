import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { createData, deleteData } from '../scripts.js'

chai.use(chaiHttp)

describe('GET', () => {
	before(async () => {
		await deleteData()
	})
	after(async () => {
		await deleteData()
	})

	it('should return empty array', done => {
		chai.request(api.url)
			.get(api.exercise)
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('array').and.be.empty
				expect(res.body.length).to.be.equal(0)
				expect(res).to.have.header('content-type', 'application/json')
				done()
			})
	})

	it('should return 10 elements', async () => {
		await createData(10)
		chai.request(api.url)
			.get(api.exercise)
			.set('content-type', 'application/json')
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('array')
				expect(res.body.length).to.be.equal(10)
				for (let el in res.body) {
					expect(res.body[el]).to.have.all.keys('main_key', 'value')
					expect(res.body[el]['main_key']).to.be.a('string')
					expect(res.body[el]['value']).to.be.a('string')
					expect(res).to.have.header('content-type', 'application/json')
				}
			})
	})
})
