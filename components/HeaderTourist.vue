<template>
  <div>
    <v-toolbar  fixed dark  color="#03a9f4" app>
      <v-toolbar-title class="headline">Yummy</v-toolbar-title>
      <v-btn flat @click="showSearch=true">
        <v-icon>place</v-icon>
        {{address.name}}[切换]
      </v-btn>

      <v-spacer></v-spacer>
      <slot></slot>
      <v-btn flat class="title" href="/yummy/login">登录</v-btn>
    </v-toolbar>
    <v-dialog v-model="showSearch" width="800">
      <Map-search :initLocation="address" @mapConfirm="mapConfirm" @mapCancel="showSearch=false"></Map-search>
    </v-dialog>
  </div>
</template>
<script>
import axios from "@/plugins/axios";
import MapSearch from "@/components/MapSearch";

export default {
  components: {
    MapSearch
  },
  data() {
    return {
      address: {"name":"南京大学(鼓楼校区)","lng":118.78600,"lat":32.06143},
      showSearch: false
    };
  },
  methods: {
    mapConfirm(address) {
      this.address = address;
      this.showSearch = false;
      axios.post("/api/location", address);
      this.$emit("located", {...this.address});
    }
  },
  created() {
    let vue = this;
    axios.get("/api/location").then(res => {
      if (res.data.name) {
        vue.address = res.data;
      } else {
        // alert("请选择您的位置,方便为您推荐周边商店");
      }
      this.$emit("located", {...vue.address});
    });
  }
};
</script>
