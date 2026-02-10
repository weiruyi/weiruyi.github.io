---
title: GoLang锁机制
date: 2024-12-25 16:25:22
tags: Go
category: Go
icon: "/img/golang.svg"
order: 2
---



# GoLang锁机制

 虽然Golang Mutex只有短短的200多行，但是已经是一个极其丰富、精炼的组件，有极其复杂的状态控制.

## 一、sync.Mutex设计v1/v2版本

其实如果我们去追溯 Mutex 的演进历史，会发现，Mutex最开始是一个非常简单的实现，简单到难以置信的地步，是Go开发者们经过了好几轮的优化才变成了现在这么一个非常复杂的数据结构，这是一个逐步完善的过程.于是我想如果我们是设计者，我们会怎么去设计去优化一个锁的实现呢？

Mutex是Golang 中的锁，主要是控制并发访问资源，保护共享资源。

### 1、首先从最简单的锁开始设计

定义一个int变量，0代表没有加锁，1代表加锁了，初始状态为0。

然后使用一个For循环去尝试加锁，加锁时使用Atomic的CAS尝试将值从0改为1，如果成功了就获取锁，如果没有成功就继续For循环也就是自旋尝试获取锁，直到成功为止。

拿到锁的线程想解锁的话也是通过Atomic的CAS尝试将值从1改为0。

```go
type Mutex struct {
	key  int32
}

func (m *Mutex) Lock() {
	for {
		if atomic.CompareAndSwapInt32(&m.key, 0, 1) {
			return
		}
	}
}

func (m *Mutex) Unlock() {
	atomic.CompareAndSwapInt32(&m.key, 1, 0)
}
```

::: tip 问题

性能会比较差，由于加锁是通过自旋实现的，如果有很多Goroutine在竞争锁的话，会导致CPU资源被打满，同时也是浪费资源

:::

### 2、利用信号量去实现Goroutine的睡眠和唤醒

利用信号量去实现Goroutine的睡眠和唤醒，避免自旋浪费CPU

```go
type Mutex struct {
	key  int32
	sema uint32
}

func (m *Mutex) Lock() {
	if atomic.AddInt32(&m.key, 1) ==  1 {  //值从0变为1，则证明加锁成功
		return
	}
	runtime.Semacquire(&m.sema) //等待信号量
}

func (m *Mutex) Unlock() {
	if atomic.AddInt32(&m.key, -1) == 0 { //值-1后，变为0证明没有协程等待锁了，可以直接返回
		return
	}
	runtime.Semrelease(&m.sema) //唤起信号量上的协程
}

```

这版的实现解决了自旋的性能问题，其次由于信号量有一个先进先出的等待队列，所以也可以保证竞争锁的Goroutine是先到先得的，保证了公平。**但是这样的公平其实在调度层面又是效率不高的**。

**示例:**

假设有三个协程分别是G1，G2，G3。G1首先加锁成功了，然后执行业务逻辑。期间G2想加锁发现加不上，就进入了信号量的等待队列，这个时候G2可能已经被调度器从M上调走了。然后G1解锁，这个时候G3想加锁发现由于G2在他前面进行了等待，所以导致G3加不上。**这种情况由于G2没有获得CPU时间片，但是G3已经获得了CPU时间片，所以直接把锁给G3从整体上来说，效率会更加高些**

本质是想给处于运行态的Goroutine 直接获得锁的机会，将上面的代码修改为：
这样新来的Goroutine可以有一次直接获取锁的机会

```go
type Mutex struct {
	key  int32
	sema uint32
}

func (m *Mutex) Lock() {
	if atomic.CompareAndSwapInt32(&m.key, 0, 1) {
		return
	}
	for {
		if atomic.CompareAndSwapInt32(&m.key, 0, 1) {
			return
		}
		runtime.Semacquire(&m.sema)
	}
}

func (m *Mutex) Unlock() {
	if atomic.CompareAndSwapInt32(&m.key, 1, 0) {
		runtime.Semrelease(&m.sema)
	}
}
```

:::tip 问题

**惊群效应**

- 假设先有三个协程G1，G2，G3。G1加锁成功，G2，G3进入了信号量的等待队列。然后G1解锁，G2被唤醒，这个时候来了个新协程G4，G2和G4一起竞争锁，G4竞争成功。然后G4很快执行完进行解锁，然后G3就被唤醒了，这个时候就存在G2，G3一起竞争锁的场景。如果在高并发场景，这样的唤醒竞争还会更加激烈。同时也违背了G2，G3在信号量上先来先得的设计。

:::

### 3、解决惊群效应

总结下我们的锁还需要以下额外能力：

- 1、信号量：阻塞唤醒协程
- 2、知道当前有多少协程阻塞在信号量上
- 3、避免「惊群效应」

按照一般的设计我们需要使用三个变量控制，类似下面这样

```go
type Mutex struct {
	key  int32  //控制是否加锁成功，1：加锁 0：未加锁
  woken bool  //是否已经有协程被唤醒了
  waiter int32 //记录当前有多少协程阻塞在信号量上
	sema uint32 //信号量
}
```

很多框架组件设计都会充分利用变量的高位低位，定义int32的变量state将其分为三部分：

```go
type Mutex struct {
	state int32
	sema  uint32
}
```

![](/image/go/go1.png)

那么加锁的逻辑就变成了

```go
const (
	mutexLocked      = 1 // mutex is locked
	mutexWoken       = 2 
	mutexWaiterShift = 2
)

type Mutex struct {
	state int32
	sema  uint32
}

func (m *Mutex) Lock() {
	//给新来的协程直接加锁的机会
	if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
		return
	}

	//上面没有加锁成功，尝试在接下来的唤醒中去竞争锁
	awoke := false //表示当前协程是不是被唤醒的
	for {
		old := m.state
		new := old | mutexLocked // 设置锁标志位为1
		if old&mutexLocked != 0 {
			new = old + 1<<mutexWaiterShift //锁没有释放，当前协程可能会阻塞在信号量上，先将waiter+1
		}
		if awoke { //尝试清除唤醒标志
			new &^= mutexWoken
		}

		//这里尝试将state从old设置为new。如果代码能够执行到这步，代表了可能发生以下几种情况的一种或者多种
		//1、当前协程尝试加锁
		//2、waiter+1
		//3、清除唤醒标志
		if atomic.CompareAndSwapInt32(&m.state, old, new) {
			if old & mutexLocked == 0{
				//成功获取到锁了，返回
				break
			}
			
			//没有获取到锁，阻塞在信号量上
			runtime.Semacquire(&m.sema)
			awoke = true //执行到这步，证明是被信号量唤醒的，设置唤醒标志
		}
	}
}
```

对上面的一些运算进行解释：

- 1、new := old | mutexLocked 将state的最低位设置为1，即代表想加锁；
- 2、new = old + 1<<mutexWaiterShift，首先会执行1<<mutexWaiterShift，即将1左移两位，移位后的值在加上old。1左移两位即避开了mutexLocked和mutexWoken，然后再跟old相加，就可以实现waiter+1。
- 3、new &^= mutexWoken，&^ 是一个位清除运算符（bit clear operator，它的作用是将第一个操作数（左操作数）中的位与第二个操作数（右操作数）相对应的位进行比较。如果右操作数的位为 1，则将左操作数的相应位清零（设置为 0）。如果右操作数的位为 0，则左操作数的相应位保持不变。

```go
func (m *Mutex) Unlock() {
	new := atomic.AddInt32(&m.state, -mutexLocked)
	if (new+mutexLocked)&mutexLocked == 0 {
		panic("sync: unlock of unlocked mutex")
	}
	
	old := new
	for{
		//以下情况都直接结束，不继续往下：
		//1、如果没有人阻塞在信号量上了
		//2、其他人加锁了
		//3、已经有人唤醒协程了
		if old>>mutexWaiterShift == 0 || old & (mutexLocked|mutexWoken) != 0{
			return
		}
		
		new = (old - 1<<mutexWaiterShift) | mutexWoken //waiter-1 并且将唤醒标志置为1
		if atomic.CompareAndSwapInt32(&m.state,old,new){
			//如果cas执行成功就唤醒一个协程
			runtime.Semacquire(&m.sema)
			return
		}
		old = m.state
	}
}
```

**这个设计就是 2011年 Russ Cox 的第二版的Mutex实现逻辑**

### 4、golang原版Mutex

V1版本极其简单：[github地址](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fgolang%2Fgo%2Fblob%2Fbf3dd3f0efe5b45947a991e22660c62d4ce6b671%2Fsrc%2Flib%2Fsync%2Fmutex.go)

```go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package sync

package func cas(val *int32, old, new int32) bool

export type Mutex struct {
	key int32;
	sema int32;
}

func xadd(val *int32, delta int32) (new int32) {
	for {
		v := *val;
		if cas(val, v, v+delta) {
			return v+delta;
		}
	}
	panic("unreached")
}

func (m *Mutex) Lock() {
	if xadd(&m.key, 1) == 1 {
		// changed from 0 to 1; we hold lock
		return;
	}
	sys.semacquire(&m.sema);
}

func (m *Mutex) Unlock() {
	if xadd(&m.key, -1) == 0 {
		// changed from 1 to 0; no contention
		return;
	}
	sys.semrelease(&m.sema);
}
```

V2版本增加了点细节：[github地址](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Fgolang%2Fgo%2Fblob%2Frelease-branch.go1%2Fsrc%2Fpkg%2Fsync%2Fmutex.go)

```go
// Copyright 2009 The Go Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

// Package sync provides basic synchronization primitives such as mutual
// exclusion locks.  Other than the Once and WaitGroup types, most are intended
// for use by low-level library routines.  Higher-level synchronization is
// better done via channels and communication.
//
// Values containing the types defined in this package should not be copied.
package sync

import "sync/atomic"

// A Mutex is a mutual exclusion lock.
// Mutexes can be created as part of other structures;
// the zero value for a Mutex is an unlocked mutex.
type Mutex struct {
	state int32
	sema  uint32
}

// A Locker represents an object that can be locked and unlocked.
type Locker interface {
	Lock()
	Unlock()
}

const (
	mutexLocked = 1 << iota // mutex is locked
	mutexWoken
	mutexWaiterShift = iota
)

// Lock locks m.
// If the lock is already in use, the calling goroutine
// blocks until the mutex is available.
func (m *Mutex) Lock() {
	// Fast path: grab unlocked mutex.
	if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
		return
	}

	awoke := false
	for {
		old := m.state
		new := old | mutexLocked
		if old&mutexLocked != 0 {
			new = old + 1<<mutexWaiterShift
		}
		if awoke {
			// The goroutine has been woken from sleep,
			// so we need to reset the flag in either case.
			new &^= mutexWoken
		}
		if atomic.CompareAndSwapInt32(&m.state, old, new) {
			if old&mutexLocked == 0 {
				break
			}
			runtime_Semacquire(&m.sema)
			awoke = true
		}
	}
}

// Unlock unlocks m.
// It is a run-time error if m is not locked on entry to Unlock.
//
// A locked Mutex is not associated with a particular goroutine.
// It is allowed for one goroutine to lock a Mutex and then
// arrange for another goroutine to unlock it.
func (m *Mutex) Unlock() {
	// Fast path: drop lock bit.
	new := atomic.AddInt32(&m.state, -mutexLocked)
	if (new+mutexLocked)&mutexLocked == 0 {
		panic("sync: unlock of unlocked mutex")
	}

	old := new
	for {
		// If there are no waiters or a goroutine has already
		// been woken or grabbed the lock, no need to wake anyone.
		if old>>mutexWaiterShift == 0 || old&(mutexLocked|mutexWoken) != 0 {
			return
		}
		// Grab the right to wake someone.
		new = (old - 1<<mutexWaiterShift) | mutexWoken
		if atomic.CompareAndSwapInt32(&m.state, old, new) {
			runtime_Semrelease(&m.sema)
			return
		}
		old = m.state
	}
}
```

## 二、sync.Mutex设计v3/v4版本

v2版本存在的问题:

现在实现的锁的确给了新来的Goroutine直接获取锁的机会，但是还不够优雅。比如说，新Goroutine尝试获取锁失败的那一刻，锁就被释放了，但是新Goroutine需要等到下一次信号量唤醒加调度才有机会再次获取锁，这样其实浪费了新Goroutine的CPU时间

考虑到这种情况，可以尝试给新的Goroutine多次获取锁的机会，说白了就是允许自旋，但是需要给自旋加一些限制条件，避免最开始提到的性能问题

### 1、允许自旋

首先需要限制自旋的次数，其次操作系统的处理器个数和Golang 调度的P个数都必须大于1，否则就会是串行，自旋就没有意义了。

```go
const (
	mutexLocked      = 1 //    mutex    is    locked
	mutexWoken       = 2
	mutexWaiterShift = 2
)

type Mutex struct {
	state int32
	sema  uint32
}

func (m *Mutex) Lock() {
	// 给新来的协程直接加锁的机会
	if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
		return
	}

	// 上面没有加锁成功，尝试在接下来的唤醒中去竞争锁
	awoke := false //表示当前协程是不是被唤醒的
	iter := 0      //记录当前自旋的次数
	for {
		old := m.state
		new := old | mutexLocked //    设置锁标志位为1
		if old&mutexLocked != 0 {
			// 判断是否满足自旋条件
			if runtime_canSpin(iter) {
				if !awoke && old&mutexWoken == 0 && old>>mutexWaiterShift != 0 && atomic.CompareAndSwapInt32(&m.state, old, old|mutexWoken) {
					awoke = true
				}

				// 内部调用procyield函数，该函数也是汇编语言实现。
				// 函数内部循环调用PAUSE指令。减少cpu的消耗，节省电量。
				// 指令的本质功能：让加锁失败时cpu睡眠30个（about）clock，从而使得读操作的频率低很多。流水线重排的代价也会小很多。
				runtime_doSpin()
				iter++
				continue
			}

			new = old + 1<<mutexWaiterShift //锁没有释放，当前协程可能会阻塞在信号量上，先将waiter+1
		}
		··· //剩下的不变
	}
}

```

判断是否可以自旋

```go
//判断是否可以自旋，同时满足以下4个条件才能自旋：
//1、自旋次数小于4次
//2、cpu核数大于1
//3、GOMAXPROCS>1
//4、running P > 1 并且 P队列为空
func sync_runtime_canSpin(i int) bool {
   if i >= active_spin || ncpu <= 1 || gomaxprocs <= int32(sched.npidle+sched.nmspinning)+1 {
    	return false
   }
   if p := getg().m.p; p.runqhead != p.runqtail {
    	return false
   }
   return true
}

```

解锁部分没有变化

通过自旋，对于临界区代码执行非常短的场景来说，这是一个非常好的优化。因为临界区的代码耗时很短，锁很快就能释放，而抢夺锁的 goroutine不用通过休眠唤醒方式等待调度，直接自旋几次，可能就获得了锁

::: tip 问题

因为新来的 goroutine 也参与竞争，有可能每次都会被新来的 goroutine 抢到获取锁的机会，在极端情况下，等待中的goroutine可能会一直获取不到锁，就会导致【饥饿】

:::

### 2、解决饥饿问题

可以考虑给锁加一个标识，比如我们可以检测当一个老goroutine超过一定时间都没有获取到锁，那么他就给锁打上一个【饥饿】的标识，新来的goroutine发现存在该标识就不再通过自旋抢锁，而是直接进入信号量的等待队列的队尾。同时把老goroutine移动到信号量等待队列的队头，这样老goroutine下次就可以直接获取到锁了。

![](/image/go/go2.png)

**加锁部分**

```go
type Mutex struct {
	state int32
	sema  uint32
}

const (
	mutexLocked      = 1 //  mutex  is  locked
	mutexWoken       = 2
	mutexWaiterShift = 3
	mutexStarving    = 4 //新增字段，标识
)

func (m *Mutex) Lock() {
	// 给新来的协程直接加锁的机会
	if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
		return
	}

	m.lockSlow()
}

func (m *Mutex) lockSlow() {
	var waitStartTime int64 //表示等待了多久还没获取到锁
	starving := false       //表示当前锁是否处于饥饿状态
	awoke := false          //表示当前协程是不是被唤醒的
	iter := 0               //自旋次数
	old := m.state

	for {
		// 满足以下条件才能进入自旋：
		// 1、锁不是饥饿状态，并且没有获取到锁
		// 2、满足自旋条件runtime_canSpin
		if old&(mutexLocked|mutexStarving) == mutexLocked && runtime_canSpin(iter) {
			if !awoke && old&mutexWoken == 0 && old>>mutexWaiterShift != 0 && atomic.CompareAndSwapInt32(&m.state, old, old|mutexWoken) {
				awoke = true
			}

			// 内部调用procyield函数，该函数也是汇编语言实现。
			// 函数内部循环调用PAUSE指令。减少cpu的消耗，节省电量。
			// 指令的本质功能：让加锁失败时cpu睡眠30个（about）clock，从而使得读操作的频率低很多。流水线重排的代价也会小很多。
			runtime_doSpin()
			iter++
			old = m.state
			continue
		}

		new := old

		// 如果当前锁不是饥饿状态，尝试将加锁标志置为1
		if old&mutexStarving == 0 {
			new |= mutexLocked
		}

		// 锁没有释放，或者是饥饿模式，当前协程会阻塞在信号量上，将waiter+1
		if old&(mutexLocked|mutexStarving) != 0 {
			new = old + 1<<mutexWaiterShift
		}

		// 已经等待超过了1ms，且锁被其他协程占用，则进入饥饿模式
		if starving && old&mutexLocked != 0 {
			new |= mutexStarving
		}

		if awoke { //尝试清除唤醒标志
			if new&mutexWoken == 0 {
				throw("sync:  inconsistent  mutex  state")
			}
			new &^= mutexWoken
		}

		// 这里尝试将state从old设置为new。如果代码能够执行到这步，代表了可能发生以下几种情况的一种或者多种
		// 1、当前协程尝试加锁
		// 2、waiter+1
		// 3、清除唤醒标志
		// 4、想将锁设置为饥饿模式
		if atomic.CompareAndSwapInt32(&m.state, old, new) {
			if old&(mutexLocked|mutexStarving) == 0 {
				// 不是饥饿状态，并且成功获取到锁了，返回
				break
			}

			// 是否已经等待过了
			queueLifo := waitStartTime != 0
			if waitStartTime == 0 {
				waitStartTime = runtime_nanotime()
			}

			//	阻塞等待
			// queueLifo 为 true，表示加入到队列头。否则，加入到队列尾。
			//	(首次加入队列加入到队尾，不是首次加入则加入队头，这样等待最久的 goroutine 优先能够获取到锁。)
			runtime_SemacquireMutex(&m.sema, queueLifo, 1)

			// 从等待队列中唤醒，根据等待时间，判断锁是否应该进入饥饿模式。
			starving = starving || runtime_nanotime()-waitStartTime > starvationThresholdNs

			// 如果锁已经是饥饿状态了，直接抢锁返回
			if old&mutexStarving != 0 {
				if old&(mutexLocked|mutexWoken) != 0 || old>>mutexWaiterShift == 0 {
					throw("sync:  inconsistent  mutex  state")
				}

				// 加锁并且等待者数量减一
				delta := int32(mutexLocked - 1<<mutexWaiterShift)

				//	清除饥饿状态的两种情况：
				//
				// .  如果不需要进入饥饿模式（当前被唤醒的  goroutine  的等待时间小于  1ms）
				// . 原来的等待者数量为 1，说明是最后一个被唤醒的 goroutine。
				if !starving || old>>mutexWaiterShift == 1 {
					// 清除饥饿状态
					delta -= mutexStarving
				}

				// 设置状态，加锁
				atomic.AddInt32(&m.state, delta)
				break
			}
			// 设置唤醒标记，重新抢占锁（会与那些运行中的  goroutine  一起竞争锁）
			awoke = true
			iter = 0
		} else {
			old = m.state
		}
	} //for
}

```

**解锁部分**

```go
func (m *Mutex) Unlock() {
	new := atomic.AddInt32(&m.state, -mutexLocked)
	// 还有人阻塞在信号量上，需要进行唤醒
	if new != 0 {
		m.unlockSlow(new)
	}
}

func (m *Mutex) unlockSlow(new int32) {
	if (new+mutexLocked)&mutexLocked == 0 {
		fatal("sync:   unlock   of   unlocked   mutex")
	}

	// 非饥饿模式
	if new&mutexStarving == 0 {
		old := new
		for {
			// 以下情况都直接结束，不继续往下：
			// 1、如果没有人阻塞在信号量上了
			// 2、其他人加锁了
			// 3、已经有人唤醒协程了
			// 4、锁又切换成饥饿模式了
			if old>>mutexWaiterShift == 0 || old&(mutexLocked|mutexWoken|mutexStarving) != 0 {
				return
			}

			// waiter-1   并且将唤醒标志置为1
			new = (old - 1<<mutexWaiterShift) | mutexWoken
			if atomic.CompareAndSwapInt32(&m.state, old, new) {
				// 如果cas执行成功就唤醒队头协程
				runtime_Semrelease(&m.sema, false, 1)
				return
			}
			old = m.state
		}
	} else {
		// 饥饿模式下直接唤醒队头，这里分为两种情况：
		// 1、如果“mutexLocked”未设置，等待者在唤醒后会获取到锁。
		// 2、如果只设置了“mutexStarving”，则仍然认为互斥锁已被锁定，因此新到来的goroutine不会获取它，唤醒的协程会获取到锁。
		runtime_Semrelease(&m.sema, true, 1)
	}
} //func
```

关于信号量相关接口：

```go
//lifo:true 加入等待队列的队头，否则加入队尾
func runtime_SemacquireMutex(s *uint32, lifo bool, skipframes int)

//handoff=true：将当前G直接放到runq，调度器可以立即该G，并且会继承上一个G的时间片，
//这样的目的是为了使当前G可以得到更快的调度。
func runtime_Semrelease(s *uint32, handoff bool, skipframes int)
```

## 三、总结

- 1、互斥锁是一种常见的控制并发读写资源的手段，go 中的互斥锁实现是 sync.Mutex。

- 2、Mutex 的对外的接口：

    - Lock：同一时刻只能有一个 goroutine 可以获取到锁，其他goroutine会先通过自旋抢占锁，抢不到则阻塞等待。

    - Unlock：释放锁，释放锁之后，会唤醒等待队列中的下一个 goroutine。

- 3、使用 Mutex 需要注意以下几点：

    - Lock与Unlock需要成对出现，在 Unlock 之前，必须已经调用了 Lock，否则会 panic。

    - 不要将 Mutex 作为函数或方法的参数传递。

    - 不要在锁内部执行阻塞或耗时操作。

    - 可以通过 vet 这个命令行来检查上面的锁 copy 的问题。

- 4、go 的 Mutex 基于以下技术实现：

    - 信号量：操作系统层面的同步机制。

    - 队列：在协程抢锁失败后，会将这些协程放入一个 FIFO 队列中，下次唤醒会唤醒队列头的协程。

    - 原子操作：通过cas操作状态字段state，可以保证数据的完整性。

- 5、go Mutex 的两种模式：

    - 正常模式：运行中的 goroutine 有一定机会比等待队列中的 goroutine 先获取到锁，这种模式有更好的性能。

    - 饥饿模式：所有后来的 goroutine 都直接进入等待队列，会依次从等待队列头唤醒 goroutine。可以有效避免【饥饿】。等待队列中的 goroutine 超过了 1ms 还没有获取到锁，那么会进入饥饿模式

