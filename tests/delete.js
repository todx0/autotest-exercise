import { api } from '../config.js'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import { createData, deleteData, getLength } from '../scripts.js'

chai.use(chaiHttp)

/**
 * !!!
 * Most tests were done for PUT method. I din't wanted to repeat same tests and covered only basics
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
			.send({
				main_key: `key_0`,
			})
			.end((err, res) => {
				expect(res).to.have.status(200)
				expect(res.body).to.be.a('object')
				expect(res.body).to.have.all.keys('main_key')
				expect(res.body['main_key']).to.be.a('string')
			})
		await createData(1)
	})
	it('delete a key & assert key removed', async () => {
		const lenAfter = await getLength()
		await chai.request(api.url).delete(api.exercise).send({
			main_key: `key_1`,
		})
		expect(lenAfter).to.be.equal(lenBefore - 1)
	})
})
