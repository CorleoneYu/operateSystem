<template>
  <div class="courseDispatch">
    <header class="header">courseDispatch进程调度</header>

    <main>
      <el-card class="table-box">
        <div slot="header" class="clearfix">
          <span>操作</span>
        </div>
        <div class="operate-pane">
         
          <el-button class="db" type="primary" :disabled="courseList.length > 0"
            @click="create">
            创建进程
          </el-button>

          <div class="mt20">
            <span>选择调度算法</span>
            <el-radio-group class="ml20" v-model="dispatch" :disabled="courseList.length > 0">
              <el-radio v-for="item in dispatchList" :key="item.id" :label="item.id">
                {{item.name}}
              </el-radio>
            </el-radio-group>
          </div>
          
        
          <div class="mt20">
            <span>当前时间片: {{now}}</span>
            <el-button type="primary" @click="next" @keyup.enter="next" class="ml20"
             :disabled="courseList.length <= 0">下一时间片</el-button>
            <el-button type="danger" @click="reset">重置</el-button>
          </div>
        </div>
      </el-card>
      <div class="list">
        <el-card class="table-box">
          <div slot="header" class="clearfix">
            <span>全部进程列表 进程总数：{{courseList.length}}</span>
          </div>
          <el-table :data="courseList" border class="course-list">
            <el-table-column prop="id" label="进程编号"></el-table-column>
            <el-table-column prop="name" label="进程名"></el-table-column>
            <el-table-column label="进程状态">
              <template slot-scope="scope">
                <p v-if="scope.row.state == STATE.WAIT">等待</p>
                <p v-if="scope.row.state == STATE.RUN">运行</p>
                <p v-if="scope.row.state == STATE.FINISH">已完成</p>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="进程长度"></el-table-column>
            <el-table-column prop="reach" label="到达时间"></el-table-column>
            <el-table-column prop="runTime" label="已运行时间"></el-table-column>
            <el-table-column prop="preRunTime" label="本次运行时间"></el-table-column>
            <el-table-column prop="waitTime" label="等待时间"></el-table-column>
            <el-table-column prop="level" label="响应比" ></el-table-column>
          </el-table>
        </el-card>

        <el-card class="table-box">
          <div slot="header" class="clearfix">
            <span>已经到达的进程列表 进程总数：{{reachList.length}}</span>
          </div>
          <el-table :data="reachList" border class="course-list">
            <el-table-column prop="id" label="进程编号"></el-table-column>
            <el-table-column prop="name" label="进程名"></el-table-column>
            <el-table-column label="进程状态">
              <template slot-scope="scope">
                <p v-if="scope.row.state == STATE.WAIT">等待</p>
                <p v-if="scope.row.state == STATE.RUN">运行</p>
                <p v-if="scope.row.state == STATE.FINISH">已完成</p>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="进程长度"></el-table-column>
            <el-table-column prop="reach" label="到达时间"></el-table-column>
            <el-table-column prop="runTime" label="已运行时间"></el-table-column>
            <el-table-column prop="preRunTime" label="本次运行时间"></el-table-column>
            <el-table-column prop="waitTime" label="等待时间"></el-table-column>
            <el-table-column prop="level" label="响应比" ></el-table-column>
          </el-table>
        </el-card>

        <el-card class="table-box">
          <div slot="header" class="clearfix">
            <span>等待进程列表 进程总数：{{waitList.length}}</span>
          </div>
          <el-table :data="waitList" border class="course-list">
            <el-table-column prop="id" label="进程编号"></el-table-column>
            <el-table-column prop="name" label="进程名"></el-table-column>
            <el-table-column label="进程状态">
              <template slot-scope="scope">
                <p v-if="scope.row.state == STATE.WAIT">等待</p>
                <p v-if="scope.row.state == STATE.RUN">运行</p>
                <p v-if="scope.row.state == STATE.FINISH">已完成</p>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="进程长度"></el-table-column>
            <el-table-column prop="reach" label="到达时间"></el-table-column>
            <el-table-column prop="runTime" label="已运行时间"></el-table-column>
            <el-table-column prop="preRunTime" label="本次运行时间"></el-table-column>
            <el-table-column prop="waitTime" label="等待时间"></el-table-column>
            <el-table-column prop="level" label="响应比" ></el-table-column>
            <el-table-column label="下一时间片响应比" >
              <template slot-scope="scope">
                <p>{{(scope.row.waitTime + 1)/ scope.row.length}}</p>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <el-card class="table-box">
          <div slot="header" class="clearfix">
            <span>运行进程列表 进程总数：{{runList.length}}</span>
          </div>
          <el-table :data="runList" border class="course-list">
            <el-table-column prop="id" label="进程编号"></el-table-column>
            <el-table-column prop="name" label="进程名"></el-table-column>
            <el-table-column label="进程状态">
              <template slot-scope="scope">
                <p v-if="scope.row.state == STATE.WAIT">等待</p>
                <p v-if="scope.row.state == STATE.RUN">运行</p>
                <p v-if="scope.row.state == STATE.FINISH">已完成</p>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="进程长度"></el-table-column>
            <el-table-column prop="reach" label="到达时间"></el-table-column>
            <el-table-column prop="runTime" label="已运行时间"></el-table-column>
            <el-table-column prop="preRunTime" label="本次运行时间"></el-table-column>
            <el-table-column prop="waitTime" label="等待时间"></el-table-column>
            <el-table-column prop="level" label="响应比" ></el-table-column>
          </el-table>
        </el-card>

        <el-card class="table-box">
          <div slot="header" class="clearfix">
            <span>完成进程列表 进程总数：{{finishList.length}}</span>
          </div>
          <el-table :data="finishList" border class="course-list">
            <el-table-column prop="id" label="进程编号"></el-table-column>
            <el-table-column prop="name" label="进程名" ></el-table-column>
            <el-table-column label="进程状态">
              <template slot-scope="scope">
                <p v-if="scope.row.state == STATE.WAIT">等待</p>
                <p v-if="scope.row.state == STATE.RUN">运行</p>
                <p v-if="scope.row.state == STATE.FINISH">已完成</p>
              </template>
            </el-table-column>
            <el-table-column prop="length" label="进程长度"></el-table-column>
            <el-table-column prop="reach" label="到达时间"></el-table-column>
            <el-table-column prop="runTime" label="已运行时间"></el-table-column>
            <el-table-column prop="preRunTime" label="本次运行时间"></el-table-column>
            <el-table-column prop="waitTime" label="等待时间"></el-table-column>
            <el-table-column prop="level" label="响应比" ></el-table-column>
          </el-table>
        </el-card>

      </div>
    </main>
    
  </div>
</template>

<script>
const cpuCount = 1; //同时可以运行的进程数
const STATE = {
  WAIT: 1,
  RUN: 2,
  FINISH: 3
};
let id = 1; //用于创建进程时编号
let reachIdx = 0; //标记已经到达的最大进程idx 

export default {
  data() {
    return {
      //系统时间
      now: 0,
      //调度算法
      dispatch: 3, 
      dispatchList: [
        {
          id: 1,
          name: '时间片轮转'
        },{
          id: 2,
          name: '短进程优先'
        },{
          id: 3,
          name: '高响应比优先'
        }
      ],
      //进程状态config
      STATE: {
        WAIT: 1,
        RUN: 2,
        FINISH: 3
      },
      //进程列表
      courseList: [],
      reachList: [],
      waitList: [],
      runList: [],
      finishList: [],
      preTime: 2, //时间片轮转 一个轮转的长度
    }
  },
  methods: {
    create() {
      this.createCourse(5);
      this.updateReach();
    },
    //随机创建n个进程
    createCourse(n) {
      let count = 0;
      while(count < n) {
        this.courseList.push(this._createCourseItem());
        count++;
      }
      //根据到达时间排序
      this.courseList.sort( (a, b) => {
        return a.reach - b.reach;
      })
    },
    //根据now将已经到达的进程 push 进队列
    //同时加入等待队列
    updateReach() {
      let now = this.now;
      while( reachIdx < this.courseList.length) {
        if (this.courseList[reachIdx].reach == now ) {
          this.reachList.push(this.courseList[reachIdx]);
          this.waitList.push(this.courseList[reachIdx++])
        } else {
          break;
        }
      }
    },
    //进入下一个时间片
    next() {
      this.now++;

      //1. 更新进程的数据
      this.updateData();

      //2. 更新进程的所属状态队列(运行->完成)
      this.updateList();

      //3. 更新到达队列 
      this.updateReach();

      //4. 通过不同算法进行调度(更新进程所属队列)
      if ( this.dispatch == 1) {
        //时间片轮转 timeslice
        this.timeslice();
      } else  if (this.dispatch  == 2) {
        //短进程优先
        this.SJF();
      } else if (this.dispatch == 3) {
        //高响应比优先
        this.HRRN();
      }
    },
    //更新进程数据（不更新进程所属队列）
    updateData() {
      this.waitList.forEach( item => {
        item.waitTime++;
        item.level = item.waitTime / item.length;
      })

      this.runList.forEach( item => {
        item.runTime++;
        item.preRunTime++;
      })
    },
    //更新进程所属状态队列
    updateList() {
      this.runList.forEach( (item, idx) => {
        if (item.runTime >= item.length) {
          item.state = STATE.FINISH;
          this.finishList.push(item);
          this.runList.splice(idx, 1);
        }
      })
    },
    //时间片轮转 timeslice
    timeslice() {
      console.log("时间片轮转");

      if(this.waitList.length === 0) {
        console.log("无等待进程");
        return;
      } else if (this.runList.length === 0) {
        //没有运行的进程 就从等待队列中拿第一个
        let targetItem = this.waitList[0]; //将第一个作为运行目标
        targetItem.state = STATE.RUN;
        this._spliceItem(this.waitList, 0, this.runList);
        return;
      }

      this.runList.forEach( (runItem,idx) => {
        if (runItem.preRunTime >= this.preTime) {
          let targetItem = this.waitList[0]; //将第一个作为运行目标
          targetItem.state = STATE.RUN;
          this._spliceItem(this.waitList, 0, this.runList);

          runItem.preRunTime = 0;
          runItem.state = STATE.WAIT;
          this._spliceItem(this.runList, idx, this.waitList);
        }
      })
    },
    //短进程优先
    SJF() {
      console.log("短进程优先");
      if (this.waitList.length === 0) {
        console.log("无等待进程");
        return;
      }
      if ( this.runList.length >= cpuCount) {
        return;
      } else {
        //从等待队列中拿取 长度最短的
        let list = this.waitList;
        let minIdx = 0;
        let min = list[minIdx];
        list.forEach( (item, idx) => {
          if (item.length < min.length) {
            min = item;
            minIdx = idx;
          }
        })
        min.state = STATE.RUN;
        this.runList.push(min);
        this.waitList.splice(minIdx, 1);
      }
    },
    //高响应比优先
    HRRN() {
      console.log("高响应比优先");
      if (this.waitList.length === 0) {
        console.log("无等待进程");
        return;
      }
      if ( this.runList.length >= cpuCount) {
        return;
      } else {
        //从等待队列中拿取 响应比最高的
        let list = this.waitList;
        let hIdx = 0;
        let high = list[hIdx];
        list.forEach( (item, idx) => {
          if (item.level > high.level) {
            high = item;
            hIdx = idx;
          }
        })
        high.state = STATE.RUN;
        this._spliceItem(this.waitList, hIdx, this.runList);
      }
    },
    //重置
    reset() {
      this.now = 0;
      this.courseList = [];
      this.reachList = [];
      this.waitList = [];
      this.runList = [];
      this.finishList = [];
      id = 1;
      reachIdx = 0;
    },
    _createCourseItem() {
      let courseItem = {
        id: id,
        name: `我是进程${id++}`,
        state: 1,
        length: this._random(1, 10),
        runTime: 0, 
        preRunTime: 0, //本次运行了的时间
        waitTime: 0, //已经等待的时间
        reach: this._random(1, 7), //进程到达的时间
        level: 0, //响应比
      }
      console.log("随机创建:", courseItem);
      return courseItem;
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
    }
  }
}
</script>

<style>
</style>
