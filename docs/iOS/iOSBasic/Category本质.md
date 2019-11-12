# Category本质

苹果公司在Objective-C 2.0中，提供了category这个语言特性，可以动态地为已有类添加新行为。

## Category 使用场合

#### 1. 为已经存在的类添加新的方法，或者覆盖原有的方法

例如想扩展系统的UIButton的功能，可以为UIButton写一个Category, 这样引用 `UIButton+Category.h` 即可以使用新添加的方法了。

#### 2. 分类

一个类中的代码非常多，如果超过1000多行，那么在翻阅的时候也会觉得很困难，这时候可以采取分类的方式，把想通类型的代码加载在一起。这样，可以把类的实现分开在不同的几个文件里面。好处多多：

* 可以减少单个文件的体积
* 可以把不同的功能组织到不同的category里
* 可以由多个开发者共同完成一个类
* 可以按需加载想要的category 等等。

## Category 实现原理

iOS 在 runtime (程序运行的时候，而不是编译的时候)动态的将 Category 中的方法添加到类方法或者元类方法中。

### 编译期

在编译的时候，所有的 Category 文件都会被转化成 category_t 的结构体形式。但是并没有合并到class的底层结构中去。category_t 结构体的定义如下：

```objectivec
struct category_t {
    struct _category_t {
    const char *name;
    struct _class_t *cls;
    const struct _method_list_t *instance_methods;
    const struct _method_list_t *class_methods;
    const struct _protocol_list_t *protocols;
    const struct _prop_list_t *properties;
};
```

创建一个`LJPerson` 类如下：

```objectivec
// 创建LJPerson类，里面不添加任何属性和方法
// LJPerson.h
// LJPerson.m 

// LJPerson+Test1.h
@interface LJPerson (Test1)
@property(nonatomic, assign) NSInteger age;
- (void)eat;
+ (void)walk;
@end

// LJPerson+Test1.m
@implementation LJPerson (Test1)
- (void)eat {
    NSLog(@"eat");
}
+ (void)walk {
     NSLog(@"walk");
}
```

将 `LJPerson+Test1.m` 重写成cpp的代码：

```objectivec
xcrun -sdk iphoneos clang -arch arm64 -rewrite-objc LJPerson+Test1.m

```

可以得到核心代码如下：

```objectivec
static struct /*_method_list_t*/ {
	unsigned int entsize;  // sizeof(struct _objc_method)
	unsigned int method_count;
	struct _objc_method method_list[1];
} _OBJC_$_CATEGORY_INSTANCE_METHODS_LJPerson_$_Test1 __attribute__ ((used, section ("__DATA,__objc_const"))) = {
	sizeof(_objc_method),
	1,
	{{(struct objc_selector *)"eat", "v16@0:8", (void *)_I_LJPerson_Test1_eat}}
};

static struct /*_method_list_t*/ {
	unsigned int entsize;  // sizeof(struct _objc_method)
	unsigned int method_count;
	struct _objc_method method_list[1];
} _OBJC_$_CATEGORY_CLASS_METHODS_LJPerson_$_Test1 __attribute__ ((used, section ("__DATA,__objc_const"))) = {
	sizeof(_objc_method),
	1,
	{{(struct objc_selector *)"walk", "v16@0:8", (void *)_C_LJPerson_Test1_walk}}
};

static struct /*_prop_list_t*/ {
	unsigned int entsize;  // sizeof(struct _prop_t)
	unsigned int count_of_properties;
	struct _prop_t prop_list[1];
} _OBJC_$_PROP_LIST_LJPerson_$_Test1 __attribute__ ((used, section ("__DATA,__objc_const"))) = {
	sizeof(_prop_t),
	1,
	{{"age","Tq,N"}}
};
extern "C" __declspec(dllimport) struct _class_t OBJC_CLASS_$_LJPerson;

static struct _category_t _OBJC_$_CATEGORY_LJPerson_$_Test1 __attribute__ ((used, section ("__DATA,__objc_const"))) = 
{
	"LJPerson",
	0, // &OBJC_CLASS_$_LJPerson,
	(const struct _method_list_t *)&_OBJC_$_CATEGORY_INSTANCE_METHODS_LJPerson_$_Test1,
	(const struct _method_list_t *)&_OBJC_$_CATEGORY_CLASS_METHODS_LJPerson_$_Test1,
	0,
	(const struct _prop_list_t *)&_OBJC_$_PROP_LIST_LJPerson_$_Test1,
};
static void OBJC_CATEGORY_SETUP_$_LJPerson_$_Test1(void ) {
	_OBJC_$_CATEGORY_LJPerson_$_Test1.cls = &OBJC_CLASS_$_LJPerson;
}
#pragma section(".objc_inithooks$B", long, read, write)
__declspec(allocate(".objc_inithooks$B")) static void *OBJC_CATEGORY_SETUP[] = {
	(void *)&OBJC_CATEGORY_SETUP_$_LJPerson_$_Test1,
};
static struct _category_t *L_OBJC_LABEL_CATEGORY_$ [1] __attribute__((used, section ("__DATA, __objc_catlist,regular,no_dead_strip")))= {
	&_OBJC_$_CATEGORY_LJPerson_$_Test1,
};

```

我们可以看到，

1. 编译器生成了实例方法列表 `_OBJC_$_CATEGORY_INSTANCE_METHODS_LJPerson_$_Test1`

2. 编译器生成了类方法列表 `_OBJC_$_CATEGORY_CLASS_METHODS_LJPerson_$_Test1`

3. 编译器生成了属性列表 `_OBJC_$_PROP_LIST_LJPerson_$_Test1`

4. 编译器生成了category本身 `_OBJC_$_CATEGORY_LJPerson_$_Test1`，并用前面生成的列表来初始化category本身

5. 将 `_OBJC_$_CATEGORY_LJPerson_$_Test1` 的 cls 指针指向 `LJPerson`的地址`&OBJC_CLASS_$_LJPerson`

6. 最后，编译器在DATA段下的`__objc_catlist` section里保存了一个大小为 1 的 category_t 的数组 `L_OBJC_LABELCATEGORY$`（当然，如果有多个category，会生成对应长度的数组），用于运行期category的加载。

### 运行期

运行期的源码就不贴在这里了，有兴趣的可以自行百度。 Category 运行期的加载大概经历这么几个阶段：

1. 通过 Runtime 加载某个类的所有 Category 数据

2. 把所有 Category 的方法，属性，协议数据，合并到一个大数组中，最后面参与编译的分类优先放在前面。

3. 将合并后的分类数据（方法，属性，协议），插入到类原来数据的前面

## Category 添加成员变量

### 正确认识

在一般情况下，我们能否给 Category 添加成员变量呢？

答案自然是否否定的。原因也很简单，因为底层结构就没有存储 Category 的实例变量，只存储了方法，协议和属性。

我们为 Category 添加属性，只会声明setter和getter方法，并不会为我们自动生成相应的实例变量。所以为 Category 里的属性赋值是没有作用的。

**那么苹果为什么不存储实例变量，为什么Category要这么设计呢？**

我们设想一下如果Objective-C允许动态增加成员变量，会发生什么事情。
这样做会带来严重问题，为基类动态增加成员变量会导致所有已创建出的子类实例都无法使用，比如上线后的app，如果用户手机系统升级iOS新版本后，必须重新编译提交才能在新版系统上运行。那为什么runtime允许动态添加方法和属性，而不会引发问题呢？

因为方法和属性并不“属于”类实例，而成员变量“属于”类实例。我们所说的“类实例”概念，指的是一块内存区域，包含了isa指针和所有的成员变量。所以假如允许动态修改类成员变量布局，已经创建出的类实例就不符合类定义了，变成了无效对象。但方法定义是在objc_class中管理的，不管如何增删类方法，都不影响类实例的内存布局，已经创建出的类实例仍然可正常使用。


### 如何添加

那么，能不能间接实现给一个 Category 添加 成员变量呢？

答案是使用 **关联对象** 。

```objectivec
// LJPerson+Test1.h
// 在 分类中声名一个属性 name
@interface LJPerson (Test1)
@property(nonatomic, copy) NSString *name;
@end

// LJPerson+Test1.m
static const void *kNameKey = &kNameKey; // 这里只需要为key设置一个唯一值就可以了

- (NSString *)name {
    // 返回关联对象
    return objc_getAssociatedObject(self, kNameKey);
}

- (void)setName:(NSString *)name {
    // 设置关联对象
    objc_setAssociatedObject(self, kNameKey, name, OBJC_ASSOCIATION_COPY_NONATOMIC);
}

```

### 关联对象的原理

![关联对象的原理](https://raw.githubusercontent.com/kakadee/myMarkDownPic/master/img/20191021212831.png)

## load, initialize

### load 

在 [苹果官方文档](https://developer.apple.com/reference/objectivec/nsobject/1418815-load?language=objc) 中是这样描述的：
```objectivec
Invoked whenever a class or category is added to the Objective-C runtime; implement this method to perform class-specific behavior upon loading.

当类（Class）或者类别（Category）加入Runtime中时（就是被引用的时候）。
实现该方法，可以在加载时做一些类特有的操作。

Discussion

The load message is sent to classes and categories that are both dynamically loaded and statically linked, but only if the newly loaded class or category implements a method that can respond.

The order of initialization is as follows:

All initializers in any framework you link to.
调用所有的Framework中的初始化方法

All +load methods in your image.
调用所有的+load方法

All C++ static initializers and C/C++ attribute(constructor) functions in your image.
调用C++的静态初始化方及C/C++中的attribute(constructor)函数

All initializers in frameworks that link to you.
调用所有链接到目标文件的framework中的初始化方法

In addition:

A class’s +load method is called after all of its superclasses’ +load methods.
一个类的+load方法在其父类的+load方法后调用

A category +load method is called after the class’s own +load method.
一个Category的+load方法在被其扩展的类的自有+load方法后调用

In a custom implementation of load you can therefore safely message other unrelated classes from the same image, but any load methods implemented by those classes may not have run yet.
在+load方法中，可以安全地向同一二进制包中的其它无关的类发送消息，但接收消息的类中的+load方法可能尚未被调用。
```

**load函数调用特点如下:**

当类被引用进项目的时候就会执行load函数(在main函数开始执行之前）,与这个类是否被用到无关,每个类的load函数只会自动调用一次.由于load函数是系统自动加载的，因此不需要调用父类的load函数，否则父类的load函数会多次执行。

1. 当父类和子类都实现load函数时,父类的load方法执行顺序要优先于子类  
2. 当子类未实现load方法时,不会调用父类load方法  
3. 类中的load方法执行顺序要优先于类别(Category)  
4. 当有多个类别(Category)都实现了load方法,这几个load方法都会执行,但执行顺序不确定(其执行顺序与类别在Compile Sources中出现的顺序一致)  
5. 当然当有多个不同的类的时候,每个类load 执行顺序与其在Compile Sources出现的顺序一致  

### initialize

同样，在 [苹果官方文档](https://developer.apple.com/documentation/objectivec/nsobject/1418639-initialize?language=occ) 中是这样描述的：


```objectivec
Initializes the class before it receives its first message.

在这个类接收第一条消息之前调用。

Discussion

The runtime sends initialize to each class in a program exactly one time just before the class, or any class that inherits from it, is sent its first message from within the program. (Thus the method may never be invoked if the class is not used.) The runtime sends the initialize message to classes in a thread-safe manner. Superclasses receive this message before their subclasses.

```

initialize在类或者其子类的第一个方法被调用前调用。即使类文件被引用进项目,但是没有使用,initialize不会被调用。由于是系统自动调用，也不需要再调用  [super initialize] ，否则父类的initialize会被多次执行。假如这个类放到代码中，而这段代码并没有被执行，这个函数是不会被执行的。

1.父类的initialize方法会比子类先执行  
2.当子类未实现initialize方法时,会调用父类initialize方法,子类实现initialize方法时,会覆盖父类initialize方法.  
3.当有多个Category都实现了initialize方法,会覆盖类中的方法,只执行一个(会执行Compile Sources 列表中最后一个Category 的initialize方法)  

### 什么情况下使用

#### load的使用

由于调用load方法时的环境很不安全，我们应该尽量减少load方法的逻辑。另一个原因是load方法是线程安全的，它内部使用了锁，所以我们应该避免线程阻塞在load方法中

load很常见的一个使用场景,交换两个方法的实现.

```objectivec
//摘自MJRefresh
+ (void)load
{
    [self exchangeInstanceMethod1:@selector(reloadData) method2:@selector(mj_reloadData)];
    [self exchangeInstanceMethod1:@selector(reloadRowsAtIndexPaths:withRowAnimation:) method2:@selector(mj_reloadRowsAtIndexPaths:withRowAnimation:)];
    [self exchangeInstanceMethod1:@selector(deleteRowsAtIndexPaths:withRowAnimation:) method2:@selector(mj_deleteRowsAtIndexPaths:withRowAnimation:)];
    [self exchangeInstanceMethod1:@selector(insertRowsAtIndexPaths:withRowAnimation:) method2:@selector(mj_insertRowsAtIndexPaths:withRowAnimation:)];
    [self exchangeInstanceMethod1:@selector(reloadSections:withRowAnimation:) method2:@selector(mj_reloadSections:withRowAnimation:)];
    [self exchangeInstanceMethod1:@selector(deleteSections:withRowAnimation:) method2:@selector(mj_deleteSections:withRowAnimation:)];
    [self exchangeInstanceMethod1:@selector(insertSections:withRowAnimation:) method2:@selector(mj_insertSections:withRowAnimation:)];
}

+ (void)exchangeInstanceMethod1:(SEL)method1 method2:(SEL)method2
{
    method_exchangeImplementations(class_getInstanceMethod(self, method1), class_getInstanceMethod(self, method2));
}

```

#### initialize的使用

一般用来初始化全局变量或者静态变量。在initialize方法收到调用时,运行环境基本健全。 initialize内部也使用了锁，所以是线程安全的。但同时要避免阻塞线程，不要再使用锁。

```objectivec
// Person.m
// int 等基本类型可以在编译期进行赋值
static int numCount = 0;
// 对象无法在编译器进行赋值
static NSMutableArray *dataSource;
+ (void)initialize {
    if (self == [Person class]) {
        // 不能在编译期赋值的对象在这里进行赋值 dataSource = [[NSMutableArray alloc] init];
    }
}
```

### 总结

* 正常情况下(即没有在 load 方法中调用相关类方法)，load 和 Initialize 方法都在实例化对象之前调用，load相当于装载方法，都在main()函数之前调用，Initialize方法都在main() 函数之后调用。

* 如果在A类的 load 方法中调用 B 类的类方法，那么在调用A的Load 方法之前，会先调用一下B类的initialize 方法，但是B类的load 方法还是按照 Compile Source 顺序进行加载

* 如果A类的 load 方法中调用 A类的类方法， 那么 Initialize 在 load 方法之前调用, 且都在main 函数之前。

* 所有类的 load 方法都会被调用，先调用父类、再调用子类，多个分类会按照Compile Sources 顺序加载。但是Initialize 方法会被覆盖，子类父类分类中只会执行一个

* load 方法内部一般用来实现 Method Swizzle，Initialize方法一般用来初始化全局变量或者静态变量
两个方法都不能主动调用，也不需要通过 super 继承父类方法，但是 Initialize 方法会在子类没有实现的时候调用父类的该方法，而 load 不会


## 面试题

#### 1. Category 的使用场合是什么

#### 2. Category的实现原理，以及Category为什么只能加方法不能加属性

#### 3. Category 和 Extension 的区别

Extension 在编译的时候，它的数据就已经包含在类信息中  
Category在运行时，才会将数据合并到类信息中

#### 4. Category中有load方法吗？load方法是什么时候调用的？load 方法能继承吗？
有。load 方法在runtime加载类和分类的时候调用。不需要声名声名和创建实例，也不需要引入头文件，只要程序运行，就会加载load 方法。类和分类的load方法都会调用，因为不是通过objcMsgSend方式调用的，是直接通过指针调用的。

#### 5. load、initialize的区别，以及它们在category重写的时候的调用的次序。

#### 6. Category 能否添加成员变量？ 如果可以，如何给Category添加成员变量

Category不能直接添加成员变量。但是可以间接添加。使用关联对象。
