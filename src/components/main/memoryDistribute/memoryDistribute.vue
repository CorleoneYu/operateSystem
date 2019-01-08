<template>
  <div class="memoryDistribute">
    <el-card>
      <div slot="header">
        <span>内存分区表</span>
      </div>
      <el-table :data="memoryList" border class="memory-table">
        <el-table-column prop="id" label="分区编号"></el-table-column>
        <el-table-column prop="size" label="分区大小"></el-table-column>
        <el-table-column prop="start" label="起始位置"></el-table-column>
        <el-table-column label="分配状态">
          <template slot-scope="scope">
            <p v-if="scope.row.free">空闲</p>
            <p v-else>已分配 {{scope.row.workId}}号作业</p>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="mt20">
      <div slot="header" class="df">
        <span>请求序列和作业序列</span>
        <span class="ml20">下一处理请求编号： {{now+1}}</span>
        <el-radio-group class="ml20" v-model="dispatch" :disabled="now > 0">
          <el-radio v-for="item in dispatchList" :key="item.id" :label="item.id">{{item.name}}</el-radio>
        </el-radio-group>
        <el-button type="primary" class="ml20" @click="next" @keyup.enter="next">处理请求</el-button>
      </div>
      <div class="df">
        <el-table :data="requestList" border class="request-table" :row-class-name="requestState">
          <el-table-column prop="id" label="请求编号"></el-table-column>
          <el-table-column prop="workId" label="作业编号"></el-table-column>
          <el-table-column label="请求类型">
            <template slot-scope="scope">
              <p v-if="scope.row.isAsk">索取内存</p>
              <p v-else>归还内存</p>
            </template>
          </el-table-column>
          <el-table-column prop="size" label="内存大小"></el-table-column>
        </el-table>
        <el-table :data="workList" border class="work-table ml20">
          <el-table-column prop="id" label="作业编号"></el-table-column>
          <el-table-column prop="size" label="需要内存大小"></el-table-column>
          <el-table-column label="内存分区编号">
            <template slot-scope="scope">
              <p v-if="scope.row.memoryId == -1">未分配</p>
              <p v-else>{{scope.row.memoryId}}</p>
            </template>
          </el-table-column>
          <el-table-column label="起始位置">
            <template slot-scope="scope">
              <p v-if="scope.row.start == -1">未分配</p>
              <p v-else>{{scope.row.start}}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <el-card class="mt20">
      <div slot="header">
        <span>内存分区图示</span>
        <span class="ml10">总大小: {{totalSize}}KB</span>
        <span class="ml10">不可再分大小: {{minSize}}KB</span>
      </div>

      <div class="memory-list" :style="{width: totalSize  * 1.25 + 'px'}">
        <div
          class="memory-item"
          :class="{'memory-item_free': memoryItem.free }"
          :style="{width: memoryItem.size * 1.25 + 'px'}"
          v-for="memoryItem in memoryList"
          :key="memoryItem.id"
        >{{memoryItem.size}} 作业：{{memoryItem.workId}}</div>
      </div>
    </el-card>
  </div>
</template>

<script>
let memoryId = 1;
export default {
  data() {
    return {
      now: 0, //处理请求序列的位置
      dispatch: 1,
      dispatchList: [
        {
          id: 1,
          name: "首次适应"
        },
        {
          id: 2,
          name: "最佳适应"
        }
      ],
      minSize: 20,
      memoryList: [
        {
          id: memoryId++,
          size: 640,
          start: 0,
          free: true,
          workId: -1
        }
      ],
      workList: [
        {
          id: 1,
          memoryId: -1,
          size: 130,
          start: -1
        },
        {
          id: 2,
          memoryId: -1,
          size: 60,
          start: -1
        },
        {
          id: 3,
          memoryId: -1,
          size: 100,
          start: -1
        },
        {
          id: 4,
          memoryId: -1,
          size: 200,
          start: -1
        },
        {
          id: 5,
          memoryId: -1,
          size: 140,
          start: -1
        },
        {
          id: 6,
          memoryId: -1,
          size: 60,
          start: -1
        },
        {
          id: 7,
          memoryId: -1,
          size: 50,
          start: -1
        },
        {
          id: 8,
          memoryId: -1,
          size: 60,
          start: -1
        }
      ],
      requestList: [
        {
          id: 1,
          workId: 1,
          //是索取内存还是归还内存 索取为true
          isAsk: true,
          //索取/归还内存的大小
          size: 130,
          start: -1
        },
        {
          id: 2,
          workId: 2,
          isAsk: true,
          size: 60,
          start: -1
        },
        {
          id: 3,
          workId: 3,
          isAsk: true,
          size: 100,
          start: -1
        },
        {
          id: 4,
          workId: 2,
          isAsk: false,
          size: 60,
          start: -1
        },
        {
          id: 5,
          workId: 4,
          isAsk: true,
          size: 200,
          start: -1
        },
        {
          id: 6,
          workId: 3,
          isAsk: false,
          size: 100,
          start: -1
        },
        {
          id: 7,
          workId: 1,
          isAsk: false,
          size: 130,
          start: -1
        },
        {
          id: 8,
          workId: 5,
          isAsk: true,
          size: 140,
          start: -1
        },
        {
          id: 9,
          workId: 6,
          isAsk: true,
          size: 60,
          start: -1
        },
        {
          id: 10,
          workId: 7,
          isAsk: true,
          size: 50,
          start: -1
        },
        {
          id: 11,
          workId: 8,
          isAsk: true,
          size: 60,
          start: -1
        }
      ]
    };
  },
  methods: {
    next() {
      let requestItem = this.requestList[this.now++];
      let workItem = this.workList[requestItem.workId - 1];

      if (requestItem.isAsk) {
        this.disttibute(requestItem, workItem);
      } else {
        this.recovery(requestItem, workItem);
      }
    },
    //分配内存
    disttibute(requestItem, workItem) {
      console.log("分配内存大小", requestItem.size, requestItem, workItem);

      let memoryList = this.memoryList;
      let memoryIdx = -1;

      if (this.dispatch == 1) {
        memoryIdx = this.FF(workItem);
      } else if (this.dispatch == 2) {
        memoryIdx = this.BF(workItem);
      }

      //找到可以分配的内存分区
      let memoryItem = memoryList[memoryIdx];
      memoryItem.free = false;
      memoryItem.workId = workItem.id;
      workItem.memoryId = memoryItem.id;
      workItem.start = memoryItem.start;

      if (memoryItem.size - workItem.size > this.minSize) {
        //如果之差大于最小内存分区大小 则新增分区
        console.log("新增分区");
        let newMemory = {
          id: memoryId++,
          size: memoryItem.size - workItem.size,
          start: memoryItem.start + workItem.size,
          free: true,
          workId: -1
        };
        memoryItem.size = workItem.size;
        memoryList.splice(memoryIdx + 1, 0, newMemory);
      } else {
        console.log("无需新增分区");
      }
      console.log("分配成功");
    },
    FF(workItem) {
      //first fit 首次适应
      console.log("首次适应算法");
      let memoryList = this.memoryList;
      let len = memoryList.length;
      for (let i = 0; i < len; i++) {
        //首次适应
        let memoryItem = memoryList[i];

        if (!memoryItem.free) {
          continue;
        }
        if (memoryItem.size > workItem.size) {
          return i;
        }
      }
      return -1;
    },
    BF(workItem) {
      //best fit 最佳适应
      console.log("最佳适应算法");
      let fitAry = [];
      this.memoryList.forEach( item => {
        if (item.free) {
          if (item.size > workItem.size) {
            fitAry.push(item);
          }
        }
      })

      //按大小从小到大排序
      fitAry.sort( (x, y)=>{
        return x.size - y.size;
      })

      let best = fitAry && fitAry[0];
      console.log("排序后", fitAry, "最佳", best);

      let idx = this.memoryList.indexOf(best);
      console.log("idx", idx);
      return idx;
    },
    //回收内存
    recovery(requestItem, workItem) {
      console.log("回收内存大小", requestItem.size, requestItem, workItem);

      let memoryList = this.memoryList;
      let memoryId = workItem.memoryId;
      let memoryItem = memoryList.find((item, idx) => {
        return item.id == memoryId;
      });
      let memoryIdx = memoryList.indexOf(memoryItem);
      console.log("将要归还", memoryItem, memoryIdx);

      workItem.memoryId = -1;
      workItem.start = -1;
      memoryItem.free = true;
      memoryItem.workId = -1;

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
    requestState({ row, rowIndex }) {
      if (rowIndex == this.now) {
        return "warning-row";
      } else if (rowIndex < this.now) {
        return "success-row";
      } else {
        return "";
      }
    }
  },
  computed: {
    totalSize() {
      let len = this.memoryList.length;

      if (!len) {
        return 0;
      }

      let lastItem = this.memoryList[len - 1];
      return lastItem.start + lastItem.size;
    }
  }
};
</script>

<style>
.memory-list {
  display: flex;
  border: 1px solid #e4e7ed;
  border-radius: 10px;
  padding: 10px;
  height: 50px;
  color: white;
  font-size: 22px;
  line-height: 50px;
}

.memory-item {
  margin-right: 10px;
  background: #e6a23c;
  text-align: center;
}

.memory-item_free {
  background: #67c23a;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
