(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{188:function(a,t,n){"use strict";n.r(t);var s=n(0),e=Object(s.a)({},function(){var a=this,t=a.$createElement,n=a._self._c||t;return n("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[n("h1",{attrs:{id:"caaction"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#caaction","aria-hidden":"true"}},[a._v("#")]),a._v(" CAAction")]),a._v(" "),n("h2",{attrs:{id:"caaction概念"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#caaction概念","aria-hidden":"true"}},[a._v("#")]),a._v(" CAAction概念")]),a._v(" "),n("p",[a._v("话不多说，先看源码：")]),a._v(" "),n("div",{staticClass:"language-objectivec line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-objectivec"}},[n("code",[n("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("@protocol")]),a._v(" CAAction\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[a._v("/* Called to trigger the event named 'path' on the receiver. The object\n * (e.g. the layer) on which the event happened is 'anObject'. The\n * arguments dictionary may be nil, if non-nil it carries parameters\n * associated with the event. */")]),a._v("\n\n"),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v("-")]),a._v(" "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),n("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("void")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("runActionForKey"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("NSString "),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v("*")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("event object"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("id"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("anObject\n    arguments"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),a._v("nullable NSDictionary "),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v("*")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),a._v("dict"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("@end")]),a._v("\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br")])]),n("p",[a._v("从源码中我们可以看出，CAAction 其实是一个协议，也可以说它是一个接口。原则上说，只要一个对象遵循了这个协议，我们都可以称它为一个CAAction对象。但是在实际的应用中，这个对象基本上只用来处理动画。")]),a._v(" "),n("p",[a._v("比如说，我们的"),n("code",[a._v("CAAnimation")]),a._v("类就遵循了CAAction协议，当一个 Layer 需要执行一个 Action对象的时候，你可以将一个你自己创建的"),n("code",[a._v("CAAnimation")]),a._v("对象传过去。")]),a._v(" "),n("h2",{attrs:{id:"caaction如何触发"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#caaction如何触发","aria-hidden":"true"}},[a._v("#")]),a._v(" CAAction如何触发")]),a._v(" "),n("p",[a._v("当你定义了一个动作对象，你必须决定动作以何种方式被触发。动作的触发器定义了你用于注册动作的键（行为标示符）。动作对象可在下面的情况下被触发：")]),a._v(" "),n("ol",[n("li",[a._v("图层的某一个属性值被改变。这可以是图层的任何一个属性，不仅仅是可动画的属性（你也可以给添加到图层的自定义属性关联动作）。 识别动作的键是属性名。")]),a._v(" "),n("li",[a._v("图层变成可视或被加入到图层层次中。则识别动作的键为kCAOnOrderIn。")]),a._v(" "),n("li",[a._v("图层从图层层次中被移除。则识别动作的键为kCAOnOrderOut。")]),a._v(" "),n("li",[a._v("图层是即将包含一个变换动画。则识别动作的键为kCATransition。")])]),a._v(" "),n("h2",{attrs:{id:"layer-如何执行-caaction"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#layer-如何执行-caaction","aria-hidden":"true"}},[a._v("#")]),a._v(" Layer 如何执行 CAAction")]),a._v(" "),n("p",[a._v("先来看下面这张图。")]),a._v(" "),n("p",[n("img",{attrs:{src:"https://raw.githubusercontent.com/kakadee/myMarkDownPic/master/img/20191119201927.png",alt:"pic1-action"}})]),a._v(" "),n("p",[a._v("当改变一个Layer的属性之后，Layer会先检查有没有代理。如果设置了layer的代理，可以通过执行代理方法"),n("code",[a._v("actionForLayer:forKey:")]),a._v("。代理方法可以返回：")]),a._v(" "),n("p",[a._v("a. "),n("code",[a._v("action对象")]),a._v("。例如CAAnimation对象。"),n("br"),a._v("\nb. "),n("code",[a._v("nil")]),a._v("。nil表示结束actionForLayer:forKey:方法的执行，继续搜索下一个阶段。"),n("br"),a._v("\nc. "),n("code",[a._v("[NSNull null]")]),a._v("。表示结束搜索，即结束actionForLayer:forKey:，也结束其他阶段，将不会有隐式动画。")]),a._v(" "),n("p",[a._v("如果Layer没有设置代理，或者代理返回nil, 那么Layer的"),n("code",[a._v("actionForKey:")]),a._v("方法将会按以下顺序继续搜索：")]),a._v(" "),n("ol",[n("li",[a._v("查找Layer的actions属性，看key是否有对应的值。")]),a._v(" "),n("li",[a._v("查找Layer的style属性。")]),a._v(" "),n("li",[a._v("Layer调用defaultActionForKey:方法。")]),a._v(" "),n("li",[a._v("如果搜索到了最后阶段，如果是可动画的属性，layer会执行一个默认的action对象，一般是CABasicAnimation。")])]),a._v(" "),n("p",[a._v("如果最后确实返回了一个action对象，那么该对象就会执行"),n("code",[a._v("runActionForLayer:object:arguments:")]),a._v("方法，我们的Layer就会按照方法里定义好的行为去做动作。")]),a._v(" "),n("h2",{attrs:{id:"qa"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#qa","aria-hidden":"true"}},[a._v("#")]),a._v(" QA")]),a._v(" "),n("h3",{attrs:{id:"q-为什么直接改变view或者其layer的属性不会有隐式动画"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#q-为什么直接改变view或者其layer的属性不会有隐式动画","aria-hidden":"true"}},[a._v("#")]),a._v(" Q: 为什么直接改变View或者其Layer的属性不会有隐式动画")]),a._v(" "),n("p",[a._v("A: 因为属性改变时 layer 会向 view 请求一个action，而一般情况下 view 将返回一个 NSNull，只有当属性改变发生在动画 block 中时，view 才会返回实际的动作。")]),a._v(" "),n("p",[a._v("如何验证？")]),a._v(" "),n("div",{staticClass:"language-objectivec line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-objectivec"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[a._v("NSLog")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[a._v('@"outside animation block: %@"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n      "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("myView actionForLayer"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),a._v("myView"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("layer forKey"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),n("span",{pre:!0,attrs:{class:"token string"}},[a._v('@"position"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("UIView animateWithDuration"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),n("span",{pre:!0,attrs:{class:"token number"}},[a._v("0.3")]),a._v(" animations"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v("^")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("{")]),a._v("\n    "),n("span",{pre:!0,attrs:{class:"token function"}},[a._v("NSLog")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("(")]),n("span",{pre:!0,attrs:{class:"token string"}},[a._v('@"inside animation block: %@"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(",")]),a._v("\n          "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("myView actionForLayer"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),a._v("myView"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("layer forKey"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),n("span",{pre:!0,attrs:{class:"token string"}},[a._v('@"position"')]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(")")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("}")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[a._v("// 打印内容：")]),a._v("\noutside animation block"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),a._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("null"),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v("\ninside animation block"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),a._v(" "),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v("<")]),a._v("CABasicAnimation"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),a._v(" "),n("span",{pre:!0,attrs:{class:"token number"}},[a._v("0x8c2ff10")]),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v(">")]),a._v("\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br"),n("span",{staticClass:"line-number"},[a._v("5")]),n("br"),n("span",{staticClass:"line-number"},[a._v("6")]),n("br"),n("span",{staticClass:"line-number"},[a._v("7")]),n("br"),n("span",{staticClass:"line-number"},[a._v("8")]),n("br"),n("span",{staticClass:"line-number"},[a._v("9")]),n("br"),n("span",{staticClass:"line-number"},[a._v("10")]),n("br"),n("span",{staticClass:"line-number"},[a._v("11")]),n("br")])]),n("p",[a._v("运行上面的代码，可以看到在 block 外 view 返回的是 NSNull 对象，而在 block 中时返回的是一个 CABasicAnimation。")]),a._v(" "),n("h3",{attrs:{id:"q-如何关闭layer隐式动画"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#q-如何关闭layer隐式动画","aria-hidden":"true"}},[a._v("#")]),a._v(" Q: 如何关闭Layer隐式动画")]),a._v(" "),n("p",[a._v("A: 如果是自定义的Layer,可以重写其"),n("code",[a._v("actionForKey:")]),a._v("方法，让其返回"),n("code",[a._v("[NSNull null]")]),a._v("。如果是系统的Layer, 可以指定其代理，在代理的"),n("code",[a._v("actionForLayer:forKey:")]),a._v("方法中返回"),n("code",[a._v("[NSNull null]")]),a._v("。")]),a._v(" "),n("p",[a._v("还有一种方法，用"),n("code",[a._v("CATransaction")]),a._v("类临时取消隐式动画。")]),a._v(" "),n("div",{staticClass:"language-objectivec line-numbers-mode"},[n("pre",{pre:!0,attrs:{class:"language-objectivec"}},[n("code",[n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("CATransaction begin"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("CATransaction setDisableActions"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(":")]),a._v("YES"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),n("span",{pre:!0,attrs:{class:"token keyword"}},[a._v("self")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("standaloneLayer"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("backgroundColor "),n("span",{pre:!0,attrs:{class:"token operator"}},[a._v("=")]),a._v(" UIColor"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(".")]),a._v("redColor"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("[")]),a._v("CATransaction commit"),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v("]")]),n("span",{pre:!0,attrs:{class:"token punctuation"}},[a._v(";")]),a._v("\n")])]),a._v(" "),n("div",{staticClass:"line-numbers-wrapper"},[n("span",{staticClass:"line-number"},[a._v("1")]),n("br"),n("span",{staticClass:"line-number"},[a._v("2")]),n("br"),n("span",{staticClass:"line-number"},[a._v("3")]),n("br"),n("span",{staticClass:"line-number"},[a._v("4")]),n("br")])]),n("h2",{attrs:{id:"参考"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#参考","aria-hidden":"true"}},[a._v("#")]),a._v(" 参考")]),a._v(" "),n("ol",[n("li",[n("p",[n("a",{attrs:{href:"https://www.objc.io/issues/12-animations/view-layer-synergy/",target:"_blank",rel:"noopener noreferrer"}},[a._v("View-Layer Synergy"),n("OutboundLink")],1)])]),a._v(" "),n("li",[n("p",[n("a",{attrs:{href:"https://www.jianshu.com/p/9e9c8ee3f7a2",target:"_blank",rel:"noopener noreferrer"}},[a._v("CALayer的隐式动画"),n("OutboundLink")],1)])])])])},[],!1,null,null,null);t.default=e.exports}}]);