import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
// Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
// Parse.serverURL = 'https://parseapi.back4app.com/'

export const useTicketsStore = defineStore('tickets', {
	state: () => {
		return {
			tickets: [],
			ticketError: null,
			nextTicketNumber: 0,
			chartData: [],
			loading: false
		}
	},
	actions: {
		async getTickets (payload) {
			try {
				this.loading = true
				const Service_Request = Parse.Object.extend('Service_Requests')
				const query = new Parse.Query(Service_Request)
				const companyPointer = {
					__type: 'Pointer',
					className: 'Company',
					objectId: payload
				}
				query.equalTo('belongsTo', companyPointer)

				// Get all service requests that belong to the company
				const serviceRequests = await query.find()

				// Get the relation between the service request and the technicians
				const promises = serviceRequests.map(async (serviceRequest) => {
					const relation = serviceRequest.relation('technicians')
					// Get the list of technician objects
					const technician = await relation.query().first()
					serviceRequest.technicianName = technician.get("Name")
					return serviceRequest
				})
				// Wait for all promises to resolve
				const newServiceRequests = await Promise.all(promises)
				
				this.tickets = newServiceRequests

				// Get the next highest ticket number
				const queryTicketNumber = new Parse.Query(Service_Request)
				queryTicketNumber.descending("ticketNumber")
				queryTicketNumber.first().then((serviceRequest) => {
					if (serviceRequest) {
						this.nextTicketNumber = serviceRequest.get("ticketNumber") + 1
					} else {
						this.nextTicketNumber = 1
					}
					//Update the store
					const store = useTicketsStore()
					setTimeout(() => {
						store.chartCount()
					}, 1000)
				}).catch((error) => {
					console.error('Error:', error)
				})

			} catch (error) {
				console.error('Error while retrieving Ticket', error)
			}

		},
		async saveNewTicket (payload) {
			const ticket = new Parse.Object('Service_Requests')
			ticket.set('ticketNumber', payload.ticketNumber)
			ticket.set('customer', payload.customer.toPointer())
			ticket.set('location', payload.location.toPointer())
			ticket.set('issue', payload.issue)
			ticket.set('notes', payload.notes)
			ticket.set('repairNotes', payload.repairNotes)
			ticket.set('belongsTo', payload.belongsTo.toPointer())
			const tech = new Parse.User()
			tech.id = payload.technicians.id
			// Add the technician object to the "technicians" field of the service request
			const rel = ticket.relation('technicians')
			rel.add(tech)
			await ticket.save().then(() => { }), (err) => {
				this.TicketError = err.message
			}
			const store = useTicketsStore()
			store.getTickets(payload.belongsTo.id)
		},
		async editTicket (payload) {
			try {
				const Ticket = Parse.Object.extend('Service_Requests')
				const query = new Parse.Query(Ticket)
				let ticket = await query.get(payload.id)

				// ensure working with the most up-to-date version of the object
				await ticket.fetch()

				for (const i in payload) {
					if (i !== 'technicians') {
						ticket.set(i, payload[i])
					}
				}
				if (payload.technicians) {
					const tech = new Parse.User()
					tech.id = payload.technicians.id

					// Add the technician object to the "technicians" field of the service request
					const rel = ticket.relation('technicians')
					rel.add(tech)
				}

				await ticket.save()
					.then(() => { })
					.catch((err) => {
						console.error(err.message)
					})
			} catch (error) {
				console.error('Error while retrieving Ticket', error)
			}
			const store = useTicketsStore()
			store.getTickets(payload.belongsTo.id)
		},
		async deleteTicket (payload) {
			try {
				const Ticket = Parse.Object.extend('Service_Requests')
				const query = new Parse.Query(Ticket)
				// Finds the Ticket by its ID
				let ticket = await query.get(payload.id)
				// Invokes the "destroy" method to delete the Ticket
				await ticket.destroy().then(() => {
					console.log("Ticket deleted successfully!")
				}).catch(error => {
					console.error('Error while deleting Ticket', error)
				})
			} catch (error) {
				console.error('Error while retrieving Ticket', error)
			}
			const store = useTicketsStore()
			store.getTickets(payload.belongsTo.id)
		},
		chartCount () {
			console.log('chart run')
			const count = {}
			this.tickets.forEach(obj => {
				count[obj.attributes.customer.attributes.company] = (count[obj.attributes.customer.attributes.company] || 0) + 1
			})
			for (const [key, val] of Object.entries(count)) {
				this.chartData.push({ Customer: key, Count: val })
			}
			this.loading = false
		}
	},
	getters: {
		allTickets (state) {
			return state.tickets
		},
		getTicketError (state) {
			return state.ticketError
		},
		getNextTicketNumber (state) {
			return state.nextTicketNumber
		},
		getTicketChartCount (state) {
			return state.chartData
		},
		getTicketLoading (state) {
			return state.loading
		}
	}
})