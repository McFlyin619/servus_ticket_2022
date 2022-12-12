import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

export const useJobsitesStore = defineStore('jobsites', {
	state: () => {
		return {
			jobsites: [],
			jobsiteError: null,
		}
	},
	actions: {
		async getJobsites(payload) {
			this.jobsites = []
			const Jobsite = Parse.Object.extend('Jobsite')
			const query = new Parse.Query(Jobsite)
			const companyPointer = {
				__type: 'Pointer',
				className: 'Company',
				objectId: payload
			}
			query.equalTo('belongsTo', companyPointer)
			try {
				const results = await query.find()
				for (const j of results) {
					this.jobsites.push(j)
					// this.jobsites.push({
					// 	id: j.id,
					// 	onsiteContact: j.attributes.onsiteContact,
					// 	address: j.attributes.address,
					// 	phoneNumber: j.attributes.phoneNumber,
					// 	notes: j.attributes.notes,
					// })
				}

			} catch (err) {
				this.jobsiteError = err.message
			}
		},
		async saveNewJobsite(payload) {
			const jobsite = new Parse.Object('Jobsite')
			jobsite.set('onsiteContact', payload.onsiteContact)
			jobsite.set('company', payload.company)
			jobsite.set('address', payload.address)
			jobsite.set('phoneNumber', payload.phoneNumber)
			jobsite.set('notes', payload.notes)
			jobsite.set('belongsTo', payload.belongsTo.toPointer())
			try {
				await jobsite.save()
			} catch (err) {
				this.jobsiteError = err.message
			}
			const store = useJobsitesStore()
			store.getJobsites(payload.belongsTo.id)
		},
		async editJobsite(payload) {
			const Jobsite = Parse.Object.extend('Jobsite')
			const query = new Parse.Query(Jobsite)
			try {
				// Finds the jobsite by its ID
				let jobsite = await query.get(payload.id)
				for (const i in payload) {
					jobsite.set(i, payload[i])
				}
				try {
					jobsite.save()
				} catch (error) {
					console.error('Error while editing jobsite', error)
				}
			} catch (error) {
				console.error('Error while retrieving jobsite', error)
			}
			const store = useJobsitesStore()
			store.getJobsites(payload.belongsTo.id)
		},
		async deleteJobsite(payload) {
			const Jobsite = Parse.Object.extend('Jobsite')
			const query = new Parse.Query(Jobsite)

			try {
				// Finds thejobsite by its ID
				let jobsite = await query.get(payload.id)
				try {
					// Invokes the "destroy" method to delete the jobsite
					await jobsite.destroy().then(() => {
					})
				} catch (error) {
					console.error('Error while deleting service', error)
				}
			} catch (error) {
				console.error('Error while retrieving service', error)
			}
			const store = useJobsitesStore()
			store.getJobsites(payload.belongsTo.id)
		}
	},
	getters: {
		allJobsites(state) {
			return state.jobsites
		},
		getJobsiteError(state) {
			return state.jobsiteError
		}
	}
})