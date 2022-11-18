<template>
	<modal-layout :show="show" @close="closeModal">
		<template v-slot:header>
			<h1 class="txt-on-main">Add New {{ title }}</h1>
		</template>
		<template v-slot:default>
			<div class="row row-cols-1 row-cols-md-3 g-4">
				<div v-for="field in fields" :key="field">
					<div v-if="field.type === 'text'" class="mb-3 col">
						<label :for="field" class="form-label">{{ field.title }}</label>
						<input type="text" class="form-control" :id="field" :placeholder="'Enter ' + field.title" />
					</div>
					<div v-if="field.type === 'number'" class="mb-3 col">
						<label :for="field" class="form-label">{{ field.title }}</label>
						<input type="number" class="form-control" :id="field" :placeholder="'Enter ' + field.title" />
					</div>
				</div>
			</div>
			<div v-for="field in fields" :key="field">
				<div v-if="field.type === 'text-area'" class="mb-3">
					<label :for="field" class="form-label">{{ field.title }}</label>
					<textarea class="form-control" :id="field" :placeholder="'Enter ' + field.title" />
				</div>
			</div>
		</template>
		<template v-slot:footer>
			sdgf
		</template>
	</modal-layout>
</template>

<script>
import ModalLayout from '../layout/ModalLayout.vue'
import CustomerFields from '@/configs/customer.json'
export default {
	emits: ['close'],
	props: ['title', 'show'],
	components: {
		ModalLayout
	},
	data() {
		return {
			fields: null
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