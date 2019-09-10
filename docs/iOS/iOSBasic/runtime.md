# runtime

## 简介

Objective-C 是一门动态性比较强的语言。

OC 的动态性是由 Runtime API 支持的。

Runtime API 提供的接口基本都是C语言的，源码由 C/C++ 汇编语言编写。

## isa指针详解

学习Runtime，先要了解它底层的一些常用的数据结构，比如ISA指针。

在 arm64 架构之前， isa 就是一个普通的指针， 存储着 Class, or Meta-Class 对象的内存地址

在 arm64 架构之后，对 isa 指针做了优化，变成了一个共用体（union）结构，还使用位域来存储更多的信息。

isa 指针需要 & ISA_MASK 才能得到真正对应的地址值。

![pic1](https://raw.githubusercontent.com/kakadee/myMarkDownPic/master/img/20190826203413.png)

![pic2](https://raw.githubusercontent.com/kakadee/myMarkDownPic/master/img/20190826203511.png)

```objectivec
struct objc_object {
    private:
        isa_t isa;
    ...
}

union isa_t {
    isa_t() { }
    isa_t(uintptr_t value) : bits(value) { }

    Class cls;
    uintptr_t bits;
#if defined(ISA_BITFIELD)
    struct {
        ISA_BITFIELD;  // defined in isa.h
    };
#endif
};

```

