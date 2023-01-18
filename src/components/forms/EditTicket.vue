<template>
	<modal-layout :show="true" @close="closeModal" :zIndex="50">
		<template v-slot:header>
			<h1 class="txt-main">Edit Service Request #{{ data.ticketNumber}}</h1>
		</template>
		<template v-slot:default>
			<div class="d-flex justify-content-between">
				<h3 class="txt-main"></h3>
				<button class="btn btn-danger btn-sm align-self-center" @click="undoEdits">Undo all edits</button>
			</div>
			<div class="row">
				<div class="col-6">
					<label for="customer" class="form-label">Customer</label>
					<div class="d-flex">
						<select
							v-model="changedFormData.customer"
							id="customer"
							:class="{'is-invalid': customerInvalid}"
							class="form-select"
							aria-label="Default select example"
							@change="
								changedData(
									changedFormData.customer,
									'customer'
								)
							"
						>
							<option disabled :value="undefined" selected>
								{{ originalFormData.customer.attributes.company }}
							</option>
							<option
								v-for="customer in locationCustomers"
								:key="customer"
								:value="customer"
							>
								{{ customer.attributes.company }}
							</option>
						</select>
						
						<button v-if="changedFormData['customer']" class="btn btn-sm btn-outline-danger ms-1 align-self-center" @click="removeField('customer')">Undo</button>
					</div>
					<small v-if="customerInvalid" class="text-danger">Please select a new customer</small>
				</div>
				<div class="col-6">
					<div class="d-flex justify-content-between">
						<label for="location" class="form-label">Location</label>
					</div>
					<div class="d-flex">
						<select
							v-model="changedFormData.location"
							id="customer"
							:class="{'is-invalid': locationInvalid}"
							class="form-select"
							aria-label="Default select example"
							@change="
								changedData(
									changedFormData.location,
									'location'
								)
							"
						>
							<option disabled :value="undefined" selected>
								{{ originalFormData.location.attributes.address }} {{ originalFormData.location.attributes.address2 }}, {{ originalFormData.location.attributes.city }}, {{ originalFormData.location.attributes.state }} {{ originalFormData.location.attributes.zipCode }}
							</option>
							<option
								v-for="location in customerLocations"
								:key="location"
								:value="location"
							>
								{{ location.attributes.address }} {{ location.attributes.address2 }}, {{ location.attributes.city }}, {{ location.attributes.state }} {{ location.attributes.zipCode }}
							</option>
						</select>
						<button v-if="changedFormData.location" class="btn btn-sm btn-outline-danger ms-1 align-self-center" @click="removeField('location')">Undo</button>
					</div>
					<small v-if="locationInvalid" class="text-danger">Please select a new location</small>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<label for="issue" class="form-label">Problem</label>
					<textarea class="form-control" id="issue" v-model="originalFormData.issue" :placeholder="'Enter issue/problem'"/>
					<button v-if="originalFormData.issue !== editedIssue" class="btn btn-sm btn-outline-danger mt-2" @click="originalFormData.issue = editedIssue">Undo</button>
				</div>
			</div>
			<div class="row">
				<div class="col-6">
					<label for="technician" class="form-label">Technician</label>
					<div class="d-flex">
						<select v-model="changedFormData.technicians" id="technician" :class="{'is-invalid': locationInvalid}"
							class="form-select"
							aria-label="Default select example"
							@change="
								changedData(
									changedFormData.technicians,
									'technicians'
								)
							">
							<option disabled :value="undefined" selected>
								{{ originalFormData.technicianName}}
							</option>
							<option v-for="tech in technicians" :key="tech" :value="tech">{{ tech.attributes.Name }}</option>
						</select>
						<button v-if="changedFormData.technicians" class="btn btn-sm btn-outline-danger ms-1 align-self-center" @click="removeField('technicians')">Undo</button>
					</div>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<div class="d-flex justify-content-between">
				<button class="btn but-outline-modal-cancel" @click="closeModal">Cancel</button>
				<button class="btn but-outline-modal-save" @click="saveData">Save</button>
			</div>
		</template>
	</modal-layout>
</template>

<script>
import ModalLayout from '../layout/ModalLayout.vue'
import TicketFields from '@/configs/tickets.json'
export default {
	emits: ['close', 'saveEditEntry'],
	props: ['title', 'show', 'data', 'customers', 'locations', 'technicians'],
	components: {
		ModalLayout
	},
	data() {
		return {
			fields: TicketFields.formFields,
			originalFormData: {},
			changedFormData: {},
			editedIssue: this.data.issue,
			locationInvalid: false,
			customerInvalid: false
		}
	},
	created() {
		this.originalFormData = this.data
	},
	computed: {
		locationCustomers() {
			if(!this.changedFormData.location) {
				return this.customers.filter(i => i.attributes.company !== this.originalFormData.location.attributes.customer.attributes.company)
			} else {
				return this.customers.filter(i => i.attributes.company === this.changedFormData.location.attributes.customer.attributes.company)
			}
		},
		customerLocations() {
			if (!this.changedFormData.customer) {
				return this.locations.filter(i => i.attributes.customer.attributes.company !== this.originalFormData.customer.attributes.company)
			} else if (this.changedFormData.customer) {
				return this.locations.filter(i => i.attributes.customer.attributes.company === this.changedFormData.customer.attributes.company)
			} else {
				return this.customers
			}

		},
	},
	methods: {
		undoEdits() {
			this.removeField('location')
			this.removeField('customer')
			this.removeField('technicians')
			this.originalFormData.issue = this.editedIssue
			this.locationInvalid = false
			this.customerInvalid = false
		},
		changedData(data, field) {
			this.changedFormData = {
				id: this.data.id,
				...this.changedFormData,
				[field]: data,
			}
			if (field === 'customer' && !this.changedFormData.location) {
				console.log(field)
				console.log('no location')
				this.locationInvalid = true
				this.customerInvalid = false
			} else if (field === 'customer' && this.changedFormData.location.attributes.customer.attributes.company !== this.changedFormData.customer.attributes.company) {
				console.log(field)
				this.locationInvalid = true
				console.log('location doesnt match customer')
			} else if(field === 'customer') {
				console.log(field)
				this.locationInvalid = false
				this.customerInvalid = false
			}
			if (field === 'location' && !this.changedFormData.customer) {
				console.log(field)
				console.log('no customer')
				this.locationInvalid = false
				this.customerInvalid = true
			} else if (field === 'location' && this.changedFormData.location.attributes.customer.attributes.company !== this.changedFormData.customer.attributes.company) {
				console.log(field)
				console.log('customer doesnt match location')
			} else if(field === 'location') {
				console.log(field)
				this.locationInvalid = false
				this.customerInvalid = false
			}
		},
		closeModal() {
			this.$emit('close')
		},
		saveData() {
			console.log('saving')
			this.$emit('saveEditEntry', this.changedFormData)
		},
		removeField(key) {
			if( key === 'location' || key === 'customer') {
				delete this.changedFormData['customer']
				delete this.changedFormData['location']
				this.locationInvalid = false
				this.customerInvalid = false
			} else {
				delete this.changedFormData[key]
			}
		}
	}
}
</script>

<style scoped>
label {
	color: var(--main-color);
}
input {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
	border-color: var(--main-color) !important;
}

select {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
	border-color: var(--main-color) !important;
}

textarea {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
	border-color: var(--main-color) !important;
}

.form-check-input {
	border: 1px solid var(--txt-on-second) !important;
	background-color: var(--secondary) !important;
}

.form-check-input:checked {
	border: 1px solid var(--txt-on-second) !important;
	background-color: var(--main-color) !important;
}

.col-6, .col {
	margin-bottom: 30px;
}
</style>
