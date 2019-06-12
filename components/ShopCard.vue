<template>
  <v-hover>
    <v-card class="black--text" slot-scope="{ hover }">
      <v-img src="https://cdn.vuetifyjs.com/images/cards/desert.jpg" aspect-ratio="1.618">
      </v-img>
      <v-layout>
        <v-flex>
          <v-card-title>
            <div>
              <div class="headline">
                {{shop.name}}
              </div>
              <div style="display: flex">
                <v-rating :value="shop.rating" color="amber" dense half-increments readonly size="14"></v-rating>
                <div class="ml-2 grey--text text--darken-2">
                  <span>{{ shop.rating }}</span>
                  <span>({{ shop.review }})</span>
                </div>
              </div>
            </div>
          </v-card-title>
          <v-card-text>
            {{shop.description}}
          </v-card-text>
        </v-flex>
      </v-layout>
      <v-divider light></v-divider>
      <v-card-actions class="pa-3">
        <v-layout align-center>
          <div>
            <v-icon small>class</v-icon>
            {{shop.type}}
          </div>
          <v-spacer />
          <span class="body-1">
            <v-icon small>place</v-icon>
            {{shop.address.name}}
          </span>
        </v-layout>
      </v-card-actions>
      <v-expand-transition>
        <div v-if="hover"
          class="d-flex transition-fast-in-fast-out darken-2 v-card--reveal display-3 white--text"
          style="height: 100%;">
          <v-list id="list" three-line style="height:100%; width: 100%;overflow-y: scroll;">
            <template v-for="(item, index) in shop.items">
              <v-subheader v-if="item.header" :key="item.header">
                <v-layout justify-space-between>
                  <div>
                    <v-icon>thumb_up</v-icon>
                    {{ item.header }}
                  </div>
                  <v-btn @click="bubleData()" color="light-blue" outline round style="height:100%;">
                    进店
                  </v-btn>
                </v-layout>
              </v-subheader>

              <v-divider v-else-if="item.divider" :key="index" :inset="item.inset"></v-divider>

              <v-list-tile v-else :key="item.title" avatar @click="">
                <v-list-tile-avatar>
                  <img :src="item.avatar">
                </v-list-tile-avatar>

                <v-list-tile-content>
                  <v-list-tile-title v-html="item.title"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.subtitle"></v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
          <!-- <v-btn @click="bubleData()" flat dark style="height:100%; width:100%;font-size:0.8em;">
            进店
          </v-btn> -->
        </div>
      </v-expand-transition>
    </v-card>
  </v-hover>
</template>

<script>
  export default {
    props: ["shop"],
    methods: {
      bubleData() {
        this.$emit("chosen", this.shop);
      }
    }
  };

</script>

<style>
  .v-card--reveal {
    align-items: start;
    bottom: 0;
    justify-content: center;
    opacity: 0.95;
    position: absolute;
    width: 100%;
  }
  #list::-webkit-scrollbar{
    display:none;
  }
</style>
