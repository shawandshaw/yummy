<template>
  <v-footer  dark class="blue-grey darken-2 justify-center white-text" >
    用户统计：total: {{count.total}}，
    online: {{count.online}}
  </v-footer>
</template>
<script>
import axios from '@/plugins/axios'
export default {
    data(){
      return {
        count:{}
      }
    },
    created(){
      const vue=this
      axios.get('/api/countOnline').then(res=>{
        vue.count=res.data
      })
    }
}
</script>
