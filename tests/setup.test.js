import { deleteData, createData } from '../scripts.js'

before(async () => {
	await deleteData()
	await createData(3)
})

after(async () => {
	await deleteData()
})
