import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

export const useCustomersStore = defineStore('customers', {
	state: () => {
		return {
			customers: [],
			customerError: null,
		}
	},
	actions: {
		async getCustomers(payload) {
			console.dir(payload)
			const Customer = Parse.Object.extend('Customer')
			const query = new Parse.Query(Customer)
			const companyPointer = {
				__type: 'Pointer',
				className: 'Company',
				objectId: payload
			}
			query.equalTo('belongsTo', companyPointer)
			try {
				const results = await query.find()
				console.log(results)
				// for (const c of results) {
				// 	console.log(c)

				// }

			} catch (err) {
				this.companyError = err.message
			}
		}
	},
	getters: {
		allCustomers(state) {
			return state.customers
		}
	}
})