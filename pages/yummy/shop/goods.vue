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
                  <v-btn slot="activator" color="primary" dark class="mb-2">添加商品</v-btn>
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
                          :rules="rules.notEmptyRules"
                          required
                          name="name"
                          label="商品名"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          v-model="editedItem.description"
                          :rules="rules.notEmptyRules"
                          prepend-icon="description"
                          name="description"
                          label="商品描述"
                          id="description"
                          type="text"
                        ></v-text-field>
                        <v-dialog
                          ref="startDateDialog"
                          v-model="startDateDialog"
                          :return-value.sync="editedItem.startDate"
                          lazy
                          full-width
                          width="290px"
                        >
                          <template slot="activator">
                            <v-text-field
                              v-model="editedItem.startDate"
                              label="开始日期"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.startDate" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="startDateDialog = false">Cancel</v-btn>
                            <v-btn
                              flat
                              color="primary"
                              @click="$refs.startDateDialog.save(editedItem.startDate)"
                            >OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                        <v-dialog
                          ref="endDateDialog"
                          v-model="endDateDialog"
                          :return-value.sync="editedItem.endDate"
                          lazy
                          full-width
                          width="290px"
                        >
                          <template slot="activator">
                            <v-text-field
                              v-model="editedItem.endDate"
                              label="结束日期"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItem.endDate" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="endDateDialog = false">Cancel</v-btn>
                            <v-btn
                              flat
                              color="primary"
                              @click="$refs.endDateDialog.save(editedItem.endDate);"
                            >OK</v-btn>
                          </v-date-picker>
                        </v-dialog>

                        <v-text-field
                          v-model="editedItem.price"
                          :rules="rules.positiveFloatRules"
                          prepend-icon="money"
                          name="price"
                          label="价格"
                          id="price"
                          type="text"
                        ></v-text-field>
                        <v-text-field
                          prepend-icon="number"
                          :rules="rules.positiveIntRules"
                          v-model="editedItem.quantity"
                          label="数量"
                        ></v-text-field>
                      </v-form>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn @click="close" flat>
                        <v-icon>arrow_back</v-icon>cancel
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="blue-grey darken-2" @click="saveGood" class="white--text">save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>

              <v-data-table :headers="headers" :items="goods" :search="searchGoods">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.id }}</td>
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.startDate }}</td>
                  <td class="text-xs-left">{{ props.item.endDate }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.price }}</td>
                  <td class="text-xs-left">{{ props.item.quantity }}</td>
                  <td class="text-xs-left">
                    <v-btn small icon @click="editItem(props.item)">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn small icon @click="deleteItem(props.item)">
                      <v-icon>delete</v-icon>
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
                  <v-btn slot="activator" color="primary" dark class="mb-2">添加套餐</v-btn>
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
                          :rules="rules.notEmptyRules"
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
                              <v-btn icon @click="editedItemCombo.items=[]">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </v-toolbar>
                            <v-list two-line>
                              <template v-for="(item, index) in editedItemCombo.items">
                                <v-list-tile :key="index" avatar @click=";">
                                  <v-list-tile-content>
                                    <v-select
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
                                    <v-btn icon small @click="item.number++;">
                                      <v-icon>add</v-icon>
                                    </v-btn>
                                    <v-btn icon disabled small>{{ item.number }}</v-btn>
                                    <v-btn icon small @click="decrease(item,index)">
                                      <v-icon>remove</v-icon>
                                    </v-btn>
                                  </v-list-tile-action>
                                </v-list-tile>
                                <v-divider
                                  v-if="index + 1 < editedItemCombo.items.length"
                                  :key="`divider-${index}`"
                                ></v-divider>
                              </template>
                              <v-divider></v-divider>

                              <v-list-tile key="last" avatar ripple>
                                <v-layout justify-center>
                                  <v-btn icon @click="addItemToCombo()">
                                    <v-icon medium>add</v-icon>
                                  </v-btn>
                                </v-layout>
                              </v-list-tile>
                            </v-list>
                            <v-divider></v-divider>

                            <v-card-actions>
                              <v-btn flat color="primary" @click="listDialog = false">Cancel</v-btn>
                              <v-spacer></v-spacer>
                              <v-btn
                                color="primary"
                                flat
                                @click="generateDescriptionAndAdvicePrice();$refs.listDialog.save(editedItemCombo.items)"
                              >OK</v-btn>
                            </v-card-actions>
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
                        <v-dialog
                          ref="startDateDialogCombo"
                          v-model="startDateDialogCombo"
                          :return-value.sync="editedItemCombo.startDate"
                          lazy
                          full-width
                          width="290px"
                        >
                          <template slot="activator">
                            <v-text-field
                              v-model="editedItemCombo.startDate"
                              label="开始日期"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItemCombo.startDate" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="startDateDialogCombo = false">Cancel</v-btn>
                            <v-btn
                              flat
                              color="primary"
                              @click="$refs.startDateDialogCombo.save(editedItemCombo.startDate)"
                            >OK</v-btn>
                          </v-date-picker>
                        </v-dialog>
                        <v-dialog
                          ref="endDateDialogCombo"
                          v-model="endDateDialogCombo"
                          :return-value.sync="editedItemCombo.endDate"
                          lazy
                          full-width
                          width="290px"
                        >
                          <template slot="activator">
                            <v-text-field
                              v-model="editedItemCombo.endDate"
                              label="结束日期"
                              prepend-icon="event"
                              readonly
                            ></v-text-field>
                          </template>
                          <v-date-picker v-model="editedItemCombo.endDate" scrollable>
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="endDateDialogCombo = false">Cancel</v-btn>
                            <v-btn
                              flat
                              color="primary"
                              @click="$refs.endDateDialogCombo.save(editedItemCombo.endDate)"
                            >OK</v-btn>
                          </v-date-picker>
                        </v-dialog>

                        <v-text-field
                          v-model="editedItemCombo.price"
                          :rules="rules.positiveFloatRules"
                          prepend-icon="money"
                          name="price"
                          label="价格（需要您在自动计算的结果上略微降低，以体现套餐价值）"
                          id="price"
                          type="text"
                        ></v-text-field>
                        <!-- <v-text-field
                          prepend-icon="number"
                          :rules="rules.positiveIntRules"
                          v-model="editedItem.quantity"
                          label="数量"
                        ></v-text-field>-->
                      </v-form>
                    </v-card-text>

                    <v-card-actions>
                      <v-btn @click="close" flat>
                        <v-icon>arrow_back</v-icon>cancel
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn color="blue-grey darken-2" @click="saveCombo" class="white--text">save</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-layout>

              <v-data-table :headers="headersCombo" :items="combos" :search="searchCombo">
                <template slot="items" slot-scope="props">
                  <td>{{ props.item.id }}</td>
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.startDate }}</td>
                  <td class="text-xs-left">{{ props.item.endDate }}</td>
                  <td class="text-xs-left">{{ props.item.description }}</td>
                  <td class="text-xs-left">{{ props.item.price }}</td>
                  <td class="text-xs-left">{{ props.item.status }}</td>
                  <td class="text-xs-left">
                    <v-btn small icon @click="editItemCombo(props.item)">
                      <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn small icon @click="deleteItemCombo(props.item)">
                      <v-icon>delete</v-icon>
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
import Header from "@/components/HeaderS";

export default {
  components: {
    Header
  },
  data() {
    return {
      tabs: "single",
      listDialog: false,
      startDateDialog: false,
      endDateDialog: false,
      startDateDialogCombo: false,
      endDateDialogCombo: false,
      searchCombo: "",
      searchGoods: "",
      dialogGood: false,
      dialogCombo: false,
      headers: [
        { text: "GoodId", value: "id" },
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
      rules: {
        notEmptyRules: [v => !!v || "该项不能为空"],
        positiveFloatRules: [
          v => !!v || "该项不能为空",
          v => (v && /^[0-9]+(.[0-9]{2})?$/.test(v)) || "请输入正的两位小数"
        ],
        positiveIntRules: [
          v => !!v || "该项不能为空",
          v => (v && /^[0-9]*[1-9][0-9]*$/.test(v)) || "请输入正整数"
        ]
      },
      editedIndex: -1,
      editedIndexCombo: -1,
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
      defaultItemCombo: {
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
      },
      defaultItem: {
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
    decrease(comboItem, index) {
      comboItem.number--;
      if (comboItem.number == 0) {
        this.editedItemCombo.items.splice(index, 1);
      }
    },
    editItem(item) {
      this.editedIndex = this.goods.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogGood = true;
    },
    editItemCombo(item) {
      this.editedIndexCombo = this.combos.indexOf(item);
      this.editedItemCombo = Object.assign({}, item);
      this.dialogCombo = true;
    },

    deleteItem(item) {
      let app = this;
      const index = this.goods.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        axios
          .delete("/api/goods", {
            params: {
              id: item.id
            }
          })
          .then(res => {
            if (res.data.status == "success") {
              app.goods.splice(index, 1);
              alert("delete successfully");
            } else {
              alert(res.data.message);
            }
          });
    },
    addItemToCombo() {
      const good = this.goods[0] || {};
      this.editedItemCombo.items.push(
        Object.assign({}, { good: good, number: 1 })
      );
      console.log(this.editedItemCombo);
    },
    deleteItemCombo(item) {
      let app = this;
      const index = this.combos.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        axios
          .delete("/api/combos", {
            params: {
              id: item.id
            }
          })
          .then(res => {
            if (res.data.status == "success") {
              app.combos.splice(index, 1);
              alert("delete successfully");
            } else {
              alert(res.data.message);
            }
          });
    },

    close() {
      this.dialogGood = false;
      this.dialogCombo = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedItemCombo = Object.assign({}, this.defaultItemCombo);
        this.editedIndex = -1;
        this.editedIndexCombo = -1;
      }, 300);
    },

    saveGood() {
      const app = this;
      if (this.$refs.formGood.validate()) {
        if (this.editedIndex > -1) {
          Object.assign(this.goods[this.editedIndex], this.editedItem);
          axios.put("/api/goods", this.editedItem).then(res => {
            if (res.data.status == "success") {
              alert("change successfully");
            } else {
              alert(res.data.message);
            }
          });
        } else {
          axios.post("/api/goods", this.editedItem).then(res => {
            if (res.data.status == "success") {
              app.editedItem.id = res.data.message;
              app.goods.push(Object.assign({}, app.editedItem));
              alert("添加成功");
            } else {
              alert(res.data.message);
            }
          });
        }
        this.close();
      }
    },
    generateDescriptionAndAdvicePrice() {
      this.editedItemCombo.description = "";
      let price=0;
      for (let comboItem of this.editedItemCombo.items) {
        this.editedItemCombo.description +=
          comboItem.good.name + "*" + comboItem.number + "+";
        price+=comboItem.good.price*comboItem.number
      }
      this.editedItemCombo.description=this.editedItemCombo.description.substr(0,this.editedItemCombo.description.length-1);
      this.editedItemCombo.oldPrice=price
      this.editedItemCombo.price=price
    },
    saveCombo() {
      const app = this;
      if (this.$refs.formCombo.validate()) {
        if (this.editedIndexCombo > -1) {
          this.editedItemCombo.items.forEach(comboItem => {
            comboItem.id=null
          });
          Object.assign(
            this.combos[this.editedIndexCombo],
            this.editedItemCombo
          );
          axios.put("/api/combos", this.editedItemCombo).then(res => {
            if (res.data.status == "success") {
              alert("change successfully");
            } else {
              alert(res.data.message);
            }
          });
        } else {
          axios.post("/api/combos", this.editedItemCombo).then(res => {
            if (res.data.status == "success") {
              app.editedItemCombo.id = res.data.message;
              app.combos.push(Object.assign({}, app.editedItemCombo));
              alert("添加成功");
            } else {
              alert(res.data.message);
            }
          });
        }
        this.close();
      }
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

