<template>
	<div>
		<customer-view v-if="$route.params.page === 'customers'"></customer-view>
		<jobsite-view v-if="$route.params.page === 'jobsites'"></jobsite-view>
	</div>
</template>

<script>
import CustomerView from '@/components/data/Customers.vue'
import JobsiteView from '@/components/data/Jobsites.vue'
export default {
	components: {
		CustomerView,
		JobsiteView
	}
}
</script>