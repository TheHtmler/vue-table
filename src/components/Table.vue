<template>
    <div class="t-table">
        <table class="table table-hover">
            <thead>
                <tr>
                    <th v-if="showCheckbox"><input type="checkbox" v-model="checkall" @click.stop="checkedAll()"></th>
                    <th v-for="(item, index) in columns" :key="index" @click="sortBy(item.key, index)">
                        {{ item.title }}
                        <span v-if="showSortBy" class="glyphicon" :class="{'glyphicon-sort': currentIndex!==index, 'glyphicon-sort-by-attributes': currentIndex===index&&sortdown, 'glyphicon-sort-by-attributes-alt': currentIndex===index&&sortup}"></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item2, index2) in tableData" :key="index2">
                    <td v-if="showCheckbox"><input type="checkbox" v-model="item2.checked" :value="index2" @click.stop="choosedItem(item2, index2)"></td>
                    <td v-for="(item3, index3) in columns" :key="index3">{{ item2[item3.key] }}</td>
                </tr>
            </tbody>
        </table>
        <div class="pager" id="pager" v-if="showPagenization">
            <span class="form-inline">
                <select class="form-control" v-model="pagesize" v-on:change="showPage(pageCurrent,$event,true)" number>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                </select>
            </span>
            <span v-for="(item,index) in pageCount+1" :key="index">
                <span v-if="item==1" class="btn btn-default" v-on:click="showPage(1,$event)" :class="{'disabled':fDisabled}">
                Start
                </span>
                <span v-if="item==1" class="btn btn-default" v-on:click="showPage(pageCurrent-1,$event)" :class="{'disabled':fDisabled}">
                Previous
                </span>
                <span v-if="item==1" class="btn btn-default" v-on:click="showPage(item,$event)">
                {{item}}
                </span>
                <span v-if="item==1&&item<showPagesStart-1" class="btn btn-default disabled">
                ...
                </span>
                <span v-if="item>1&&item<=pageCount-1&&item>=showPagesStart&&item<=showPageEnd&&item<=pageCount" class="btn btn-default" v-on:click="showPage(item,$event)">
                {{item}}
                </span>
                <span v-if="item==pageCount&&item>showPageEnd+1" class="btn btn-default disabled">
                ...
                </span>
                <span v-if="item==pageCount" class="btn btn-default" v-on:click="showPage(item,$event)" >
                {{item}}
                </span>
                <span v-if="item==pageCount" class="btn btn-default" v-on:click="showPage(pageCurrent+1,$event)" :class="{'disabled':lDisabled}">
                Next
                </span>
                <span v-if="item==pageCount" class="btn btn-default" v-on:click="showPage(pageCount,$event)" :class="{'disabled':lDisabled}">
                End
                </span>
            </span>
            <span>{{pageCurrent}}/{{pageCount}}</span>
        </div>
    </div>
</template>

<script>
import { sortItem } from '@/utils/sortItem'

export default {
    props: {
        columns: {
            type: Array
        },
        showCheckbox: {
            type: Boolean,
        },
        tableData: {
            type: Array
        },
        originData: {
            type: Array,
        },
        showSortBy: {
            type: Boolean,
        },
        defaultSortObj: {
            type: Object
        },
        showPagenization: {
            type: Boolean,
        },
        dataCount: {
            type: Number
        }
    },
    data() {
        return {
            checkall: false,
            selectedItems: [],
            // sort
            isAsc: false,
            sortup: false,
            sortdown: false,
            currentIndex: null,
            // pagenization
            fDisabled:false,
            lDisabled:false,
            pageCount: 20,
            pageCurrent: 1,
            pagesize: 5,
            showPages: 7,
            showPagesStart: 1,
            showPageEnd: 100,
            arrayData: [],
        }
    },
    created () {
        this.tableData.forEach(val => {
            val.checked = false
        })
        if(this.showSortBy) {
            this.sortBy(this.defaultSortObj.sortKey, this.defaultSortObj.index)
        }
    },
    methods: {
        checkedAll() {
            this.checkall = !this.checkall
            this.tableData.forEach(item => {
                item.checked = this.checkall
            })
            if(this.checkall) {
                this.selectedItems = [...this.tableData]
            } else {
                this.selectedItems = []
            }
        },
        choosedItem(item, index) {
            item.checked = !item.checked
            if(item.checked) {
                this.selectedItems.push(item)
            } else {
                this.selectedItems.forEach((val, key) => {
                    if(item == val) {
                        this.selectedItems.splice(key, 1)
                    }
                })
            }
            this.checkall = this.selectedItems.length === this.tableData.length
        },
        sortBy(sortKey, index) {
            if(this.showSortBy) {
                this.isAsc = (this.currentIndex === index) ? !this.isAsc : false
                this.tableData.sort(sortItem(sortKey, !this.isAsc))
                if(this.isAsc) {
                    this.sortup = true
                    this.sortdown = false
                } else {
                    this.sortup = false
                    this.sortdown = true
                }
                this.currentIndex = index
            }
        },
        showPage: function (pageIndex, $event, forceRefresh) {
            if(this.showPagenization) {
                if (pageIndex > 0) {
                    if (pageIndex > this.pageCount) {
                        pageIndex = this.pageCount
                    }

                    // checking if the data needs to be updated
                    var currentPageCount = Math.ceil(this.dataCount / this.pagesize)
                    if (currentPageCount != this.pageCount) {
                        pageIndex = 1
                        this.pageCount = currentPageCount
                    } else if (this.pageCurrent == pageIndex && currentPageCount == this.pageCount && typeof (forceRefresh) == "undefined") {
                        console.log("not refresh")
                        return
                    }

                    //page button active
                    var buttons = $("#pager").find("span")
                    for (var i = 0; i < buttons.length; i++) {
                        if (buttons.eq(i).html() != pageIndex) {
                            buttons.eq(i).removeClass("active")
                        } else {
                            buttons.eq(i).addClass("active")
                        }
                    }

                    // process data
                    var newPageInfo = []
                    for (var i = 0; i < this.pagesize; i++) {
                        let dataObj = this.originData[(i + (pageIndex - 1) * (this.pagesize))]
                        if(dataObj) {
                            newPageInfo[newPageInfo.length] = dataObj
                        }
                    }
                    this.pageCurrent = pageIndex
                    this.arrayData = newPageInfo
                    this.$emit('change-data', this.arrayData)

                    // calculates paging button data
                    if (this.pageCount > this.showPages) {
                        if (pageIndex <= (this.showPages - 1) / 2) {
                            this.showPagesStart = 1
                            this.showPageEnd = this.showPages - 1
                            // console.log("showPage1")
                        } else if (pageIndex >= this.pageCount - (this.showPages - 3) / 2) {
                            this.showPagesStart = this.pageCount - this.showPages + 2
                            this.showPageEnd = this.pageCount
                            // console.log("showPage2")
                        } else {
                            // console.log("showPage3")
                            this.showPagesStart = pageIndex - (this.showPages - 3) / 2
                            this.showPageEnd = pageIndex + (this.showPages - 3) / 2
                        }
                    }
                    // console.log("showPagesStart:" + this.showPagesStart + ",showPageEnd:" + this.showPageEnd + ",pageIndex:" + pageIndex)
                }
            }
        },
    },
    mounted(){
        if(this.showPagenization) {
            this.showPage(this.pageCurrent, null, true)
        }
    }
}
</script>

<style scoped>
    .t-table{
        padding-bottom: 50px;
    }
    .t-table table th{
        cursor: pointer;
        text-align: center;
    }
    .t-table table th .glyphicon-sort{
        color: #b9b9b9;
    }
    select{
        padding: 3px 8px;
    }
</style>
