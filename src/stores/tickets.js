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
			chartData: []
		}
	},
	actions: {
		async getTickets (payload) {
			this.tickets = []
			const tNumbers = []
			const Service_Request = Parse.Object.extend('Service_Requests')
			const query = new Parse.Query(Service_Request)
			const companyPointer = {
				__type: 'Pointer',
				className: 'Company',
				objectId: payload
			}
			query.equalTo('belongsTo', companyPointer)
			query.find().then((serviceRequests) => {
				const promises = serviceRequests.map(async (serviceRequest) => {
					// Get the relation between the service request and the technicians
					const relation = serviceRequest.relation('technicians');
					// Get the list of technician objects
					const technician = await relation.query().first()
					serviceRequest.technicianName = technician.get("Name")
					return serviceRequest
				});
				// Wait for all promises to resolve
				return Promise.all(promises);
			}).then((newServiceRequests) => {
				//The newServiceRequests list now contains all serviceRequest with technicianName attribute containing the name of the related technician.
				newServiceRequests.forEach(request => {
					tNumbers.push(request.attributes.ticketNumber)
					this.tickets.push(request)
				});
				setTimeout(() => {
					const store = useTicketsStore()
					store.chartCount()
				}, 1000)
			}).catch((error) => {
				console.error('Error:', error);
			});
			if (tNumbers.length === 0) {
				this.nextTicketNumber = 1
			} else {
				this.nextTicketNumber = Math.max(...tNumbers) + 1
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
			await ticket.save().then(() =>{}), (err) => {
				this.TicketError = err.message
			}
			const store = useTicketsStore()
			store.getTickets(payload.belongsTo.id)
		},
		async editTicket (payload) {
			const Ticket = Parse.Object.extend('Service_Requests')
			const query = new Parse.Query(Ticket)
			try {
				// Finds the location by its ID
				let ticket = await query.get(payload.id)
				for (const i in payload) {
					ticket.set(i, payload[i])
				}
				try {
					ticket.save()
				} catch (error) {
					console.error('Error while editing Ticket', error)
				}
			} catch (error) {
				console.error('Error while retrieving Ticket', error)
			}
			const store = useTicketsStore()
			store.getTickets(payload.belongsTo.id)
		},
		async deleteTicket (payload) {
			const Ticket = Parse.Object.extend('Service_Requests')
			const query = new Parse.Query(Ticket)

			try {
				// Finds thelocation by its ID
				let ticket = await query.get(payload.id)
				try {
					// Invokes the "destroy" method to delete the location
					await ticket.destroy().then(() => {
					})
				} catch (error) {
					console.error('Error while deleting Ticket', error)
				}
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
		}
	}
})