<template>
  <div class="bank">
    <header class="header">银行家算法</header>
    <main>
      <el-card class="table-box">
        <div slot="header" class="card-header">
          <div>
            <span>可用资源</span>
            <span class="ml20">A: {{available.A}}</span>
            <span class="ml20">B: {{available.B}}</span>
            <span class="ml20">C: {{available.C}}</span> 
          </div>
          
          <div>
            <span>安全队列：</span>
            <span v-if="safeQue.length == 0">暂无安全队列</span>
            <span class="mr10" v-for="(item, idx) in safeQue" :key="idx">{{item.name}}</span>
          </div>
          <el-button class="db" type="primary" @click="create" :disabled="courseList.length > 0">
            创建进程
          </el-button>
        </div>
        <div class="operate-pane">
          <div>
            <span>分配资源</span>
            <el-select v-model="change.course" placeholder="请选择" clearable
            class="ml10" value-key="id">
              <el-option class="w300"  v-for="item in courseList" :key="item.id"
                :label="item.name" :value="item" :disabled="item.state == STATE.FINISH">
              </el-option>
            </el-select>
            <span class="ml20">A: </span>
            <el-input class="w100 ml10" v-model="change.A"></el-input>
            <span class="ml20">B: </span>
            <el-input class="w100 ml10" v-model="change.B"></el-input>
            <span class="ml20">C: </span>
            <el-input class="w100 ml10" v-model="change.C"></el-input>

            <el-button class="ml20" type="primary" @click="dispatch">分配</el-button>
          </div>
        </div>
      </el-card>

      <el-card class="table-box">
        <div slot="header" class="clearfix">
          <span>挂起进程列表 进程总数：{{blockList.length}}</span>
        </div>
        <el-table :data="blockList" border class="course-list">
          <el-table-column prop="id" label="进程编号"></el-table-column>
          <el-table-column prop="name" label="进程名" ></el-table-column>
          <el-table-column label="进程状态">
            <template slot-scope="scope">
              <p v-if="scope.row.state == STATE.BLOCK">挂起</p>
              <p v-if="scope.row.state == STATE.FINISH">已完成</p>
            </template>
          </el-table-column>
          <el-table-column label="最大需求">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.max.A}}</span>
              <span class="ml10">B: {{scope.row.max.B}}</span>
              <span class="ml10">C: {{scope.row.max.C}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已分配">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.allocation.A}}</span>
              <span class="ml10">B: {{scope.row.allocation.B}}</span>
              <span class="ml10">C: {{scope.row.allocation.C}}</span>
            </template>
          </el-table-column>
          <el-table-column label="还需分配">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.need.A}}</span>
              <span class="ml10">B: {{scope.row.need.B}}</span>
              <span class="ml10">C: {{scope.row.need.C}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      
      <el-card class="table-box">
        <div slot="header" class="clearfix">
          <span>进程列表 进程总数：{{courseList.length}}</span>
        </div>
        <el-table :data="courseList" border class="course-list">
          <el-table-column prop="id" label="进程编号"></el-table-column>
          <el-table-column prop="name" label="进程名" ></el-table-column>
          <el-table-column label="进程状态">
            <template slot-scope="scope">
              <p v-if="scope.row.state == STATE.BLOCK">挂起</p>
              <p v-if="scope.row.state == STATE.FINISH">已完成</p>
            </template>
          </el-table-column>
          <el-table-column label="最大需求">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.max.A}}</span>
              <span class="ml10">B: {{scope.row.max.B}}</span>
              <span class="ml10">C: {{scope.row.max.C}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已分配">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.allocation.A}}</span>
              <span class="ml10">B: {{scope.row.allocation.B}}</span>
              <span class="ml10">C: {{scope.row.allocation.C}}</span>
            </template>
          </el-table-column>
          <el-table-column label="还需分配">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.need.A}}</span>
              <span class="ml10">B: {{scope.row.need.B}}</span>
              <span class="ml10">C: {{scope.row.need.C}}</span>
            </template>
          </el-table-column>
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
              <p v-if="scope.row.state == STATE.BLOCK">挂起</p>
              <p v-if="scope.row.state == STATE.FINISH">已完成</p>
            </template>
          </el-table-column>
          <el-table-column label="最大需求">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.max.A}}</span>
              <span class="ml10">B: {{scope.row.max.B}}</span>
              <span class="ml10">C: {{scope.row.max.C}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已分配">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.allocation.A}}</span>
              <span class="ml10">B: {{scope.row.allocation.B}}</span>
              <span class="ml10">C: {{scope.row.allocation.C}}</span>
            </template>
          </el-table-column>
          <el-table-column label="还需分配">
            <template slot-scope="scope">
              <span class="ml10">A: {{scope.row.need.A}}</span>
              <span class="ml10">B: {{scope.row.need.B}}</span>
              <span class="ml10">C: {{scope.row.need.C}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </main>
  </div>
</template>

<script>
const STATE = {
  FINISH: 4,
  BLOCK: 3,
};
let id = 1;

export default {
  data() {
    return {
      STATE: STATE,
      available: {
        A: 10,
        B: 15,
        C: 12
      },
      courseList: [],
      change: {
        course: null,
        A: 0,
        B: 0,
        C: 0
      },
      safeQue: []
    }
  },
  created() {
  },
  computed: {
    finishList() {
      return this.courseList.filter( (item)=>{
        return item.state == STATE.FINISH;
      })
    },
    blockList() {
      return this.courseList.filter( (item)=>{
        return item.state == STATE.BLOCK
      })
    }
  },
  methods: {
    create() {
      this._createCourse(5);
    },
    //分配
    dispatch() {
      let change = this.change;
      change.A = parseInt(change.A);
      change.B = parseInt(change.B);
      change.C = parseInt(change.C);

      if ( change.course.need.A < change.A ||
        change.course.need.B < change.B ||
        change.course.need.C < change.C
      ) {
        this.$message.error('分配的资源超过所需');
        // change.A = 0;
        // change.B = 0;
        // change.C = 0;
        return;
      }

      if ( change.A > this.available.A ||
            change.B > this.available.B ||
            change.C > this.available.C
      ) {
        this.$message.error('分配的资源超过系统现在所有');
        // change.A = 0;
        // change.B = 0;
        // change.C = 0;
        return;
      }

      console.log(change.course.allocation);
      //尝试分配
      change.course.allocation.A += parseInt(change.A);
      change.course.allocation.B += parseInt(change.B);
      change.course.allocation.C += parseInt(change.C);
      
      change.course.need.A -= change.A;
      change.course.need.B -= change.B;
      change.course.need.C -= change.C;

      this.available.A -= change.A;
      this.available.B -= change.B;
      this.available.C -= change.C;

      if (this.check()) {
        if( this._checkEqual(change.course.allocation, change.course.max) ) {
          //完成任务
          change.course.state = STATE.FINISH;
          this.available.A += change.course.allocation.A;
          this.available.B += change.course.allocation.B;
          this.available.C += change.course.allocation.C;
          this.$message({
            message: `恭喜你，进程${change.course.name}完成`,
            type: 'success'
          });
        } else {
          this.$message({
            message: '恭喜你，分配成功',
            type: 'success'
          });
        }
        
      } else {
        this.$message.error('分配后不存在安全序列');
        change.course.allocation.A -= parseInt(change.A);
        change.course.allocation.B -= parseInt(change.B);
        change.course.allocation.C -= parseInt(change.C);
        
        change.course.need.A += parseInt(change.A);
        change.course.need.B += parseInt(change.B);
        change.course.need.C += parseInt(change.C);

        this.available.A += parseInt(change.A);
        this.available.B += parseInt(change.B);
        this.available.C += parseInt(change.C);
      }

      this.courseList.forEach( item => {
        item.canFinish = false;
      })
    },
    //安全性检测算法
    check() {
      let work = {...this.available};
      let unFinishList = this.blockList;
      let finishList = [];
      let len = unFinishList.length;
      for (let i = 0; i < len; i++) {
        let isErr = true;
        for(let j = 0; j < unFinishList.length; j++) {
          let item = unFinishList[j];
          if (item.canFinish) {
            continue;
          }
          if (item.need.A <= work.A && item.need.B <= work.B && item.need.C <= work.C) {
            //可以完成
            isErr = false;
            item.canFinish = true;
            work.A += item.allocation.A;
            work.B += item.allocation.B;
            work.C += item.allocation.C;
            finishList.push(item);
            console.log("完成一个", finishList);
            continue;
          }
          if (finishList.length == len) {
            console.log("已完成",unFinishList, finishList);
            return true;
          }
        }
      
        if (isErr) {
          console.log("一次循环中无可完成任务", unFinishList, finishList)
          return false;
        }

        if (finishList.length == len) {
          console.log("已完成",unFinishList, finishList);
          this.safeQue = finishList;
          return true;
        }
      }
      return false;
    },
    _createCourse(n) {
      for(let i=0; i<n; i++) {
        let courseItem = {
          id: id,
          name: `我是进程${id++}`,
          max: {
            A: this._random(1, this.available.A),
            B: this._random(1, this.available.B),
            C: this._random(1, this.available.C)
          },
          allocation: {
            A: 0,
            B: 0,
            C: 0
          },
          state: STATE.BLOCK,
          canFinish: false //用于check
        }
        courseItem.need = { ...courseItem.max};
        this.courseList.push(courseItem);
      }
    },
    //生成包含n m 的随机数
    _random(n, m) {
      let w = m - n;
      return Math.round(Math.random()*w + n);
    },
    //判断资源是否相等
    _checkEqual(a, b) {
      a = JSON.stringify(a);
      b = JSON.stringify(b);
      console.log(`a: ${a}, b: ${b}, isEqual: ${a == b}`);
      return a == b;
    }
  }
}
</script>

<style>
.card-header {
  display: flex;
  height: 40px;
  line-height: 40px;
  justify-content: space-between;
}
</style>
