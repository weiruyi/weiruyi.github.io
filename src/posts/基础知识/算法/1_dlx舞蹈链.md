---
title: DLX舞蹈链
date: 2024-09-05 
category: 计算机基础
tags: 算法
order: 1
---

<!--more--->

# DLX舞蹈链

## 一、精确覆盖问题

**精确覆盖问题**（英文：Exact Cover Problem）是指给定许多集合 $S_i (1 \le i \le n)$ 以及一个集合 $X$，求满足以下条件的无序多元组 $(T_1, T_2, \cdots , T_m)$：

1.  $\forall i, j \in [1, m],T_i\bigcap T_j = \varnothing (i \neq j)$
2.  $X = \bigcup\limits_{i = 1}^{m}T_i$
3.  $\forall i \in[1, m], T_i \in \{S_1, S_2, \cdots, S_n\}$

例如，若给出

$$
\begin{aligned}
  & S_1 = \{5, 9, 17\} \\
  & S_2 = \{1, 8, 119\} \\
  & S_3 = \{3, 5, 17\} \\
  & S_4 = \{1, 8\} \\
  & S_5 = \{3, 119\} \\
  & S_6 = \{8, 9, 119\} \\
  & X = \{1, 3, 5, 8, 9, 17, 119\}
\end{aligned}
$$

则 $(S_1, S_4, S_5)$ 为一组合法解。

**问题转化**

将 $\bigcup\limits_{i = 1}^{n}S_i$ 中的所有数离散化，可以得到这么一个模型：

> 给定一个 01 矩阵，你可以选择一些行（row），使得最终每列（column）都恰好有一个 1。
> 举个例子，我们对上文中的例子进行建模，可以得到这么一个矩阵：

$$
\begin{pmatrix}
0 & 0 & 1 & 0 & 1 & 1 & 0 \\
1 & 0 & 0 & 1 & 0 & 0 & 1 \\
0 & 1 & 1 & 0 & 0 & 1 & 0 \\
1 & 0 & 0 & 1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 & 0 & 0 & 1 \\
0 & 0 & 0 & 1 & 1 & 0 & 1
\end{pmatrix}
$$

> 其中第 $i$ 行表示着 $S_i$，而这一行的每个数依次表示 $[1 \in S_i],[3 \in S_i],[5 \in S_i],\cdots,[119 \in S_i]$。

**过程**

继续以上文中中提到的例子为载体，得到一个这样的 01 矩阵：

$$
\begin{pmatrix}
  0 & 0 & 1 & 0 & 1 & 1 & 0 \\
  1 & 0 & 0 & 1 & 0 & 0 & 1 \\
  0 & 1 & 1 & 0 & 0 & 1 & 0 \\
  1 & 0 & 0 & 1 & 0 & 0 & 0 \\
  0 & 1 & 0 & 0 & 0 & 0 & 1 \\
  0 & 0 & 0 & 1 & 1 & 0 & 1
\end{pmatrix}
$$

1.  此时第一行有 $3$ 个 $1$，第二行有 $3$ 个 $1$，第三行有 $3$ 个 $1$，第四行有 $2$ 个 $1$，第五行有 $2$ 个 $1$，第六行有 $3$ 个 $1$。选择第一行，将它删除，并将所有 $1$ 所在的列打上标记；

    $$
    \begin{pmatrix}
      \color{Blue}0 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 & \color{Blue}0 \\
      1 & 0 & \color{Red}0 & 1 & \color{Red}0 & \color{Red}0 & 1 \\
      0 & 1 & \color{Red}1 & 0 & \color{Red}0 & \color{Red}1 & 0 \\
      1 & 0 & \color{Red}0 & 1 & \color{Red}0 & \color{Red}0 & 0 \\
      0 & 1 & \color{Red}0 & 0 & \color{Red}0 & \color{Red}0 & 1 \\
      0 & 0 & \color{Red}0 & 1 & \color{Red}1 & \color{Red}0 & 1
      \end{pmatrix}
    $$

2.  选择所有被标记的列，将它们删除，并将这些列中含 $1$ 的行打上标记（重复覆盖问题无需打标记）；

    $$
    \begin{pmatrix}
      \color{Blue}0 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 & \color{Blue}0 \\
      1 & 0 & \color{Blue}0 & 1 & \color{Blue}0 & \color{Blue}0 & 1 \\
      \color{Red}0 & \color{Red}1 & \color{Blue}1 & \color{Red}0 & \color{Blue}0 & \color{Blue}1 & \color{Red}0 \\
      1 & 0 & \color{Blue}0 & 1 & \color{Blue}0 & \color{Blue}0 & 0 \\
      0 & 1 & \color{Blue}0 & 0 & \color{Blue}0 & \color{Blue}0 & 1 \\
      \color{Red}0 & \color{Red}0 & \color{Blue}0 & \color{Red}1 & \color{Blue}1 & \color{Blue}0 & \color{Red}1
    \end{pmatrix}
    $$

3.  选择所有被标记的行，将它们删除；

    $$
    \begin{pmatrix}
      \color{Blue}0 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 & \color{Blue}0 \\
      1 & 0 & \color{Blue}0 & 1 & \color{Blue}0 & \color{Blue}0 & 1 \\
      \color{Blue}0 & \color{Blue}1 & \color{Blue}1 & \color{Blue}0 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 \\
      1 & 0 & \color{Blue}0 & 1 & \color{Blue}0 & \color{Blue}0 & 0 \\
      0 & 1 & \color{Blue}0 & 0 & \color{Blue}0 & \color{Blue}0 & 1 \\
      \color{Blue}0 & \color{Blue}0 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 & \color{Blue}0 & \color{Blue}1
    \end{pmatrix}
    $$

    **这表示这一行已被选择，且这一行的所有 $1$ 所在的列不能有其他 $1$ 了**。

    于是得到一个新的小 01 矩阵：

    $$
    \begin{pmatrix}
      1 & 0 & 1 & 1 \\
      1 & 0 & 1 & 0 \\
      0 & 1 & 0 & 1
    \end{pmatrix}
    $$

4.  此时第一行（原来的第二行）有 $3$ 个 $1$，第二行（原来的第四行）有 $2$ 个 $1$，第三行（原来的第五行）有 $2$ 个 $1$。选择第一行（原来的第二行），将它删除，并将所有 $1$ 所在的列打上标记；

    $$
    \begin{pmatrix}
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 \\
      \color{Red}1 & 0 & \color{Red}1 & \color{Red}0 \\
      \color{Red}0 & 1 & \color{Red}0 & \color{Red}1
    \end{pmatrix}
    $$

5.  选择所有被标记的列，将它们删除，并将这些列中含 $1$ 的行打上标记；

    $$
    \begin{pmatrix}
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 \\
      \color{Blue}1 & \color{Red}0 & \color{Blue}1 & \color{Blue}0 \\
      \color{Blue}0 & \color{Red}1 & \color{Blue}0 & \color{Blue}1
    \end{pmatrix}
    $$

6.  选择所有被标记的行，将它们删除；

    $$
    \begin{pmatrix}
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 \\
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 \\
      \color{Blue}0 & \color{Blue}1 & \color{Blue}0 & \color{Blue}1
    \end{pmatrix}
    $$

    这样就得到了一个空矩阵。但是上次删除的行 `1 0 1 1` 不是全 $1$ 的，说明选择有误；

    $$
    \begin{pmatrix}
    \end{pmatrix}
    $$

7.  回溯到步骤 4，考虑选择第二行（原来的第四行），将它删除，并将所有 $1$ 所在的列打上标记；

    $$
    \begin{pmatrix}
      \color{Red}1 & 0 & \color{Red}1 & 1 \\
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 \\
      \color{Red}0 & 1 & \color{Red}0 & 1
    \end{pmatrix}
    $$

8.  选择所有被标记的列，将它们删除，并将这些列中含 $1$ 的行打上标记；

    $$
    \begin{pmatrix}
      \color{Blue}1 & \color{Red}0 & \color{Blue}1 & \color{Red}1 \\
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 \\
      \color{Blue}0 & 1 & \color{Blue}0 & 1
    \end{pmatrix}
    $$

9.  选择所有被标记的行，将它们删除；

    $$
    \begin{pmatrix}
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}1 \\
      \color{Blue}1 & \color{Blue}0 & \color{Blue}1 & \color{Blue}0 \\
      \color{Blue}0 & 1 & \color{Blue}0 & 1
      \end{pmatrix}
    $$

    于是我们得到了这样的一个矩阵：

    $$
    \begin{pmatrix}
      1 & 1
    \end{pmatrix}
    $$

10. 此时第一行（原来的第五行）有 $2$ 个 $1$，将它们全部删除，得到一个空矩阵：

    $$
    \begin{pmatrix}
    \end{pmatrix}
    $$

11. 上一次删除的时候，删除的是全 $1$ 的行，因此成功，算法结束。

    答案即为被删除的三行：$1, 4, 5$。

**强烈建议自己模拟一遍矩阵删除、还原与回溯的过程后，再接着阅读下文。**

::: tip 从上面的求解过程来看，实际上求解过程可以如下表示

1、从矩阵中选择一行

2、根据定义，标示矩阵中其他行的元素

3、删除相关行和列的元素，得到新矩阵

4、如果新矩阵是空矩阵，并且之前的一行都是1，那么求解结束，跳转到6；新矩阵不是空矩阵，继续求解，跳转到1；新矩阵是空矩阵，之前的一行中有0，跳转到5

5、说明之前的选择有误，回溯到之前的一个矩阵，跳转到1；如果没有矩阵可以回溯，说明该问题无解，跳转到7

6、求解结束，把结果输出

7、求解结束，输出无解消息

:::

从如上的求解流程来看，在求解的过程中有大量的缓存矩阵和回溯矩阵的过程。而**如何缓存矩阵以及相关的数据（保证后面的回溯能正确恢复数据）**，也是一个比较头疼的问题（并不是无法解决）。以及在输出结果的时候，如何输出正确的结果（把每一步的选择转换为初始矩阵相应的行）。

于是算法大师Donald E.Knuth（《计算机程序设计艺术》的作者）出面解决了这个方面的难题。他提出了DLX（Dancing Links X）算法。实际上，他把上面求解的过程称为X算法，而他提出的舞蹈链（Dancing Links）实际上并不是一种算法，而是一种数据结构。一种非常巧妙的数据结构，他的数据结构在缓存和回溯的过程中效率惊人，不需要额外的空间，以及近乎线性的时间。而在整个求解过程中，**指针在数据之间跳跃着，就像精巧设计的舞蹈一样，故Donald E.Knuth把它称为Dancing Links（中文译名舞蹈链）。**

## 二、舞蹈链

Dancing Links用的数据结构是**交叉十字循环双向链**,核心是基于双向链的方便操作（移除、恢复加入）

下图就是根据题目构建好的**交叉十字循环双向链**

![](/image/algorithm/a2.png)

**整体链表的最上端是哨兵节点** 。

::: tip 对于每一个节点而言：

- 首先，对于每一个节点而言，他的四个方向都被链接，所以称为十字链表。
- 其次，每一条链接都是双向的，可以由左节点访问右节点，也可以有右节点访问左节点，所以它又是双向链表。
- 最后，它的行和列都是循环的，意味着可以通过每一列的哨兵节点向上访问列的最末节点。每一行也是同样的，具有循环链表的性质。

:::

接下来，利用图来解释`Dancing Links`是如何求解精确覆盖问题。

1. 首先判断`Head.Right=Head`？若是，求解结束，输出解；若不是，求解还没结束，到步骤`2`（也可以判断`Head.Left=Head`？）

2. 获取`Head.Right`元素，即元素`C1`，并**标示元素`C1`**（**标示元素`C1`**，指的是标示`C1`、和`C1`所在列的所有元素、以及该元素所在行的元素，并从双向链中移除这些元素）。如下图中的紫色部分。

    ![](/image/algorithm/a3.png)

    如上图可知，行`2`和行`4`中的一个必是答案的一部分（其他行中没有元素能覆盖列`C1`），先假设选择的是行`2`.

3. 选择行`2`（在答案栈中压入`2`），标示该行中的其他元素（元素`5`和元素`6`）所在的列首元素，即**标示元素`C4`和标示元素`C7`**，下图中的橙色部分。 注意的是，即使元素`5`在步骤`2`中就从双向链中移除，但是元素`5`的`Col`分量还是指向元素`C4`的，这里体现了双向链的强大作用。 

    ![](/image/algorithm/a4.png)

    把上图中的紫色部分和橙色部分移除的话，剩下的绿色部分就如下图所示:

    ![](/image/algorithm/a5.png)

    一下子空了好多，是不是转换为一个少了很多元素的精确覆盖问题？，利用递归的思想，很快就能写出求解的过程来。我们继续完成求解过程

4. 获取`Head.Right`元素，即元素`C2`，并**标示元素`C2`**。如下图中的紫色部分。

    ![](/image/algorithm/a6.png)

    如图，列`C2`只有元素`7`覆盖，故答案只能选择行`3`.

5. 选择行`3`（在答案栈中压入`3`），标示该行中的其他元素（元素`8`和元素`9`）所在的列首元素，即**标示元素`C3`和标示元素`C6`**，下图中的橙色部分。

    ![](/image/algorithm/a7.png)

    把上图中的紫色部分和橙色部分移除的话，剩下的绿色部分就如下图所示: 

    ![](/image/algorithm/a8.png)

6. 获取`Head.Right`元素，即元素`C5`，元素`C5`中的垂直双向链中没有其他元素，也就是没有元素覆盖列`C5`。说明当前求解失败。要回溯到之前的分叉选择步骤（步骤`2`）。那要**回标列首元素**（把列首元素、所在列的元素，以及对应行其余的元素。并恢复这些元素到双向链中），**回标列首元素**的顺序是**标示元素**的顺序的反过来。从前文可知，顺序是**回标列首`C6`**、**回标列首`C3`**、**回标列首`C2`**、**回标列首`C7`**、**回标列首`C4`**。表面上看起来比较复杂，实际上利用递归，是一件很简单的事。并把答案栈恢复到步骤`2`（清空的状态）的时候。又回到下图所示: 

    ![](/image/algorithm/a9.png)

7. 由于之前选择行`2`导致无解，因此这次选择行`4`（再无解就整个问题就无解了）。选择行`4`（在答案栈中压入`4`），标示该行中的其他元素（元素`11`）所在的列首元素，即**标示元素`C4`**，下图中的橙色部分。

     ![](/image/algorithm/a10.png)

    把上图中的紫色部分和橙色部分移除的话，剩下的绿色部分就如下图所示: 

     ![](/image/algorithm/a11.png)

8. 获取`Head.Right`元素，即元素`C2`，并**标示元素`C2`**。如下图中的紫色部分。

     ![](/image/algorithm/a12.png)

    如图，行`3`和行`5`都可以选择

9. 选择行`3`（在答案栈中压入`3`），标示该行中的其他元素（元素`8`和元素`9`）所在的列首元素，即**标示元素`C3`和标示元素`C6`**，下图中的橙色部分。  

    ![](/image/algorithm/a13.png)

    把上图中的紫色部分和橙色部分移除的话，剩下的绿色部分就如下图所示: 

     ![](/image/algorithm/a14.png)

10. 获取`Head.Right`元素，即元素`C5`，元素`C5`中的垂直双向链中没有其他元素，也就是没有元素覆盖列`C5`。说明当前求解失败。要回溯到之前的分叉选择步骤（步骤`8`）。从前文可知，**回标列首`C6`**、**回标列首`C3`**。并把答案栈恢复到步骤`8`（答案栈中只有`4`）的时候。又回到下图所示: 

     ![](/image/algorithm/a15.png)

11. 由于之前选择行`3`导致无解，因此这次选择行`5`（在答案栈中压入`5`），标示该行中的其他元素（元素`13`）所在的列首元素，即**标示元素`C7`**，下图中的橙色部分。

    ![](/image/algorithm/a16.png)

    把上图中的紫色部分和橙色部分移除的话，剩下的绿色部分就如下图所示:

     ![](/image/algorithm/a17.png)

    获取`Head.Right`元素，即元素`C3`，并**标示元素`C3`**。如下图中的紫色部分。

     ![](/image/algorithm/a18.png)

12. 如上图，列`C3`只有元素`1`覆盖，故答案只能选择行`3`（在答案栈压入`1`）。标示该行中的其他元素（元素`2`和元素`3`）所在的列首元素，即**标示元素`C5`和标示元素`C6`**，下图中的橙色部分。 

     ![](/image/algorithm/a19.png)

    把上图中的紫色部分和橙色部分移除的话，剩下的绿色部分就如下图所示: 

     ![](/image/algorithm/a20.png)

13. 因为`Head.Right=Head`。故，整个过程求解结束。输出答案，答案栈中的答案分别是`4`、`5`、`1`。表示该问题的解是第`4`、`5`、`1`行覆盖所有的列。如下图所示（蓝色的部分）:

    ![](/image/algorithm/a21.png)

::: info Dancing Links的求解过程表述如下

1、Dancing函数的入口

2、判断Head.Right=Head？，若是，输出答案，返回True，退出函数。

3、获得Head.Right的元素C

4、**标示元素C**

5、获得元素C所在列的一个元素

6、**标示该元素同行的其余元素所在的列首元素**

7、获得一个简化的问题，递归调用Daning函数，若返回的True，则返回True，退出函数。

8、若返回的是False，则**回标该元素同行的其余元素所在的列首元素**，回标的顺序和之前标示的顺序相反

9、获得元素C所在列的下一个元素，若有，跳转到步骤6

10、若没有，**回标元素C**，返回False，退出函数。

:::

## 三、代码

### 1、舞蹈链

我们使用数组的形式来表示舞蹈链，以解决数独问题为例([leetcode-37](https://leetcode.cn/problems/sudoku-solver/description/))，代码如下

```java
public class DLX {
    //行数，列数，总节点数
    int rowNums, columnNums, totalNums;
    // left[i]：第i个节点的左节点
    int[] left, right, up, down, rowIndexs, colIndexs;
    //记录第i行的头指针
    int [] headers;
    //记录结果
    int [] res;
    int resNum; //结果数量
    //统计每一列的节点数量
    int[] columnCount;

    public DLX(int n){
        int maxRowNum = n*n*n + 10;
        int maxColumnNum = n*n*4 + 10;
        int maxNodeNum = maxRowNum * 4 + maxColumnNum;
        left = new int[maxNodeNum];
        right = new int[maxNodeNum];
        up = new int[maxNodeNum];
        down = new int[maxNodeNum];
        rowIndexs = new int[maxNodeNum];
        colIndexs = new int[maxNodeNum];
        headers = new int[maxRowNum];
        columnCount = new int[maxColumnNum];
        res = new int[maxRowNum];
    }

    public void init(int rowNums, int columnNums){
        this.rowNums = rowNums;
        this.columnNums = columnNums;
        //初始化第一行，表头
        for(int i=0; i<=columnNums;i++){
            columnCount[i] = 0;
            left[i] = i-1;
            right[i] = i+1;
            up[i] = down[i] = i;
        }
        left[0] = columnNums;
        right[columnNums] = 0;
        totalNums = columnNums;
        //初始化每一行的头指针
        for(int i=1; i<=rowNums;i++){
            headers[i] = -1;
        }
    }

    //插入点（rowIndex, columnIndex)第rowindex行，第columnIndex列
    public void addNode(int rowIndex, int columnIndex){
        columnCount[colIndexs[++totalNums] = columnIndex]++;
        rowIndexs[totalNums] = rowIndex;

        up[totalNums] = columnIndex; down[totalNums] = down[columnIndex];
        up[down[columnIndex]] = totalNums; down[columnIndex] = totalNums;

        if(headers[rowIndex] == -1){
            headers[rowIndex] = left[totalNums] = right[totalNums] = totalNums;
        }else{
            left[totalNums] = headers[rowIndex]; right[totalNums] = right[headers[rowIndex]];
            left[right[headers[rowIndex]]] = totalNums; right[headers[rowIndex]] = totalNums;
        }
    }

    //删除啊一列，将该列为1的行都删除
    public void removeColumn(int columnIndex){
        left[right[columnIndex]] = left[columnIndex];
        right[left[columnIndex]] = right[columnIndex];
        for(int i=down[columnIndex]; i!= columnIndex;i=down[i]){
            for(int j=right[i]; j!= i; j=right[j]){
                up[down[j]] = up[j];
                down[up[j]] = down[j];
                columnCount[colIndexs[j]]--;
            }
        }
    }

  //恢复一列，将该列为1的行恢复
    public void resumeColumn(int columnIndex){
        for(int i=up[columnIndex];i!=columnIndex;i=up[i]){
            for(int j=left[i]; j!= i;j=left[j]){
                up[down[j]] = j;
                down[up[j]] = j;
                columnCount[colIndexs[j]]++;
            }
        }
        left[right[columnIndex]] = columnIndex;
        right[left[columnIndex]] = columnIndex;
    }

    /**
     *
     * @param d 选取了d行
     */
    public boolean dance(int d){
        if(right[0] == 0){
            resNum = d;
            return true;
        }
        int removeCol = right[0];
        for(int i=removeCol; i!=0; i=right[i]){
            if(columnCount[i] < columnCount[removeCol])
                removeCol = i;
        }
        removeColumn(removeCol);
        for(int i=down[removeCol]; i!=removeCol; i=down[i]){
            res[d] = rowIndexs[i];
            for(int j=right[i]; j!=i; j=right[j]) removeColumn(colIndexs[j]);
            if(dance(d+1)) return true;
            for(int j=right[i]; j!=i; j=right[j]) resumeColumn(colIndexs[j]);
        }
        resumeColumn(removeCol);
        return false;
    }

}

```

### 2、数独

**矩阵的列**

将数独问题转换成精确覆盖问题我们把矩阵的每个列都定义成一个约束条件。

```
第1列定义成：（1，1）填了一个数字
第2列定义成：（1，2）填了一个数字
...
第9列定义成：（1，9）填了一个数字
第10列定义成：（2，1）填了一个数字
...
第18列定义成：（2，9）填了一个数字
...
第81列定义成：（9，9）填了一个数字
```

至此，用第`1-81`列完成了**约束条件1：每个格子只能填一个数字**

第`N`列（`1≤N≤81`）定义成：`（X，Y）`填了一个数字。`N`、`X`、`Y`之间的关系是：`X = INT((N - 1)/ 9)+1; Y = ((N-1) Mod 9) + 1; N =(X - 1) × 9 + Y`.

```
第82列定义成：在第1行填了数字1
第83列定义成：在第1行填了数字2
...
第90列定义成：在第1行填了数字9
第91列定义成：在第2行填了数字1
...
第99列定义成：在第2行填了数字9
...
第162列定义成：在第9行填了数字9
```



至此，用第`82-162`列（共`81`列）完成了**约束条件2：每行1-9的这9个数字都得填一遍**

第`N`列（`82≤N≤162`）定义成：在第`X`行填了数字`Y`。`N`、`X`、`Y`之间的关系是：`X = INT(N - 81 - 1)/ 9)+ 1; Y = ((N - 81 - 1)Mod 9)+ 1; N = (X - 1)× 9 + Y + 81`.

```
第163列定义成：在第1列填了数字1
第164列定义成：在第1列填了数字2
...
第171列定义成：在第1列填了数字9
第172列定义成：在第2列填了数字1
...
第180列定义成：在第2列填了数字9
...
第243列定义成：在第9列填了数字9
```

至此，用第`163-243`列（共`81`列）完成了**约束条件3：每列1-9的这9个数字都得填一遍**

第`N`列（`163≤N≤243`）定义成：在第`X`列填了数字`Y`。`N`、`X`、`Y`之间的关系是：`X = INT((N - 162 - 1) / 9) + 1; Y =((N - 162 - 1)Mod 9) + 1; N = (X - 1)× 9 + Y + 162`.

```
第244列定义成：在第1宫填了数字1
第245列定义成：在第1宫填了数字2
...
第252列定义成：在第1宫填了数字9
第253列定义成：在第2宫填了数字1
...
第261列定义成：在第2宫填了数字9
...
第324列定义成：在第9宫填了数字9
```

至此，用第`244-324`列（共`81`列）完成了**约束条件4：每宫1-9的这9个数字都得填一遍**

第`N`列（`244≤N≤324`）定义成：在第`X`宫填了数字`Y`。`N`、`X`、`Y`之间的关系是：`X = INT((N - 243 - 1) / 9)+ 1; Y = ((N - 243 - 1)Mod 9)+ 1; N = (X - 1) × 9 + Y + 243`.

 至此，用了`324`列完成了数独的四个约束条件，矩阵的列定义完成.

**矩阵的行**

第1-9行分别表示（1，1）位置填入1-9，依次类推，因此`(i,j)`处填入`k`在第`(i*9+j)*9+k`行

这样，从数独的格子依次转换成行（`1`行或者`9`行）插入到矩阵中。完成了数独问题到精确覆盖问题的转换。接下来求解精确覆盖问题就可以交给舞蹈链（`Dancing Links`）算法了.

```java
public class Solution{
    //编码需要根据图的性质进行调整，这个编码只针对对于9*9数独的等价限制条件
    public int[] encode(int i,int j,int k){
        int r=(i*9+j)*9+k;
        int c1=81*0+i*9+j+1;
        int c2=81*1+i*9+k;
        int c3=81*3+j*9+k;
        int c4=81*2+((i/3)*3+(j/3))*9+k;
        return new int[]{r,c1,c2,c3,c4};
    }

    public void solveSudoku(char[][] board){
        DLX dlx=new DLX(9);
        dlx.init(9*9*9,9*9*4);
        int[]code;
        for(int i=0;i<9;i++)
            for(int j=0;j<9;j++)
                for(int k=1;k<=9;k++)
                    if(board[i][j]=='.' || board[i][j]=='0'+k){
                        code=encode(i,j,k);
                        dlx.addNode(code[0],code[1]);
                        dlx.addNode(code[0],code[2]);
                        dlx.addNode(code[0],code[3]);
                        dlx.addNode(code[0],code[4]);
                    }
        dlx.dance(0);
        int v,x,y;
        for(int i=0;i<dlx.resNum;i++){
            v=(dlx.res[i]-1)%9+1;//这里记得加回1，从'1'~'9'
            x=(dlx.res[i]-1)/9/9;//开始编码的，不是'0'~'8'
            y=(dlx.res[i]-1)/9%9;//否则下面将采用(char)('1'+v)
            board[x][y]=(char)('0'+v);
        }

    }
}
```



## 参考

[1] [https://oi-wiki.org/search/dlx/](https://oi-wiki.org/search/dlx/)

[2] [https://www.cnblogs.com/grenet/p/3145800.html](https://www.cnblogs.com/grenet/p/3145800.html)

[3] [https://blog.csdn.net/m0_52447591/article/details/120250353](https://blog.csdn.net/m0_52447591/article/details/120250353)
