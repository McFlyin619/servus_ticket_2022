import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

export const useServicesStore = defineStore('services', {
	state: () => {
		return {
			services: [],
			serviceError: null,
		}
	},
	actions: {
		async getServices(payload) {
			this.services = []
			const Service = Parse.Object.extend('Service')
			const query = new Parse.Query(Service)
			const companyPointer = {
				__type: 'Pointer',
				className: 'Company',
				objectId: payload
			}
			query.equalTo('belongsTo', companyPointer)
			try {
				const results = await query.find()
				for (const s of results) {
					this.services.push({
						id: s.id,
						name: s.attributes.name,
					})
				}

			} catch (err) {
				this.serviceError = err.message
			}
		},
		async saveNewService(payload) {
			const service = new Parse.Object('Service')
			service.set('name', payload.name)
			service.set('belongsTo', payload.belongsTo.toPointer())
			try {
				await service.save()
			} catch (err) {
				this.serviceError = err.message
			}
			const store = useServicesStore()
			store.getServices(payload.belongsTo.id)
		},
		async editService(payload) {
			const Service = Parse.Object.extend('Service')
			const query = new Parse.Query(Service)
			try {
				// Finds the jobsite by its ID
				let service = await query.get(payload.id)
				for (const i in payload) {
					service.set(i, payload[i])
				}
				try {
					service.save()
				} catch (error) {
					console.error('Error while editing service', error)
				}
			} catch (error) {
				console.error('Error while retrieving service', error)
			}
			const store = useServicesStore()
			store.getServices(payload.belongsTo.id)
		},
		async deleteService(payload) {
			const Service = Parse.Object.extend('Service')
			const query = new Parse.Query(Service)

			try {
				// Finds thejobsite by its ID
				let service = await query.get(payload.id)
				try {
					// Invokes the "destroy" method to delete the jobsite
					await service.destroy().then(() => {
					})
				} catch (error) {
					console.error('Error while deleting service', error)
				}
			} catch (error) {
				console.error('Error while retrieving service', error)
			}
			const store = useServicesStore()
			store.getServices(payload.belongsTo.id)
		}
	},
	getters: {
		allServices(state) {
			return state.services
		},
		getServiceError(state) {
			return state.serviceError
		}
	}
})