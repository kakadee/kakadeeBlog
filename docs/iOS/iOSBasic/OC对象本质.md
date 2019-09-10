# OC对象的本质

## 如何将OC代码转化为C++代码

OC 代码如下，存在 main.m 文件里，如果将其转化为 C++ 代码？

```objectivec
#import <Foundation/Foundation.h>

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSObject *objc = [[NSObject alloc] init];
        NSLog(@"Hello, World!");
    }
    return 0;
}
```

快速模式：

```objectivec
// 这种方式没有指定架构例如arm64架构
clang -rewrite-objc main.m -o main.cpp
```

指定架构模式：（使用xcode工具 xcrun）

```objectivec
// 生成 arm64架构 下的 cpp
xcrun -sdk iphoneos clang -arch arm64 -rewrite-objc main.m -o main-arm64.cpp
```

## NSObject的内部实现

main-arm64.cpp 文件中搜索NSObjcet，可以找到NSObjcet_IMPL（IMPL代表 implementation 实现）

```objectivec
struct NSObject_IMPL {
    Class isa;
};
```

接着搜索`Class`的实现，发现Class其实就是一个指针，对象底层实现其实就是这个样子。

```objectivec
typedef struct objc_class *Class;
```

接着搜索`struct objc_class`的实现，需注意，如果你搜索到的是如下代码，那么恭喜你入坑了。。。
网上的大部分讲解也是照这个讲的，但是这个根本就是错误❌且过时的。

```objectivec

#if !OBJC_TYPES_DEFINED

struct objc_class {
    Class _Nonnull isa  OBJC_ISA_AVAILABILITY;

#if !__OBJC2__
    Class _Nullable super_class                              OBJC2_UNAVAILABLE;
    const char * _Nonnull name                               OBJC2_UNAVAILABLE;
    long version                                             OBJC2_UNAVAILABLE;
    long info                                                OBJC2_UNAVAILABLE;
    long instance_size                                       OBJC2_UNAVAILABLE;
    struct objc_ivar_list * _Nullable ivars                  OBJC2_UNAVAILABLE;
    struct objc_method_list * _Nullable * _Nullable methodLists                    OBJC2_UNAVAILABLE;
    struct objc_cache * _Nonnull cache                       OBJC2_UNAVAILABLE;
    struct objc_protocol_list * _Nullable protocols          OBJC2_UNAVAILABLE;
#endif

} OBJC2_UNAVAILABLE;
/* Use `Class` instead of `struct objc_class *` */

#endif

```

原因是什么？ 我们注意到最前面有个 `if !OBJC_TYPES_DEFINED` 的声名， 但是内部`OBJC_TYPES_DEFINED` 被声名成1，也就是这段代码是根本不会执行的。所以苹果里面的这段`objc_class` 其实是可以不用看的。

推荐大家看的是开源库中的最新代码，我这里是用的是 objc4-750 version。
链接：<https://opensource.apple.com/tarballs/objc4/>

真正的 `objc_class` 源码如下:
```objectivec
struct objc_class : objc_object {
    // Class ISA;
    Class superclass;
    cache_t cache;             // formerly cache pointer and vtable
    class_data_bits_t bits;    // class_rw_t * plus custom rr/alloc flags

    class_rw_t *data() { 
        return bits.data();
    }
    // 后面是一堆方法，我这里就不写了
    ...
}
```

## OC对象主要可以分哪几种


## 对象的结构
## 一个对象在内存中是如何分配的
## 一个NSObject对象占用多少内存？
64位机器下，占用16字节（malloc_size)。
NSObject对象的成员变量占用8字节（getInstance_size). 因为仅有一个isa指针。