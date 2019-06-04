<template>
  <v-toolbar color="blue-grey darken-2" fixed dark app>
    <v-toolbar-title class="headline">Yummy</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn flat class="title" href="/yummy/manager/customers">会员</v-btn>
    <v-btn flat class="title" href="/yummy/manager/shops">商店</v-btn>
    <v-btn flat class="title" href="/yummy/manager/orders">订单</v-btn>
    <v-btn flat class="title" href="/yummy/manager/notes">单据</v-btn>
    <v-btn flat class="title" href="/yummy/manager/goods">商品</v-btn>
    <v-btn flat class="title" href="/yummy/manager/charts">统计图</v-btn>
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
          icon: "person",
          href: "/yummy/manager/customers",
          title: "会员",
          click: e => {
            window.location.href = "/yummy/manager/customers";
          }
        },
        {
          icon: "store",
          href: "/yummy/manager/shops",
          title: "商店",
          click: e => {
            window.location.href = "/yummy/manager/shops";
          }
        },
        {
          icon: "list",
          href: "/yummy/manager/orders",
          title: "订单",
          click: e => {
            window.location.href = "/yummy/manager/orders";
          }
        },
        {
          icon: "list",
          href: "/yummy/manager/notes",
          title: "单据",
          click: e => {
            window.location.href = "/yummy/manager/notes";
          }
        },
        {
          icon: "money",
          href: "/yummy/manager/goods",
          title: "商品",
          click: e => {
            window.location.href = "/yummy/manager/goods";
          }
        },
         {
          icon: "bar_chart",
          href: "/yummy/manager/charts",
          title: "统计",
          click: e => {
            window.location.href = "/yummy/manager/charts";
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
