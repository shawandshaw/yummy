<template>
  <v-app>
    <Header></Header>
    <v-content>
      <v-container fluid>
        <v-card>
          <v-toolbar dark color="cyan darken-2">
            <v-toolbar-title>订单(共{{orders.length}}份)</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
          <v-data-table ref='table' :headers="headers" :items="orders" :search="search">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.id }}</td>
              <td>{{ props.item.shop.name }}</td>
              <td>{{ props.item.customer.username }}</td>
              <td class="text-xs-left">{{ props.item.createTime }}</td>
              <td class="text-xs-left">{{ props.item.payTime }}</td>
              <td class="text-xs-left">{{ props.item.originPrice }}</td>
              <td class="text-xs-left">{{ props.item.realPrice }}</td>
              <td class="text-xs-left">
                <v-chip
                  :color="colorStatus(props.item.status)"
                  text-color="white"
                  small
                >{{ props.item.status }}</v-chip>
              </td>
              <td class="text-xs-left">
                <v-btn small fab @click="chosenOrder=props.item;detailDialog=true;">详情</v-btn>
              </td>
            </template>
             <template slot="footer">
              <td>筛选统计(SUM)</td>
              <td>共{{filteredOrders.length}}份订单</td>
              <td class="text-xs-left"></td>
              <td class="text-xs-left"></td>
              <td class="text-xs-left"></td>
              <td class="text-xs-left">{{sumOriginPrice}}</td>
              <td class="text-xs-left">{{sumRealPrice}}</td>
              <td class="text-xs-left"></td>
              <td class="text-xs-left">共{{sumGoods}}个商品</td>
            </template>
            <v-alert :value="true" color="error" icon="warning">Sorry, nothing to display here.</v-alert>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card>
        <v-dialog v-model="detailDialog" width="500">
          <v-card>
            <v-toolbar color="pink" dark>
              <v-toolbar-title>Order Details</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>list_alt</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list two-line>
              <template v-for="(item, index) in chosenOrder.items">
                <v-list-tile :key="index" avatar @click=";">
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.combo.name }}</v-list-tile-title>
                    <v-list-tile-sub-title class="text--primary">{{ item.combo.price }}</v-list-tile-sub-title>
                    <v-list-tile-sub-title>{{ item.combo.description }}</v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon disabled small>{{ item.number }}</v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider v-if="index + 1 < chosenOrder.items.length" :key="`divider-${index}`"></v-divider>
              </template>
            </v-list>
            <v-divider></v-divider>
            <v-container fluid>
            <div>地址：{{chosenOrder.receiveInfo.address.name+chosenOrder.receiveInfo.detailedAddress}}</div>
            <div>收货人：{{chosenOrder.receiveInfo.receiver+chosenOrder.receiveInfo.gender}}</div>
            <div>电话：{{chosenOrder.receiveInfo.phone}}</div>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
              <v-chip flat>原价 {{chosenOrder.originPrice}}</v-chip>
              <v-chip flat @click="promotionDialog=true"><v-icon small>info</v-icon>优惠{{chosenOrder.promotion.benefit}}</v-chip>
              <v-chip flat>现价 {{chosenOrder.realPrice}}</v-chip>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="promotionDialog" width="500">
          <v-card>
            <v-toolbar color="pink" dark>
              <v-toolbar-title>promotion</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-text-field
                  prepend-icon="star"
                  v-model="chosenOrder.promotion.id"
                  required
                  placeholder="后端自动生成"
                  readonly
                  name="name"
                  label="优惠ID"
                  type="text"
                ></v-text-field>
                <v-text-field
                  prepend-icon="home"
                  v-model="chosenOrder.promotion.benefit"
                  readonly
                  required
                  name="name"
                  label="优惠内容（小数代表折扣，负数代表满减）"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="chosenOrder.promotion.startDate"
                  label="开始日期"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="chosenOrder.promotion.endDate"
                  label="结束日期"
                  prepend-icon="event"
                  readonly
                ></v-text-field>
                <v-text-field
                  v-model="chosenOrder.promotion.minPrice"
                  readonly
                  prepend-icon="star"
                  name="minPrice"
                  label="最低适用价格"
                  id="minPrice"
                  type="text"
                ></v-text-field>
                <v-text-field
                  prepend-icon="star"
                  readonly
                  v-model="chosenOrder.promotion.minLevel"
                  label="最低适用会员等级"
                ></v-text-field>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
        
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import Header from "@/components/HeaderM";
import axios from "@/plugins/axios";
export default {
  components: {
    Header
  },
  data() {
    return {
      search: "",
      chosenOrder: {
        receiveInfo:{
          address:{
            
          }
        },
        promotion: {}
      },
      promotionDialog:false,
      detailDialog: false,
      headers: [
        { text: "OrderId", value: "id" },
        { text: "Shop", value: "shop.name" },
        { text: "Customer", value: "customer.username" },
        { text: "CreateTime", value: "createTime" },
        { text: "PayTime", value: "payTime" },
        { text: "OriginPrice", value: "originPrice" },
        { text: "RealPrice", value: "realPrice" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "action", sortable: false, align: "left" }
      ],
      orders: [],
      filteredOrders:[]
    };
  },
  watch: {
    search(nv, ov) {
      let vue = this;
      setTimeout(
        () => (vue.filteredOrders = vue.$refs.table.filteredItems),
        400
      );
    }
  },
  computed: {
    sumOriginPrice() {
      let sum = 0;
      for (const order of this.filteredOrders) {
        sum += order.originPrice;
      }
      return sum;
    },
    sumRealPrice() {
      let sum = 0;
      for (const order of this.filteredOrders) {
        sum += order.realPrice;
      }
      return sum;
    },
    sumGoods(){
      let sum=0;
      for (const order of this.filteredOrders) {
        for (const item of order.items) {
          sum+=item.number
        }
      }
      return sum;
    }
  },
  methods: {
    colorStatus(status) {
       let colorTable = {
        paid: "green",
        notPaid: "red",
        invalid: "gray",
        canceled: "gray",
        cooking: "pink",
        sending: "cyan",
        got:'purple',
      };
      return colorTable[status];
    }
  },
  created() {
    let app = this;
    axios.get("/api/orders").then(res => {
      app.orders = res.data;
      app.filteredOrders=app.orders
    });
  }
};
</script>
<style>
</style>

