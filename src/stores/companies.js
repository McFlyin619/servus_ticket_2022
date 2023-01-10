import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
// Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
// Parse.serverURL = 'https://parseapi.back4app.com/'

export const useCompaniesStore = defineStore('companies', {
	state: () => {
		return {
			companies: [],
			companyError: null,
		}
	},
	actions: {
		async getCompanies () {
			const Company = Parse.Object.extend('Company');
			const query = new Parse.Query(Company)
			try {
				const results = await query.find()
				for (const c of results) {
					// console.log(c)
					const name = c.get('name')
					const id = c.id
					this.companies.push({ name: name, id: id})
				}

			} catch (err) {
				this.companyError = err.message
			}
		}
	},
	getters: {
		allCompanies (state) {
			return state.companies
		}
	}
})