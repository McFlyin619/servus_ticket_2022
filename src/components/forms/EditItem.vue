<template>
	<modal-layout :show="true" @close="closeModal" :zIndex="50">
		<template v-slot:header>
			<h1 v-if="title === 'Customer'" class="txt-main">
				Edit - {{ data.firstName }} {{ data.lastName }}
			</h1>
			<h1 v-if="title === 'location'" class="txt-main">
				Edit - {{ data.address }}
			</h1>
			<h1 v-if="title === 'Service'" class="txt-main">
				Edit - {{ data.name }}
			</h1>
		</template>
		<template v-slot:default>
			<div class="row row-cols-1 row-cols-md-3 g-4">
				<div v-for="field in fields" :key="field">
					<div v-if="field.type === 'dropdown'" class="mb-3 col">
						<div class="d-flex">
							<label :for="field" class="form-label">{{
								field.title
							}}</label>
						</div>
						<select
							v-model="changedFormData['customer']"
							id="customer"
							class="form-select"
							aria-label="Default select example"
							@change="
								changedData(
									changedFormData[field.field],
									field.field
								)
							"
						>
							<option
								v-if="changedFormData['customer']"
								disabled
								:value="undefined"
								selected
							>
								{{
									changedFormData["customer"].attributes
										.company
								}}
							</option>
							<option v-else disabled :value="undefined" selected>
								{{ formData["customer"].attributes.company }}
							</option>
							<option
								v-for="customer in filteredCustomers"
								:key="customer"
								:value="customer"
							>
								{{ customer.attributes.company }}
							</option>
						</select>
					</div>
					<div v-if="field.type === 'text'" class="mb-3 col">
						<label :for="field" class="form-label">{{
							field.title
						}}</label>
						<input
							type="text"
							class="form-control"
							:id="field"
							v-model="formData[field.field]"
							:placeholder="'Enter ' + field.title"
							@change="
								changedData(formData[field.field], field.field)
							"
						/>
					</div>
					<div v-if="field.type === 'number'" class="mb-3 col">
						<label :for="field" class="form-label">{{
							field.title
						}}</label>
						<input
							type="number"
							class="form-control"
							:id="field"
							v-model="formData[field.field]"
							:placeholder="'Enter ' + field.title"
							@change="
								changedData(formData[field.field], field.field)
							"
						/>
					</div>
				</div>
			</div>
			<div v-for="field in fields" :key="field">
				<div v-if="field.type === 'text-area'" class="mb-3">
					<label :for="field" class="form-label">{{
						field.title
					}}</label>
					<textarea
						class="form-control"
						:id="field"
						v-model="formData[field.field]"
						:placeholder="'Enter ' + field.title"
						@change="
							changedData(formData[field.field], field.field)
						"
					/>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<div class="d-flex justify-content-between">
				<button
					class="btn but-outline-modal-cancel"
					@click="closeModal"
				>
					Cancel
				</button>
				<button
					:disabled="!this.changedFormData.id"
					class="btn but-outline-modal-save"
					@click="saveData"
				>
					Save
				</button>
			</div>
		</template>
	</modal-layout>
</template>

<script>
import ModalLayout from "../layout/ModalLayout.vue";
import CustomerFields from "@/configs/customer.json";
import locationFields from "@/configs/locations.json";

export default {
	emits: ["close", "saveEditEntry"],
	props: ["title", "show", "data", "customers"],
	components: {
		ModalLayout,
	},
	data() {
		return {
			fields: null,
			formData: this.data,
			changedFormData: {},
		};
	},
	created() {
		this.getFormFields();
	},
	computed: {
		filteredCustomers() {
			return this.customers.filter(
				(i) =>
					i.attributes.company !==
					this.formData["customer"].attributes.company
			);
		},
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
			this.$emit("close");
		},
		getFormFields() {
			if (this.title === "Customer")
				this.fields = CustomerFields.formFields;
			if (this.title === "Location")
				this.fields = locationFields.formFields;
		},
		saveData() {
			if (!Object.keys(this.changedFormData)) return;
			this.$emit("saveEditEntry", this.changedFormData);
		},
	},
};
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