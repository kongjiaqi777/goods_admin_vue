<template>
  <div>
      <Card>
      <i-button type="primary" @click="addSalesOrderFunc">添加销售订单</i-button>
      <i-table :columns="columns" :data="tableData" style="margin-top: 30px;"></i-table>
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
        title="订单详情"
        @on-ok="showDetail=false" width="800">
        <i-table :data="recordData" :columns="recordColumns"></i-table>
    </Modal>
    <Modal v-model="showUpdateDetail" title="修改订单信息" @on-ok="AddOrder" @on-cancel="clearFormData" width="900">
      <i-form ref="addSalesOrder" :model="addSalesOrderForm" :rules="addSalesOrderRules" :label-width="100" style="width:813px;padding-top:50px;">
          <Form-item label="客户信息" prop="customer_id">
            <i-select v-model="addSalesOrderForm.customer_id" placeholder="请选择客户">
              <i-option v-for="item in customerData" :key="item.id" :value="item.id" :label="item.name"></i-option>
            </i-select>
          </Form-item>

          <i-table borderd :columns="saleRecordColumn" :data="saleRecord" style="margin-top:50px;margin-bottom:50px;">
          </i-table>

          <Form-item label="总价" prop="total_price_display">
            <i-input type="text" v-model="addSalesOrderForm.total_price_display" disabled></i-input>
          </Form-item>
          <Form-item label="折扣金额" prop="discount">
            <i-input type="text" v-model="addSalesOrderForm.discount" disabled></i-input>
          </Form-item>
          <Form-item label="付款方式" prop="pay_way">
            <RadioGroup v-model="addSalesOrderForm.pay_way">
              <Radio v-for="item in this.payWay" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="是否付款" prop="is_pay_off">
            <RadioGroup v-model="addSalesOrderForm.is_pay_off">
              <Radio v-for="item in this.payOff" :label="item.value" :key="item.value">
                <span>{{item.label}}</span>
              </Radio>
            </RadioGroup>
          </Form-item>
          <Form-item label="已付金额" prop="pay_number">
            <i-input type="text" v-model="addSalesOrderForm.pay_number" onblur="calDiscount"></i-input>
          </Form-item>
          <Form-item label="凭证" prop="photo">
            <i-input type="text" v-model="addSalesOrderForm.photo"></i-input>
          </Form-item>
          <Form-item label="备注信息" prop="comment">
            <i-input type="text" v-model="addSalesOrderForm.comment"></i-input>
          </Form-item>
          <!-- <Form-item>
            <i-button @click="AddOrder" type="primary">确认添加</i-button>
            <i-button style="margin-left: 8px">取消</i-button>
          </Form-item> -->
        </i-form>
    </Modal>
  </div>
</template>
<script>
import { getSalesOrder, getSalesRecord, addSalesOrder } from '@/api/order'
import { getCustomerInfo, unitSuggest } from '@/api/customer'
import { getGoodsInfo } from '@/api/goods'

import * as util from '@/utils/util'

export default {
  name: 'sales_order',
  data () {
    return {
      // 订单列表
      columns: [
        {
          title: '订单编号',
          key: 'order_code',
          sortable: true
        },
        {
          title: '订单总额',
          key: 'total_price',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.total_price)
            )
          }
        },
        {
          title: '折扣金额',
          key: 'discount',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.discount)
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
        {
          title: '是否付款',
          key: 'is_pay_off',
          render: (h, params) => {
            return h('div',
              util.showPayOff(params.row.is_pay_off)
            )
          }
        },
        {
          title: '已付金额',
          key: 'pay_number',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.pay_number)
            )
          }
        },
        { title: '顾客姓名', key: 'customer_name' },
        // { title: '凭证', key: 'photo' },
        { title: '备注信息', key: 'comment' },
        { title: '添加时间', key: 'created_at' },
        {
          title: '详情',
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
                      this.getSalesRecordItem(params.row.order_code)
                      this.showDetail = true
                    }
                  }
                }, '查看详情'),
                h('Button', {
                  props: {
                    type: 'success'
                  },
                  style: {
                    width: '80%',
                    display: 'flex',
                    'justify-content': 'center'
                  },
                  on: {
                    click: () => {
                      this.showSalesOrderDetail(params.row)
                      // this.showUpdateDetail = true
                    }
                  }
                }, '修改订单')
              ]
            )
          }
        }
      ],
      // 订单数据
      tableData: [],
      // 记录列表
      recordColumns: [
        { title: '货物编号', key: 'goods_id' },
        { title: '货物名称', key: 'goods_name' },
        { title: '销售订单', key: 'sales_order_code', width: 100 },
        { title: '销售数量', key: 'num' },
        {
          title: '销售价格',
          key: 'sales_price',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.sales_price)
            )
          }
        },
        { title: '销售日期', key: 'sales_date' },
        { title: '顾客名称', key: 'customer_name' },
        { title: '备注信息', key: 'comment' }
      ],
      // 记录数据
      recordData: [],
      // 是否显示订单详情modal
      showDetail: false,
      // 是否显示添加/更新订单modal
      showUpdateDetail: false,
      // 增加订单表单
      addSalesOrderForm: {
        customer_id: 0, // 客户ID
        sales_record: [],
        pay_way: 1, // 付款方式
        discount: 0, // 折扣
        is_pay_off: 1, // 是否全部付款
        pay_number: 0, // 付款金额
        total_price: 0,
        photo: '',
        comment: '',
        total_price_display: 0
      },
      // 添加订单验证
      addSalesOrderRules: {
        customer_id: [
          { required: true, message: '请选择客户' }
        ],
        pay_way: [
          { required: true, message: '请选择付款方式' }
        ],
        total_price: [
          { required: true, message: '全部价格为空', trigger: 'blur' }
        ],
        is_pay_off: [
          { required: true, message: '请选择是否全部付款' }
        ],
        pay_number: [
          { required: true, message: '请填写实际付款金额', trigger: 'blur' }
        ]
      },
      // 顾客列表数据
      customerData: [],
      // 商品列表
      goodsList: [],
      // 订单数据
      saleRecord: [
        {
          goods_id: 0,
          num: 1,
          unit: 0,
          sales_price: 0,
          sales_price_display: 0
        }
      ],
      // 订单详情列
      saleRecordColumn: [
        {
          title: '序号',
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '商品名称',
          key: 'goods_id',
          width: 200,
          align: 'center',
          render: (h, params) => {
            return h('Select',
              {
                props: {
                  value: this.saleRecord[params.index].goods_id, // 数据的双向绑定 data是定义好的数据
                  transfer: true
                },
                on: {
                  'on-change': (event) => { // select改变事件
                    this.saleRecord[params.index].goods_id = event
                    let obj = this.goodsList.find(function (x) {
                      if (x.id === event) {
                        return x
                      }
                    })
                    this.saleRecord[params.index].unit = obj.unit
                    this.saleRecord[params.index].sales_price = obj.sale_price
                    this.saleRecord[params.index].sales_price_display = util.montyFormatterOutput(obj.sale_price)
                    this.calPrice()
                  }
                }
              },
              this.goodsList.map(function (val, key) {
                return h('Option', {
                  props: {
                    value: val.id
                  }
                }, val.name + '-' + val.model)
              })
            )
          }
        },
        {
          title: '数量',
          key: 'num',
          width: 100,
          align: 'center',
          render: (h, params) => {
            return h('Input', {
              props: {
                value: this.saleRecord[params.index].num
              },
              on: {
                input: (val) => {
                  this.saleRecord[params.index].num = val
                },
                'on-blur': () => {
                  this.calPrice()
                }
              }
            })
          }
        },
        {
          title: '单位',
          key: 'unit',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('Select',
              {
                props: {
                  value: this.saleRecord[params.index].unit, // 数据的双向绑定 data是定义好的数据
                  transfer: true
                },
                on: {
                  'on-change': (event) => { // select改变事件
                    this.saleRecord[params.index].unit = event
                    let obj = this.unitList.find(function (x) {
                      if (x.id === event) {
                        return x
                      }
                    })
                    this.saleRecord[params.index].unit = obj.id
                    this.calPrice()
                  }
                }
              },
              this.unitList.map(function (val, key) {
                return h('Option', {
                  props: {
                    value: val.id
                  }
                }, val.unit_name)
              })
            )
          }
        },
        {
          title: '售价',
          key: 'sales_price_display',
          width: 150,
          align: 'center',
          render: (h, params) => {
            return h('Input', {
              props: {
                value: this.saleRecord[params.index].sales_price_display
              },
              on: {
                input: (val) => {
                  this.saleRecord[params.index].sales_price_display = val
                  this.saleRecord[params.index].sales_price = util.moneyFormatterInput(val)
                },
                'on-blur': () => {
                  this.calPrice()
                }
              }
            })
          }
        },
        {
          title: '操作',
          width: 150,
          align: 'center',
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
                      if (this.saleRecord[params.index].goods_id === 0) {
                        this.$Message.error('请选择商品')
                        return
                      }
                      if (this.saleRecord[params.index].num === 0) {
                        this.$Message.error('请填写商品数量')
                        return
                      }
                      if (this.saleRecord[params.index].sale_price === 0) {
                        this.$Message.error('请填写零售价')
                        return
                      }
                      this.saleRecord.push({
                        goods_id: 0,
                        num: 1,
                        sales_price: 0,
                        sales_price_display: 0
                      })
                    }
                  }
                }, '添加新数据')
              ]
            )
          }
        }
      ],
      // 付款方式
      payWay: [
        { value: 1, label: '现金' },
        { value: 2, label: '微信' },
        { value: 3, label: '支付宝' },
        { value: 4, label: '银行卡' }
      ],
      // 是否付款
      payOff: [
        { value: 1, label: '已付款' },
        { value: 2, label: '欠款' },
        { value: 3, label: '部分付款' },
        { value: 4, label: '付款结余' }
      ],
      // 增加订单modal类型1新增 2修改
      modelType: 1,
      // 增加订单modal标题
      modelTitle: '添加销售订单',
      // 订单数量
      totalCount: 0,
      // 当前页
      currentPage: 1,
      // 页码
      pageSize: 10,
      // 订单列表筛选
      orderParam: {
        page: 1,
        perpage: 10
      },
      // 单位列表
      unitList: []
    }
  },
  mounted () {
    this.getSalesOrderList()
    this.getCustomerInfo()
    this.getGoodsInfoList()
    this.getUnitSuggest()
  },
  methods: {
    // 获取订单列表
    getSalesOrderList () {
      getSalesOrder(this.orderParam).then(res => {
        if (res.data.info) {
          this.tableData = res.data.info.list
          this.totalCount = res.data.info.pagination.total_count
          this.currentPage = res.data.info.pagination.page
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取销售记录
    getSalesRecordItem: function (order_code) {
      getSalesRecord({ 'sales_order_code': order_code }).then(res => {
        this.recordData = res.data.info
      }).catch(err => {
        console.log(err)
      })
    },
    gotoAddPage () {
      this.$router.push({
        path: '/add_sales_order'
      })
    },
    // 获取客户列表
    getCustomerInfo () {
      getCustomerInfo().then(res => {
        this.customerData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      })
    },
    // 商品列表
    getGoodsInfoList () {
      getGoodsInfo().then(res => {
        this.goodsList = res.data.info.list
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加订单
    AddOrder () {
      // 先验证saleRecord
      this.$refs.addSalesOrder.validate((valid) => {
        if (valid) {
          this.validateRecordArray()
          // 价钱格式化
          this.addSalesOrderForm.sales_record = this.saleRecord
          this.addSalesOrderForm.total_price = util.moneyFormatterInput(this.addSalesOrderForm.total_price)
          // 重新计算总价
          this.calPrice()
          // 请求方法
          addSalesOrder(this.addSalesOrderForm).then(res => {
            if (res.data.code === 0) {
              this.$Message.success('添加成功!')
              this.getSalesOrderList()
            } else {
              this.$Message.error('添加失败请重试!')
            }
          })
        }
      })
    },
    // 计算总价
    calPrice () {
      console.log(this.saleRecord)
      this.addSalesOrderForm.total_price_display = 0
      this.addSalesOrderForm.total_price = 0
      this.saleRecord.forEach((item) => {
        this.addSalesOrderForm.pay_number = util.moneyFormatterInput(this.addSalesOrderForm.pay_number)
        this.addSalesOrderForm.discount = util.moneyFormatterInput(this.addSalesOrderForm.discount)
        // console.log(parseInt(item.num) * parseInt(item.sales_price))
        this.addSalesOrderForm.total_price_display += parseInt(item.num) * parseInt(item.sales_price_display)
        this.addSalesOrderForm.total_price = util.moneyFormatterInput(this.addSalesOrderForm.total_price_display)
      })
    },
    // 校验商品销售记录完整性
    validateRecordArray () {
      this.saleRecord.forEach((item) => {
        if (item.goods_id === 0) {
          this.$Message.error('请选择商品')
          return
        }
        if (item.num === 0) {
          this.$Message.error('请填写商品数量')
          return
        }
        if (item.sale_price === 0) {
          this.$Message.error('请填写零售价')
        }
      })
    },
    // 清空表单
    clearFormData () {
      this.addSalesOrderForm.customer_id = 0
      this.addSalesOrderForm.sales_record = []
      this.addSalesOrderForm.pay_way = 0
      this.addSalesOrderForm.discount = 0
      this.addSalesOrderForm.is_pay_off = 0
      this.addSalesOrderForm.pay_number = 0
      this.addSalesOrderForm.total_price = 0
      this.addSalesOrderForm.photo = ''
      this.addSalesOrderForm.comment = ''
      this.addSalesOrderForm.total_price_display = 0
      this.saleRecord = [
        {
          goods_id: 0,
          num: 0,
          sales_price: 0,
          sales_price_display: 0
        }
      ]
    },
    // 显示销售订单
    showSalesOrderDetail (rowData) {
      getSalesRecord({ 'sales_order_code': rowData.order_code }).then(res => {
        let record = res.data.info
        let saleRecordTmp = []
        record.forEach(function (value, index, array) {
          saleRecordTmp.push({
            goods_id: value.goods_id,
            num: parseInt(value.num),
            sales_price: parseInt(value.sales_price),
            sales_price_display: util.montyFormatterOutput(parseInt(value.sales_price))
          })
        })
        this.saleRecord = saleRecordTmp
        this.addSalesOrderForm.sales_record = saleRecordTmp
      }).catch(err => {
        console.log(err)
      })
      this.addSalesOrderForm.id = rowData.id
      this.addSalesOrderForm.customer_id = rowData.customer_id
      this.addSalesOrderForm.sales_record = rowData.sales_record
      // this.saleRecord = rowData.sales_record
      this.addSalesOrderForm.pay_way = rowData.pay_way
      this.addSalesOrderForm.discount = util.montyFormatterOutput(rowData.discount)
      this.addSalesOrderForm.is_pay_off = rowData.is_pay_off
      this.addSalesOrderForm.pay_number = util.montyFormatterOutput(rowData.pay_number)
      this.addSalesOrderForm.total_price = rowData.total_price
      this.addSalesOrderForm.total_price_display = util.montyFormatterOutput(rowData.total_price)
      this.addSalesOrderForm.photo = rowData.photo
      this.addSalesOrderForm.comment = rowData.comment
      this.modelType = 2
      this.modelTitle = '修改订单信息'
      this.showUpdateDetail = true
    },
    changePage (page) {
      this.currentPage = page
      this.orderParam.page = page
      this.orderParam.perpage = this.pageSize
      this.getSalesOrderList()
    },
    addSalesOrderFunc () {
      this.modelType = 1
      this.modelTitle = '添加销售订单'
      this.showUpdateDetail = true
    },
    calDiscount () {
      if (this.addSalesOrderForm.is_pay_off === 1) {
        this.addSalesOrderForm.discount = this.addSalesOrderForm.total_price - this.addSalesOrderForm.pay_number
      }
    },
    // 单位
    getUnitSuggest () {
      unitSuggest().then(res => {
        this.unitList = res.data.info
      })
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
