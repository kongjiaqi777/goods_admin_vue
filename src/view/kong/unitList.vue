<template>
  <div>
    <Card>
      <i-button type="primary" click="addForm">添加</i-button>
      <i-table :columns="unitColumns" :data="unitData" style="margin-top: 30px;"></i-table>
      <Page
      :total="totalCount"
      :current="currentPage"
      :page-size="pageSize"
      style="margin-top: 50px;text-align: center;"
      show-total
      show-elevator
      @on-change="changePage">
      </Page>
    </Card>
  </div>
</template>

<script>
import { getUnitList } from '@/api/customer'

export default {
  name: 'unit_list',
  data () {
    return {
      unitColumns: [
        { title: '编号', key: 'id', sortable: true },
        { title: '单位名称', key: 'unit_name' }
      ],
      unitData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 20
    }
  },
  mounted () {
    this.getUnitListData()
  },
  methods: {
    getUnitListData () {
      getUnitList().then(res => {
        this.unitData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      }).catch(err => {
        console.log(err)
      })
    },
    changePage () {
    },
    addForm () {
    }
  }
}
</script>
