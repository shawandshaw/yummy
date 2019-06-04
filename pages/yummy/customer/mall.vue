<template>
  <v-app id="home">
    <Header v-on:located="receiveLocation"></Header>
    <v-content>
      <v-container fluid grid-list-lg>
        <v-layout row wrap fill-height>
          <v-flex v-for="(shop,index) in shops" v-bind:key="index" lg3 md4 xs12>
            <Card :shop="shop" v-on:chosen="goTo"></Card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import Card from "@/components/ShopCard";
import Header from "@/components/HeaderC";
import axios from "@/plugins/axios";

export default {
  components: {
    Card,
    Header
  },
  data() {
    return {
      location: {

      },
      shops: []
    };
  },
  computed: {
    filterShops() {}
  },
  methods: {
    receiveLocation(address) {
      this.location = address;
    },
    goTo(shop) {
      window.location.href = "/yummy/customer/shop?shopId=" + shop.id;
    }
  },
  created() {
    let vue = this;
    axios.get("api/shops").then(res => {
      vue.shops = res.data;
    });
  }
};
</script>

<style>
</style>

