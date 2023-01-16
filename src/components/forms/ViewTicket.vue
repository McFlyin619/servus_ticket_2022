<template>
	<modal-layout :show="true" @close="closeModal" :zIndex="50">
		<template v-slot:header>
			<h1 class="txt-main">View Service Request # {{ formData["ticketNumber"] }}</h1>
		</template>
		<template v-slot:default>
			<div class="row">
				<h3 class="txt-main">
					Ticket # {{ formData["ticketNumber"] }}
				</h3>
			</div>
			<div class="row">
				<div class="col-6">
					<label for="customer" class="form-label">Customer</label>
					<p>
						({{ formData["customer"].attributes.company }})
						{{ formData["customer"].attributes.firstName }}
						{{ formData["customer"].attributes.lastName }}
					</p>
				</div>
				<div class="col-6">
					<div class="d-flex justify-content-between">
						<label for="location" class="form-label">Location</label>
					</div>
					<p>
						{{ formData["location"].attributes.address }}
						{{ formData["location"].attributes.address2 }},
						{{ formData["location"].attributes.city }},
						{{ formData["location"].attributes.state }}
						{{ formData["location"].attributes.zipCode }}
					</p>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<label for="issue" class="form-label">Problem/Issue</label>
					<p>{{formData['issue']}}</p>
				</div>
			</div>
			<div class="row">
				<div class="col-6">
					<label for="technician" class="form-label"
						>Technician</label
					>
					<p>{{ formData["technicianName"] }}</p>
				</div>
			</div>
		</template>
		<template v-slot:footer>
			<div class="d-flex justify-content-between">
				<button
					class="btn but-outline-modal-cancel"
					@click="closeModal"
				>
					Close
				</button>
			</div>
		</template>
	</modal-layout>
</template>

<script>
import ModalLayout from "../layout/ModalLayout.vue";
import TicketFields from "@/configs/tickets.json";
export default {
	emits: ["close", "saveEntry"],
	props: ["title", "show", "data"],
	components: {
		ModalLayout,
	},
	data() {
		return {
			fields: TicketFields.formFields,
			formData: this.data,
		};
	},
	created() {},
	methods: {
		closeModal() {
			this.$emit("close");
		},
		saveData() {
			this.$emit("saveEntry", this.formData);
		},
	},
};
</script>

<style scoped>
label {
	color: var(--txt-on-second);
	border-bottom: solid 1px var(--txt-on-second);
	font-size: 0.9rem;
}

p {
	color: var(--main-color);
	font-size: 1.2rem;
}

.col-6,
.col {
	margin-bottom: 30px;
}
</style>
