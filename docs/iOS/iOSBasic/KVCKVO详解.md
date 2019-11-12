# KVC & KVO

## KVC

1. KVC 中文名叫 键值编码，是 Key-Value-Coding 的简称。
2. KVC 是一种可以直接通过字符串的名字 key 来访问类属性的机制，而不是通过调用 setter、getter 方法去访问。
3. 我们可以通过在运行时动态的访问和修改对象的属性。而不是在编译时确定，KVC 是 iOS 开发中的黑魔法之一。

### KVC属性

KVC 是通过字符串的 key 来访问和设置类属性的。

* 设置值

```objectivec
// value的值为OC对象，如果是基本数据类型要包装成NSNumber
- (void)setValue:(id)value forKey:(NSString *)key;

// keyPath键路径，类型为xx.xx
- (void)setValue:(id)value forKeyPath:(NSString *)keyPath;

// 它的默认实现是抛出异常，可以重写这个函数做错误处理。
- (void)setValue:(id)value forUndefinedKey:(NSString *)key;
```

* 获取值

```objectivec
- (id)valueForKey:(NSString *)key;

- (id)valueForKeyPath:(NSString *)keyPath;

// 如果Key不存在，且没有KVC无法搜索到任何和Key有关的字段或者属性，则会调用这个方法，默认是抛出异常
- (id)valueForUndefinedKey:(NSString *)key;
```

NSKeyValueCoding 类别中还有其他的一些方法:

```objectivec
// 允许直接访问实例变量，默认返回YES。如果某个类重写了这个方法，且返回NO，则KVC不可以访问该类。
+ (BOOL)accessInstanceVariablesDirectly;

// 这是集合操作的API，里面还有一系列这样的API，如果属性是一个NSMutableArray，那么可以用这个方法来返回
- (NSMutableArray *)mutableArrayValueForKey:(NSString *)key;

// 如果你在setValue方法时面给Value传nil，则会调用这个方法
- (void)setNilValueForKey:(NSString *)key;

// 输入一组key，返回该组key对应的Value，再转成字典返回，用于将Model转到字典。
- (NSDictionary *)dictionaryWithValuesForKeys:(NSArray *)keys;

// KVC提供属性值确认的API，它可以用来检查set的值是否正确、为不正确的值做一个替换值或者拒绝设置新值并返回错误原因。
- (BOOL)validateValue:(id)ioValue forKey:(NSString *)inKey error:(NSError)outError;
```

### 如何使用KVC

定义一个Person类。

```objectivec
//  Person.h
@interface Person : NSObject
@property (nonatomic, copy, readonly) NSString *name;
@end

//  Person.m
@interface Person () {
    int age;
}
@property (nonatomic, copy, readwrite) NSString *name;
@end
```

设置私有变量 age 和 只读变量 name, 如果用一般的 setter 和 getter，在类外部是不能访问到私有变量的，不能设值给只读变量，那是不是就拿它没办法了呢? 然而 KVC 可以做到，就是这么神奇。

```objectivec
[p setValue:@"Jack" forKey:@"name"];
[p setValue:[NSNumber numberWithInteger:14] forKey:@"age"];
NSLog(@"test---p.name:%@,age:%@",[p valueForKey:@"name"],[p valueForKey:@"isAge"]);
```

### 实现的细节

```objectivec
- (void)setValue:(id)value forKey:(NSString *)key;
```

参考Search Pattern for the Basic Setter [1]

1. 首先搜索 setter 方法(set\<Key>: or _set\<Key>)，有就直接赋值。
2. 如果上面的 setter 方法没有找到，再检查类方法+ (BOOL)accessInstanceVariablesDirectly
    1. 返回 NO，则执行setValue：forUNdefinedKey：
    2. 返回 YES，则按_\<key>，_\<isKey>，\<key>，\<isKey>的顺序搜索成员名。
3. 还没有找到的话，就调用setValue:forUndefinedKey;
4. 如果没有重写 setValue:forUndefinedKey，会造成崩溃(抛出NSUndefinedKeyException)。

```objectivec
- (id)valueForKey:(NSString *)key;
```

1. 首先查找 getter (get\<Key>, \<key>, is\<Key>, or _\<key> )方法，找到直接调用。如果是 bool、int、float 等基本数据类型，会做 NSNumber 的转换。
2. 如果没查到，再检查类方法+ (BOOL)accessInstanceVariablesDirectly
    1. 返回 NO，则执行valueForUNdefinedKey:
    2. 返回 YES，则按_\<key>,_is\<Key>,\<key>,is\<Key>的顺序搜索成员名。
3. 还没有找到的话，调用valueForUndefinedKey;
4. 如果没有重写 valueForUndefinedKey，也会造成崩溃(抛出NSUndefinedKeyException)。

### 总结

**KVC 与点语法比较**
用 KVC 访问属性和用点语法访问属性的区别：

1. 用点语法编译器会做预编译检查，访问不存在的属性编译器会报错，但是用 KVC 方式编译器无法做检查，如果有错误只能运行的时候才能发现（crash）。
2. 相比点语法用 KVC 方式 KVC 的效率会稍低一点，但是灵活，可以在程序运行时决定访问哪些属性。
3. 用 KVC 可以访问对象的私有成员变量。

**优点：**

1. 不需要通过 setter、getter 方法去访问对象的属性，可以访问对象的私有属性
2. 可以轻松处理集合类。

**缺点：**

1. 一旦使用KVC你的编译器无法检查出错误，即不会对设置的键、键值路径进行错误检查。
2. 执行效率要低于 setter 和 getter 方法。因为使用 KVC 键值编码，它必须先解析字符串，然后在设置或者访问对象的实例变量。
3. 使用 KVC 会破坏类的封装性。

## KVO

1. KVO 是 Key-Value-Observing 的简称。
2. KVO 是一个观察者模式。观察一个对象的属性，注册一个指定的路径，若这个对象的的属性被修改，则 KVO 会自动通知观察者。
3. 更通俗的话来说就是任何对象都允许观察其他对象的属性，并且可以接收其他对象状态变化的通知。

### 如何使用KVO

```objectivec
1.// 注册观察者，实施监听；
[self.person addObserver:self
              forKeyPath:@"age"
                 options:NSKeyValueObservingOptionNew
                 context:nil];
2.// 回调方法，在这里处理属性发生的变化；
- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary<NSString *,id> *)change
                       context:(void *)context

3.// 移除观察者；
[self removeObserver:self forKeyPath:@“age"];
```

### KVO实现原理

当某个类的对象第一次被观察时，系统就会在运行期动态地创建该类的一个派生类，在这个派生类中重写基类中任何被观察属性的 setter 方法。 派生类在被重写的 setter 方法实现真正的通知机制，就如前面手动实现键值观察那样。这么做是基于设置属性会调用 setter 方法，而通过重写就获得了 KVO 需要的通知机制。

当然前提是要通过遵循 KVO 的属性设置方式来变更属性值，如果仅是直接修改属性对应的成员变量，是无法实现 KVO 的。 同时派生类还重写了 class 方法以“欺骗”外部调用者它就是起初的那个类。然后系统将这个对象的 isa 指针指向这个新诞生的派生类，因此这个对象就成为该派生类的对象了，因而在该对象上对 setter 的调用就会调用重写的 setter，从而激活键值通知机制。此外，派生类还重写了 dealloc 方法来释放资源。

**派生类 NSKVONotifying_Person 剖析：**

在这个过程，被观察对象的 isa 指针从指向原来的 Person 类，被 KVO 机制修改为指向系统新创建的子类 NSKVONotifying_Person 类，来实现当前类属性值改变的监听。

所以当我们从应用层面上看来，完全没有意识到有新的类出现，这是系统“隐瞒”了对 KVO 的底层实现过程，让我们误以为还是原来的类。但是此时如果我们创建一个新的名为 NSKVONotifying_Person 的类()，就会发现系统运行到注册 KVO 的那段代码时程序就崩溃，因为系统在注册监听的时候动态创建了名为 NSKVONotifying_Person 的中间类，并指向这个中间类了。

因而在该对象上对 setter 的调用就会调用已重写的 setter，从而激活键值通知机制。这也是 KVO 回调机制，为什么都俗称 KVO 技术为黑魔法的原因之一吧：内部神秘、外观简洁。

**子类 setter 方法剖析：**

KVO 在调用存取方法之前总是调用 willChangeValueForKey:，通知系统该 keyPath 的属性值即将变更。 当改变发生后，didChangeValueForKey: 被调用，通知系统该 keyPath 的属性值已经变更。 之后，observeValueForKey:ofObject:change:context: 也会被调用。

重写观察属性的 setter 方法这种方式是在运行时而不是编译时实现的。 KVO 为子类的观察者属性重写调用存取方法的工作原理在代码中相当于：

```objectivec
- (void)setName:(NSString *)newName
{
    [self willChangeValueForKey:@"name"];    // KVO在调用存取方法之前总调用
    [super setValue:newName forKey:@"name"]; // 调用父类的存取方法
    [self didChangeValueForKey:@"name"];     // KVO在调用存取方法之后总调用
}

```

## 面试题

### 1. iOS用什么方式实现对一个对象的KVO？（KVO的本质是什么？）

答: 当一个对象使用了KVO监听，iOS系统会修改这个对象的isa指针，改为指向一个全新的通过Runtime动态创建的子类，子类拥有自己的set方法实现，set方法实现内部会顺序调用willChangeValueForKey方法、原来的setter方法实现、didChangeValueForKey方法，而didChangeValueForKey方法内部又会调用监听器的observeValueForKeyPath:ofObject:change:context:监听方法。

### 2. 如何手动触发KVO

答: 被监听的属性的值被修改时，就会自动触发KVO。如果想要手动触发KVO，则需要我们自己调用willChangeValueForKey和didChangeValueForKey方法即可在不改变属性值的情况下手动触发KVO，并且这两个方法缺一不可。

## 参考

[1] [Key-Value Coding Programming Guide](<https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/KeyValueCoding/SearchImplementation.html#//apple_ref/doc/uid/20000955-CJBBBFFA>)

[2] KVC 与 KVO 使用姿势和原理解析 (<https://www.jianshu.com/p/4748ef75126a>)
