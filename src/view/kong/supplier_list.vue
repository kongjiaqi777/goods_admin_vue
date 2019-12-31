<template>
  <div>
      <Card>
      <i-button type="primary" @click="clickAdd">添加</i-button>
      <i-table :columns="supplierColumns" :data="supplierData" style="margin-top: 30px;"></i-table>
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
      @on-ok="AddSupplierSubmit" @on-cancel="clearFormData">
      <i-form ref="supplierForm" :model="addSupplierForm" :rules="addSupplierRule">
        <Form-item prop="name" label="姓名">
          <i-input type="text" v-model="addSupplierForm.name" placeholder="请输入顾客姓名">
          </i-input>
        </Form-item>
        <Form-item prop="type" label="供应商类别">
          <RadioGroup v-model="addSupplierForm.type">
              <Radio v-for="item in supplierType" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
        </Form-item>
        <Form-item prop="phone" label="联系电话">
          <i-input type="text" v-model="addSupplierForm.phone" placeholder="请输入联系电话">
          </i-input>
        </Form-item>
        <Form-item prop="wechat" label="微信号码">
          <i-input type="text" v-model="addSupplierForm.wechat" placeholder="请输入微信号码">
          </i-input>
        </Form-item>
        <Form-item prop="address" label="联系地址">
          <i-input type="text" v-model="addSupplierForm.address" placeholder="请输入联系地址">
          </i-input>
        </Form-item>
        <!-- <Form-item prop="car_type" label="常用车型">
          <i-input type="text" v-model="addSupplierForm.car_type" placeholder="请输入常用车型">
          </i-input>
        </Form-item>
        <Form-item prop="car_number" label="车牌号码">
          <i-input type="text" v-model="addSupplierForm.car_number" placeholder="请输入车牌号码">
          </i-input>
        </Form-item> -->
        <Form-item prop="contact_name" label="其他联系人">
          <i-input type="text" v-model="addSupplierForm.contact_name" placeholder="请输入顾客亲属等常用联系人">
          </i-input>
        </Form-item>
        <Form-item prop="bank_account" label="银行账户">
          <i-input type="text" v-model="addSupplierForm.bank_account" placeholder="请输入顾客银行账户">
          </i-input>
        </Form-item>
        <Form-item prop="total_cost" label="总消费">
          <i-input type="text" v-model="addSupplierForm.total_cost" placeholder="请输入顾客在本店总消费">
          </i-input>
        </Form-item>
        <Form-item prop="debt" label="欠款金额">
          <i-input type="text" v-model="addSupplierForm.debt" placeholder="请输入顾客在本店的欠款金额">
          </i-input>
        </Form-item>
        <Form-item prop="repayment" label="已还款金额">
          <i-input type="text" v-model="addSupplierForm.repayment" placeholder="请输入顾客在本店已经还款金额">
          </i-input>
        </Form-item>
        <Form-item prop="comment" label="备注信息">
          <i-input type="text" v-model="addSupplierForm.comment" placeholder="备注信息">
          </i-input>
        </Form-item>
      </i-form>
    </Modal>
  </div>
</template>
<script>
import { getSupplierList, addSupplierInfo, updateSupplierInfo } from '@/api/supplier'
import * as util from '@/utils/util'

export default {
  name: 'supplier_list',
  data () {
    return {
      supplierColumns: [
        { title: '编号', key: 'id', sortable: true },
        {
          title: '类型',
          key: 'type',
          render: (h, params) => {
            return h('div',
              util.getSupplierType(params.row.type)
            )
          }
        },
        { title: '用户姓名', key: 'name' },
        { title: '联系方式', key: 'phone' },
        { title: '微信', key: 'wechat' },
        { title: '通信地址', key: 'address' },
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
                      this.modelTitle = '修改供应商信息'
                      this.addSupplierForm.id = params.row.id
                      this.addSupplierForm.name = params.row.name
                      this.addSupplierForm.type = params.row.type
                      this.addSupplierForm.phone = params.row.phone
                      this.addSupplierForm.wechat = params.row.wechat
                      this.addSupplierForm.address = params.row.address
                      this.addSupplierForm.contact_name = params.row.contact_name
                      this.addSupplierForm.total_cost = params.row.total_cost
                      this.addSupplierForm.debt = params.row.debt
                      this.addSupplierForm.repayment = params.row.repayment
                      this.addSupplierForm.comment = params.row.comment
                      this.addSupplierForm.bank_account = params.row.bank_account
                    }
                  }
                }, '修改')
              ]
            )
          }
        }
      ],
      // 参数
      supplierData: [],
      showDetail: false,
      modelTitle: '添加新供应商',
      modelType: 1,
      addSupplierForm: {
        name: '',
        type: 1,
        phone: '',
        wechat: '',
        address: '',
        contact_name: '',
        bank_account: '',
        total_cost: 0,
        debt: 0,
        repayment: 0,
        comment: '',
        id: 0
      },
      addSupplierRule: {
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
      supplierType: [
        { value: 1, label: '个体供应商' },
        { value: 2, label: '公司' }
      ],
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      supplierParam: {
        page: 1,
        perpage: 20
      }
    }
  },
  mounted () {
    this.getSupplierListData()
  },
  methods: {
    getSupplierListData () {
      getSupplierList(this.supplierParam).then(res => {
        this.supplierData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      }).catch(err => {
        console.log(err)
      })
    },
    AddSupplierSubmit () {
      this.$refs.supplierForm.validate((valid) => {
        if (valid) {
          console.log(this.addSupplierForm)
          this.FormatterInput()
          if (this.modelType === 1) {
            addSupplierInfo(this.addSupplierForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功!')
                // 清理form数据
                this.showDetail = false
                this.getSupplierListData()
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
            updateSupplierInfo(this.addSupplierForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('更新成功!')
                // 清理form数据
                this.showDetail = false
                this.getSupplierListData()
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
      this.addSupplierForm.id = 0
      this.addSupplierForm.name = ''
      this.addSupplierForm.type = 1
      this.addSupplierForm.phone = ''
      this.addSupplierForm.wechat = ''
      this.addSupplierForm.address = ''
      this.addSupplierForm.contact_name = ''
      this.addSupplierForm.total_cost = 0
      this.addSupplierForm.debt = 0
      this.addSupplierForm.repayment = 0
      this.addSupplierForm.comment = ''
      this.addSupplierForm.bank_account = ''
    },
    FormatterInput () {
      this.addSupplierForm.total_cost = util.moneyFormatterInput(this.addSupplierForm.total_cost)
      this.addSupplierForm.debt = util.moneyFormatterInput(this.addSupplierForm.debt)
      this.addSupplierForm.repayment = util.moneyFormatterInput(this.addSupplierForm.repayment)
    },
    changePage (page) {
      this.currentPage = page
      this.supplierParam.page = page
      this.supplierParam.perpage = this.pageSize
      this.getSupplierListData()
    },
    clickAdd () {
      this.showDetail = true
      this.modelType = 1
      this.modelTitle = '添加新供应商'
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
