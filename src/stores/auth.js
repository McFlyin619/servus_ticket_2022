import { defineStore } from 'pinia'

var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

export const useAuthStore = defineStore('auth', {
	state: () => {
		return {
			loggedUser: null,
			company: null,
			companyId: null,
			token: null,
			didAutoLogout: false,
			darkMode: false,
			authError: null,
			timer: null,
			loading: false
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
						user.set('Name', payload.fLName)
						user.set('username', payload.userName)
						user.set('email', payload.email)
						user.set('password', payload.password)
						// Used on the Sign Up page for creating a new company
						user.set('companyName', company.toPointer())
						user.set('darkMode', this.darkMode)
						try {
							await user.signUp()
						} catch (err) {
							this.authError = 'Error while signing up user 1' + err.message
						}
					})
				} catch (err) {
					this.authError = 'Error while signing up user 2' + err.message
				}
			} else {
				// Used on the add user page when adding users to a company
				user.set('Name', payload.fLName)
				user.set('username', payload.username)
				user.set('email', payload.email)
				user.set('password', payload.password)
				user.set('companyName', payload.company)
				try {
					await user.signUp()
				} catch (err) {
					this.authError = 'Error while signing up user 3' + err.message
				}
			}
		},
		async login(payload) {
			this.loading = true
			try {
				// Pass the username and password to logIn function
				let user = await Parse.User.logIn(payload.email, payload.password)
				// Do stuff after successful login
				const query = new Parse.Query('Company')
				const co = await query.get(user.attributes.companyName.id)
				this.company = co.attributes.name
				this.companyId = co.id
				localStorage.setItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/c', co.attributes.name)
				localStorage.setItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/cI', co.id)
				localStorage.setItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/d',  user.attributes.darkMode)

				this.loggedUser = user

				this.token = user.attributes.sessionToken
				localStorage.setItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/t', user.attributes.sessionToken)

				this.darkMode = user.attributes.darkMode

				const expiresIn = 7200000
				const expirationDate = new Date().getTime() + expiresIn

				localStorage.setItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/tE', expirationDate)
				this.timer = setTimeout(() => {
					this.autoLogout()
				}, expiresIn)
				setTimeout(() => {
					this.loading = false
				}, 1500)
			} catch (err) {
				this.authError = 'Error while logging in user 4' + err.message
				setTimeout(() => {
					this.loading = false
				}, 1500)
			}
		},
		logout() {
			Parse.User.logOut().then(() => {
				localStorage.removeItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/t')
				localStorage.removeItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/tE')
				localStorage.removeItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/c')
				this.loggedUser = null
				this.token = null,
				this.company = null
			})
		},
		tryLogin() {
			this.loading = true
			const sessionToken = localStorage.getItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/t')
			const tokenExpiration = localStorage.getItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/tE')
			const companyName = localStorage.getItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/c')
			const companyId = localStorage.getItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/cI')
			const darkMode = localStorage.getItem('Parse/3ZU4sYEQIQb2kQgIQh7qpjMMajqBaV/d')
			if (sessionToken) {
				Parse.User.become(sessionToken).then((user) => {
					this.token = user.attributes.sessionToken
					this.loggedUser = user
					this.company = companyName
					this.companyId = companyId
					this.darkMode = darkMode
				})
				setTimeout(() => {
					this.loading = false
				}, 1500)
			}
			const expiresIn = +tokenExpiration - new Date().getTime()
			if (expiresIn > 0) {
				return
			}
			this.timer = setTimeout(() => {
				this.autoLogout()
			}, expiresIn)
			setTimeout(() => {
				this.loading = false
			}, 1500)
		},
		autoLogout() {
			this.logout()
			this.didAutoLogout = true
		},
		async getCompanies() {
			const query = new Parse.Query('Companies')
			try {
				query.find()
			} catch (err) {
				this.authError = err.message
			}
		},
		async setDarkMode(payload) {
			this.darkMode = payload
			if (this.loggedUser !== null) {
				const User = new Parse.User()
				const query = new Parse.Query(User)
				try {
					let user = await query.get(this.loggedUser.id);
					user.set('darkMode', payload)
					try {
						await user.save()
					} catch (err) {
						this.authError = 'Error while updating user' + err.message
					}
				} catch (err) {
					this.authError = 'Error while updating user' + err.message
				}
			}
		}
	},
	getters: {
		darkModeState(state) {
			return state.darkMode
		},
		loggedUserInfo(state) {
			return state.loggedUser
		},
		loadingState(state) {
			return state.loading
		},
		companyName(state) {
			return state.company
		},
		getCompanyId (state) {
			return state.companyId
		},
		getToken (state) {
			return state.token
		}
	}
})
