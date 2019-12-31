import axios from '@/libs/api.request'

// 销售订单列表
export const getSalesOrder = (data) => {
  return axios.request({
    url: 'v1/order/get_sales_order',
    method: 'get',
    params: data
  })
}

// 销售记录
export const getSalesRecord = (data) => {
  return axios.request({
    url: 'v1/sales/list',
    method: 'get',
    params: data
  })
}

// 购买订单列表
export const getPurchaseOrder = (data) => {
  return axios.request({
    url: 'v1/order/get_purchase_order',
    method: 'get',
    params: data
  })
}

// 购买记录
export const getPurchaseRecord = (data) => {
  return axios.request({
    url: 'v1/purchase/list',
    method: 'get',
    params: data
  })
}

// 添加销售订单
export const addSalesOrder = (info) => {
  return axios.request({
    url: 'v1/order/add_sales_order',
    method: 'post',
    data: info
  })
}

// 添加购买订单
export const addPurchaseOrder = (info) => {
  return axios.request({
    url: 'v1/order/add_purchase_order',
    method: 'post',
    data: info
  })
}

// 修改销售订单
export const updateSalesOrder = (info) => {
  return axios.request({
    url: '',
    method: 'post',
    data: info
  })
}

// 修改购买订单
export const updatePurchaseOrder = (info) => {
  return axios.request({
    url: '',
    method: 'post',
    data: info
  })
}
