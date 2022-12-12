import { defineStore } from 'pinia'
var Parse = require('parse/node')
// Initialize Parse
Parse.initialize('jeJcRpa3ZU4sYEQIQb2kQgIQh7qpjMMajqBaVnsy', 'uvlJSJ5fHDsVREoOSuX3ENHkLyK6cx9HKliAyo2k')
Parse.serverURL = 'https://parseapi.back4app.com/'

export const useTicketsStore = defineStore('tickets', {
	state: () => {
		return {
			tickets: [],
			ticketError: null,
			nextTicketNumber: 0
		}
	},
	actions: {
		async getTickets(payload) {
			this.tickets = []
			const tNumbers = []
			const Ticket = Parse.Object.extend('Ticket')
			const query = new Parse.Query(Ticket)
			const companyPointer = {
				__type: 'Pointer',
				className: 'Company',
				objectId: payload
			}
			query.equalTo('belongsTo', companyPointer)
			try {
				const results = await query.find()
				for (const s of results) {
					tNumbers.push(s.attributes.ticketNumber)
					this.tickets.push(s)
					// this.tickets.push({
					// 	id: s.id,
					// 	ticketNumber: s.attributes.ticketNumber,
					// 	issue: s.attributes.issue,
					// 	billedTo: s.attributes.billedTo.attributes.company,
					// 	jobsite: s.attributes.jobsite.attributes.address,
					// 	technician: s.attributes.technician.Name

					// })
				}
				this.nextTicketNumber = Math.max(...tNumbers) + 1
			} catch (err) {
				this.ticketError = err.message
			}
		},
		async saveNewTicket(payload) {
			console.log(payload)
			const ticket = new Parse.Object('Ticket')
			ticket.set('ticketNumber', payload.ticketNumber)
			ticket.set('billedTo', payload.billedTo.toPointer())
			if (!payload.isJobsiteCustomer) ticket.set('jobsite', payload.jobsite.toPointer()); else ticket.set('customerIsJobsite', payload.customerIsJobsite.toPointer())
			ticket.set('technician', payload.technician.toPointer())
			ticket.set('issue', payload.issue)
			ticket.set('belongsTo', payload.belongsTo.toPointer())
			try {
				await ticket.save()
			} catch (err) {
				this.TicketError = err.message
			}
			const store = useTicketsStore()
			store.getTickets(payload.belongsTo.id)
		},
		async editTicket(payload) {
			const Ticket = Parse.Object.extend('Ticket')
			const query = new Parse.Query(Ticket)
			try {
				// Finds the jobsite by its ID
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
		async deleteTicket(payload) {
			const Ticket = Parse.Object.extend('Ticket')
			const query = new Parse.Query(Ticket)

			try {
				// Finds thejobsite by its ID
				let ticket = await query.get(payload.id)
				try {
					// Invokes the "destroy" method to delete the jobsite
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
		}
	},
	getters: {
		allTickets(state) {
			return state.tickets
		},
		getTicketError(state) {
			return state.ticketError
		},
		getNextTicketNumber(state) {
			return state.nextTicketNumber
		}
	}
})