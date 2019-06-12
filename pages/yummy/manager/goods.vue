
<template>
  <v-app>
    <Header></Header>
    <v-content>
      <v-container fluid>
        <v-tabs fixed-tabs v-model="tabs" color="transparent">
          <v-tabs-slider></v-tabs-slider>
          <v-tab href="#single" class="primary--text">
            <v-icon>单品</v-icon>
          </v-tab>

          <v-tab href="#combo" class="primary--text">
            <v-icon>套餐</v-icon>
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabs" class="white elevation-1">
          <v-tab-item key="single" value="single">
            <v-card class="elevation-12">
              <v-toolbar dark color="cyan darken-2">
                <v-toolbar-title>单品(共{{goods.length}}个)</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="searchGoods"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-toolbar>

              <v-layout justify-end>
                <v-dialog v-model="dialogGood" width="500">
                  <v-card>
                    <v-toolbar color="pink" dark>
                      <v-toolbar-title>Good Edit</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                      <v-form ref="formGood" lazy-validation>
                        <v-text-field
                          prepend-icon="star"
                          v-model="editedItem.id"
                          required
                          placeholder="后端自动生成"
                          readonly
                          name="name"
                          label="商品ID"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          prepend-icon="home"
                          v-model="editedItem.name"
                          readonly
                          required
                          name="name"
                          label="商品名"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.description"
                          readonly
                          prepend-icon="description"
                          name="description"
                          label="商品描述"
                          id="description"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.startDate"
                          label="开始日期"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.endDate"
                          label="结束日期"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>

                        <v-text-field
                          v-model="editedItem.price"
                          readonly
                          prepend-icon="money"
                          name="price"
                          label="价格"
                          id="price"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          prepend-icon="number"
                          readonly
                          v-model="editedItem.quantity"
                          label="数量"
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-layout>

              <v-data-table :headers="headers" :items="goods" :search="searchGoods">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.id }}</td>
                  <td>{{ props.item.shopId }}</td>
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.startDate }}</td>
                  <td class="text-xs-left">{{ props.item.endDate }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.price }}</td>
                  <td class="text-xs-left">{{ props.item.quantity }}</td>
                  <td class="text-xs-left">
                    <v-btn small icon @click="editItem(props.item)">
                      <v-icon>info</v-icon>
                    </v-btn>
                  </td>
                </template>
                <v-alert :value="true" color="error" icon="warning">Sorry, nothing to display here.</v-alert>
                <v-alert
                  slot="no-results"
                  :value="true"
                  color="error"
                  icon="warning"
                >Your search for "{{ searchGoods }}" found no results.</v-alert>
              </v-data-table>
            </v-card>
          </v-tab-item>
          <v-tab-item key="combo" value="combo">
            <v-card class="elevation-12">
              <v-toolbar dark color="cyan darken-2">
                <v-toolbar-title>套餐(共{{combos.length}}个)</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="searchCombo"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-toolbar>

              <v-layout justify-end>
                <v-dialog v-model="dialogCombo" width="500">
                  <v-card>
                    <v-toolbar color="pink" dark>
                      <v-toolbar-title>Combo Edit</v-toolbar-title>
                      <v-spacer></v-spacer>
                    </v-toolbar>
                    <v-card-text>
                      <v-form ref="formCombo" lazy-validation>
                        <v-text-field
                          prepend-icon="star"
                          v-model="editedItemCombo.id"
                          required
                          placeholder="后端自动生成"
                          readonly
                          name="name"
                          label="套餐ID"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          prepend-icon="home"
                          v-model="editedItemCombo.name"
                          readonly
                          required
                          name="name"
                          label="套餐名"
                          type="text"
                        ></v-text-field>
                        <v-dialog
                          ref="listDialog"
                          v-model="listDialog"
                          :return-value.sync="editedItemCombo.items"
                          lazy
                          full-width
                          width="500px"
                        >
                          <v-card>
                            <v-toolbar color="pink" dark>
                              <v-toolbar-title>Combo Item</v-toolbar-title>
                              <v-spacer></v-spacer>
                            </v-toolbar>
                            <v-list two-line>
                              <template v-for="(item, index) in editedItemCombo.items">
                                <v-list-tile :key="index" avatar @click=";">
                                  <v-list-tile-content>
                                    <v-select
                                        readonly
                                      v-model="item.good"
                                      :hint="`单价 ：${editedItemCombo.items[index].good.price}`"
                                      :items="goods"
                                      persistent-hint
                                      item-text="name"
                                      item-value="id"
                                      label="商品"
                                      return-object
                                      single-line
                                      style="300px"
                                    ></v-select>
                                    <!-- <v-list-tile-title>{{ item.good.name }}</v-list-tile-title> -->
                                    <!-- <v-list-tile-sub-title
                                      class="text--primary"
                                    >单价：{{ item.good.price }}</v-list-tile-sub-title>-->
                                    <!-- <v-list-tile-sub-title>{{ item.good.description }}</v-list-tile-sub-title> -->
                                  </v-list-tile-content>
                                  <v-list-tile-action>
                                    <v-btn icon disabled small>{{ item.number }}</v-btn>
                                  </v-list-tile-action>
                                </v-list-tile>
                                <v-divider
                                  v-if="index + 1 < editedItemCombo.items.length"
                                  :key="`divider-${index}`"
                                ></v-divider>
                              </template>
                              <v-divider></v-divider>
                            </v-list>
                          </v-card>
                        </v-dialog>
                        <v-text-field
                          readonly
                          v-model="editedItemCombo.description"
                          prepend-icon="list"
                          name="description"
                          label="点击查看或者编辑套餐条目"
                          id="list"
                          @keyup.enter="listDialog=true"
                          @click="listDialog=true"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItemCombo.startDate"
                          label="开始日期"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItemCombo.endDate"
                          label="结束日期"
                          prepend-icon="event"
                          readonly
                        ></v-text-field>

                        <v-text-field
                          v-model="editedItemCombo.price"
                          readonly
                          prepend-icon="money"
                          name="price"
                          label="价格（需要您在自动计算的结果上略微降低，以体现套餐价值）"
                          id="price"
                          type="text"
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-dialog>
              </v-layout>

              <v-data-table :headers="headersCombo" :items="combos" :search="searchCombo">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.id }}</td>
                  <td>{{ props.item.shopId }}</td>
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.startDate }}</td>
                  <td class="text-xs-left">{{ props.item.endDate }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.price }}</td>
                  <td class="text-xs-left">{{ props.item.status }}</td>
                  <td class="text-xs-left">
                    <v-btn small icon @click="editItemCombo(props.item)">
                      <v-icon>info</v-icon>
                    </v-btn>
                  </td>
                </template>
                <v-alert :value="true" color="error" icon="warning">Sorry, nothing to display here.</v-alert>
                <v-alert
                  slot="no-results"
                  :value="true"
                  color="error"
                  icon="warning"
                >Your search for "{{ searchCombo }}" found no results.</v-alert>
              </v-data-table>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import axios from "@/plugins/axios";
import Header from "@/components/HeaderM";

export default {
  components: {
    Header
  },
  data() {
    return {
      tabs: "single",
      listDialog: false,
      searchCombo: "",
      searchGoods: "",
      dialogGood: false,
      dialogCombo: false,
      headers: [
        { text: "GoodId", value: "id" },
        { text: "ShopId", value: "shopId" },
        { text: "Name", value: "name" },
        { text: "StartDate", value: "startDate" },
        { text: "EndDate", value: "endDate" },
        { text: "description", value: "description" },
        { text: "price", value: "price" },
        { text: "Quantity", value: "quantity" },
        { text: "Actions", value: "action", sortable: false, align: "left" }
      ],
      headersCombo: [
        { text: "ComboId", value: "id" },
        { text: "ShopId", value: "shopId" },
        { text: "Name", value: "name" },
        { text: "StartDate", value: "startDate" },
        { text: "EndDate", value: "endDate" },
        { text: "description", value: "description" },
        { text: "price", value: "price" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "action", sortable: false, align: "left" }
      ],
      goods: [],
      combos: [],

      editedItemCombo: {
        name: "",
        items: [],
        description: "",
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        quantity: 100,
        status: 'selling',
        price: 15
      },
     
      editedItem: {
        name: "",
        description: "",
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        quantity: 100,
        price: 15
      }
     
    };
  },
  watch: {
    dialogCombo(val) {
      val || this.close();
    },
    dialogGood(val) {
      val || this.close();
    }
  },
  methods: {
  
    editItem(item) {
      this.editedItem = Object.assign({}, item);
      this.dialogGood = true;
    },
    editItemCombo(item) {
      this.editedItemCombo = Object.assign({}, item);
      this.dialogCombo = true;
    },
    close() {
      this.dialogGood = false;
      this.dialogCombo = false;
    }
  },
  created() {
    let app = this;
    axios.get("/api/goods").then(res => {
      app.goods = res.data;
    });
    axios.get("/api/combos").then(res => {
      app.combos = res.data;
    });
  }
};
</script>
<style>
</style>

