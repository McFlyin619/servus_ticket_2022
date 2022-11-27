<template>
	<modal-layout :show="true" @close="closeModal"  :zIndex="50">
		<template v-slot:header>
			<h1 v-if="title === 'Customer'" class="txt-on-main">Edit - {{ data.firstName }} {{ data.lastName }}</h1>
			<h1 v-if="title === 'Jobsite'" class="txt-on-main">Edit - {{ data.address }} </h1>
			<h1 v-if="title === 'Service'" class="txt-on-main">Edit - {{ data.name }}</h1>
		</template>
		<template v-slot:default>
			<div class="row row-cols-1 row-cols-md-3 g-4">
				<div v-for="field in fields" :key="field">
					<div v-if="field.type === 'text'" class="mb-3 col">
						<label :for="field" class="form-label">{{ field.title }}</label>
						<input type="text" class="form-control" :id="field" v-model="formData[field.field]" :placeholder="'Enter ' + field.title" @change="changedData(formData[field.field], field.field)" />
					</div>
					<div v-if="field.type === 'number'" class="mb-3 col">
						<label :for="field" class="form-label">{{ field.title }}</label>
						<input type="number" class="form-control" :id="field" v-model="formData[field.field]" :placeholder="'Enter ' + field.title"  @change="changedData(formData[field.field], field.field)" />
					</div>
				</div>
			</div>
			<div v-for="field in fields" :key="field">
				<div v-if="field.type === 'text-area'" class="mb-3">
					<label :for="field" class="form-label">{{ field.title }}</label>
					<textarea class="form-control" :id="field"  v-model="formData[field.field]" :placeholder="'Enter ' + field.title"  @change="changedData(formData[field.field], field.field)" />
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<div class="d-flex justify-content-between">
				<button class="btn but-outline-modal-cancel" @click="closeModal">Cancel</button>
				<button :disabled="!this.changedFormData.id" class="btn but-outline-modal-save" @click="saveData">Save</button>
			</div>
		</template>
	</modal-layout>
</template>

<script>
import ModalLayout from '../layout/ModalLayout.vue'
import CustomerFields from '@/configs/customer.json'
import JobsiteFields from '@/configs/jobsite.json'
import ServiceFields from '@/configs/service.json'

export default {
	emits: ['close', 'saveEditEntry'],
	props: ['title', 'show', 'data'],
	components: {
		ModalLayout
	},
	data() {
		return {
			fields: null,
			formData: this.data,
			changedFormData: {}
		}
	},
	created() {
		this.getFormFields()
	},
	methods: {
		changedData(data, field) {
			this.changedFormData = { id: this.data.id, ...this.changedFormData, [field]: data}
			console.log(this.changedFormData)
		},
		closeModal() {
			this.$emit('close')
		},
		getFormFields() {
			if (this.title === 'Customer') this.fields = CustomerFields.formFields
			if (this.title === 'Jobsite') this.fields = JobsiteFields.formFields
			if (this.title === 'Service') this.fields = ServiceFields.formFields

		},
		saveData() {
			if (!Object.keys(this.changedFormData)) return
			this.$emit('saveEditEntry', this.changedFormData)
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

}

textarea {
	background-color: var(--secondary) !important;
	color: var(--txt-on-second) !important;

}
</style>