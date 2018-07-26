# Vue事件机制

Vue.js 用`v-on`指令来监听 DOM 事件

## 事件修饰符

原生JS事件处理程序中，常常需要调用`event.preventDefault`或是`event.stopPropagation`是常见的需求，尽管我们可以在方法中轻松实现这点，但更好的方式是：方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。Vue.js提供事件修饰符来满足这些需求

* `v-on:click.stop="doThis"` 阻止单击事件继续传播
* `v-on:submit.prevent="onSubmit"` 提交事件不再重载页面
* `v-on:click.stop.prevent="doThat"` 修饰符可以串联
* `v-on:click.prevent` 只有修饰符
* `v-on:click.capture="doThis"` 添加事件监听器时使用事件捕获模式,即元素自身触发的事件先在此处处理，然后才交由内部元素进行处理
* `v-on:click.self="doThat"` 只当在 event.target 是当前元素自身时触发处理函数,即事件不是从内部元素触发的
* 使用修饰符时，顺序也是非常重要的。`v-on:click.prevent.self`  会阻止所有的点击,而`v-on:click.self.prevent` 只会阻止对元素自身的点击
* `v-on:click.once="doThis"` 新增修饰符，即事件处理函数只会触发一次 `.once`修饰符特殊的地方在于，不像其他修饰符只能用于原生事件，它还能用于自定义事件
* Vue 还对应 `addEventListener` 中的 `passive` 选项提供了 `.passive` 修饰符。 `v-on:scroll.passive="onScroll"` -- 滚动事件的默认行为 (即滚动行为) 将会立即触发 ,而不会等待`onScroll` 完成，这其中包含`event.preventDefault()` 的情况。`.passive`修饰符尤其能够提升移动端性能。但是务必不要把 `.passive` 和 `.prevent` 一起使用，因为 `.prevent` 将会被忽略，同时浏览器可能会向你展示一个警告。请记住，`.passive` 会告诉浏览器你不想阻止事件的默认行为。

## 按键修饰符

在监听键盘事件时，我们经常需要检查常见的键值。Vue 允许为 `v-on` 在监听键盘事件时添加按键修饰符：

```html
<!-- 只有在 `keyCode` 是 13 时调用 `vm.submit()` -->
<input v-on:keyup.13="submit">
```

记住所有的按键的`keyCode`值是比较困难的，所以`Vue`为最常用的按键提供了别名

```html
<!-- 同上 -->
<input v-on:keyup.enter="submit">
<input @keyup.enter="submit">
```

全部的按键别名

* `@keyup.enter`
* `@keyup.tab`
* `@keyup.delete` (捕获“删除”和“退格”键)
* `@keyup.esc`
* `@keyup.space`
* `@keyup.up`
* `@keyup.down`
* `@keyup.left`
* `@keyup.right`

可以通过全局配置`config.keyCodes`对象来自定义按键修饰符别名

```js
// 以使用 `v-on:keyup.f1`
Vue.config.keyCode.f1 = 112
```

## Vue.js为什么在 HTML 中监听事件

1. 扫一眼 HTML 模板便能轻松定位在 JavaScript 代码里对应的方法。
2. 因为你无须在 JavaScript 里手动绑定事件，你的 `ViewModel` 代码可以是非常纯粹的逻辑，和 DOM 完全解耦，更易于测试。
3. 当一个 ViewModel 被销毁时，所有的事件处理器都会自动被删除。你无须担心如何清理它们。