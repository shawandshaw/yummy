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
      <v-btn flat class="title" href="/yummy/customer/mall">商城</v-btn>
      <v-btn flat class="title" href="/yummy/customer/orders">订单</v-btn>
      <Menu :menu="menu"></Menu>
    </v-toolbar>
    <v-dialog v-model="showSearch" width="800">
      <Map-search :initLocation="address" @mapConfirm="mapConfirm" @mapCancel="showSearch=false"></Map-search>
    </v-dialog>
  </div>
</template>
<script>
import axios from "@/plugins/axios";
import Menu from "@/components/Menu";
import MapSearch from "@/components/MapSearch";

export default {
  components: {
    Menu,
    MapSearch
  },
  data() {
    return {
      address: {"name":"南京大学(鼓楼校区)","lng":118.78600,"lat":32.06143},
      showSearch: false,
      menu: [
        {
          icon: "store",
          href: "/yummy/customer/mall",
          title: "美食商城",
          click: e => {
            window.location.href = "/yummy/customer/mall";
          }
        },
        {
          icon: "list",
          href: "/yummy/customer/orders",
          title: "我的订单",
          click: e => {
            window.location.href = "/yummy/customer/orders";
          }
        },
        {
          icon: "account_circle",
          href: "/yummy/customer/info",
          title: "个人信息",
          click: e => {
            window.location.href = "/yummy/customer/info";
          }
        },
        {
          icon: "place",
          href: "/yummy/customer/info",
          title: "我的地址",
          click: e => {
            window.location.href = "/yummy/customer/info";
          }
        },
        {
          icon: "delete",
          href: "/yummy/login",
          title: "注销账户",
          click: e => {
            axios
              .delete("/api/customers", {
                params: {
                  customer: "currentUser"
                }
              })
              .then(res => {
                axios.get("/api/logout");
                alert("注销账户成功");
                window.location.href = "/yummy/login";
              });
          }
        },
        {
          icon: "fullscreen_exit",
          href: "/yummy/login",
          title: "登出系统",
          click: e => {
            axios.get("/api/logout");
            window.location.href = "/yummy/login";
          }
        }
      ]
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
        alert("请选择您的位置,方便为您推荐周边商店");
      }
      this.$emit("located", {...vue.address});
    });
  }
};
</script>
