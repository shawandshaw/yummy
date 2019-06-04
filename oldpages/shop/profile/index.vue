<template>
  <v-app id="profile">
    <v-navigation-drawer fixed clipped class="grey lighten-4" app v-model="drawer">
      <v-list dense class="grey lighten-4">
        <template v-for="(item, i) in navItems">
          <v-divider dark v-if="item.divider" class="my-3" :key="i"></v-divider>
          <v-list-tile :key="i" v-else @click="page=item.name">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title class="grey--text">{{ item.text }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue-grey darken-2" app clipped-left>
      <v-toolbar-side-icon @click.native="drawer = !drawer"></v-toolbar-side-icon>
      <span class="title ml-3 mr-5">Profile</span>
      <v-spacer></v-spacer>
      <Menu></Menu>
    </v-toolbar>
    <v-content>
      <Info v-if="page=='info'" app></Info>
      <Orders v-if="page=='orders'"></Orders>
    </v-content>
  <Footer/>
  </v-app>
</template>
<script>
import Menu from "@/components/Menu";
import Footer from "@/components/Footer";
import Orders from "./orders";
import Info from "./info";
export default {
  components: {
    Menu,
    Info,
    Orders,
    Footer
  },
  data: () => ({
    drawer: true,
    page: "orders",
    navItems: [
      { icon: "account_circle", text: "My Info", name: "info" },
      { icon: "list", text: "My Orders", name: "orders" }
    ]
  })
};
</script>
<style>
</style>
