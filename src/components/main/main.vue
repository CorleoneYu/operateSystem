<template>
  <div class="main">
    <div class="link-list">
      <router-link :to='{ name: item.name}' tag="div"
      v-for="(item,index) in linkList" :key="index" 
      class="link-item">
        <el-button type="primary">{{item.name}}</el-button>
      </router-link>
    </div>
    
    <router-view class="ml20"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      linkList: [
        {
          name: 'CourseDispatch'
        },{
          name: 'Bank'
        },{
          name: 'MemoryDistribute'
        },{
          name: 'DiskDispatch'
        },{
          name: 'OperateSystem'
        }
      ]
    }
  }
}
</script>

<style>
.link-list {
  display: flex;
}

.link-item {
  margin: 20px;
}
</style>
