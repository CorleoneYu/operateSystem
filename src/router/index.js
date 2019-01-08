import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/main/main'
import CourseDispatch from '@/components/main/courseDispatch/courseDispatch'
import Bank from '@/components/main/bank/bank'
import DiskDispatch from '@/components/main/diskDispatch/diskDispatch'
import MemoryDistribute from '@/components/main/memoryDistribute/memoryDistribute'
import OperateSystem from '@/components/main/operateSystem/operateSystem'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/main',
      redirect: '/main/courseDispatch',
      name: 'Main',
      component: Main,
      children: [
        {
          path: 'courseDispatch',
          
          name: 'CourseDispatch',
          component: CourseDispatch
        },{
          path: 'bank',
          name: 'Bank',
          component: Bank
        },{
          path: 'memoryDistribute',
          name: 'MemoryDistribute',
          component: MemoryDistribute
        },{
          path: 'diskDispatch',
          name: 'DiskDispatch',
          component: DiskDispatch
        },{
          path: 'operateSystem',
          name: 'OperateSystem',
          component: OperateSystem
        }
      ]
    },
  ]
})
