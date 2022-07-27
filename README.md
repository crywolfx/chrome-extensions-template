## 基于React + TS + Antd开发
## 项目运行
### 安装依赖
`yarn install`

### 启动项目
- 正常启动 `yarn start`

- 调试模式：background以及contentjs热启动 `yarn start:hot`，开发环境热更新的产物都会打包在build目录下

- 仅更新产物模式： `yarn start:disk`，开发环境热更新的产物都会打包在build目录下，bg和contentjs不会自动更新，方便调试popup（热更新模式runtime会自动刷新，导致popup代码有变动就自动更新了）

### 项目调试
- 项目启动后将build目录在chrome拓展页面进行导入 
- 在插件popup页面中打开开关

### 项目打包
`yarn build`   

## 项目需知
- 热更新每次变动都会写入磁盘，需要注意大小，及时清理
- contentjs内是通过shadowDom插入到页面里的，外部组件库的的css和js需要分离引入

## 请求方式
防止跨域以及csp等限制，接口请求放在background页面进行   
content通过消息的方式将请求参数发送至background，background请求获取到返回值再返回到content。
> formData或者file buffer对象是通过序列化为字符串传输到background再反序列化的，所以建议传输内容不要过大