---
title: Netty进阶
date: 2024-11-07 16:24:22
tags: Netty进阶
order: 26
---



# Netty进阶

## 一、源码分析

### 1、启动流程

Netty 说白了是对原始 Java-NIO 的二次开发和优化，因此底层还是 NIO 的开发范式。先回顾一下开发一个 NIO 服务器的基本步骤：

```java
// step 1. 创建 Selector
Selector selector = Selector.open();

// step 2. 创建 ssc，并配置非阻塞
ServerSocketChannel ssc = ServerSocketChannel.open();
ssc.configureBlocking(false);

// ste 3. 关联 selector、ssc，并注册感兴趣事件
SelectionKey sscKey = ssc.register(selector, 0, null);

// step 4. 绑定端口
ssc.bind(new InetSocketAddress(8080));

// step 5. 注册感兴趣事件
sscKey.interestOps(SelectionKey.OP_ACCEPT);
```

然后跟踪源码，看看 Netty 是如何完成这几个步骤的。NioEventLoop 里面包含了 Selector 的开启，即NIO 的step 1，这个放到 NioEventLoop 中详细分析。下面的 group(), channel(), childHandler() 等方法都是配置 ServerBootstrap 的方法，关键逻辑在 bind() 方法里面。

```java
new ServerBootstrap()
    .group(new NioEventLoopGroup(1), new NioEventLoopGroup(2))
    .channel(NioServerSocketChannel.class)
    .childHandler(new ChannelInitializer<>() { ... })
    .bind(8080);
```

启动流程主要涉及两个线程: **Main 主线程**、**NioEventLoop 线程**。

![netty 启动流程](/image/jvm/jvm104.png)

ServerBootstrap 执行 bind，进入AbstractBootstrap#doBind方法

```java
//io.netty.bootstrap.AbstractBootstrap#doBind 
private ChannelFuture doBind(final SocketAddress localAddress) {
   			//进入 initAndRegister()
        final ChannelFuture regFuture = this.initAndRegister();
        final Channel channel = regFuture.channel();
        if (regFuture.cause() != null) {
            return regFuture;
        } else if (regFuture.isDone()) {
            ChannelPromise promise = channel.newPromise();
          //如果initAndRegister()执行完毕，直接调用doBind0
            doBind0(regFuture, channel, localAddress, promise);
            return promise;
        } else {
            final PendingRegistrationPromise promise = new PendingRegistrationPromise(channel);
            regFuture.addListener(new ChannelFutureListener() {
                public void operationComplete(ChannelFuture future) throws Exception {
                    Throwable cause = future.cause();
                    if (cause != null) {
                        promise.setFailure(cause);
                    } else {
                        promise.registered();
                        //如果initAndRegister()没有执行完毕，等待执行完毕后回调doBind0
                        AbstractBootstrap.doBind0(regFuture, channel, localAddress, promise);
                    }

                }
            });
            return promise;
        }
    }
```

进入 `initAndRegister()`后，里面分为 **init()** 和 **register()** 两个步骤。

```java
// io.netty.bootstrap.AbstractBootstrap#initAndRegister
channel = this.channelFactory.newChannel(); //创建NioServerSocketChannel  ----NIO step2

// io.netty.channel.socket.nio.NioServerSocketChannel#newSocket
private static ServerSocketChannel newSocket(SelectorProvider provider) {
    try {
        return provider.openServerSocketChannel();
    } catch (IOException e) {
        throw new ChannelException("Failed to open a server socket.", e);
    }
}
```

**Init()**

init 之前会创建 ServerSocketChannel，即NIO 的step 2。然后 init() 负责初始化通道的参数配置，并为 ServerSocketChannel 添加 ChannelInitializer ,准备执行（添加 ServerBootstrapAcceptor 处理子Channel，初始化的时候调用）

```java
//io.netty.bootstrap.ServerBootstrap#init()			
				// 为 NioServerSocketChannel 添加 ChannelInitializer
				p.addLast(new ChannelHandler[]{new ChannelInitializer<Channel>() {
          	//初始化的时候才会被调用
            public void initChannel(final Channel ch) throws Exception {
                final ChannelPipeline pipeline = ch.pipeline();
                ChannelHandler handler = ServerBootstrap.this.config.handler();
                if (handler != null) {
                    pipeline.addLast(new ChannelHandler[]{handler});
                }

                ch.eventLoop().execute(new Runnable() {
                    public void run() {
                      	//添加 ServerBootstrapAcceptor handler (accept 事件发生后建立连接)
                        //调用之后 pipeline 为 head -> ServerBootstrapAcceptor -> tail
                        pipeline.addLast(new ChannelHandler[]{new ServerBootstrapAcceptor(ch, currentChildGroup, currentChildHandler, currentChildOptions, currentChildAttrs)});
                    }
                });
            }
        }});
```

**register()**  	

开启一个新的NioEventLoop线程执行register0去关联 ssc 和 selector

```java
// io.netty.channel.AbstractChannel.AbstractUnsafe#register
  eventLoop.execute(new Runnable() {
      public void run() {
          AbstractUnsafe.this.register0(promise);
      }
  });
```

register0方法会调用AbstractNioChannel#doRegister关联 selector、ssc，并注册感兴趣事件，之后调用NioServerSocketChannel初始化handler，执行initChannel，最后给promise对象设置为成功

```java
//io.netty.channel.AbstractChannel.AbstractUnsafe#register0
    //调用AbstractNioChannel#doRegister关联 selector、ssc，并注册感兴趣事件
    AbstractChannel.this.doRegister();
    this.neverRegistered = false;
    AbstractChannel.this.registered = true;
    //调用NioServerSocketChannel初始化handler，执行initChannel
    AbstractChannel.this.pipeline.invokeHandlerAddedIfNeeded();
		//final ChannelFuture regFuture = this.initAndRegister()   regFuture == promise
		// 给promise对象设置为成功
    this.safeSetSuccess(promise);
    AbstractChannel.this.pipeline.fireChannelRegistered();
```

注意：register 方法的第三个参数是 attachment 附件，在 Netty 的实现里就是 NioServerSocketChannel

```java
// io.netty.channel.nio.AbstractNioChannel#doRegister
@Override
protected void doRegister() throws Exception {
    boolean selected = false;
    for (;;) {
        try {
            // NIO step3：关联 selector、ssc，并注册感兴趣事件
            selectionKey = javaChannel().register(eventLoop().unwrappedSelector(), 0, this);
            return;
        } catch (CancelledKeyException e) {
            if (!selected) {
                eventLoop().selectNow();
                selected = true;
            } else {
                throw e;
            }
        }
    }
}
```

**Bind**

promise对象设置为成功后会回调`AbstractBootstrap.doBind0`，层层调用最后到达 `AbstractChannel.AbstractUnsafe#bind`，首先调用`NioServerSocketChannel#doBind`方法绑定端口，之后触发所有handler的active事件注册感兴趣事件

```java
//io.netty.channel.AbstractChannel.AbstractUnsafe#bind
public final void bind(SocketAddress localAddress, ChannelPromise promise) {
          ......
          try {
            //NioServerSocketChannel#doBind
              AbstractChannel.this.doBind(localAddress);
          } catch (Throwable var5) {
              this.safeSetFailure(promise, var5);
              this.closeIfClosed();
              return;
          }

          if (!wasActive && AbstractChannel.this.isActive()) {
              this.invokeLater(new Runnable() {
                  public void run() {
                    //触发所有handler的active事件
                      AbstractChannel.this.pipeline.fireChannelActive();
                  }
              });
          }

          this.safeSetSuccess(promise);
      }
  }
```

`NioServerSocketChannel#doBind`方法

```java
// io.netty.channel.socket.nio.NioServerSocketChannel#doBind
@Override
protected void doBind(SocketAddress localAddress) throws Exception {
    if (PlatformDependent.javaVersion() >= 7) {
        // NIO step 4：绑定端口
        javaChannel().bind(localAddress, config.getBacklog());
    } else {
        javaChannel().socket().bind(localAddress, config.getBacklog());
    }
}
```

doBind 绑定完成后，会触发所有 handler 的 channelActive 方法，在 HeadContext 的 channelActive() 方法里会执行NIO step 5注册感兴趣事件，默认是关注`OP_ACCEPT`：

`HeadContext#channelActive`被触发

```java
# io.netty.channel.DefaultChannelPipeline.HeadContext#channelActive
public void channelActive(ChannelHandlerContext ctx) throws Exception {
    ctx.fireChannelActive();
    this.readIfIsAutoRead();
}
```

层层调用最后到达 `AbstractNioChannel#doBeginRead `

```java
//io.netty.channel.nio.AbstractNioChannel#doBeginRead    
protected void doBeginRead() throws Exception {
        SelectionKey selectionKey = this.selectionKey;
        if (selectionKey.isValid()) {
            this.readPending = true;
            int interestOps = selectionKey.interestOps();
          // readInterestOp = 16，即 SelectionKey.OP_ACCEPT
            if ((interestOps & this.readInterestOp) == 0) {
                selectionKey.interestOps(interestOps | this.readInterestOp);
            }
        }
    }
```

### 2、NioEventLoop

NioEventLoop 是 Netty 的一个核心类，包括很多重要的逻辑操作。

**成员对象**

1. 两个 Selector 对象

    - selector：基于数组存储 SelectionKey 实现的 Selector

    ```java
    // io.netty.channel.nio.SelectedSelectionKeySet
    SelectionKey[] keys = new SelectionKey[1024];
    ```

    - unwrappedSelector: 基于 HashSet 存储 SelectionKey 实现的 Selector，也即原始的 `java.nio.channels.Selector`

    ```java
    // sun.nio.ch.SelectorImpl
    private final Set<SelectionKey> selectedKeys;
    ```

    

2. 继承自 SingleThreadEventExecutor 的线程对象 thread 和所属的单线程 Executor

3. 暂存任务的任务队列，NioEventLoop 不仅可以处理 IO 事件，也可以处理普通任务和定时任务

    - `Queue<Runnable>`普通任务队列
    - `PriorityQueue<ScheduledFutureTask<?>>`定时任务

**构造方法**

NioEventLoop 内部使用 `unwrappedSelector` 进行底层的选择操作，而对外提供的接口是通过 `selector` 进行的，额外添加了处理空轮询问题、资源释放等功能，使得 Netty 能够提供更好的性能和稳定性。

```java
// io.netty.channel.nio.NioEventLoop#NioEventLoop
NioEventLoop(NioEventLoopGroup parent, Executor executor, SelectorProvider selectorProvider,
                SelectStrategy strategy, RejectedExecutionHandler rejectedExecutionHandler,
                EventLoopTaskQueueFactory queueFactory) {
    
    super(parent, executor, false, newTaskQueue(queueFactory), newTaskQueue(queueFactory), rejectedExecutionHandler);
    
    ...

    provider = selectorProvider;
  	//创建selector,魔改原始selector
    final SelectorTuple selectorTuple = openSelector();
    selector = selectorTuple.selector;
    unwrappedSelector = selectorTuple.unwrappedSelector;
    selectStrategy = strategy;
}


// io.netty.channel.nio.NioEventLoop#openSelector
private SelectorTuple openSelector() {
    try {
        // 此处即执行了 Java-NIO 的第1步，开启 Selector
        unwrappedSelector = provider.openSelector();
    } catch (IOException e) {
        throw new ChannelException("failed to open a new selector", e);
    }

    ...
}
```

**启动线程**

NioEventLoop 首次调用 execute() 时（事件触发）将启动 NIO 线程，并且通过状态变量保证只启动一次。

```java
// io.netty.util.concurrent.SingleThreadEventExecutor#doStartThread
private void doStartThread() {
    assert thread == null;
    executor.execute(new Runnable() {
        @Override
        public void run() {
            // thread 对象即 executor 线程池里的那个唯一线程
            thread = Thread.currentThread();

            ...

            try {
                // 进入死循环，监测普通任务、定时任务、IO事件
                SingleThreadEventExecutor.this.run();
            } catch (Throwable t) {
                ...
            }
        }
    });
}
```

**监听事件**

```java
// io.netty.channel.nio.NioEventLoop#run
@Override
protected void run() {
    for (;;) {
        // 选择策略：
        // 队列里没有任务时，走 SELECT 分支阻塞；
        // 队列里有任务时，则执行 selector.selectNow() 以非阻塞方式拿到所有 IO 事件
        switch (selectStrategy.calculateStrategy(selectNowSupplier, hasTasks())) {
            case SelectStrategy.CONTINUE:
                continue;

            case SelectStrategy.BUSY_WAIT:

            case SelectStrategy.SELECT:
            		//select方法
                select(wakenUp.getAndSet(false));
                if (wakenUp.get()) {
                    selector.wakeup();
                }
            default:
        }

        // 控制处理 IO 事件所占用的时间比例，默认50%
        final int ioRatio = this.ioRatio;
        // 处理 IO 事件
        processSelectedKeys();
        // 处理普通任务
        runAllTasks(ioTime * (100 - ioRatio) / ioRatio);
    }
}
```

**selectStrategy**

只有当有任务的时候才会走SELECT分支，否则会调用 selectNow() 方法，以非阻塞的方式拿到 IO 事件

```java
// io.netty.channel.DefaultSelectStrategy#calculateStrategy
public int calculateStrategy(IntSupplier selectSupplier, boolean hasTasks) throws Exception {
        return hasTasks ? selectSupplier.get() : -1;
    }

// io.netty.util.IntSupplier
private final IntSupplier selectNowSupplier = new IntSupplier() {
        public int get() throws Exception {
            return NioEventLoop.this.selectNow();
        }
    };
```

**select()方法**

使用selectCnt计数来解决nio空轮询bug(Linux下可能会出现),超过阈值（默认32）就会退出循环，重新创建新的selector

```java
//io.netty.channel.nio.NioEventLoop#select
private void select(boolean oldWakenUp) throws IOException {
        Selector selector = this.selector;

        try {
            int selectCnt = 0;
            long currentTimeNanos = System.nanoTime(); //currentTimeNanos当前时间
            // selectDeadLineNanos截止时间   this.delayNanos(currentTimeNanos)没有延时任务时为1s，否则为最晚延时任务到期时间
            long selectDeadLineNanos = currentTimeNanos + this.delayNanos(currentTimeNanos);

            while(true) {
              	// timeoutMillis 超时时间 = 截止时间-当前时间 + 0.5ms = 1s + 0.5ms
                long timeoutMillis = (selectDeadLineNanos - currentTimeNanos + 500000L) / 1000000L;
                if (timeoutMillis <= 0L) {
                    if (selectCnt == 0) {
                        selector.selectNow();
                        selectCnt = 1;
                    }
                    break;
                }

                if (this.hasTasks() && this.wakenUp.compareAndSet(false, true)) {
                    selector.selectNow();
                    selectCnt = 1;
                    break;
                }

                int selectedKeys = selector.select(timeoutMillis);
                ++selectCnt;
                if (selectedKeys != 0 || oldWakenUp || this.wakenUp.get() || this.hasTasks() || this.hasScheduledTasks()) {
                    break;
                }

                ...

                long time = System.nanoTime();
                if (time - TimeUnit.MILLISECONDS.toNanos(timeoutMillis) >= currentTimeNanos) {
                    selectCnt = 1;
                } else if (SELECTOR_AUTO_REBUILD_THRESHOLD > 0 && selectCnt >= SELECTOR_AUTO_REBUILD_THRESHOLD) {
                    logger.warn("Selector.select() returned prematurely {} times in a row; rebuilding Selector {}.", selectCnt, selector);
                    this.rebuildSelector();
                    selector = this.selector;
                    selector.selectNow();
                    selectCnt = 1;
                    break;
                }

                currentTimeNanos = time;
            }

            ...

    }
```

**wakeup方法**

wakeup方法可以用来唤醒阻塞的selector.select()方法，当提普通任务时会调用selector.wakeup方法唤醒selector

- `!inEventLoop` 表示只有其他线程提交的任务才会唤醒
- `wakenUp.compareAndSet(false, true)`  避免了多个线程同时调用wakeup方法

```java
//io.netty.channel.nio.NioEventLoop#wakeup
protected void wakeup(boolean inEventLoop) {
        if (!inEventLoop && this.wakenUp.compareAndSet(false, true)) {
            this.selector.wakeup();
        }
    }
```

**处理事件**

```java
// io.netty.channel.nio.NioEventLoop#processSelectedKey(java.nio.channels.SelectionKey, io.netty.channel.nio.AbstractNioChannel)
private void processSelectedKey(SelectionKey k, AbstractNioChannel ch) {
    final AbstractNioChannel.NioUnsafe unsafe = ch.unsafe();

    ...

    // 处理不同的 IO 事件
    int readyOps = k.readyOps();
    if ((readyOps & SelectionKey.OP_CONNECT) != 0) {
        int ops = k.interestOps();
        ops &= ~SelectionKey.OP_CONNECT;
        k.interestOps(ops);
        unsafe.finishConnect();
    }

    if ((readyOps & SelectionKey.OP_WRITE) != 0) {
        ch.unsafe().forceFlush();
    }

    if ((readyOps & (SelectionKey.OP_READ | SelectionKey.OP_ACCEPT)) != 0 || readyOps == 0) {
        unsafe.read();
    }
}
```

**处理 ACCEPT 事件**

执行 `unsafe.read()` 后，接受连接，创建 SocketChannel 后执行 handler 链。

```java
// io.netty.channel.nio.AbstractNioMessageChannel.NioMessageUnsafe#read

public void read() {
    do {
        // 处理 accept，创建 NioSocketChannel
        int localRead = doReadMessages(readBuf);
        ...
    } while (allocHandle.continueReading());
    
    int size = readBuf.size();
    for (int i = 0; i < size; i ++) {
        readPending = false;
        // 开始调用 handler 链的 channelRead 方法
        pipeline.fireChannelRead(readBuf.get(i));
    }
    ...
    allocHandle.readComplete();
    pipeline.fireChannelReadComplete();
}


// io.netty.channel.socket.nio.NioServerSocketChannel#doReadMessages
protected int doReadMessages(List<Object> buf) throws Exception {
    // 此处即执行 ssc.accept(),创建 SocketChannel
    SocketChannel ch = SocketUtils.accept(javaChannel());
    if (ch != null) {
        buf.add(new NioSocketChannel(this, ch));
        return 1;
    }
   
    ...
    return 0;
}
```

ServerSocketChannel 的调用链是 **head -> ServerBootstrapAcceptor -> tail**，由 acceptor 负责处理连接的 accpt 事件，执行和 ServerSocketChannel 类似的 register 流程（启动流程步骤-2）。只不过这次是 SocketChannel 的启动，也是要新建 NIO 线程，为 SocketChannel 执行用户自定义的 ChannelInitializer。

```java
// io.netty.bootstrap.ServerBootstrap.ServerBootstrapAcceptor#channelRead
public void channelRead(ChannelHandlerContext ctx, Object msg) {
    final Channel child = (Channel) msg;
    child.pipeline().addLast(childHandler);

    try {
        // 注册流程，和启动流程类似
        childGroup.register(child).addListener(new ChannelFutureListener() {
            @Override
            public void operationComplete(ChannelFuture future) throws Exception {
                if (!future.isSuccess()) {
                    forceClose(child, future.cause());
                }
            }
        });
    } catch (Throwable t) {
        forceClose(child, t);
    }
}
```

完成后触发`pipeline.fireChannelActive()`注册 read 事件（启动流程步骤-4），结束 Accpet 事件的处理。

**处理 READ 事件**

同样的，触发 read 事件后，读取数据最后交由 Pipeline 里面用户自定义的各个 Handler 依次加工数据，完成 Read 事件处理。

```java
// io.netty.channel.nio.AbstractNioByteChannel.NioByteUnsafe#read
public final void read() {

    ...

    ByteBuf byteBuf = null;
    do {
        byteBuf = allocHandle.allocate(allocator);
        // 基于底层 Java-NIO，将数据读入 byteBuf
        allocHandle.lastBytesRead(doReadBytes(byteBuf));
        
        ...

        // 依次经过各个 Handler 加工
        pipeline.fireChannelRead(byteBuf);
        byteBuf = null;
    } while (allocHandle.continueReading());

    allocHandle.readComplete();
    pipeline.fireChannelReadComplete();
}
```
