<template>
  <div>
    <Card>
      <Tooltip placement="right-start" max-width="200">
        <i-button @click="handleAdd" type="primary" size="large">添加还款记录</i-button>
        <div slot="content">
            <p>点击此处添加商品，确保添加之前商品类别已经存在</p>
            <p><i>商品名称最好具有唯一标示性</i></p>
        </div>
      </Tooltip>

      <i-table :columns="paymentColumns" :data="paymentData" style="margin-top: 30px;"></i-table>
      <Page :total="totalCount" :current="currentPage" :page-size="pageSize" style="margin-top: 50px;text-align: center;" show-total show-elevator @on-change="changePage"></Page>
    </Card>
    <Modal v-model="showDetail" :title="modelTitle" @on-ok="paymentSubmit" @on-cancel="clearFormData">
      <i-form ref="paymentForm" :model="addPaymentForm" :rules="paymentRule" :label-width="80">
        <!-- 顾客姓名 -->
        <Form-item prop="user_id" label="顾客姓名">
          <i-select v-model="addPaymentForm.user_id" placeholder="请选择顾客" filterable>
            <i-option v-for="item in this.customerData" :key="item.id" :label="item.name" :value="item.id"></i-option>
          </i-select>
        </Form-item>
        <!-- 还款金额 -->
        <Form-item prop="pay_number" label="还款金额">
          <i-input type="text" v-model="addPaymentForm.pay_number" placeholder="请输入还款金额">
          </i-input>
        </Form-item>
        <!-- 还款方式 -->
        <Form-item label="付款方式" prop="pay_way">
          <RadioGroup v-model="addPaymentForm.pay_way">
            <Radio v-for="item in this.payWay" :label="item.value" :key="item.value">
              <span>{{item.label}}</span>
            </Radio>
          </RadioGroup>
        </Form-item>
        <!-- 备注信息 -->
        <Form-item prop="comment" label="备注信息">
          <i-input type="text" v-model="addPaymentForm.comment" placeholder="请输入备注信息">
          </i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>

<script>
import { getPaymentList, addPaymentInfo, modifyPaymentInfo, getCustomerInfo } from '@/api/customer'
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
        // {
        //   title: '用户类型',
        //   key: 'user_type',
        //   render: (h, params) => {
        //     return h('div',
        //       util.getPaymentType(params.row.user_type)
        //     )
        //   }
        // },
        {
          title: '付款方式',
          key: 'pay_way',
          render: (h, params) => {
            return h('div',
              util.showPayWay(params.row.pay_way)
            )
          }
        },
        {
          title: '还款金额',
          key: 'pay_number',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.pay_number)
            )
          }
        },
        { title: '备注信息', key: 'comment' },
        { title: '创建时间', key: 'created_at' }
      ],
      paymentData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      paymentParam: {
        page: 1,
        perpage: 20
      },
      addPaymentForm: {
        user_id: 0,
        pay_number: 0,
        pay_way: 1,
        user_type: 1
      },
      // 付款方式
      payWay: [
        { value: 1, label: '现金' },
        { value: 2, label: '微信' },
        { value: 3, label: '支付宝' },
        { value: 4, label: '银行卡' }
      ],
      showDetail: false,
      modelType: 1,
      modelTitle: '添加还款记录',
      // 添加validate
      paymentRule: {
        user_id: [
          { required: true, message: '请选择顾客' }
        ],
        pay_number: [
          { required: true, message: '请填写还款金额', trigger: 'blur' }
        ]
      },
      // 顾客列表数据
      customerData: []
    }
  },
  mounted () {
    this.getPaymentList()
    this.getCustomerInfo()
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
    },
    handleAdd () {
      this.showDetail = true
      this.modelType = 1
      this.modelTitle = '添加还款记录'
    },
    paymentSubmit () {
      this.$refs.paymentForm.validate((valid) => {
        if (valid) {
          this.addPaymentForm.pay_number = util.moneyFormatterInput(this.addPaymentForm.pay_number)
          if (this.modelType === 1) {
            addPaymentInfo(this.addPaymentForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功!')
                // 清理form数据
                this.showDetail = false
                this.getPaymentList()
                this.clearFormData()
              } else {
                this.$Message.error('添加失败请重试!')
                this.clearFormData()
              }
            }).catch(err => {
              console.log(err)
              this.$Message.error('添加失败请重试!')
              this.clearFormData()
            })
          } else if (this.modelType === 2) {
            modifyPaymentInfo(this.addPaymentForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('修改成功!')
                // 清理form数据
                this.showDetail = false
                this.getPaymentList()
                this.clearFormData()
              } else {
                this.$Message.error('修改失败请重试!')
                this.clearFormData()
              }
            })
          }
        } else {
          this.$Message.error('表单验证失败!')
          this.clearFormData()
        }
      })
    },
    clearFormData () {
      this.addPaymentForm.user_id = 0
      this.addPaymentForm.pay_number = 0
      this.addPaymentForm.pay_way = 1
    },
    // 获取客户列表
    getCustomerInfo () {
      getCustomerInfo().then(res => {
        this.customerData = res.data.info.list
      })
    }
  }
}
</script>
