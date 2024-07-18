import request from '@/utils/request'

// 获取文章详情
export const articleGetInfoService = () => request.get('/my/cate/list')

// 更新文章详情
export const articleUpdateInfoService = ({ id, cate_name, cate_alias }) => 
  request.put('/my/cate/info', { id, cate_name, cate_alias })


// 添加文章
export const articleAddService = ({ cate_name, cate_alias }) => 
  request.post('/my/cate/add', { cate_name, cate_alias })
 
// 删除文章
export const articleDeleteService = (id) => request.delete('/my/cate/del', {
  params: { id }
})

// 获取文章分类详情
export const articleGetChannelInfoService = (id) => request.get('/my/cate/info', id)

// 下述为文章管理页所用api
// 获取文章列表接口
export const getArticleListService = (params) => {
  return request.get('/my/article/list', {
    params
  })
}

// 获取文章详情接口
export const getArticleInfoService = (id) => {
  return request.get('/my/article/info', {
  params: {
    id
  }
 })
}

// 增加文章接口 
export const addArticleService = (data) => request.post('/my/article/add', data)

// 更新文章接口
export const updateArticleInfoService = (data) => {
  return request.put('/my/article/info', data)
}

// 删除文章接口
export const deleteArticleInfoService = (id) => request.delete('/my/article/info', { paramas: { id } })