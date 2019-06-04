<template>
  <v-app>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <div class="text-md-center">
            <h1>等待经理审批</h1>
            <h2 class="my-3 headline ">对不起, 您需要等待经理审批后才能继续操作</h2>
            <div>
              <v-btn color="primary" @click="goHome()">Go Home</v-btn>
            </div>  
          </div>
        </v-layout>
      </v-container>
  </v-app>
</template>

<script>
import axios from "@/plugins/axios";
export default {
  methods: {
    goHome () {
      axios.get('/api/logout');
      window.location.href = "/yummy/login"
    }
  }  
};
</script>
<style scoped lang="css">
  h1 {
    font-size: 150px;
    line-height: 150px;
    font-weight: 700;
    color: #252932;
    text-shadow: rgba(61, 61, 61, 0.3) 1px 1px, rgba(61, 61, 61, 0.2) 2px 2px, rgba(61, 61, 61, 0.3) 3px 3px;    
  }
</style>