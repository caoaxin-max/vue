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

## 4 展示图

![老师管理员登录页面](https://user-images.githubusercontent.com/63568153/227859982-3aa5c3aa-a046-4804-a70f-b44ab7f3e0e5.png)
![学生登录页面-1](https://user-images.githubusercontent.com/63568153/227859989-f554894b-39d4-472f-adf7-3af5133becef.png)
![学生登录页面](https://user-images.githubusercontent.com/63568153/227860012-ed1a554a-db00-43ac-afdb-f5ddd096f19f.png)
![批改页面](https://user-images.githubusercontent.com/63568153/227860070-d5d28550-ec51-47ed-b967-4c98f4d71b73.png)
![任务管理页面](https://user-images.githubusercontent.com/63568153/227860076-5f8b3960-3f2d-4d6a-9b3e-386bcd1e2c47.png)
![试卷管理页面](https://user-images.githubusercontent.com/63568153/227860078-7e68ac52-c48b-49c2-9c29-fd93c4864f87.png)
![题目管理页面](https://user-images.githubusercontent.com/63568153/227860081-4aae889f-6caa-4b57-aa47-8a8016d9de6b.png)
![学科管理页面](https://user-images.githubusercontent.com/63568153/227860084-6273a315-f9fc-437d-a9c3-776b871232c4.png)
![班级管理页面](https://user-images.githubusercontent.com/63568153/227860085-93e2c580-332e-4805-ae72-f8bc4ecb1126.png)
![老师和管理员试卷分析页面](https://user-images.githubusercontent.com/63568153/227860089-34ff2e75-10ec-41dd-b8dd-a7b7d5d0a36e.png)
![批改完成页面](https![错题本页面](https://user-images.githubusercontent.com/63568153/227860119-798674fd-0a4e-4265-8c34-f87b14b39290.png)
![考试记录页面 - 副本](https://user-images.githubusercontent.com/63568153/227860125-42674c89-8631-4b82-9d7e-3ebef130f582.png)
![考试记录页面](https://user-images.githubusercontent.com/63568153/227860130-54ad0204-8eed-462e-b8c6-8790bf00cb17.png)
![考试页面](https://user-images.githubusercontent.com/63568153/227860132-bfca84f7-a4d1-463d-bfe0-92e09be58b8c.png)
![学生端试卷分析页面](https://user-images.githubusercontent.com/63568153/227860134-bbc6c816-259d-4076-9d79-855bc69bf278.png)
![错题本页面 - 副本](https://user-images.githubusercontent.com/63568153/227860138-61f7d358-328a-4d8f-962a-2aeae60ca46e.png)
://user-images.githubusercontent.com/63568153/227860091-44182f4e-fa5f-43cd-bacc-8ec3b6bae784.png)
