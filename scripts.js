import { api } from './config.js'
import chai from 'chai'
import chaiHttp from 'chai-http'

chai.use(chaiHttp)

/**
 * I use this abomination since I don't have an access
 * to the database and the data for tests should be consistent.
 * It checks for value with GET request and if it's empty it creates
 * data with PUT request.
 */
export const createData = async num => {
	const response = await chai.request(api.url).get(api.exercise)
	if (response.body.length === 0) {
		for (let i = 0; i < num; i++) {
			await chai
				.request(api.url)
				.put(api.exercise)
				.set('content-type', 'application/json')
				.send({
					main_key: `key_${i}`,
					value: `value_${i}`,
				})
		}
	}
}

/**
 * Same for this one. It erases all the data with DELETE request.
 */
export const deleteData = async () => {
	const response = await chai.request(api.url).get(api.exercise)
	if (response.body.length > 0) {
		const values = Object.values(response.body)
		for (let i = 0; i < response.body.length; i++) {
			await chai
				.request(api.url)
				.delete(api.exercise)
				.set('content-type', 'application/json')
				.send({
					main_key: values[i].main_key,
				})
		}
	}
}

/**
 * It returns the length of the array returned by the API call, and the value of the first element's
 * main_key property
 * @returns The length of the array and the first element of the array
 */
export const getLength = async () => {
	const response = await chai.request(api.url).get(api.exercise)
	return response.body.length
}
