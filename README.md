# 考试通前端

## 1.技术栈

- vue 采用新版，使用了vue-cli4搭建的系统，减少大量配置文件
- element-ui 最流行的vue UI框架
- echarts 图表统计
- 基于vue-admin-template二次开发
- wangEditor富文本编辑器

## 2.部署前端

- 执行下面2个命令，安装node_module：

```npm
npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass/
npm install --registry https://registry.npm.taobao.org  
```

- 执行下面命令，启动前端代码

```npm
npm run serve
```

- 打包命名

```npm
npm run build
```

## 3.前端代码结构

```text
 - vue 后端代码
  - xzs-student  学生端代码
   - public 公共文件、主页
   - src 前端代码
    - api 接口地址
    - assets 图片资源
    - components 公共组件
     - BackToTop 返回顶部组件
     - Pagination 分页组件
     - SvgIcon 图标组件
     - Ueditor 编辑器组件
    - icons 图标库
    - layout 母版页
    - store 状态管理
    - styles 主题样式
    - utils 公共方法
    - views 视图、系统页面
```

```text
 - vue 后端代码
  - xzs-student  学生端代码
   - public 公共文件、主页
   - src 前端代码
    - api 接口地址
    - assets 图片资源
    - components 公共组件
     - BackToTop 返回顶部组件
     - Pagination 分页组件
     - SvgIcon 图标组件
     - Ueditor 编辑器组件
    - icons 图标库
    - layout 母版页
    - store 状态管理
    - styles 主题样式
    - utils 公共方法
    - views 视图、系统页面
```