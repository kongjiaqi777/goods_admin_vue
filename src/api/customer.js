import axios from '@/libs/api.request'

// 顾客列表
export const getCustomerInfo = (data) => {
  return axios.request({
    url: 'customer/list',
    method: 'get',
    params: data
  })
}

// 添加顾客
export const addCustomerInfo = (info) => {
  return axios.request({
    url: 'customer/create',
    method: 'post',
    data: info
  })
}

// 更改顾客信息
export const updateCustomerInfo = (info) => {
  return axios.request({
    url: 'customer/update',
    method: 'post',
    data: info
  })
}

// 更新还款信息列表
export const getPaymentList = (data) => {
  return axios.request({
    url: 'payment/list',
    method: 'get',
    params: data
  })
}

// 单位列表
export const getUnitList = (data) => {
  return axios.request({
    url: 'unit/list',
    method: 'get',
    params: data
  })
}

// 单位suggest
export const unitSuggest = (data) => {
  return axios.request({
    url: 'unit/suggest',
    method: 'get',
    params: data
  })
}

// 单位转换
export const unitConvert = (data) => {
  return axios.request({
    url: 'unit/convertList',
    method: 'get',
    params: data
  })
}

// 添加还款
export const addPaymentInfo = (info) => {
  return axios.request({
    url: 'payment/create',
    method: 'post',
    data: info
  })
}

export const modifyPaymentInfo = (info) => {
  return axios.request({
    url: 'payment/update',
    method: 'post',
    data: info
  })
}
