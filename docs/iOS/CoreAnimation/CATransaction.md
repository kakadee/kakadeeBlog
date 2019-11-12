# CATransaction

## 什么是CATransaction

CATransaction：事务。

在核心动画中，CATransaction是一种将多个与动画相关的更改组织在一起的方法。CATransaction确保所需的动画更改同时提交到核心动画。

事务分成两种：隐式的和显式的。当一个runloop开启的时候，在一个runloop中的所有 `layer tree` （模型树）的属性的改变都会被隐式的放进一个事务中统一处理，然后更新到 `render tree`（渲染树）。注意有两种情况不会被放进隐式的事务中：一是backing layer（view所持有的layer），二是显式的为 layer 创建了事务。

```objectivec
- (void)testButtonAction1 {
    [CATransaction begin];
    [CATransaction setAnimationDuration:5];
    // 直接更改view的背景色，立即变色
    self.view.backgroundColor = UIColor.yellowColor;
    // 直接更改view的layer的背景色，立即变色
    self.view.layer.backgroundColor = UIColor.yellowColor.CGColor;
    [CATransaction commit];
}

- (void)testButtonAction2 {
    // 直接改变独立layer的背景色，0.25s后变色（有隐式动画）
    self.standaloneLayer.backgroundColor = UIColor.redColor.CGColor;
    
    [CATransaction begin];
    [CATransaction setAnimationDuration:10];
    self.standaloneLayer.opacity = 0; // 动画时间10s
    [CATransaction commit];
}

- (void)testButtonAction3 {
    
    [CATransaction begin];
    [CATransaction setAnimationDuration:10];
    [UIView animateWithDuration:0.3 animations:^{
        self.view.backgroundColor = UIColor.yellowColor; // 动画时间0.3s
    }];
    [CATransaction commit];
}
```

## CATransaction可以做什么

### 更改动画执行时间

如上面的例子。

### 更改动画时间曲线

```objectivec
- (void)testButtonAction4 {
    
    [CATransaction begin];
    [CATransaction setAnimationDuration:10];
    [CATransaction setAnimationTimingFunction:[CAMediaTimingFunction functionWithName:kCAMediaTimingFunctionLinear]];
    self.standaloneLayer.opacity = 0; // 动画时间10s,变化是线性变化
    
    [CATransaction commit];
}
```

### 停止动画

```objectivec
- (void)testButtonAction5 {
    [CATransaction begin];
    [CATransaction setDisableActions:YES]; // 让包裹的动画不执行
    [UIView animateWithDuration:10 animations:^{
        self.view.backgroundColor = UIColor.yellowColor;
    }];
    [CATransaction commit];
}
```

### 设置动画完成的回调

```objectivec
- (void)testButtonAction5 {
    [CATransaction begin];
    [CATransaction setCompletionBlock:^{
        NSLog(@"animation finished."); // 等包裹的所有动画执行完毕，执行该block
    }];

    // A1
    [UIView animateWithDuration:5 animations:^{
        self.view.backgroundColor = UIColor.yellowColor;
    } completion:^(BOOL finished) {
        
    }];
    
    // 如果两个view animation改变的是同一个属性，前一个会动画会立即执行完成
    // A2
    [UIView animateWithDuration:5 delay:5 options:UIViewAnimationOptionCurveEaseInOut animations:^{
        self.view.backgroundColor = UIColor.blueColor;
    } completion:nil];
    
    // 如果两个view animation改变的是不同属性，两者同时执行
    // A3
    [UIView animateWithDuration:5 delay:0 options:UIViewAnimationOptionCurveEaseInOut animations:^{
        self.view.frame = CGRectMake(100, 100, 100, 100);
    } completion:nil];
    
    // 如果使用GCD延迟执行，则该view不算被CATransaction包裹
    // A4
    dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (int64_t)(5 * NSEC_PER_SEC)), dispatch_get_main_queue(), ^{
        [UIView animateWithDuration:5 animations:^{
            self.view.backgroundColor = UIColor.blueColor;
        }];
    });
    
    [CATransaction commit];
}
```

### 嵌套事务

事务可以嵌套。需注意 begin 和 commit 需要成对出现。就跟大括号一样。

```objectivec
- (void)testButtonAction6 {
    [CATransaction begin];
    [CATransaction setAnimationDuration:8];
    self.standaloneLayer.opacity = 0;
    
    [CATransaction begin];
    [CATransaction setAnimationDuration:4];
    self.standaloneLayer.backgroundColor = UIColor.redColor.CGColor;
    [CATransaction commit];
    
    [CATransaction commit];
    
}
```

### 总结

1. 隐式动画和显式动画是由CATransaction控制的。隐式动画隐式的创建CATransaction，显式动画自己去创建（有的动画API由系统帮我们创建）

2. CATransaction 在一个runloop 开启时，将捕捉到的 所有将要做动画的属性 统一提交到渲染树。

3. CATransaction 由系统创建，是全局的，我们不能alloc,init。只能调用 begin , commit 开启或提交事务。

4. 在CATransaction里，对UIView的底层layer(backing layer)做更改，是没有效果的。

5. 对使用GCD包裹的动画块，CATransaction并不能捕捉到。

## 参考

1. [Better iOS Animations with CATransaction](https://medium.com/@joncardasis/better-ios-animations-with-catransaction-72a7425673a6)

2. [CATransaction in Depth](https://www.calayer.com/core-animation/2016/05/17/catransaction-in-depth.html)