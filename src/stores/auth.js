import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

export const useAuthStore = defineStore('auth', {
	state: () => {
		return {
			loggedUser: null,
			authError: null,
		}
	},
	actions: {
		async signUp(payload) {
			//  initiates the USer Class Object
			const user = new Parse.User()
			// Initiates the Company CLass Object
			const company = new Parse.Object('Company')
			// Sets the new company name
			company.set('name', payload.newCompany.name)
			// Used on new user sign up
			if (payload.newCompany.value) {
				try {
					// Saves the new company name first so it can be pointed to when the user is created
					await company.save().then(async (company) => {
						// Sets user provided info
						user.set('username', payload.username)
						user.set('email', payload.email)
						user.set('password', payload.password)
						// Used on the Sign Up page for creating a new company
						user.set('companyName', company.toPointer())
						try {
							let userResult = await user.signUp()
							console.log('User signed up', userResult)
						} catch (err) {
							this.authError = 'Error while signing up user', err.message
						}
					})
				} catch (err) {
					this.authError = 'Error while signing up user', err.message
				}
			} else {
				// Used on the add user page when adding users to a company
				user.set('username', payload.username)
				user.set('email', payload.email)
				user.set('password', payload.password)
				user.set('companyName', payload.company)
				try {
					let userResult = await user.signUp()
					console.log('User signed up', userResult)
				} catch (err) {
					this.authError = 'Error while signing up user', err.message
				}
			}
		},
		async getCompanies() {
			const query = new Parse.Query('Companies')
			try {
				query.find()
			} catch (err) {
				this.authError = err.message
			}
		}
	},
	getters: {

	}
})
