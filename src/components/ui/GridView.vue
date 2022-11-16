<template>
	<div>
		<ag-grid-vue
			style="width: 100%; height: 65vh"
			class="ag-theme-alpine"
			:rowData="gridData"
			:columnDefs="columnDefs"
			:animateRows="true"
			@grid-ready="onGridReady"
		>
		</ag-grid-vue>
	</div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue3";  // the AG Grid Vue Component

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
export default {
	props: ['gridData', 'columnDefs'],
	components: {
		AgGridVue
	},
	data () {
		return {
			gridApi: null,
			columnApi: null
		}
	},
	methods: {
		onGridReady (params) {
			this.gridApi = params.api
			this.columnApi = params.columnApi
		},
	}
}
</script>