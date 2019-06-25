<template>
  <v-menu offset-y origin="center center" :nudge-bottom="10"  transition="slide-y-transition">
    <v-btn icon large flat slot="activator">
      <v-avatar size="30px">
        <img src="@/assets/avatar.png" alt="Michael Wang">
      </v-avatar>
      <v-icon>arrow_drop_down</v-icon>
    </v-btn>
    <v-list class="pa-0">
      <v-list-tile
        v-for="(item,index) in menu"
        @click="item.click"
        ripple="ripple"
        :disabled="item.disabled"
        :target="item.target"
        rel="noopener"
        :key="index"
      >
        <v-list-tile-action v-if="item.icon">
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import axios from "@/plugins/axios";
export default {
  props:['menu'],
  data() {
    return {
      
    };
  }
};
</script>

