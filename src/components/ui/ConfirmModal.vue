<template>
	<modal-layout :show="true" @close="closeModal" :deleteModal="true">
		<template v-slot:header>
			<h1 :class="[ typeOfConfirm === 'delete' || typeOfConfirm === 'error' ? 'color-error' : 'txt-on-main']">{{ title }} <span v-if="page === 'customer'">{{ data.firstName }} {{ data.lastName }}?</span></h1>
		</template>
		<template v-slot:default>
			<h3 class="text-center txt-on-main">{{message}}</h3>
		</template>
		<template v-slot:footer>
			<div v-if="typeOfConfirm === 'error'" class="d-flex justify-content-center">
				<button class="btn but-outline-modal-save me-2" @click="closeModal">Ok</button>
			</div>
			<div v-else class="d-flex justify-content-center">
				<button class="btn but-outline-modal-save me-2" @click="confirm">Yes</button>
				<button class="btn but-outline-modal-cancel" @click="closeModal">No</button>
			</div>
		</template>
	</modal-layout>
</template>
<script>
import ModalLayout from '../layout/ModalLayout.vue'
export default {
	emits: ['close', 'confirm'],
	props: ['title', 'show', 'message', 'data', 'page', 'typeOfConfirm'],
	components: {
		ModalLayout
	},
	data() {
		return {
		}
	},
	methods: {
		closeModal() {
			this.$emit('close')
		},
		confirm() {
			this.$emit('confirm')
		}
	}
}
</script>