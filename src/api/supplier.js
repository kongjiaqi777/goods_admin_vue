import axios from '@/libs/api.request'

// 供应商列表
export const getSupplierList = (data) => {
  return axios.request({
    url: 'supplier/list',
    method: 'get',
    params: data
  })
}

// 添加供应商
export const addSupplierInfo = (info) => {
  return axios.request({
    url: 'supplier/create',
    method: 'post',
    data: info
  })
}

// 修改供应商
export const updateSupplierInfo = (info) => {
  return axios.request({
    url: 'supplier/update',
    method: 'post',
    data: info
  })
}
