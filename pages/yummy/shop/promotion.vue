<template>
  <v-app>
    <Header></Header>
    <v-content>
      <v-container fluid>
        <v-card class="elevation-12">
          <v-toolbar dark color="cyan darken-2">
            <v-toolbar-title>优惠(共{{promotions.length}}个)</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>

          <v-layout justify-end>
            <v-dialog v-model="dialog" width="500">
              <v-btn slot="activator" color="primary" dark class="mb-2">添加优惠</v-btn>
              <v-card>
                <v-toolbar color="pink" dark>
                  <v-toolbar-title>promotion Edit</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
                <v-card-text>
                  <v-form ref="form" lazy-validation>
                    <v-text-field
                      prepend-icon="star"
                      v-model="editedItem.id"
                      required
                      placeholder="后端自动生成"
                      readonly
                      name="name"
                      label="优惠ID"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="home"
                      v-model="editedItem.benefit"
                      :rules="rules.notEmptyRules"
                      required
                      name="name"
                      label="优惠内容（小数代表折扣，负数代表满减）"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="editedItem.minPrice"
                      :rules="rules.notEmptyRules"
                      prepend-icon="star"
                      name="minPrice"
                      label="最低适用价格"
                      id="minPrice"
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
                          @click="$refs.endDateDialog.save(editedItem.endDate)"
                        >OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                    <v-text-field
                      prepend-icon="star"
                      :rules="rules.positiveIntRules"
                      v-model="editedItem.minLevel"
                      label="最低适用会员等级"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="close" flat>
                    <v-icon>arrow_back</v-icon>cancel
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-grey darken-2" @click="save" class="white--text">save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>

          <v-data-table :headers="headers" :items="promotions" :search="search">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.id }}</td>
              <td class="text-xs-left">{{ props.item.benefit }}</td>
              <td class="text-xs-left">{{ props.item.startDate }}</td>
              <td class="text-xs-left">{{ props.item.endDate }}</td>
              <td class="text-xs-left">{{ props.item.minPrice }}</td>
              <td class="text-xs-left">{{ props.item.minLevel }}</td>
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
            >Your search for "{{ search }}" found no results.</v-alert>
          </v-data-table>
        </v-card>
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
      startDateDialog: false,
      endDateDialog: false,
      search: "",
      dialog: false,
      headers: [
        { text: "PromotionId", value: "id" },
        { text: "Benefit", value: "benefit" },
        { text: "StartDate", value: "startDate" },
        { text: "EndDate", value: "endDate" },
        { text: "MinPrice", value: "minPrice" },
        { text: "MinLevel", value: "minLevel" },
        { text: "Actions", value: "action", sortable: false, align: "left" }
      ],
      promotions: [],
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
      editedItem: {
        benefit: 0.99,
        minPrice: 100,
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        minLevel: 1,
      },
      defaultItem: {
        benefit: 0.99,
        minPrice: 100,
        startDate: new Date().toISOString().substr(0, 10),
        endDate: new Date().toISOString().substr(0, 10),
        minLevel: 1,
      }
    };
  },
   watch: {
   
    dialog(val) {
      val || this.close();
    }
  },
  methods: {
    editItem(item) {
      this.editedIndex = this.promotions.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      let app = this;
      const index = this.promotions.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        axios
          .delete("/api/promotions", {
            params: {
              id: item.id
            }
          })
          .then(res => {
            if (res.data.status == "success") {
              app.promotions.splice(index, 1);
              alert("delete successfully");
            } else {
              alert(res.data.message);
            }
          });
    },
     close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },

    save() {
      const app = this;
      if (this.$refs.form.validate()) {
        if (this.editedIndex > -1) {
          Object.assign(this.promotions[this.editedIndex], this.editedItem);
          axios.put("/api/promotions", this.editedItem).then(res => {
            if (res.data.status == "success") {
              alert("change successfully");
            } else {
              alert(res.data.message);
            }
          });
        } else {
          axios.post("/api/promotions", this.editedItem).then(res => {
            if (res.data.status == "success") {
              app.editedItem.id = res.data.message;
              app.promotions.push(Object.assign({}, app.editedItem));
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
  created(){
      const app=this
      axios.get('/api/promotions').then(res=>{
          app.promotions=res.data
      })
  }
};
</script>
          
          