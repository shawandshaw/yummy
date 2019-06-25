<template>
  <v-hover>
    <v-card width="270" class="black--text" slot-scope="{ hover }">
      <v-img style="width:270px" :src="'/img/'+shop.id+'.jpg'" aspect-ratio="1.618">
      </v-img>
      <v-divider></v-divider>
      <v-layout>
        <v-flex>
          <v-card-title>
            <div>
              <div class="headline">
                {{shop.name}}
              </div>
              <div style="display: flex">
                <v-rating :value="shop.rating" color="amber" dense half-increments readonly size="14"></v-rating>
                <!-- <div class="ml-2 grey--text text--darken-2">
                  <span>{{ shop.rating }}</span>
                </div> -->
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
          <v-list id="list" two-line style="height:100%; width: 100%;overflow-y: scroll;">
            <v-subheader >
                <v-layout justify-space-between align-center>
                  <span>
                    <v-icon small color='red'>whatshot</v-icon>
                    特色菜品
                  </span>
                  <v-btn @click="bubleData()" color="light-blue" outline round style="height:100%;">
                    进店
                  </v-btn>
                </v-layout>
              </v-subheader>

            <template v-for="(item, index) in shop.recommendGoods">
              
              <v-divider :key="index"></v-divider>

              <v-list-tile :key="item.name" avatar @click=";">
                <v-list-tile-avatar>
                  <img :src="'/img/'+shop.id+item.id+'.jpg'">
                </v-list-tile-avatar>
               
                <v-list-tile-content align-center>
                  <v-list-tile-title v-html="item.name"></v-list-tile-title>
                  <v-list-tile-sub-title>{{item.price}}元/份</v-list-tile-sub-title>
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
