<template>
	<modal-layout :show="true" @close="closeModal" :zIndex="50">
		<template v-slot:header>
			<h1 class="txt-main">Add New {{ title }}</h1>
		</template>
		<template v-slot:default>
			<div class="row">
				<h3 class="txt-main">Ticket # {{ nextTicketNumber }}</h3>
			</div>
			<div class="row">
				<div class="col-6">
					<label for="customer" class="form-label">Customer</label>
					<select v-model="formData['billedTo']" id="customer" class="form-select" aria-label="Default select example">
						<option disabled :value="undefined" selected>Choose...</option>
						<option v-for="customer in customers" :key="customer" :value="customer">({{ customer.company }}) {{ customer.firstName }} {{ customer.lastName }}</option>
					</select>
				</div>
				<div v-if="formData['isJobsiteCustomer'] !== true" class="col-6">
					<div class="d-flex justify-content-between">
						<label for="jobsite" class="form-label">Jobsite</label>
						<div v-if="formData['billedTo']" class="form-check">
							<input class="form-check-input" type="checkbox" v-model="formData['isJobsiteCustomer']" :value="true" id="flexCheckDefault" />
							<label class="form-check-label" for="flexCheckDefault">Same as customer </label>
						</div>
					</div>
					<select v-model="formData['jobsite']" id="jobsite" class="form-select" aria-label="Default select example">
						<option disabled :value="undefined" selected>Choose...</option>
						<option v-for="jobsite in jobsites" :key="jobsite" :value="jobsite">{{ jobsite.address }}</option>
					</select>
				</div>
				<div v-else class="col-6">
					<div class="d-flex justify-content-between">
						<label for="jobsite" class="form-label">Jobsite</label>
						<div v-if="formData['billedTo']" class="form-check">
							<input class="form-check-input" type="checkbox" v-model="formData['isJobsiteCustomer']" :value="false" id="flexCheckDefault" />
							<label class="form-check-label" for="flexCheckDefault">Same as customer </label>
						</div>
					</div>
					<select v-model="formData['customerIsJobsite']" id="jobsite" class="form-select" aria-label="Default select example">
						<option disabled :value="undefined" selected>Verify Address...</option>
						<option selected :value="formData['billedTo'].address">{{ formData['billedTo'].address }} {{ formData['billedTo'].address2 }}, {{ formData['billedTo'].city }}, {{ formData['billedTo'].state }} {{ formData['billedTo'].zipCode }}</option>
					</select>
				</div>
			</div>
			<!-- <label for="customer" class="form-label">{{ field.title }}</label>
				<input type="text" class="form-control" :id="field" v-model="formData[field.field]" :placeholder="'Enter ' + field.title" /> -->

			<!-- <label :for="field" class="form-label">{</label>
				<input type="number" class="form-control" v-model="formData[field.field]" :placeholder="'Enter ' + field.title" /> -->
			<div class="row">
				<div class="col">
					<label for="issue" class="form-label">Problem</label>
					<textarea class="form-control" id="issue" v-model="formData['issue']" :placeholder="'Enter issue/problem'" />
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
	emits: ['close', 'saveEntry'],
	props: ['title', 'show', 'nextTicketNumber', 'customers', 'jobsites'],
	components: {
		ModalLayout
	},
	data() {
		return {
			fields: TicketFields.formFields,
			formData: {}
		}
	},
	created() {},
	methods: {
		closeModal() {
			this.$emit('close')
		},
		saveData() {
			this.$emit('saveEntry', this.formData)
		}
	}
}
</script>

<style>
label {
	color: var(--main-color);
}
input {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
}

select {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
}

textarea {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
}

.form-check-input {
	border: 1px solid var(--txt-on-second) !important;
	background-color: var(--secondary) !important;
}

.form-check-input:checked {
	border: 1px solid var(--txt-on-second) !important;
	background-color: var(--main-color) !important;
}
</style>
