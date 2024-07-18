import request from '@/utils/request'
// 用户注册接口
export const userRegisterSerive = ({username, password, repassword}) => {
  return request.post('/api/reg', { username, password, repassword })
}

// 用户登录接口
export const userLoginService = ({ username, password }) => {
  return request.post('/api/login', { username, password })
}

// 用户信息接口
export const userInfoService = () =>  request.get('/my/userinfo')

// 更改用户信息接口
export const userUpdateInfoService = ({ id, nickname, email }) => {
  return request.put('/my/userinfo', { id, nickname, email })
}

// 更改用户密码接口
export const userChangePwdService = ({ oldPwd, newwPwd, rePwd}) => {
  return request.patch('/my/updatepwd', { oldPwd, newwPwd, rePwd })
}

// 更改用户头像接口
export const userChangeAvaService = (avatar) => 
  request.patch('/my/update/avatar', { avatar })