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

### 子组件尝试改变来自父组件的 prop

这里有两种常见的试图改变一个prop的情形：

1. prop 用来想子组件传递一个初始值：这个子组件希望将其作为一个本地的 prop 数据来使用。那么，最好在子组件的 data 里定义一个属性并将这个 prop 用作为初始值

    ````js
        props: ['initialCounter'],
        data() {
            return {
            counter: this.initialCounter
            }
        }
    ```

2. prop 以一种原始的值传入后续需要进行转换：在这种情况下，最好使用这个 prop 在子组件里定义一个计算属性

    ```js
        props: ['size'],
        computer: {
            normalizedSize: function() {
                return this.size.trim().toLowerCase()
            }
        }
    ```

不过要注意的是，因为JavaScript中对象和数组都是通过引用引入传入的，所以对于一个数组或对象类型的prop来说，在子组件中改变这个对象或数组本身会影响到父组件的状态

## Prop验证

我们可以为组件的 prop 指定验证要求，例如你知道的这些类型。如果有一个需求没有被满足，则 Vue 会在浏览器控制台中警告你。这在开发一个会被别人用到的组件时尤其有帮助。

为了定制 prop 的验证方式，你可以为 props 中的值提供一个带有验证需求的对象，而不是一个字符串数组。例如：

```js
Vue.component('my-component', {
            props: {
                // 基础类型检查，`null`匹配任何类型
                propA: Number,
                // 多个可能类型
                propB: [String, Number],
                // 必填的字符串
                propC: {
                    type: String,
                    required: true
                },
                // 带有默认值的数值类型prop
                propD: {
                    type: Number,
                    default: 100
                },
                // 带有默认值的对象类型prop
                propE: {
                    type: Object,
                    // 对象或数组一定会从一个工厂函数返回一个值
                    default: () => {
                        message: 'hello'
                    }
                },
                // 自定义验证函数
                propF: {
                    validator: (value) => ['success', 'warning', 'error'].indexOf(value) !== -1
                }
            }
        })
```

注意那些 prop 会在一个组件实例创建之前进行验证，所以实例的属性 (如 data、computed 等) 在 default 或 validator 函数中是不可用的。

## 类型检查

`type`可以是下列原生构造函数中的一个：

* String
* Number
* Boolean
* Array
* Object
* Date
* Function
* Symbol

额外的，type 还可以是一个自定义的构造函数，并且通过 `instanceof` 来进行检查确认。例如，给定下列现成的构造函数：

```js
function Person(firstName,lastName) {
    this.firstName = firstName
    this.lastName = lastName
}
```

你可以使用

```js
Vue.component('blog-post',{
    props: {
        author: Person
    }
})
```

来验证 `author` `prop` 的值是否是通过 `new Person` 创建的。

## 非Prop特性

一个非prop特性是指某个数据特性传向一个组件，但是该组件并没有相对应的 prop 名来接收

因为显式定义的 prop 适用于向一个子组件传入信息，然而组件库的作者并不是总能预见组件会被应用于怎样的场景。这也是为什么组件可以接受任意特性，而这些特性会被添加到这个组件的根元素上面。

比如，想象一下你通过一个 Bootstrap 插件使用了一个第三方的 `<bootstrap-data-input>` 组件，这个插件需要在其 `<input>`上用到一个 data-date-picker 特性。我们可以将这个特性添加到你的组件实例上：

```html
<bootstrap-data-input data-date-picker="activated"></bootstrap-data-input>
```

然后这个 data-date-picker="activated" 特性就会自动添加到 `<bootstrap-date-input>`的根元素上。

### 替换/合并已有的特性

想象一下`<bootstrap-data-input>`的模板是这样的

```html
<input type="date" class="from-control">
```

为了给我们的日期选择器插件定制一个主题，我们可能需要像这样添加一个特别的类名：

```html
<bootstrap-date-input
    data-date-picker="activated"
    class="date-picker-theme-dark">
</bootstrap-date-input>
```

在这种情况下，我们定义了两个不同的 class 的值：

* form-control，这是在组件的模板内设置好的
* date-picker-theme-dark，这是从组件的父级传入的

对于绝大多数特性来说，从外部提供给组件的值会替换掉组件内部设置好的值。所以如果传入 `type="text"` 就会替换掉 `type="date"` 并把它破坏！庆幸的是，`class` 和 `style` 特性会稍微智能一些，即两边的值会被合并起来，从而得到最终的值：`form-control date-picker-theme-dark`。

### 禁用特性继承

如果你不希望组件的根元素继承特性，你可以设置在组件的选项中设置 `inheritAttrs: false`。例如：

```js
Vue.component('my-component', {
    inheritAttrs: false,
    // ...
})
```

尤其适合配合实例的`$attrs`属性使用，该属性包含了传递给一个组件的特性名和特性值

有了`inheritAttrs: false`和`$attrs`，你就可以手动决定这些特性会被赋予给哪个元素，在撰写基础组件时会经常碰到

```js
Vue.component('base-input', {
    inheritAttrs: false,
    props: ['label','value'],
    template: `
        <label>
            {{label}}
            <input
                v-bind="$attrs"
                v-bind:value="value"
                v-on:input="$emit('input',$event.target.value)"
            >
        </label>
    `
})
```

这个模式允许我们在使用基础组件时，更像是在使用原生的HTML元素，而不用担心哪个元素才是真正的跟元素

```html
<base-input
    v-model="username"
    class="username-input"
    placeholder="Enter your name">
</base-input>
```