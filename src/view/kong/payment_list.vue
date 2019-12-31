<template>
  <div>
    <Card>
        <i-table :columns="paymentColumns" :data="paymentData"></i-table>
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
import { getPaymentList } from '@/api/customer'
import * as util from '@/utils/util'

export default {
  name: 'payment_list',
  data () {
    return {
      // 还款列表
      paymentColumns: [
        { title: '用户ID', key: 'user_id' },
        {
          title: '姓名',
          key: 'user_id',
          render: (h, params) => {
            if (params.row.user_type === 1) {
              return h('div',
                params.row.customer_name
              )
            } else {
              return h('div',
                params.row.supplier_name
              )
            }
          }
        },
        {
          title: '用户类型',
          key: 'user_type',
          render: (h, params) => {
            return h('div',
              util.getPaymentType(params.row.user_type)
            )
          }
        },
        {
          title: '付款方式',
          key: 'pay_way',
          render: (h, params) => {
            return h('div',
              util.showPayWay(params.row.pay_way)
            )
          }
        },
        { title: '已付金额', key: 'pay_number' },
        { title: '备注信息', key: 'comment' },
        { title: '图片', key: 'photo' },
        { title: '创建时间', key: 'created_at' },
        { title: '修改时间', key: 'updated_at' }
      ],
      paymentData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      paymentParam: {
        page: 1,
        perpage: 20
      }
    }
  },
  mounted () {
    this.getPaymentList()
  },
  methods: {
    getPaymentList () {
      getPaymentList({ 'user_type': 1 }).then(res => {
        this.paymentData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      }).catch(err => {
        console.log(err)
      })
    },
    changePage (page) {
      this.currentPage = page
      this.paymentParam.page = page
      this.paymentParam.perpage = this.pageSize
      this.getPaymentList()
    }
  }
}
</script>
