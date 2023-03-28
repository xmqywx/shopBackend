import request from '@/utils/request'

export function getBrand(params) {
  return request({
    url: 'api/yxBrand',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'api/yxBrand',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: 'api/yxBrand/' + id,
    method: 'delete'
  })
}

export function edit(data) {
  return request({
    url: 'api/yxBrand',
    method: 'put',
    data
  })
}

export default { add, edit, del, getBrand }
