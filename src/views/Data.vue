<template>
	<div>
		<customer-view v-if="$route.params.page === 'customers'"></customer-view>
	</div>
</template>

<script>
import CustomerView from '@/components/data/Customers.vue'
export default {
	components: {
		CustomerView
	}
}
</script>