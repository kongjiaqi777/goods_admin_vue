<template>
  <div>
    <Card>
        <!--search Form-->
        <i-form ref="goodsParam" :model="goodsParam" :label-width="70" inline>
          <!-- 商品类别 -->
          <Form-item prop="category_id" label="商品类别">
            <i-select v-model="goodsParam.category_id" placeholder="请选择商品类别" filterable clearable>
              <i-option v-for="item in this.categoryItem" :key="item.id" :label="item.type_name" :value="item.id"></i-option>
            </i-select>
          </Form-item>

          <!-- 商品ID -->
          <Form-item prop="name" label="商品名称(精确查询)">
              <i-select v-model="goodsParam.goods_id" placeholder="请选择商品" filterable remote :remote-method="getGoods" @focus="getGoods()" clearable>
                <i-option v-for="item in this.goodsSuggest" :key="item.id" :label="item.name" :value="item.id"></i-option>
              </i-select>
          </Form-item>

           <!-- 商品名称 -->
          <Form-item prop="name" label="商品名称(模糊查询)">
            <i-input type="text" v-model="goodsParam.name" placeholder="请输入部分商品名称" clearable></i-input>
          </Form-item>

          <Form-item prop="brand" label="品牌">
            <i-input type="text" v-model="goodsParam.brand" placeholder="请输入部分商品品牌" clearable></i-input>
          </Form-item>
          <i-button @click="handleReset" size="default" style="float: right">重置</i-button>
          <i-button @click="handleSelect" type="primary" size="default" style="margin:0 30px;float: right;">查询</i-button>
        </i-form>
      <Divider />
      <Tooltip placement="right-start" max-width="200">
        <i-button @click="handleAdd" type="primary" size="large">添加商品</i-button>
        <div slot="content">
            <p>点击此处添加商品，确保添加之前商品类别已经存在</p>
            <p><i>商品名称最好具有唯一标示性</i></p>
        </div>
      </Tooltip>

      <i-table :columns="columns" :data="tableData" style="margin-top: 30px;"></i-table>

      <Page :total="totalCount" :current="currentPage" :page-size="pageSize" style="margin-top: 50px;text-align: center;" show-total show-elevator @on-change="changePage"></Page>
    </Card>
    <Modal v-model="showDetail" :title="modelTitle" @on-ok="goodsSubmit" @on-cancel="clearFormData">
      <i-form ref="goodsForm" :model="addGoodsForm" :rules="addGoodsRule" :label-width="80">
        <!-- 商品类别 -->
        <Form-item prop="category_id" label="商品类别">
          <i-select v-model="addGoodsForm.category_id" placeholder="请选择商品类别" filterable>
            <i-option v-for="item in this.categoryItem" :key="item.id" :label="item.type_name" :value="item.id"></i-option>
          </i-select>
        </Form-item>
        <!-- 商品名称 -->
        <Form-item prop="name" label="商品名称">
          <i-input type="text" v-model="addGoodsForm.name" placeholder="请输入商品名称">
          </i-input>
        </Form-item>
        <!-- 商品型号 -->
        <Form-item prop="model" label="商品型号">
          <i-input type="text" v-model="addGoodsForm.model" placeholder="请输入商品型号">
          </i-input>
        </Form-item>
        <!-- 商品规格 -->
        <Form-item prop="unit" label="商品规格">
          <i-select v-model="addGoodsForm.unit_id" placeholder="请选择商品规格" filterable>
            <i-option v-for="item in this.unitItem" :key="item.id" :label="item.unit_name" :value="item.id"></i-option>
          </i-select>
        </Form-item>
        <!-- 额定电压 -->
        <Form-item prop="voltage" label="额定电压">
          <i-select v-model="addGoodsForm.voltage" placeholder="请选择电压">
            <i-option v-for="item in this.voltageItem" :key="item.value" :label="item.label" :value="item.value"></i-option>
          </i-select>
        </Form-item>
        <!-- 商品库存 -->
        <Form-item prop="num" label="商品库存">
          <i-input type="text" v-model="addGoodsForm.num" placeholder="请输入数量">
          </i-input>
        </Form-item>
        <!-- 采购价格 -->
        <Form-item prop="purchase_price" label="采购价格">
            <i-input type="text" v-model="addGoodsForm.purchase_price" placeholder="请输入建议售价">
            </i-input>
        </Form-item>
        <!-- 建议售价 -->
        <Form-item prop="sale_price" label="销售价格">
          <i-input type="text" v-model="addGoodsForm.sale_price" placeholder="请输入建议售价">
          </i-input>
        </Form-item>
        <!-- 品牌 -->
        <Form-item prop="brand" label="品牌">
          <i-input type="text" v-model="addGoodsForm.brand" placeholder="请输入品牌">
          </i-input>
        </Form-item>
        <!-- 适用车型 -->
        <Form-item prop="car_type" label="适用车型">
          <i-input type="text" v-model="addGoodsForm.car_type" placeholder="请输入适用车型">
          </i-input>
        </Form-item>
        <!-- 存放位置 -->
        <Form-item prop="location" label="存放位置">
          <i-input type="text" v-model="addGoodsForm.location" placeholder="请输入位置">
          </i-input>
        </Form-item>
        <!-- 备注信息 -->
        <Form-item prop="comment" label="备注信息">
          <i-input type="text" v-model="addGoodsForm.comment" placeholder="请输入备注信息">
          </i-input>
        </Form-item>
        </i-form>
    </Modal>
  </div>
</template>

<script>
import { getGoodsInfo, addGoodsInfo, suggestCategory, modifyGoodsInfo, suggestGoods } from '@/api/goods'
import { unitSuggest } from '@/api/customer'
import * as util from '@/utils/util'
export default {
  name: 'goods_info',
  data () {
    return {
      // 商品表显示列
      columns: [
        { title: '货物编号', key: 'id' },
        { title: '货物名称', key: 'name' },
        { title: '货物型号', key: 'model' },
        { title: '类别名称', key: 'type_name' },
        { title: '库存数量', key: 'num' },
        { title: '单位', key: 'unit_name' },
        {
          title: '进货价格',
          key: 'purchase_price',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.purchase_price)
            )
          }
        },
        {
          title: '建议售价',
          key: 'sale_price',
          render: (h, params) => {
            return h('div',
              util.montyFormatterOutput(params.row.sale_price)
            )
          }
        },
        {
          title: '适用电压',
          key: 'voltage',
          render: (h, params) => {
            return h('div',
              util.voltageFormatterOutput(params.row.voltage)
            )
          }
        },
        { title: '品牌', key: 'brand' },
        { title: '适用车型', key: 'car_type' },
        // { title: '存放位置', key: 'location' },
        // { title: '备注信息', key: 'comment' },
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
                      console.log(params)
                      this.clickEditRow(params)
                    }
                  }
                }, '修改')
              ]
            )
          }
        }
      ],
      // 商品表数据
      tableData: [],
      // 标题
      modelTitle: '添加商品',
      // 是否显示模态框
      showDetail: false,
      // 添加商品数据
      addGoodsForm: {
        id: 0,
        name: '',
        model: '',
        category_id: 0,
        num: 0,
        sale_price: 0,
        purchase_price: 0,
        brand: '',
        car_type: '',
        location: '',
        comment: '',
        voltage: 0,
        unit_id: 0,
        unit_type: 10
      },
      // 添加validate
      addGoodsRule: {
        name: [
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择类别' }
        ],
        num: [
          { required: true, message: '请填写库存数量', trigger: 'blur' }
        ],
        sale_price: [
          { required: true, message: '请填写建议零售价', trigger: 'blur' }
        ],
        purchase_price: [
          { required: true, message: '请填写进货价格', trigger: 'blur' }
        ],
        unit_id: [
          { required: true, message: '请选择单位' }
        ]
      },
      // 类别列表
      categoryItem: {
      },
      // 对话框类别 1添加 2更新
      modelType: 1,
      // 电压
      voltageItem: [
        { value: 0, label: '-' },
        { value: 1, label: '12V' },
        { value: 2, label: '24V' }
      ],
      // 总商品数
      totalCount: 0,
      // 当前页
      currentPage: 1,
      // 页码
      pageSize: 20,
      // 商品查询参数
      goodsParam: {
        page: 1,
        perpage: 20,
        category_id: 0,
        goods_id: 0,
        name: '',
        brand: ''
      },
      // 单位列表
      unitItem: [],
      // 商品名称suggest
      goodsSuggest: {}
    }
  },
  mounted () {
    this.getGoodsListData()
    this.getCategoryListData()
    this.getUnitSuggest()
  },
  methods: {
    // 获取商品列表
    getGoodsListData () {
      getGoodsInfo(this.goodsParam).then(res => {
        this.tableData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      }).catch(err => {
        console.log(err)
      })
    },
    // 获取类别列表
    getCategoryListData () {
      suggestCategory().then(res => {
        this.categoryItem = res.data.info
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加商品
    goodsSubmit () {
      this.$refs.goodsForm.validate((valid) => {
        if (valid) {
          this.addGoodsForm.sale_price = util.moneyFormatterInput(this.addGoodsForm.sale_price)
          this.addGoodsForm.purchase_price = util.moneyFormatterInput(this.addGoodsForm.purchase_price)
          if (this.modelType === 1) {
            addGoodsInfo(this.addGoodsForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功!')
                // 清理form数据
                this.showDetail = false
                this.getGoodsListData()
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
            modifyGoodsInfo(this.addGoodsForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('修改成功!')
                // 清理form数据
                this.showDetail = false
                this.getGoodsListData()
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
    // 清理表单
    clearFormData () {
      this.addGoodsForm.name = ''
      this.addGoodsForm.model = ''
      this.addGoodsForm.category_id = 0
      this.addGoodsForm.num = ''
      this.addGoodsForm.sale_price = ''
      this.addGoodsForm.brand = ''
      this.addGoodsForm.car_type = ''
      this.addGoodsForm.location = ''
      this.addGoodsForm.comment = ''
      this.addGoodsForm.id = 0
      this.addGoodsForm.purchase_price = 0
      this.addGoodsForm.voltage = 0
      this.addGoodsForm.unit_id = 0
      this.addGoodsForm.unit_type = 10
    },
    // 点击编辑
    clickEditRow (params) {
      this.showDetail = true
      this.modelType = 2
      this.modelTitle = '修改商品信息'
      this.addGoodsForm.name = params.row.name
      this.addGoodsForm.model = params.row.model
      this.addGoodsForm.category_id = params.row.category_id
      this.addGoodsForm.num = String(params.row.num)
      this.addGoodsForm.sale_price = util.montyFormatterOutput(params.row.sale_price)
      this.addGoodsForm.brand = params.row.brand
      this.addGoodsForm.car_type = params.row.car_type
      this.addGoodsForm.location = params.row.location
      this.addGoodsForm.comment = params.row.comment
      this.addGoodsForm.id = params.row.id
      this.addGoodsForm.purchase_price = util.montyFormatterOutput(params.row.purchase_price)
      this.addGoodsForm.voltage = params.row.voltage
      this.addGoodsForm.unit_id = Number(params.row.unit_id)
      this.addGoodsForm.unit_type = params.row.unit_type
    },
    // 点击页码
    changePage (page) {
      this.currentPage = page
      this.goodsParam.page = page
      this.goodsParam.perpage = this.pageSize
      this.getGoodsListData()
    },
    // 点击添加商品
    handleAdd () {
      this.showDetail = true
      this.modelType = 1
      this.modelTitle = '添加商品'
    },
    // 单位
    getUnitSuggest () {
      unitSuggest().then(res => {
        this.unitItem = res.data.info
      })
    },
    // 商品名称suggest
    async getGoods (name) {
      let params = {
        name: name
      }
      suggestGoods(params).then(res => {
        this.goodsSuggest = res.data.info
      })
    },
    // 列表筛选
    handleSelect () {
      this.goodsParam.page = 1
      getGoodsInfo(this.goodsParam).then(res => {
        this.tableData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      }).catch(err => {
        console.log(err)
      })
    },
    // 重置查询条件
    handleReset () {
      this.goodsParam.category_id = 0
      this.goodsParam.goods_id = 0
      this.goodsParam.page = 1
      this.goodsParam.perpage = 20
      this.goodsParam.name = ''
      this.goodsParam.brand = ''
    }
  }
}
</script>
