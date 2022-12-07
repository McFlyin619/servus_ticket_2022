<template>
	<teleport to="body">
		<div
			v-if="show"
			class="backdrop"
			:style="'z-index:' + (zIndex - 1)"
		></div>
		<dialog
			open
			v-if="show"
			class="bg-dialog"
			:class="{'delete' : deleteModal === true}"
			:style="'z-index:' + zIndex"
		>
			<header class="d-flex justify-content-between px-3 mt-3 pb-3 border-bottom">
				<slot name="header"></slot>
				<button
						class="align-self-center  btn-close text-danger"
						aria-label="Close"
						@click="closeModal"
				>
				</button>
			</header>
			<section class="p-5">
				<slot></slot>
			</section>
			<footer class="px-5 mb-3">
				<slot name="footer"></slot>
			</footer>
		</dialog>
	</teleport>
</template>
<script>
export default {
	emits: ['close'],
	props:['show', 'deleteModal', 'zIndex'],
	methods: {
		closeModal () {
			this.$emit('close')
		}
	}
}
</script>

<style scoped>
.backdrop {
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.75);
}

::-webkit-scrollbar {
	display: none;
}

dialog {
	position: fixed;
	top: 20vh;
	left: 25% !important;
	width: 50%;
	height: 60vh;
	border: none;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
	padding: 0;
	margin: 0;
	overflow: scroll;
	border-radius: 8px;
	/* border: 1px solid var(--txt-on-main); */
	-webkit-animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
		both;
	animation: slide-in-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
	background-color: var(--secondary);
}

dialog.delete {
	height: auto;
}

@media only screen and (max-width:950px) {
	dialog {
		left: 5% !important;
		width: 90%;
	}
}

@-webkit-keyframes slide-in-top {
	0% {
		-webkit-transform: translateY(-1000px);
		transform: translateY(-1000px);
		opacity: 0;
	}
	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}
}
@keyframes slide-in-top {
	0% {
		-webkit-transform: translateY(-1000px);
		transform: translateY(-1000px);
		opacity: 0;
	}
	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
		opacity: 1;
	}
}
</style>