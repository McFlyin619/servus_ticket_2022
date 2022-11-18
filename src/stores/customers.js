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
				for (const c of results) {
					console.log(c)
					var address2 = ''
					if(c.attributes.address2 !== "null") address2 = c.attributes.address2 + ', '
					this.customers.push({
						firstName: c.attributes.firstName,
						lastName: c.attributes.lastName,
						company: c.attributes.company,
						address: c.attributes.address + ', ' + address2 + c.attributes.city  + ', ' + c.attributes.state  + c.attributes.zipCode,
						phone: c.attributes.phoneNumber,
						notes: c.attributes.notes,
					})
				}

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