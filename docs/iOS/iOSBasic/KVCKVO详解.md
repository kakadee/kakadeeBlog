# KVC,KVO 详解

## 什么是KVC

1. KVC 中文名叫 键值编码，是 Key-Value-Coding 的简称。
2. KVC 是一种可以直接通过字符串的名字 key 来访问类属性的机制，而不是通过调用 setter、getter 方法去访问。
3. 我们可以通过在运行时动态的访问和修改对象的属性。而不是在编译时确定，KVC 是 iOS 开发中的黑魔法之一。

## KVC有哪些属性

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

## 如何使用KVC

定义一个Person类。

```objectivec
//  Person.h
@interface Person : NSObject

@property (nonatomic, copy, readonly) NSString *name;

@end

//  Person.m

@interface Person () {
    int isAge;
}

@property (nonatomic, copy, readonly) NSString *name;

@end

```

设置私有变量 age 和 内部变量 name, 如果用一般的 setter 和 getter，在类外部是不能访问到私有变量的，不能设值给只读变量，那是不是就拿它没办法了呢? 然而 KVC 可以做到，就是这么神奇。

```objectivec
[p setValue:@"Jack" forKey:@"name"];
[p setValue:[NSNumber numberWithInteger:14] forKey:@"age"];
NSLog(@"test---p.name:%@,age:%@",[p valueForKey:@"name"],[p valueForKey:@"isAge"]);
```

## KVC实现的细节

```objectivec
- (void)setValue:(id)value forKey:(NSString *)key;
```

1. 首先搜索 setter 方法，有就直接赋值。
2. 如果上面的 setter 方法没有找到，再检查类方法+ (BOOL)accessInstanceVariablesDirectly
    1. 返回 NO，则执行setValue：forUNdefinedKey：
    2. 返回 YES，则按_\<key>，_\<isKey>，\<key>，\<isKey>的顺序搜索成员名。
3. 还没有找到的话，就调用setValue:forUndefinedKey:

```objectivec
- (id)valueForKey:(NSString *)key;
```

1. 首先查找 getter 方法，找到直接调用。如果是 bool、int、float 等基本数据类型，会做 NSNumber 的转换。
2. 如果没查到，再检查类方法+ (BOOL)accessInstanceVariablesDirectly
    1. 返回 NO，则执行valueForUNdefinedKey:
    2. 返回 YES，则按_\<key>,_is\<Key>,\<key>,is\<Key>的顺序搜索成员名。
3. 还没有找到的话，调用valueForUndefinedKey;

## KVC 总结

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

## 什么是KVO

## 如何使用KVO

## KVO的实现原理
