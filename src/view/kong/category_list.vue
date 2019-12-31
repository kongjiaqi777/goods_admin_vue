<template>
  <div>
    <Card>
    <i-button type="primary" @click="showDetail=true, this.modelType=1, this.modelTitle='添加商品类别'">添加</i-button>
    <i-table :columns="categoryColumns" :data="categoryData" style="margin-top: 30px;"></i-table>
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
      @on-ok="AddCategorySubmit" @on-cancel="clearFormData">
      <i-form ref="categoryForm" :model="addCategoryForm" :rules="addCategoryRule">
        <Form-item prop="type_name" label="类别">
          <i-input type="text" v-model="addCategoryForm.type_name" placeholder="请输入类别名称">
          </i-input>
        </Form-item>
        <Form-item prop="comment" label="备注信息">
          <i-input type="text" v-model="addCategoryForm.comment" placeholder="备注信息">
          </i-input>
        </Form-item>
      </i-form>
  </Modal>
</div>
</template>
<script>
// import Tables from '_c/tables'
import { getCategoryList, addCategory, modifyCategory } from '@/api/goods'

export default {
  name: 'category_list',
  data () {
    return {
      categoryColumns: [ // 类别列表项
        { title: '编号', key: 'id', sortable: true },
        { title: '类别名称', key: 'type_name' },
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
                      this.modelTitle = '修改商品类别'
                      this.addCategoryForm.type_name = params.row.type_name
                      this.addCategoryForm.comment = params.row.comment
                      this.addCategoryForm.id = params.row.id
                    }
                  }
                }, '修改')
              ]
            )
          }
        }
      ],
      categoryData: [], // 列表数据
      addCategoryForm: { // 表单数据
        type_name: '',
        comment: '',
        id: 0
      },
      addCategoryRule: { // 表单验证规则
        type_name: [
          { required: true, message: '请填写类别名称', trigger: 'blur' }
        ],
        comment: [
          { type: 'string', max: 20, message: '长度不能大于20位', trigger: 'blur' }
        ]
      },
      showDetail: false, // 对话框线索
      modelTitle: '', // 对话框标题
      modelType: 1, // 对话框类别 1添加 2更新
      totalCount: 0,
      currentPage: 1,
      pageSize: 20,
      categoryParam: {
        page: 1,
        perpage: 10
      }
    }
  },
  mounted () {
    this.getCategoryListData()
  },
  methods: {
    // 获取列表数据
    getCategoryListData () {
      getCategoryList(this.categoryParam).then(res => {
        this.categoryData = res.data.info.list
        this.totalCount = res.data.info.pagination.total_count
        this.currentPage = res.data.info.pagination.page
      }).catch(err => {
        console.log(err)
      })
    },
    // 添加/修改类别
    AddCategorySubmit () {
      console.log(this.addCategoryForm)
      console.log(this.modelType)
      this.$refs.categoryForm.validate((valid) => {
        if (valid) {
          if (this.modelType === 1) {
            // 添加
            addCategory(this.addCategoryForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('添加成功!')
                this.showDetail = false
                this.getCategoryListData()
                // 清理form数据
                this.clearFormData()
              } else {
                this.$Message.success('添加失败请重试!')
              }
            }).catch(err => {
              console.log(err)
              this.$Message.success('添加失败请重试!')
            })
          } else if (this.modelType === 2) {
            modifyCategory(this.addCategoryForm).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('修改成功!')
                this.showDetail = false
                this.getCategoryListData()
                // 清理form数据
                this.clearFormData()
              } else {
                this.$Message.success('修改失败请重试!')
              }
            }).catch(err => {
              console.log(err)
              this.$Message.success('修改失败请重试!')
            })
          }
        } else {
          this.$Message.error('表单验证失败!')
        }
      })
    },
    // 清理表单数据
    clearFormData () {
      this.addCategoryForm.type_name = ''
      this.addCategoryForm.comment = ''
      this.addCategoryForm.id = 0
    },
    changePage (page) {
      this.currentPage = page
      this.categoryParam.page = page
      this.categoryParam.perpage = this.pageSize
      this.getCategoryListData()
    }
  }
}
</script>

<style lang="less">
.count-style{
  font-size: 50px;
}
</style>
