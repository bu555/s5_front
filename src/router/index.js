import Vue from 'vue'
import Router from 'vue-router'
import Bazi from '@/components/Bazi/bazi_main.vue'
import BaziCalendar from '@/components/Bazi/bazi_calendar.vue'
import BaziPaipan from '@/components/Bazi/bazi_paipan.vue'
import BaziData from '@/components/Bazi/bazi_data.vue'
import BaziSet from '@/components/Bazi/set.vue'
import BaziInfo from '@/components/Bazi/bazi_info.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',redirect:'/bazi'
    },
    {
      path: '/bazi',
      name: 'bazi',
      component: Bazi,
      children:[
        { path: '/bazi/paipan',component: BaziPaipan,name:'baziPaipan'},
        { path: '/bazi/calendar',component: BaziCalendar,name:'baziCalendar'},
        { path: '/bazi/data',component: BaziData,name:'baziData'},
        { path: '/bazi/set',component: BaziSet,name:'baziSet'},
        { path: '/bazi/info',component: BaziInfo,name:'baziInfo'},
      ]
    },
  ]
})
