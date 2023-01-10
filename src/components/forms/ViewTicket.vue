<template>
	<modal-layout :show="true" @close="closeModal" :zIndex="50">
		<template v-slot:header>
			<h1 class="txt-main">Add New {{ title }}</h1>
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
						({{ formData["billedTo"].attributes.company }})
						{{ formData["billedTo"].attributes.firstName }}
						{{ formData["billedTo"].attributes.lastName }}
					</p>
				</div>
				<div
					v-if="formData['islocationCustomer'] !== true"
					class="col-6"
				>
					<label for="location" class="form-label">location </label>
					<p>{{ formData["location"].attributes.address }}</p>
				</div>
				<div v-else class="col-6">
					<div class="d-flex justify-content-between">
						<label for="location" class="form-label">location</label>
						<div v-if="formData['billedTo']" class="form-check">
							<input
								disabled
								class="form-check-input"
								type="checkbox"
								v-model="formData['islocationCustomer']"
								:value="false"
								id="flexCheckDefault"
							/>
							<label
								class="form-check-label"
								for="flexCheckDefault"
								>Same as customer
							</label>
						</div>
					</div>
					<p>
						{{ formData["billedTo"].attributes.address }}
						{{ formData["billedTo"].attributes.address2 }},
						{{ formData["billedTo"].attributes.city }},
						{{ formData["billedTo"].attributes.state }}
						{{ formData["billedTo"].attributes.zipCode }}
					</p>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<label for="issue" class="form-label">Problem</label>
					<p>{{formData['issue']}}</p>
				</div>
			</div>
			<div class="row">
				<div class="col-6">
					<label for="technician" class="form-label"
						>Technician</label
					>
					<p>{{ formData["technician"].attributes.Name }}</p>
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
