<template>
  <v-toolbar color="blue-grey darken-2" fixed dark app>
    <v-toolbar-title class="headline">Yummy</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn flat class="title" href="/yummy/shop/promotion">促销</v-btn>
    <v-btn flat class="title" href="/yummy/shop/goods">商品</v-btn>
    <v-btn flat class="title" href="/yummy/shop/orders">订单</v-btn>
    <Menu :menu="menu"></Menu>
  </v-toolbar>
</template>
<script>
import axios from "@/plugins/axios";
import Menu from "@/components/Menu";

export default {
  components: {
    Menu
  },
  data() {
    return {
      menu: [
        {
          icon: "store",
          href: "/yummy/shop/goods",
          title: "商品",
          click: e => {
            window.location.href = "/yummy/shop/goods";
          }
        },
        {
          icon: "list",
          href: "/yummy/shop/orders",
          title: "订单",
          click: e => {
            window.location.href = "/yummy/shop/orders";
          }
        },
        {
          icon: "account_circle",
          href: "/yummy/shop/info",
          title: "资料",
          click: e => {
            window.location.href = "/yummy/shop/info";
          }
        },
        {
          icon: "fullscreen_exit",
          href: "/yummy/login",
          title: "登出",
          click: e => {
            axios.get("/api/logout");
            window.location.href = "/yummy/login";
          }
        }
      ]
    };
  },
  methods: {
  },
  created() {
  }
};
</script>
