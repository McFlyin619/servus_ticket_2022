<template>
	<navbar/>
	<router-view />
</template>
<script>
import Navbar from './components/layout/Navbar.vue'
import { Tooltip } from 'bootstrap'
new Tooltip(document.body, {
	selector: "[data-bs-toggle='tooltip']",
	trigger: 'hover'
})
export default {
	components: {
		Navbar
	}
}
</script>
<style></style>
