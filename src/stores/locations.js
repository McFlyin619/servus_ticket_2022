import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
// Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
// Parse.serverURL = 'https://parseapi.back4app.com/'

export const useLocationsStore = defineStore('locations', {
	state: () => {
		return {
			locations: [],
			locationError: null,
		}
	},
	actions: {
		async getLocations(payload) {
			this.locations = []
			const Location = Parse.Object.extend('Locations')
			const query = new Parse.Query(Location)
			const companyPointer = {
				__type: 'Pointer',
				className: 'Company',
				objectId: payload
			}
			query.equalTo('belongsTo', companyPointer)
			try {
				const results = await query.find()
				for (const j of results) {
					this.locations.push(j)
					// this.locations.push({
					// 	id: j.id,
					// 	onsiteContact: j.attributes.onsiteContact,
					// 	address: j.attributes.address,
					// 	phoneNumber: j.attributes.phoneNumber,
					// 	notes: j.attributes.notes,
					// })
				}

			} catch (err) {
				this.locationError = err.message
			}
		},
		async saveNewLocation(payload) {
			const location = new Parse.Object('Locations')
			location.set('onsiteContact', payload.onsiteContact)
			location.set('customer', payload.customer.toPointer())
			location.set('address', payload.address)
			location.set('address2', payload.address2)
			location.set('city', payload.city)
			location.set('state', payload.state)
			location.set('zipCode', payload.zipCode)
			location.set('phoneNumber', payload.phoneNumber)
			location.set('notes', payload.notes)
			location.set('belongsTo', payload.belongsTo.toPointer())
			try {
				await location.save()
			} catch (err) {
				this.locationError = err.message
			}
			const store = useLocationsStore()
			store.getLocations(payload.belongsTo.id)
		},
		async editLocation(payload) {
			const Location = Parse.Object.extend('Locations')
			const query = new Parse.Query(Location)
			try {
				// Finds the location by its ID
				let location = await query.get(payload.id)
				for (const i in payload) {
					if(i === 'customer') location.set('customer', payload.customer.toPointer())
					location.set(i, payload[i])
				}
				try {
					location.save()
				} catch (error) {
					console.error('Error while editing location', error)
				}
			} catch (error) {
				console.error('Error while retrieving location', error)
			}
			const store = useLocationsStore()
			store.getLocations(payload.belongsTo.id)
		},
		async deleteLocation(payload) {
			const Location = Parse.Object.extend('Locations')
			const query = new Parse.Query(Location)

			try {
				// Finds thelocation by its ID
				let location = await query.get(payload.id)
				try {
					// Invokes the "destroy" method to delete the location
					await location.destroy().then(() => {
					})
				} catch (error) {
					console.error('Error while deleting service', error)
				}
			} catch (error) {
				console.error('Error while retrieving service', error)
			}
			const store = useLocationsStore()
			store.getLocations(payload.belongsTo.id)
		}
	},
	getters: {
		allLocations(state) {
			return state.locations
		},
		getLocationError(state) {
			return state.locationError
		}
	}
})