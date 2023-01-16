<template>
	<modal-layout :show="true" @close="closeModal" :zIndex="50">
		<template v-slot:header>
			<h1 class="txt-main">Edit Service Request #{{ data.ticketNumber}}</h1>
		</template>
		<template v-slot:default>
			<div class="d-flex justify-content-between">
				<h3 class="txt-main"></h3>
				<button class="btn btn-danger btn-sm align-self-center" @click="changedFormData = {}, formData.issue = originalFormData.issue">Undo all edits</button>
			</div>
			<div class="row">
				<div class="col-6">
					<label for="customer" class="form-label">Customer</label>
					<div class="d-flex">
						<select
							v-model="changedFormData.customer"
							id="customer"
							class="form-select"
							aria-label="Default select example"
							@change="
								changedData(
									changedFormData.customer,
									'customer'
								)
							"
						>
							<option
								v-if="changedFormData.customer"
								disabled
								:value="undefined"
								selected
							>
								{{
									changedFormData.customer.attributes
										.company
								}}
							</option>
							<option v-else disabled :value="undefined" selected>
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
						<!-- <select v-model="formData['customer']" id="customer" class="form-select" aria-label="Default select example">
							<option disabled :value="undefined" selected>Select Customer...</option>
							<option v-for="customer in locationCustomers" :key="customer" :value="customer">({{ customer.attributes.company }}) {{ customer.attributes.firstName }} {{ customer.attributes.lastName }}</option>
						</select> -->
						<button v-if="changedFormData['customer']" class="btn btn-sm btn-outline-danger ms-1 align-self-center" @click="removeField('customer')">Undo</button>
					</div>
				</div>
				<div class="col-6">
					<div class="d-flex justify-content-between">
						<label for="location" class="form-label">Location</label>
					</div>
					<!-- <select v-if="!formData['customer']" v-model="formData['location']" id="location" class="form-select" aria-label="Default select example">
						<option disabled :value="undefined" selected>Location</option>
						<option v-for="location in locations" :key="location" :value="location">{{ location.attributes.address }} {{ location.attributes.address2 }}, {{ location.attributes.city }}, {{ location.attributes.state }} {{ location.attributes.zipCode }}</option>
					</select> -->
					<div class="d-flex">
						<select
							v-model="changedFormData.location"
							id="customer"
							class="form-select"
							aria-label="Default select example"
							@change="
								changedData(
									changedFormData.location,
									'location'
								)
							"
						>
							<option
								v-if="changedFormData.location"
								disabled
								:value="undefined"
								selected
							>
								{{ changedFormData.location.attributes.address }} {{ changedFormData.location.attributes.address2 }}, {{ changedFormData.location.attributes.city }}, {{ changedFormData.location.attributes.state }} {{ changedFormData.location.attributes.zipCode }}
							</option>
							<option v-else disabled :value="undefined" selected>
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
						<!-- <select v-model="originalFormData['location']" id="location" class="form-select" aria-label="Default select example">
							<option disabled :value="undefined" selected>Select Location...</option>
							<option v-for="location in customerLocations" :key="location" :value="location">{{ location.attributes.address }} {{ location.attributes.address2 }}, {{ location.attributes.city }}, {{ location.attributes.state }} {{ location.attributes.zipCode }}</option>
						</select> -->
						<button v-if="changedFormData.location" class="btn btn-sm btn-outline-danger ms-1 align-self-center" @click="removeField('location')">Undo</button>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<label for="issue" class="form-label">Problem</label>
					<textarea class="form-control" id="issue" v-model="originalFormData['issue']" :placeholder="'Enter issue/problem'"/>
					<button v-if="originalFormData.issue !== editedIssue" class="btn btn-sm btn-outline-danger mt-2" @click="originalFormData.issue = editedIssue">Undo</button>
				</div>
			</div>
			<!-- <div class="row">
				<div class="col-6">
					<label for="technician" class="form-label">Technician</label>
					<div class="d-flex">
						<select v-model="formData['technicians']" id="technician" class="form-select" aria-label="Default select example">
							<option disabled :value="undefined" selected>Select...</option>
							<option v-for="tech in technicians" :key="tech" :value="tech">{{ tech.attributes.Name }}</option>
						</select>
						<button v-if="formData['technicians']" class="btn btn-sm btn-outline-danger ms-1 align-self-center" @click="removeField('technicians')">Clear</button>
					</div>
				</div>
			</div> -->
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
	emits: ['close', 'saveEntry'],
	props: ['title', 'show', 'data', 'customers', 'locations', 'technicians'],
	components: {
		ModalLayout
	},
	data() {
		return {
			fields: TicketFields.formFields,
			originalFormData: {},
			changedFormData: {},
			editedIssue: this.data.issue
		}
	},
	created() {
		this.originalFormData = this.data
	},
	computed: {
		//  FIX THIS SO WHEN YOU OPEN FORM THE LOCATION ONLY SHOWS LOCATIONS FOR THAT CUSTOMER. AND WHEN YOU CHANGE CUSTOMERS ONLY THOSE LOCATIONS SHOW UP
		locationCustomers() {
			if(this.originalFormData['location'] && !this.changedFormData['customer']) {
				return this.customers.filter(i => i.attributes.company !== this.originalFormData['location'].attributes.customer.attributes.company)
			} else {
				return this.customers
			}
		},
		customerLocations() {
			if(this.originalFormData['customer']) {
				return this.locations.filter(i => i.attributes.customer.attributes.company !== this.originalFormData['customer'].attributes.company)
			} else {
				return this.locations
			}
		},
		// filteredCustomers() {
		// 	return this.customers.filter(
		// 		(i) =>
		// 			i.attributes.company !==
		// 			this.formData["customer"].attributes.company
		// 	);
		// },
	},
	methods: {
		changedData(data, field) {
			this.changedFormData = {
				id: this.data.id,
				...this.changedFormData,
				[field]: data,
			};
		},
		closeModal() {
			this.$emit('close')
		},
		saveData() {
			this.$emit('saveEntry', this.formData)
		},
		removeField(key) {
			delete this.changedFormData[key]
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
