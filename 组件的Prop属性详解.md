# 概述

`prop`属性主要用来父组件下发数据给子组件

## prop的大小写

HTML中特性名是不区分大小写的，所以浏览器会把所有的大写字符解释成小写字符，这意味着当你使用DOM中的模板时，camelCase 驼峰命名法的 prop名 需要使用等价的 kebab-case 短横线分割名

```js
Vue.component('blog-post',{
    prop: ['postTitle'],
    template: `<h3>{{postTitle}}</h3>`
})
```

```html
<blog-post :post-title="'hello'"></blog-post>
```

## 指定prop的类型

我们可以为组件接受的 prop 指定类型，如下：

```js
props: {
    title: String,
    likes: Number,
    isPublished: Boolean,
    comments: Array,
    author: Object
}
```

## 传递静态和动态prop

传入一个静态prop

```html
<blog-post title="My posts with vue.js"></blog-post>
```

通过`v-bind:propName`来动态传值

```html
<!-- 动态赋予一个变量的值 -->
<blog-post v-bind:title="post.title"></blog-post>
<!-- 动态赋予一个复杂表达式的值 -->
<blog-post v-bind:title="post.title + ' by ' + post.author.name"></blog-post>
```

## 传入一个对象的所有属性

如果我们需要将一个对象的所有属性都作为prop传入，那么我们需要使用不带参数的`v-bind`来取代`v-bind:propName`,比如给定一个对象`post`

```js
post = {
    id: 1,
    title: 'vue.js is so fun'
}
```

```html
<blog-post v-bind="post"></blog-post>
<!-- 等价于 -->
<blog-post
  v-bind:id="post.id"
  v-bind:title="post.title"
></blog-post>
```

## 单向数据流

所有的 prop 都使得 其父子prop之间形成了一个单行向下绑定：父级的prop更新会向下流动到子组件中，但是反过来是不允许的。这样会防止从子组件意外改变父级组件的状态，从而导致你的应用的数据流向难以理解。

额外的，每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着你不应该在一个子组件内部改变 prop。如果你这样做了，Vue 会在浏览器的控制台中发出警告。