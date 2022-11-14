import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

export const useAuthStore = defineStore('auth', {
	state: () => {
		return {
			loggedUser: null,
			authError: null
		}
	},
	actions: {
		async signUp (payload) {
			// payload ={
			//	username: '',
			//	email: '',
			//	password: '',
			//	newCompany: {
			//		value: true
			//		name: 'TestingName'
			//		},
			//	company: objectId of existing company if selected
			// }
			const user = new Parse.User();
			user.set('username', payload.username)
			user.set('email', payload.email)
			user.set('password', payload.password)
			if (payload.newCompany.value) {
				user.set('companyName', new Parse.Company({"name": payload.newCompany.name }))
			} else {
				user.set('companyName', payload.company )
			}
		}
	},
	getters: {

	}
})
