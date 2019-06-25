<template>
  <v-app id="home">
    <Header v-show="isSigned" v-on:located="receiveLocation"></Header>
    <HeaderTourist v-show="!isSigned" v-on:located="receiveLocation"></HeaderTourist>
    <v-content>
      <v-container grid-list-lg>
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
  import HeaderTourist from "@/components/HeaderTourist";
  import axios from "@/plugins/axios";
  import {
    distanceFunc
  } from "../../../utils/util";

  export default {
    components: {
      Card,
      Header,
      HeaderTourist
    },
    data() {
      return {
        shops: [],
        isSigned:false,
      };
    },
    methods: {
      receiveLocation(address) {
        axios.get("/api/shops").then(res => {
            this.shops = res.data.filter(
                shop =>
                    distanceFunc(
                        shop.address.lng,
                        shop.address.lat,
                        address.lng,
                        address.lat
                    ) < 100
            );
            this.shops.forEach(shop=>{
              shop.rating=Number((Math.random()*5).toFixed(2))
               axios
                .get("/api/goods", {
                    params: {
                        shopId: shop.id
                    }
                })
                .then(res => {
                    shop.recommendGoods = res.data;
                });
            })
            
        });
        // this.shops = this.shops.filter(shop => {
        //     let dis = distanceFunc(
        //         shop.address.lng,
        //         shop.address.lat,
        //         address.lng,
        //         address.lat
        //     );
        //     if (dis < 100) {
        //         return true;
        //     } else return false;
        // });
        // let random = Mock.Random;
        // let shops = []
        // for (let i = 0; i < 10; i++) {
        //   const element = {
        //     name: random.cword(2, 8),
        //     address: {
        //       name: random.city()
        //     },
        //     description: random.cparagraph(1, 5),
        //     type: random.ctitle(2, 4),
        //     rating: random.float(0, 4.9, 1, 1),
        //     review: random.integer(0, 1000),
        //     recommendGoods: [{
        //         header: '店铺推荐'
        //       },
        //       {
        //         avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        //         title: 'Brunch this weekend?',
        //         subtitle: "<span class='text--primary'>Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?"
        //       },
        //       {
        //         divider: true,
        //         inset: true
        //       },
        //       {
        //         avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        //         title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        //         subtitle: "<span class='text--primary'>to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend."
        //       },
        //       {
        //         divider: true,
        //         inset: true
        //       },
        //       {
        //         avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
        //         title: 'Oui oui',
        //         subtitle: "<span class='text--primary'>Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?"
        //       },
        //       {
        //         divider: true,
        //         inset: true
        //       },
        //       {
        //         avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
        //         title: 'Birthday gift',
        //         subtitle: "<span class='text--primary'>Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?"
        //       },
        //       {
        //         divider: true,
        //         inset: true
        //       },
        //       {
        //         avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        //         title: 'Recipe to try',
        //         subtitle: "<span class='text--primary'>Britta Holt</span> &mdash; We should eat this: Grate, Squash, Corn, and tomatillo Tacos."
        //       }
        //     ]
        //   }
        //   shops.push(element);

        // }
        // this.shops = shops;
      },
      goTo(shop) {
        if(this.isSigned){
          window.location.href = "/yummy/customer/shop?shopId=" + shop.id;
        }else{
          window.location.href = "/yummy/login"
        }
      }
    },
    created: function () {
      // this.receiveLocation();
      axios.get('/api/login').then(res=>{
        console.log(res.data=='signed')
        if(res.data=='signed'){
          this.isSigned=true;
        }else if(res.data=='notSigned'){
          this.isSigned=false;
        }
      })
    }
  };

</script>

<style>
</style>
