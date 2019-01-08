<template>
  <div class="operate-system">
    <el-card class="">
      <div slot="header">
        <span>作业概况</span>
        <span>当前时间片: {{now}}</span>
        <el-button type="primary" @click="next" @keyup.enter="next" class="ml20">
          下一时间片
        </el-button>
      </div>

      <div class="df">
        <el-table :data="job.list" border class="job-list">
          <el-table-column prop="id" label="作业编号"></el-table-column>
          <el-table-column label="作业状态">
            <template slot-scope="scope">
              <p v-if="scope.row.state == job.state.NOT_REACH">未到达</p>
              <p v-if="scope.row.state == job.state.WAIT">等待-外存中</p>
              <p v-if="scope.row.state == job.state.RUN">运行-内存中</p>
              <p v-if="scope.row.state == job.state.FINISH">作业完成</p>
            </template>
          </el-table-column>
          <el-table-column prop="reach" label="到达时间"></el-table-column>
          <el-table-column prop="size" label="作业大小"></el-table-column>
        </el-table>

        <el-table :data="process.list" border class="process-list ml10"
         :row-class-name="_porcessState">
          <el-table-column prop="id" label="进程编号"></el-table-column>
           <el-table-column prop="jobId" label="作业编号"></el-table-column>
          <el-table-column label="进程状态">
            <template slot-scope="scope">
              <p v-if="scope.row.state == process.state.WAIT">
                等待 {{ _getWaitIdx(scope.row)}}
                </p>
              <p v-if="scope.row.state == process.state.RUN">运行</p>
              <p v-if="scope.row.state == process.state.FINISH">完成</p>
            </template>
          </el-table-column>
          <el-table-column prop="length" label="进程长度"></el-table-column>
          <el-table-column prop="runTime" label="已运行"></el-table-column>
          <el-table-column prop="preRunTime" label="本次运行"></el-table-column>
        </el-table>
      </div>
      
      <div class="reached-job-list mt20">
        <div class="reached-job-item"
          :class="{'job_wait': reachedItem.state == job.state.WAIT, 
                    'job_run':  reachedItem.state == job.state.RUN,
                    'job_finish':  reachedItem.state == job.state.FINISH}" 
          :style="{width: reachedItem.size * 1.25 + 'px'}"
          v-for="reachedItem in job.reached" :key="reachedItem.id">
          作业：{{reachedItem.id}}
        </div>
      </div>
    </el-card>

    <el-card class="mt20">
      <div slot="header">
        <span>内存分区图示</span>
        <span class="ml10">总大小: {{memory.totalSize}}KB</span>
        <span class="ml10">不可再分大小: {{memory.minSize}}KB</span>
      </div>

      <div class="memory-list" :style="{width: memory.totalSize  * 1.25 + 'px'}">
        <div
          class="memory-item"
          :class="{'memory-item_free': memoryItem.free }"
          :style="{width: memoryItem.size * 1.25 + 'px'}"
          v-for="memoryItem in memory.list" :key="memoryItem.id">
          {{memoryItem.size}} 作业：{{memoryItem.jobId}}
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
const JOB_STATE = {
  NOT_REACH: 0,
  WAIT: 1,
  RUN: 2,
  FINISH: 3
}
const PROCESS_STATE = {
  WAIT: 1,
  RUN: 2,
  FINISH: 3
} 
const TOTAL_SIZE = 300;

let jobId = 1; //用于创建作业时编号
let processId = 1;
let memoryId = 1;

let reachIdx = 0; //标记已经到达的最大作业idx 

export default {
  data() {
    return {
      now: 0,
      job: {
        //作业
        state: JOB_STATE,
        list: [],
        reached: [],
        wait: [],//在外存中等待
        run: [], //调入内存
        finish: [],//完成
      },
      process: {
        //进程
        state: PROCESS_STATE,
        preTime: 2, //每个时间轮转占2个时间片
        list: [],
        wait: [],
        run: [],
        finish: [],
      },
      memory: {
        //内存
        totalSize: TOTAL_SIZE,
        minSize: 20,
        list: [
          { 
            id: memoryId++,
            size: TOTAL_SIZE,
            start: 0,
            free: true,
            jobId: -1
          }
        ]
      }
    }
  },
  created() {
    this.init();
  },
  methods: {
    next() {
      this.now++;

      // 更新到达作业队列 
      this.updateReach();

      // 将等待队列中的作业调入内存
      this.jobToRun();

      // 更新进程数据
      this.updateProcessData();

      // 更新进程状态
      this.updateProcessState();

      //时间片轮转
      this.timeslice();
    },
    init() {
      reachIdx = 0;
      this.create(5);
    },
    //创建作业
    create(n) {
      let count = 0;
      while(count < n) {
        this.job.list.push(this.createJob());
        count++;
      }
      //根据到达时间排序
      this.job.list.sort( (a, b) => {
        return a.reach - b.reach;
      })
    },
    createJob() {
      let jobTem = {
        id: jobId++,
        state: JOB_STATE.NOT_REACH,
        size: this._random(5, 15) * 10,
        reach: this._random(1, 7), //进程到达的时间
      }
      return jobTem;
    },
    createProcess(jobId) {
      let processTem = {
        jobId,
        id: processId++,
        state: PROCESS_STATE.WAIT,
        length: this._random(1, 10),
        runTime: 0, 
        preRunTime: 0, //本次运行了的时间
      }
      return processTem;
    },
    //根据now将已经到达的作业 push 进队列
    updateReach() {
      let now = this.now;
      while( reachIdx < this.job.list.length) {
        let job = this.job.list[reachIdx];
        if (job.reach == now ) {
          job.state = this.job.state.WAIT;
          this.job.reached.push(job);
          this.job.wait.push(job);
          reachIdx++;
        } else {
          break;
        }
      }
    },
    //将等待队列中的作业调入内存
    jobToRun() {
      let waitList = this.job.wait;

      for( let i=0; i<waitList.length; i++) {
        let wait = waitList[i];

        if (this.disttibute(wait)) { 
          //调入内存
          wait.state = this.job.state.RUN;
          this._spliceItem(waitList, i, this.job.run );

          //创建进程
          let processItem = this.createProcess(wait.id)
          this.process.list.push(processItem);
          this.process.wait.push(processItem);

          i--;
        } else {
          console.log("内存不足，暂且等待");
        }
      }
    },
    //分配内存
    disttibute(job) {
      console.log("分配内存大小",job);

      let memoryList = this.memory.list;
      let memoryIdx = -1;

      memoryIdx = this.FF(job);
      if (memoryIdx == -1) {
        return false;
      }

      //找到可以分配的内存分区
      let memoryItem = memoryList[memoryIdx];
      memoryItem.free = false;
      memoryItem.jobId = job.id;

      if (memoryItem.size - job.size > this.memory.minSize) {
        //如果之差大于最小内存分区大小 则新增分区
        console.log("新增分区");
        let newMemory = {
          id: memoryId++,
          size: memoryItem.size - job.size,
          start: memoryItem.start + job.size,
          free: true,
          jobId: -1
        };
        memoryItem.size = job.size;
        memoryList.splice(memoryIdx + 1, 0, newMemory);
      } else {
        console.log("无需新增分区");
      }
      console.log("分配成功");
      return true;
    },
    FF(job) {
      //first fit 首次适应
      console.log("首次适应算法");
      let memoryList = this.memory.list;
      let len = memoryList.length;
      for (let i = 0; i < len; i++) {
        //首次适应
        let memoryItem = memoryList[i];

        if (!memoryItem.free) {
          continue;
        }
        if (memoryItem.size >= job.size) {
          return i;
        }
      }
      return -1;
    },
    //回收内存
    recovery(job) {
      console.log("回收作业内存", job);

      let memoryList = this.memory.list;
      let jobId = job.id;
      let memoryItem = memoryList.find((item, idx) => {
        return item.jobId == jobId;
      });
      let memoryIdx = memoryList.indexOf(memoryItem);
      console.log("将要归还", memoryItem, memoryIdx);

      memoryItem.free = true;
      memoryItem.jobId = -1;

      if (memoryIdx < memoryList.length - 1) {
        //不能是最后一项
        let next = memoryList[memoryIdx + 1];
        if (next.free) {
          //如果后面一项是空闲的话 合并
          (memoryItem.size = memoryItem.size + next.size),
            console.log("删除后一项", next);
          memoryList.splice(memoryIdx + 1, 1);
        }
      }

      if (memoryIdx > 0) {
        //不能是第一项
        let pre = memoryList[memoryIdx - 1];
        if (pre.free) {
          //如果前面一项空闲的话 合并
          pre.size = pre.size + memoryItem.size;
          console.log("删除当前项", memoryItem);
          memoryList.splice(memoryIdx, 1);
        }
      }
    },
    //更新进程数据（不更新进程所属状态）
    updateProcessData() {

      this.process.run.forEach( item => {
        item.runTime++;
        item.preRunTime++;
      })
    },
    //更新进程所属状态
    updateProcessState() {
      let process = this.process;

      //更新运行->完成
      for (let i=0; i<process.run.length; i++) {
        let processItem = process.run[i];
        if (processItem.runTime >= processItem.length) {
          processItem.state = process.state.FINISH;
          this._spliceItem(process.run, i, process.finish);
          i--;

          //改变作业状态
          let jobId = processItem.jobId;
          let job = this.job.list.find((item, idx) => {
            return item.id == jobId;
          });
          let jobIdx = this.job.run.indexOf(job);
          job.state = this.job.state.FINISH;
          this._spliceItem(this.job.run, jobIdx, this.job.finish);

          //释放内存
          this.recovery(job);
        }        
      }
    },
    //时间片轮转 timeslice
    timeslice() {
      console.log("时间片轮转");
      let process = this.process;

      if(process.wait.length === 0) {
        //无等待进程时不需要调度
        console.log("无等待进程");
        return;
      } else if (process.run.length === 0) {
        //没有运行的进程 就从等待队列中拿第一个
        let targetItem = process.wait[0]; //将第一个作为运行目标
        targetItem.state = process.state.RUN;
        this._spliceItem(process.wait, 0, process.run);
        return;
      }

      for( let i=0; i<process.run.length; i++) {
        let runItem = process.run[i];

        if (runItem.preRunTime >= process.preTime) {
          //因为前面判断了等待队列的长度不为0 所以这里直接获取首元素
          let targetItem = process.wait[0]; 
          targetItem.state = process.state.RUN;
          this._spliceItem(process.wait, 0, process.run);

          //将运行的进程转入等待
          runItem.preRunTime = 0;
          runItem.state = process.state.WAIT;
          this._spliceItem(process.run, i, process.wait);

          i--;
        }
      }
    },
    //生成包含n m 的随机数
    _random(n, m) {
      let w = m - n;
      return Math.round(Math.random()*w + n);
    },
    //将一个数组ary中下标idx的item 推到 target的尾部
    //示例：运行队列空闲的时候 将等待队列的一个item 推到 运行队列
    _spliceItem(ary, idx, target) {
      let item = ary[idx];
      target.push(item);
      ary.splice(idx, 1);
    },
    //根据进程状态返回样式class
    _porcessState({ row, rowIndex }) {
      if ( row.state == this.process.state.RUN) {
        return "process_run";
      } else if (row.state == this.process.state.WAIT) {
        return 'process_wait'
      } else if (row.state == this.process.state.FINISH) {
        return 'prorcess_finish'
      }
    },
    //获取等待进程在等待队列中的位置
    _getWaitIdx(waitItem) {
      return this.process.wait.indexOf(waitItem);
    }
  }
}
</script>

<style>
.memory-list {
  display: flex;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 10px;
  height: 50px;
  color: white;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
}

.memory-item {
  margin-right: 10px;
  background: #e6a23c;
}

.memory-item_free {
  background: #67c23a;
}

.reached-job-list {
  display: flex;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 10px;
  height: 50px;
  color: white;
  font-size: 14px;
  line-height: 50px;
  text-align: center;
}
.reached-job-item {
  margin-right: 10px;
}

.job_wait {
  background: #e6a23c;
}

.job_run {
  background: #409EFF;
}

.job_finish {
  background: #67c23a;
}

.el-table .prorcess_finish {
  background: #f0f9eb;
}

.el-table .prorcess_run {
  
}

.el-table .process_wait {
  background: oldlace;
}
</style>
