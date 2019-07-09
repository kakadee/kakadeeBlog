# Designated initializer

## 从对象的创建开始说起

在讨论指定初始化器之前，我们需要了解iOS的初始化是个什么过程。

OC中对象的创建过程分为两个步骤。
1. 为对象分配内存。
2. 初始化对象的成员变量。

```
MyCustomClass *myObject = [[MyCustomClass alloc] init];
```

在OC中，通过 `alloc` 或者 `allocWithZone:` 方法先为对象分配内存。
执行完这一步后，runtime 会：
1.1. 返回一个这个类对象的未初始化（uninitialized instance）的实例。
1.2. 设置一个isa指针指向这个类对象。
1.3. 随后将实例的所有变量清零（zero out to appropriately typed values)
1.4. 将这个对象的retain count 置为 1

当你 alloc 完你的对象时，随后你必须正确的对其初始化。
init 所做的就是，
2.1. 为对象的实例变量 设置合理的初始值
2.2. 为对象分配和准备其他全局资源 

苹果的官方图有一个更生动的解释：
![](https://raw.githubusercontent.com/kakadee/myMarkDownPic/master/img/20190619202852.png)

## Designated initializer，convenience initializer
根据苹果的官方文档[1]，
> The initializer of a class that takes the full complement of initialization parameters is usually the designated initializer. The designated initializer of a subclass must invoke the designated initializer of its superclass by sending a message to super. 
> 
> The convenience (or secondary) initializers — which can include init — do not call super. Instead they call (through a message to self) the initializer in the series with the next most parameters, supplying a default value for the parameter not passed into it. The final initializer in this series is the designated initializer.

简单翻译下，就是

**Designated initializer （指定初始化构造器）**：一般是能够正确初始化类的全部成员变量的构造器，在实现子类的指定初始化构造器过程中，必须先调用父类的初始化构造器（从而保证其父类的成员变量也被初始化正确）。



**convenience (or secondary) initializer （便利/次要初始化构造器）**:  为了方便调用者，调用者使用该构造器时可以传入部分参数去设置成员变量，其他的使用默认值。

便利初始化构造器不直接调用父类的指定初始化构造器，而是调用本类中的其他构造器，但是最终至少有一个便利初始化构造器会调用本类中的指定初始化构造器。

话说的比较难理解，直接看图就明白了。

<img src = 'https://raw.githubusercontent.com/kakadee/myMarkDownPic/master/img/20190619204959.png'  width="50%"></img>

#### 为什么需要 Designated initializer，convenience initializer ？
1. 需要 Designated initializer，，一般它传入最多的参数，因为要保证初始化的正确调用。iOS的初始化过程是一个链式的过程，为了保证整个继承链的正确初始化，iOS设计了 Designated initializer 的调用原则，稍后会说道。

2. 需要 convenience initializer，这个纯粹是为了方便开发者，可以少设置些参数，减少开发时间。

## NS_DESIGNATED_INITIALIZER 和 NS_UNAVAILABLE

之前我们谈到了 Designated initializer （指定初始化构造器）， 如果只有我们自己一个人开发，那么你只需要在心中对自己随便写的一个初始化器说，“嗯，就是你了！你就是我选定的初始化构造器~~”。

但是现实是，别人不知道。

如果你在一个类的头文件中声名了多个初始化构造器，那么别人该如何知道应该使用哪一个？

你当然可以使用注释的方法告诉调用者应该使用哪一个。

但是 苹果为我们提供了一个更为便捷和明智的做法 ---- 直接使用 NS_DESIGNATED_INITIALIZER 宏定义。

#### NS_DESIGNATED_INITIALIZER
```
#ifndef NS_DESIGNATED_INITIALIZER
#if __has_attribute(objc_designated_initializer)
#define NS_DESIGNATED_INITIALIZER __attribute__((objc_designated_initializer))
#else
#define NS_DESIGNATED_INITIALIZER
#endif
#endif
```

这个宏定义帮我们做了两件事。

1. 告诉调用者， 我使用了哪个初始化方法作为 Designated initializer.
2. 告诉编译器帮你检查错误❌， 如果你的 Designated initializer 不符合设计原则，编译器会提供 warning 给你，告诉你哪些地方出错了。

#### NS_UNAVAILABLE 
至于它的作用，就是告诉编译器，该方法是不可用的。
通过指定 NS_UNAVAILABLE , 你就可以让调用者只调用你允许的初始化构造器了。

## 正确编写 Designated initializer 的三大原则

1. 子类如果有指定初始化函数，那么指定初始化函数实现时必须调用它的直接父类的指定初始化函数。

2. 如果子类提供了指定初始化函数，那么一定要实现所有父类的指定初始化函数（并在其中调用本类中的指定初始化函数）。

3. 如果子类有指定初始化函数，那么次要初始化函数必须调用本类的其它初始化函数，但是最终会有一个调用本类的指定初始化函数。 

如果你没有按照这几个原则去实现，那么编译器会给你提供相应的 warning ⚠️⚠️⚠️，如果你视而不见，那么你的程序早晚会出现错误，❌❌❌。

## 当 initWithCoder: 遇到 NS_DESIGNATED_INITIALIZER

NSCoding协议的定义如下:
```
@protocol NSCoding
- (void)encodeWithCoder:(NSCoder *)aCoder;
- (nullable instancetype)initWithCoder:(NSCoder *)aDecoder; // NS_DESIGNATED_INITIALIZER
@end
```
苹果官方文档 Decoding an Object [2] 中明确规定：

>In the implementation of an initWithCoder: method, the object should first invoke its superclass’s designated initializer to initialize inherited state, and then it should decode and initialize its state. If the superclass adopts the NSCoding protocol, you start by assigning of the return value of initWithCoder: to self.

翻译一下:

1. 如父类没有实现NSCoding协议，那么应该调用父类的指定初始化函数。
2. 如果父类实现了NSCoing协议，那么子类的 initWithCoder: 的实现中需要调用父类的initWithCoder:方法，

根据上面阐述的指定初始化函数的三个原则，而NSCoding实现的两个原则都需要父类的初始化函数，这违反了指定初始化实现的第二条原则。

**怎么办？**

可以参考 UIViewController 和 UIView 的实现。

实现NSCoding协议的时候，我们可以显示的声明 initWithCoder: 为指定初始化函数(一个类可以有多个指定初始化函数，比如UIViewController)即可完美解决问题，既满足了指定初始化函数的三个规则，又满足了NSCoding协议的两条原则。

 
## 参考
1 - Object creation
[https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/ObjectCreation.html#//apple_ref/doc/uid/TP40008195-CH39-SW1](Object creation)

2 - Decoding an Object
https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/Archiving/Articles/codingobjects.html#//apple_ref/doc/uid/20000948

3 - iOS: 聊聊 Designated Initializer（指定初始化函数）
[https://www.cnblogs.com/smileEvday/p/designated_initializer.html](iOS: 聊聊 Designated Initializer（指定初始化函数）)

4 - Designated Initializers and Convenience Initializers in Swift
[https://www.codingexplorer.com/designated-initializers-convenience-initializers-swift/](Designated Initializers and Convenience Initializers in Swift)

5 - Multiple initializers
[https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/MultipleInitializers.html](Multiple initializers)

6 - Initialization
[https://developer.apple.com/library/archive/documentation/General/Conceptual/DevPedia-CocoaCore/Initialization.html#//apple_ref/doc/uid/TP40008195-CH21-SW1](Initialization)

7 - 正确编写Designated Initializer的几个原则
[http://blog.jobbole.com/65762/](正确编写Designated Initializer的几个原则)

