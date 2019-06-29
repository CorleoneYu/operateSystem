# 操作系统

## 进程调度

1. 短进程优先
2. 时间片轮转
3. 高响应比优先

### 运行截图

#### 主界面（初始随机创建进程）

点击创建进程按钮随机生成5个进程（在此之前选定时间片轮转调度算法）。
同时可以看出，当前时间片为0，即还未开始运行。

![1](https://chenweilin.xin/blogImg/1561804015982e1.PNG)

#### 进程状态队列

因为当前时间点为0，无进程到达，所以状态队列都为空

![2](https://chenweilin.xin/blogImg/1561804016103tYEugu2.PNG)

#### 时间片轮转（周期为2个时间片）

时间片为2的时候， 有一个进程到达，直接进入运行队列

![3](https://chenweilin.xin/blogImg/15618040164225n3.PNG)

时间片为3的时候，同时有两个队列到达，因运行队列以有进程，所以进入等待队列

![4](https://chenweilin.xin/blogImg/156180401651994.PNG)

（预测： 下一时间片，正在运行的进程时间片用完，进入等待队列）上一时间片等待的进程进入运行

![5](https://chenweilin.xin/blogImg/1561804016622V5.PNG)

循环如此执行，直到运行结束。

#### 短进程优先（非抢占）

重新创建进程

![6](https://chenweilin.xin/blogImg/156180401667386.PNG)

运行队列中的进程即将运行结束

![7](https://chenweilin.xin/blogImg/1561804016718qxmB7.PNG)

（预计：下一时间片，将选出长度最短的进程4进入运行）

![8](https://chenweilin.xin/blogImg/1561804016776bxtF8.PNG)

#### 高响应比（非抢占）

重新创建进程

![9](https://chenweilin.xin/blogImg/1561804016830vqbsg2jsO9.PNG)

运行状态的进程即将运行结束

![10](https://chenweilin.xin/blogImg/1561804029959XgND4pi710.PNG)

（预计：下一时间片，选择响应比最高的进程5进入运行）

![11](https://chenweilin.xin/blogImg/1561804030003S4CPtZW11.PNG)

## 死锁——银行家算法

银行家算法

### 运行截图

随机创建5个进程 以及初始化系统可用资源数

![12](https://chenweilin.xin/blogImg/1561804030055265Ed12.PNG)

尝试分配——成功分配

![13](https://chenweilin.xin/blogImg/156180403011113.PNG)

尝试分配——失败：分配数大于还需分配

![14](https://chenweilin.xin/blogImg/1561804030154Mwb6XHrM14.PNG)

尝试分配——失败：分配数大于现有资源

![15](https://chenweilin.xin/blogImg/1561804030212zgoLwJK15.PNG)

尝试分配——失败：分配后将无安全序列

![16](https://chenweilin.xin/blogImg/15618040302657mtdMB0Hr16.PNG)

分配成功——进程完成

![17](https://chenweilin.xin/blogImg/1561804030322HIi0w217.PNG)

## 仿真各种磁盘调度算法

1. 先来先服务算法
2. 最短寻道时间优先算法
3. 扫描(SCAN)算法
4. 循环扫描(CSCAN)算法

### 运行截图

#### 随机创建磁盘请求

![18](https://chenweilin.xin/blogImg/1561804030375nVoiGl9C18.PNG)

#### FCFS以及SSTF寻道路径

![19](https://chenweilin.xin/blogImg/1561804044286BMeYTDm2i19.PNG)

可以看出，在随机的情况下，FCFS无规律性，而SSTF会出现偏向极端后陡然上升的趋势。(如6到7的骤升)

#### SCAN以及CSCAN寻道路径

![20](https://chenweilin.xin/blogImg/1561804044319FvQVdworp20.PNG)

可以看出在前一段两个算法基本相同，CSCAN优化了SCAN在极端的饥饿现象。

## 动态分区分配方式的模拟

### 运行截图

初始情况

![21](https://chenweilin.xin/blogImg/15618040443723qSf21.PNG)

#### （首次适应执行）1号作业索取130内存

![22](https://chenweilin.xin/blogImg/1561804044441SFJdSGE22.PNG)

2号作业索取60内存

![23](https://chenweilin.xin/blogImg/156180404445423.PNG)

3号作业索取100内存

![24](https://chenweilin.xin/blogImg/1561804044473ZX6tIrB24.PNG)

2号作业归还60内存

![25](https://chenweilin.xin/blogImg/15618040444879T2O0R25.PNG)

4号作业索取200内存

![26](https://chenweilin.xin/blogImg/15618040445005sMGVv26.PNG)

3号作业归还100内存 因为上一个60空间内存空闲 一起合并成160

![27](https://chenweilin.xin/blogImg/156180404451427.PNG)

1号作业归还130内存 因为下一个160空间内存空闲。一起合并成290

![28](https://chenweilin.xin/blogImg/15618040592212QyDglS28.PNG)

5号作业索取140内存

![29](https://chenweilin.xin/blogImg/15618040592343yh2Z329.PNG)

6号作业索取60内存

![30](https://chenweilin.xin/blogImg/1561804059243oQg4Ux30.PNG)

7号作业索取50内存

![31](https://chenweilin.xin/blogImg/1561804059257dSXpDBGzY31.PNG)

8号作业索取60内存

![32](https://chenweilin.xin/blogImg/15618040592686mKywY32.PNG)

#### （最佳适应）1号作业索取130内存

![22](https://chenweilin.xin/blogImg/1561804044441SFJdSGE22.PNG)

2号作业索取60内存

![23](https://chenweilin.xin/blogImg/156180404445423.PNG)

3号作业索取100内存

![24](https://chenweilin.xin/blogImg/1561804044473ZX6tIrB24.PNG)

2号作业归还60内存

![25](https://chenweilin.xin/blogImg/15618040444879T2O0R25.PNG)

4号作业索取200内存

![26](https://chenweilin.xin/blogImg/15618040445005sMGVv26.PNG)

3号作业归还100内存 因为上一个60空间内存空闲 一起合并成160

![27](https://chenweilin.xin/blogImg/156180404451427.PNG)

1号作业归还130内存 因为下一个160空间内存空闲。一起合并成290

![28](https://chenweilin.xin/blogImg/15618040592212QyDglS28.PNG)

5号作业索取140内存,因为最后一个空间150比290合适 所以分配最后一个

![33](https://chenweilin.xin/blogImg/1561804059276aL0mVZ3c33.PNG)

6号作业索取60内存

![34](https://chenweilin.xin/blogImg/1561804059283Y2itS34.PNG)

7号作业索取50内存

![35](https://chenweilin.xin/blogImg/156180405929335.PNG)

8号作业索取60内存

![36](https://chenweilin.xin/blogImg/156180405930036.PNG)

## 课程设计

### 需求分析

1. 实现作业调度（先来先服务）、进程调度功能（时间片轮转）
2. 实现内存管理功能（连续分配）。

### 运行截图

主界面（初始随机创建进程）

![1](https://chenweilin.xin/blogImg/1561808689519oniQ991.PNG)

时间片为2：作业8到达，分配内存80，调入内存创建进程，处理机空闲，转为运行。

![2](https://chenweilin.xin/blogImg/1561808689609zjH2.PNG)

时间片为3：作业7到达，分配内存110，调入内存创建进程，处理机机繁忙，等待

![3](https://chenweilin.xin/blogImg/1561808689714cC6FW3.PNG)

时间片为4：

1. 作业：作业6先到达，分配内存110，调入内存创建进程，处理机繁忙，等待作业10后到达，内存不足，无法调入内存，外存等待
2. 进程：进程6运行了一个周期，转为等待状态，进程7运行

![4](https://chenweilin.xin/blogImg/15618086897961ezDowmc4.PNG)

时间片5

1. 作业：无新作业到达
2. 进程：进程7运行了一个时间片

![5](https://chenweilin.xin/blogImg/1561808690042TD2A5.PNG)

时间片6

1. 作业：作业9到达，外存等待
2. 进程：进程7时间片用完 进程8运行

![6](https://chenweilin.xin/blogImg/1561808690115qBts56.PNG)

时间片14

1. 进程：进程8运行完成->作业6完成->释放内存

![7](https://chenweilin.xin/blogImg/1561808690189VvOjLUntN7.PNG)

时间片15

1. 作业：作业10成功分配内存->创建进程9->等待
2. 进程：进程6运行一个时间片

![8](https://chenweilin.xin/blogImg/1561808690268FHVwiM3L8.PNG)

时间片39 运行完成

![9](https://chenweilin.xin/blogImg/1561808690354ygK9.PNG)
