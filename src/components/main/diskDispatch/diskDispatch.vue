<template>
  <div class="disDispatch">
    <div class="charts-box df">
      <div ref="chartOne" class="charts"></div>
      <div ref="chartTwo" class="charts"></div>
    </div>
    <!-- <el-button type="primary" @click="init">重新生成</el-button> -->

    <el-card>
      <div slot="header">
        <span>磁盘请求序列</span>
        <span class="ml10">当前位置： {{now}}</span>
      </div>
      <el-table :data="requestList" border class="request-table">
        <el-table-column prop="id" label="请求编号"></el-table-column>
        <el-table-column prop="location" label="请求位置"></el-table-column>
      </el-table>
    </el-card>  
  </div>
</template>

<script>
import  echarts  from 'echarts';
let id = 1;
export default {
  data() {
    return {
      now: 50, //磁头现在的位置
      requestList: [],
      FCFSResult: [],
      SSTFResult: [],
      SCANResult: [],
      CSCANResult: [],
      myEchartOne: null,
      myEchartTwo: null
    };
  },
  mounted() {
    this.draw();
    this.init();
    
  },
  methods: {
    init() {
      this.create(10);
      this.process();

      this.myEchartOne.setOption({
        series: [
          {
            name: "FCFS",
            type: "line",
            data: this.FCFSResult
          },
          {
            name: "SSTF",
            type: "line",
            data: this.SSTFResult
          },
        ]
      });

      this.myEchartTwo.setOption({
        series: [
          {
            name: "SCAN",
            type: "line",
            data: this.SCANResult
          },
          {
            name: "CSCAN",
            type: "line",
            data: this.CSCANResult
          },
        ]
      });
    },
    //处理请求
    process() {
      this.FCFS();
      this.SSTF();
      this.SCAN();
      this.CSCAN();
    },
    //先来先服务
    FCFS() {
      let FCFSList = [...this.requestList];
      let FCFSResult = this.FCFSResult;
      FCFSResult.push(this.now);
      for (let i = 0; i < this.requestList.length; i++) {
        let next = FCFSList.splice(0, 1);
        FCFSResult.push(next[0].location);
      }
    },
    //最短寻道时间优先
    SSTF() {
      let now = this.now;
      let SSTFList = [...this.requestList];
      let SSTFResult = this.SSTFResult;
      SSTFResult.push(this.now);
      for (let i = 0; i < this.requestList.length; i++) {
        let minIdx = 0;
        let detal = 0;
        let minItem = SSTFList[minIdx];
        for (let j = 0; j < SSTFList.length; j++) {
          let current = SSTFList[j];
          if ( Math.abs(minItem.location - now) > Math.abs(current.location - now)) {
            minIdx = j;
            minItem = current;
          }
        }
        now = minItem.location;
        SSTFResult.push(minItem.location);
        SSTFList.splice(minIdx, 1);
      }
    },
    //扫描
    //从小到大后 从大到小
    SCAN() {
      let now = this.now;
      let SCANList = [...this.requestList];
      let initItem = {
        id: 11,
        location: now
      }
      SCANList.push(initItem);
      SCANList.sort( (a, b) => {
        return a.location - b.location;
      })
      // SCANList.forEach( item => {
      //   console.log(item.location);
      // })

      let SCANResult = this.SCANResult;
      let initIdx = SCANList.indexOf(initItem);

      for (let i = initIdx; i < SCANList.length; i++) {
        SCANResult.push(SCANList[i].location);
      }

      if (SCANResult.length < this.requestList.length + 1) {
        //还没满 从小于初始位置找起
        for (let i = initIdx-1; i >= 0; i--) {
          SCANResult.push(SCANList[i].location);
        }
      }
    },
    //循环扫描
    //从小到大的方向
    CSCAN() {
      let now = this.now;
      let CSCANList = [...this.requestList];
      let initItem = {
        id: 11,
        location: now
      }
      CSCANList.push(initItem);
      CSCANList.sort( (a, b)=>{
        return a.location - b.location;
      })
     
      let CSCANResult = this.CSCANResult;
      
      let initIdx = CSCANList.indexOf(initItem);
      //console.log(initIdx);
      
      let i = initIdx;
      while( CSCANResult.length < this.requestList.length + 1) {
        if (i == CSCANList.length ) {
          i = 0;
        }

        CSCANResult.push(CSCANList[i].location);
        i++;
      }
    },
    draw() {
      let one = {
        legend: {
          data: ["FCFS", "SSTF"]
        },
        series: [
          {
            name: "FCFS",
            type: "line",
            data: this.FCFSResult
          },
          {
            name: "SSTF",
            type: "line",
            data: this.SSTFResult
          },
          
        ]
      }
      let two = {
        legend: {
          data: ["SCAN", "CSCAN"]
        },
        series: [
          {
            name: "SCAN",
            type: "line",
            data: this.SCANResult
          },
          {
            name: "CSCAN",
            type: "line",
            data: this.CSCANResult
          },
        ]
      }
      let option = {
        title: {
          text: "磁盘寻道算法"
        },
        tooltip: {
          trigger: "axis"
        },
        
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
        },
        yAxis: {
          type: "value"
        },
        
      };
      this.myEchartOne = echarts.init(this.$refs.chartOne);
      this.myEchartOne.setOption({...option, ...one});

      this.myEchartTwo = echarts.init(this.$refs.chartTwo);
      this.myEchartTwo.setOption({...option, ...two});
    },
    create(n) {
      this.requestList = [];
      let count = 0;
      while (count < n) {
        this.requestList.push(this._createRequest());
        count++;
      }
    },
    _createRequest() {
      let requestItem = {
        id: id++,
        location: this._random(1, 100)
      };
      return requestItem;
    },
    //生成包含n m 的随机数
    _random(n, m) {
      let w = m - n;
      return Math.round(Math.random() * w + n);
    }
  }
};
</script>

<style>
.charts {
  margin-top: 20px;
  width: 800px;
  height: 500px;
}
</style>
