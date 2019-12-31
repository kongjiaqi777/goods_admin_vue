<template>
  <div>
      <Card>
      <i-button type="primary" @click="addForm">添加</i-button>
      <i-table :columns="customerColumns" :data="customerData" style="margin-top: 30px;"></i-table>
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
    <Modal
      v-model="showDetail"
      :title="modelTitle"
      @on-ok="AddCustomerSubmit" @on-cancel="clearFormData">
      <i-form ref="customerForm" :model="addCustomerForm" :rules="addCustomerRule">
        <Form-item prop="name" label="姓名">
          <i-input type="text" v-model="addCustomerForm.name" placeholder="请输入顾客姓名">
          </i-input>
        </Form-item>
        <Form-item prop="type" label="顾客类别">
          <RadioGroup v-model="addCustomerForm.type">
              <Radio v-for="item in customerType" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
        </Form-item>
        <Form-item prop="phone" label="联系电话">
          <i-input type="text" v-model="addCustomerForm.phone" placeholder="请输入联系电话">
          </i-input>
        </Form-item>
        <Form-item prop="wechat" label="微信号码">
          <i-input type="text" v-model="addCustomerForm.wechat" placeholder="请输入微信号码">
          </i-input>
        </Form-item>
        <Form-item prop="address" label="联系地址">
          <i-input type="text" v-model="addCustomerForm.address" placeholder="请输入联系地址">
          </i-input>
        </Form-item>
        <Form-item prop="car_type" label="常用车型">
          <i-input type="text" v-model="addCustomerForm.car_type" placeholder="请输入常用车型">
          </i-input>
        </Form-item>
        <Form-item prop="car_number" label="车牌号码">
          <i-input type="text" v-model="addCustomerForm.car_number" placeholder="请输入车牌号码">
          </i-input>
        </Form-item>
        <Form-item prop="contact_name" label="其他联系人">
          <i-input type="text" v-model="addCustomerForm.contact_name" placeholder="请输入顾客亲属等常用联系人">
          </i-input>
        </Form-item>
        <Form-item prop="bank_account" label="银行账户">
          <i-input type="text" v-model="addCustomerForm.bank_account" placeholder="请输入顾客银行账户">
          </i-input>
        </Form-item>
        <Form-item prop="total_cost" label="总消费">
          <i-input type="text" v-model="addCustomerForm.total_cost" placeholder="请输入顾客在本店总消费">
          </i-input>
        </Form-item>
        <Form-item prop="debt" label="欠款金额">
          <i-input type="text" v-model="addCustomerForm.debt" placeholder="请输入顾客在本店的欠款金额">
          </i-input>
        </Form-item>
        <Form-item prop="repayment" label="已还款金额">
          <i-input type="text" v-model="addCustomerForm.repayment" placeholder="请输入顾客在本店已经还款金额">
          </i-input>
        </Form-item>
        <Form-item prop="comment" label="备注信息">
          <i-input type="text" v-model="addCustomerForm.comment" placeholder="备注信息">
          </i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>
<script>
// import Tables from '_c/tables'
import { getCustomerInfo, addCustomerInfo, updateCustomerInfo } from '@/api/customer'
import * as util from '@/utils/util'

export default {
  name: 'customer_list',
  data () {
    return {
      customerColumns: [
        { title: '编号', key: 'id', sortable: true },
        {
          title: '类型',
          key: 'type',
          render: (h, params) => {
            return h('div',
              util.getCustomerType(params.row.type)
            )
          }
        },
        { title: '用户姓名', key: 'name' },
        { title: '联系方式', key: 'phone' },
        { title: '微信', key: 'wechat' },
        { title: '通信地址', key: 'address' },
        { title: '车型', key: 'car_type' },
        { title: '车牌号', key: 'car_number' },
        { title: '联系人', key: 'contact_name' },
        { title: '银行账户', key: 'bank_account' },
        {
          title: '欠款',
          key: 'debt',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.debt)
            )
          }
        },
        {
          title: '总消费',
          key: 'total_cost',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.total_cost)
            )
          }
        },
        {
          title: '还款',
          key: 'repayment',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.repayment)
            )
          }
        },
        { title: '备注信息', key: 'comment' },
        {
          title: '操作',
          key: 'handle',
          render: (h, params) => {
            return h('div',
              [
                h('Button', {
                  props: {
                    type: 'primary'
                  },
                  style: {
                    width: '80%',
                    display: 'flex',
                    'justify-content': 'center'
                  },
                  on: {
                    click: () => {
                      this.showDetail = true
                      this.modelType = 2
                      this.modelTitle = '修改顾客信息'
                      this.addCustomerForm.id = params.row.id
                      this.addCustomerForm.name = params.row.name
                      this.addCustomerForm.type = params.row.type
                      this.addCustomerForm.phone = params.row.phone
                      this.addCustomerForm.wechat = params.row.wechat
                      this.addCustomerForm.address = params.row.address
                      this.addCustomerForm.car_type = params.row.car_type
                      this.addCustomerForm.car_number = params.row.car_number
                      this.addCustomerForm.contact_name = params.row.contact_name
                      this.addCustomerForm.total_cost = params.row.total_cost
                      this.addCustomerForm.debt = params.row.debt
                      this.addCustomerForm.repayment = params.row.repayment
                      this.addCustomerForm.comment = params.row.comment
                      this.addCustomerForm.bank_account = params.row.bank_account
                    }
                  }
                }, '修改')
              ]
            )
          }
        }
      ],
      // 参数
      customerData: [],
      addCustomerForm: {
        name: '',
        type: 1,
        phone: '',
        wechat: '',
        address: '',
        car_type: '',
        car_number: '',
        contact_name: '',
        bank_account: '',
        total_cost: 0,
        debt: 0,
        repayment: 0,
        comment: '',
        id: 0
      },
      addCustomerRule: {
        phone: [
          { required: true, message: '请输入联系电话' }
        ],
        name: [
          { required: true, message: '请填写名称', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择类别' }
        ],
        comment: [
          { type: 'string', max: 20, message: '长度不能大于20位', trigger: 'blur' }
        ]
      },
      showDetail: false,
      modelTitle: '添加新客户',
      customerType: [
        { value: 1, label: '普通客户' },
        { value: 2, label: '公司' },
        { value: 3, label: '车队' }
      ],
      modelType: 1,
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      customerParam: {
        page: 1,
        perpage: 20
      }
    }
  },
  mounted () {
    this.getCustomerListData()
  },
  methods: {
    getCustomerListData () {
      getCustomerInfo(this.customerParam).then(res => {
        this.customerData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      }).catch(err => {
        console.log(err)
      })
    },
    AddCustomerSubmit () {
      this.$refs.customerForm.validate((valid) => {
        if (valid) {
          this.FormatterInput()
          if (this.modelType === 1) {
            addCustomerInfo(this.addCustomerForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功!')
                // 清理form数据
                this.showDetail = false
                this.getCustomerListData()
                // 清理form数据
                this.clearFormData()
              } else {
                this.$Message.error('添加失败请重试!')
              }
            }).catch(err => {
              console.log(err)
              this.$Message.error('添加失败请重试!')
            })
          } else if (this.modelType === 2) {
            updateCustomerInfo(this.addCustomerForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('更新成功!')
                // 清理form数据
                this.showDetail = false
                this.getCustomerListData()
                // 清理form数据
                this.clearFormData()
              } else {
                this.$Message.error('更新失败请重试!')
              }
            }).catch(err => {
              console.log(err)
              this.$Message.error('更新失败请重试!')
            })
          }
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    clearFormData () {
      this.addCustomerForm.id = 0
      this.addCustomerForm.name = ''
      this.addCustomerForm.type = 1
      this.addCustomerForm.phone = ''
      this.addCustomerForm.wechat = ''
      this.addCustomerForm.address = ''
      this.addCustomerForm.car_type = ''
      this.addCustomerForm.car_number = ''
      this.addCustomerForm.contact_name = ''
      this.addCustomerForm.total_cost = 0
      this.addCustomerForm.debt = 0
      this.addCustomerForm.repayment = 0
      this.addCustomerForm.comment = ''
      this.addCustomerForm.bank_account = ''
    },
    FormatterInput () {
      this.addCustomerForm.total_cost = util.moneyFormatterInput(this.addCustomerForm.total_cost)
      this.addCustomerForm.debt = util.moneyFormatterInput(this.addCustomerForm.debt)
      this.addCustomerForm.repayment = util.moneyFormatterInput(this.addCustomerForm.repayment)
    },
    changePage (page) {
      this.currentPage = page
      this.customerParam.page = page
      this.customerParam.perpage = this.pageSize
      this.getCustomerListData()
    },
    addForm () {
      this.showDetail = true
      this.modelType = 1
      this.modelTitle = '添加顾客'
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
