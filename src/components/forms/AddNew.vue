<template>
	<modal-layout :show="true" @close="closeModal"  :zIndex="50">
		<template v-slot:header>
			<h1 class="txt-main">Add New {{ title }}</h1>
		</template>
		<template v-slot:default>
			<div class="row row-cols-1 row-cols-md-3 g-4">
				<div v-for="field in fields" :key="field">
					<div v-if="field.type === 'dropdown'" class="mb-3 col">
						<label :for="field" class="form-label">{{ field.title }}</label>
						<select v-model="formData['customer']" id="customer" class="form-select" aria-label="Default select example">
							<option disabled :value="undefined" selected>Select...</option>
							<option v-for="customer in customers" :key="customer" :value="customer">{{ customer.attributes.company }}</option>
					</select>	
					</div>
					<div v-if="field.type === 'text'" class="mb-3 col">
						<label :for="field" class="form-label">{{ field.title }}</label>
						<input type="text" class="form-control" :id="field" v-model="formData[field.field]" :placeholder="'Enter ' + field.title" />
					</div>
					<div v-if="field.type === 'number'" class="mb-3 col">
						<label :for="field" class="form-label">{{ field.title }}</label>
						<input type="number" class="form-control" :id="field" v-model="formData[field.field]" :placeholder="'Enter ' + field.title" />
					</div>
				</div>
			</div>
			<div v-for="field in fields" :key="field">
				<div v-if="field.type === 'text-area'" class="mb-3">
					<label :for="field" class="form-label">{{ field.title }}</label>
					<textarea class="form-control" :id="field"  v-model="formData[field.field]" :placeholder="'Enter ' + field.title" />
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
import CustomerFields from '@/configs/customer.json'
import LocationFields from '@/configs/locations.json'
export default {
	emits: ['close', 'saveEntry'],
	props: ['title', 'show', 'customers'],
	components: {
		ModalLayout
	},
	data() {
		return {
			fields: null,
			formData: {}
		}
	},
	created() {
		this.getFormFields()
	},
	methods: {
		closeModal() {
			this.$emit('close')
		},
		getFormFields() {
			if (this.title === 'Customer') this.fields = CustomerFields.formFields
			if (this.title === 'Location') this.fields = LocationFields.formFields
		},
		saveData() {
			this.$emit('saveEntry', this.formData)
		}
	}
}
</script>

<style>
label {
	color: var(--txt-on-second);
}
input {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
	border-color: var(--main-color) !important;

}

textarea {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
	border-color: var(--main-color) !important;


}

select {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;
	border-color: var(--main-color) !important;
}
</style>