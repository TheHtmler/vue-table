<template>
    <div>
        <header>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a href="/" class="navbar-brand">LOGO</a>
                <ul class="navbar-nav">
                    <li><router-link to="/" class="nav-link">Table</router-link></li>
                </ul>
            </nav>
        </header>
        <t-table :tableData="tableData" :columns="columns" :showCheckbox="true" :showSortBy="true" :defaultSortObj="defaultSortObj" :showPagenization="true" :originData="originData" :dataCount="tableDataLen" @change-data="changeData"></t-table>
        <router-view></router-view>
    </div>
</template>

<script>
import tTable from '@/components/Table'
import { sortItem } from '@/utils/sortItem'
import person from '@/data/person'

export default {
    components: {
        tTable
    },
    data() {
        return {
            columns: [{
                title: 'Name',
                key: 'name'
            },{
                title: 'Age',
                key: 'age'
            },{
                title: 'Sex',
                key: 'sex'
            }],
            tableData: [],
            defaultSortObj: {
                sortKey: 'name',
                index: 0
            },
            originData: [],
            tableDataLen: 0
        }
    },
    created() {
        this.getData()
    },
    methods: {
        getData() {
            this.tableData = person
            this.tableData.sort(sortItem(this.defaultSortObj.sortKey, true))
            this.originData = [...this.tableData]
            this.tableDataLen = this.tableData.length
        },
        changeData(val) {
            this.tableData = val
        }
    }
}
</script>

