import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
// Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
// Parse.serverURL = 'https://parseapi.back4app.com/'

export const useCustomersStore = defineStore('customers', {
	state: () => {
		return {
			customers: [],
			customerError: null,
		}
	},
	actions: {
		async getCustomers(payload) {
			this.customers = []
			const Customers = Parse.Object.extend('Customers')
			const query = new Parse.Query(Customers)
			const companyPointer = {
				__type: 'Pointer',
				className: 'Company',
				objectId: payload
			}
			query.equalTo('belongsTo', companyPointer)
			try {
				const results = await query.find()
				for (const c of results) {
					this.customers.push(c)
				}

			} catch (err) {
				this.companyError = 'Error fetching customers. ' + err.message
			}
		},
		async saveNewCustomer(payload) {
			const customer = new Parse.Object('Customers')
			customer.set('firstName', payload.firstName)
			customer.set('lastName', payload.lastName)
			customer.set('company', payload.company)
			customer.set('address', payload.address)
			customer.set('address2', payload.address2)
			customer.set('city', payload.city)
			customer.set('state', payload.state)
			customer.set('zipCode', payload.zipCode)
			customer.set('phoneNumber', payload.phoneNumber)
			customer.set('notes', payload.notes)
			customer.set('belongsTo', payload.belongsTo.toPointer())
			try {
				await customer.save()
			} catch (err) {
				this.customerError = 'Error saving new customer. ' + err.message
			}
			const store = useCustomersStore()
			store.getCustomers(payload.belongsTo.id)
		},
		async editCustomer(payload) {
			const Customers = Parse.Object.extend('Customers')
			const query = new Parse.Query(Customers)
			try {
				// Finds the customer by its ID
				let customer = await query.get(payload.id)
				for (const i in payload) {
					customer.set(i, payload[i])
				}
				try {
					customer.save()
				} catch (error) {
					this.customerError = 'Error while trying to save edited customer. ' + error.message
				}
			} catch (error) {
				this.customerError = 'Error while trying to retrieve customer. ' + error.message
			}
			const store = useCustomersStore()
			store.getCustomers(payload.belongsTo.id)
		},
		async deleteCustomer(payload) {
			const Customers = Parse.Object.extend('Customers')
			const query = new Parse.Query(Customers)

			try {
				// Finds the customer by its ID
				let customer = await query.get(payload.id)
				try {
					// Invokes the "destroy" method to delete the customer
					await customer.destroy().then(() => {
					})
				} catch (error) {
					this.customerError = 'Error while trying to delete customer. ' + error.message
				}
			} catch (error) {
				this.customerError = 'Error while trying to retrieve customer. ' + error.message
			}
			const store = useCustomersStore()
			store.getCustomers(payload.belongsTo.id)
		},
		clearError () {
			this.customerError = null
		}
	},
	getters: {
		allCustomers(state) {
			return state.customers
		},
		getCustomerError(state) {
			return state.customerError
		}
	}
})