<template>
    <v-card width="256" height="336" class="black--text">
        <v-layout fill-height column justify-end>
            <v-flex>
                <img style="width:256px;height:150px" :src="url" aspect-ratio="2.75">
            </v-flex>
            <v-flex grow="1">
                <v-card-title>
                    <v-layout class="headline" align-baseline>
                        {{combo.name}}
                        <span v-if="type=='单品'" class="body-1">数量 : {{good.quantity}}</span>
                        <span v-if="type=='套餐'" class="body-1">状态 : {{combo.status}}</span>
                        <v-spacer></v-spacer>
                        <span class="body-1">{{type}}</span>
                    </v-layout>
                </v-card-title>
                <v-card-text>
                    <v-layout align-center>{{combo.description}}</v-layout>
                </v-card-text>
            </v-flex>
            <v-flex align-content-end>
                <v-divider light></v-divider>
                <v-card-actions class="pa-3">
                    <v-layout align-center>
                        <div>
                            RMB:
                            {{combo.price}}
                        </div>
                        <v-spacer/>
                        <v-badge color="red"  left v-model="show">
                            <template  v-slot:badge>
                                <span>{{number}}</span>
                            </template>
                            <v-btn @click="bubleData();show=true;" :disabled="good.quantity==0" icon>
                                <v-icon>add_shopping_cart</v-icon>
                            </v-btn>
                        </v-badge>
                    </v-layout>
                </v-card-actions>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script>
export default {
    props: ["good", "type", "url"],
    data (){
      return {
        show: false,
        number:0
      }
    },
    computed: {
        combo() {
            if (this.type == "单品") {
                return {
                    id: this.good.id + "single",
                    name: this.good.name,
                    description: this.good.description,
                    oldPrice: this.good.price,
                    price: this.good.price,
                    items: [{ good: this.good, number: 1 }],
                    shopId: this.good.shopId,
                    startDate: this.good.startDate,
                    endDate: this.good.endDate,
                    status: "single"
                };
            } else if (this.type == "套餐") {
                return this.good;
            }
        }
    },
    methods: {
        bubleData() {
            this.number++;
            this.show=true;
            this.$emit("chosen", this.combo);
        }
    }
};
</script>


