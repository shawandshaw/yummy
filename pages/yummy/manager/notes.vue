<template>
  <v-app>
    <Header></Header>
    <v-content>
      <v-container fluid>
        <v-card class="elevation-12">
          <v-toolbar dark color="cyan darken-2">
            <v-toolbar-title>单据</v-toolbar-title>
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
            <v-dialog v-model="dialog" width="800">
              <v-layout>
                <v-card class="elevation-12" width="400">
                  <v-toolbar color="pink" dark>
                    <v-toolbar-title>商店当前信息</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-card-text>
                    <v-form ref="form_shop" lazy-validation>
                      <v-text-field
                        prepend-icon="star"
                        v-model="shop.id"
                        readonly
                        required
                        name="email"
                        label="ID"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="home"
                        :outline="editedItem.name!=shop.name"
                        v-model="shop.name"
                        readonly
                        required
                        name="shopname"
                        label="shopname"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="place"
                        :outline="editedItem.address.name!=shop.address.name"
                        v-model="shop.address.name"
                        readonly
                        name="address"
                        label="address"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="house"
                        :outline="editedItem.detailedAddress!=shop.detailedAddress"
                        v-model="shop.detailedAddress"
                        readonly
                        required
                        name="address"
                        label="门牌号"
                        placeholder="详细地址，例：16号楼5层509室"
                        type="text"
                      ></v-text-field>
                      <v-text-field 
                      prepend-icon="class" 
                      readonly v-model="shop.type" 
                      label="type"
                      :outline="editedItem.type!=shop.type"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="tag"
                        :outline="editedItem.description!=shop.description"
                        v-model="shop.description"
                        required
                        readonly
                        name="description"
                        label="description"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        v-model="shop.password"
                        prepend-icon="lock"
                        readonly
                        name="password"
                        label="Password"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                </v-card>
                <v-card class="elevation-12" width="400">
                  <v-toolbar color="pink" dark>
                    <v-toolbar-title>商店修改申请</v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-card-text>
                    <v-form>
                      <v-text-field
                        prepend-icon="star"
                        v-model="editedItem.shopId"
                        readonly
                        required
                        name="email"
                        label="ID"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        :outline="editedItem.name!=shop.name"
                        prepend-icon="home"
                        v-model="editedItem.name"
                        readonly
                        required
                        name="shopname"
                        label="shopname"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="place"
                        :outline="editedItem.address.name!=shop.address.name"
                        v-model="editedItem.address.name"
                        readonly
                        name="address"
                        label="address"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="house"
                        :outline="editedItem.detailedAddress!=shop.detailedAddress"
                        v-model="editedItem.detailedAddress"
                        readonly
                        required
                        name="address"
                        label="门牌号"
                        placeholder="详细地址，例：16号楼5层509室"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="class"
                        :outline="editedItem.type!=shop.type"
                        readonly
                        v-model="editedItem.type"
                        label="type"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="tag"
                        :outline="editedItem.description!=shop.description"
                        v-model="editedItem.description"
                        required
                        readonly
                        name="description"
                        label="description"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        v-model="editedItem.password"
                        prepend-icon="lock"
                        readonly
                        name="password"
                        label="Password"
                        type="password"
                      ></v-text-field>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-layout>
            </v-dialog>
          </v-layout>

          <v-data-table :headers="headers" :items="notes" :search="search">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.id }}</td>
              <td class="text-xs-left">{{ props.item.date }}</td>
              <td class="text-xs-left">{{ props.item.shopId }}</td>
              <td class="text-xs-left">{{ props.item.status }}</td>
              <td class="text-xs-left">
                <v-btn small icon @click="editItem(props.item)">
                  <v-icon>info</v-icon>
                </v-btn>
                <v-btn v-if="props.item.status=='notPass'" small icon @click="passItem(props.item)">
                  <v-icon>check</v-icon>
                </v-btn>
                <v-btn
                  v-if="props.item.status=='notPass'"
                  small
                  icon
                  @click="refuseItem(props.item)"
                >
                  <v-icon>clear</v-icon>
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
import Header from "@/components/HeaderM";

export default {
  components: {
    Header
  },
  data() {
    return {
      search: "",
      dialog: false,
      headers: [
        { text: "NoteId", value: "id" },
        { text: "Date", value: "date" },
        { text: "ShopId", value: "shopId" },
        { text: "Status", value: "status" },
        { text: "Actions", value: "action", sortable: false, align: "left" }
      ],
      notes: [
        {
          id: 0,
          date: "",
          shopId: 0,
          status: "notPass",
          name: "",
          type: "",
          description: "",
          address: {
            name: ""
          },
          detailedAddress: "",
          password: ""
        }
      ],
      shop: {
        id: "loading",
        name: "loading",
        type: "loading",
        description: "loading",
        address: {
          name: "loading"
        },
        detailedAddress: "loading",
        password: "loading"
      },
      editedIndex: -1,
      editedItem: {
        id: 0,
        date: "",
        shopId: 0,
        name: "",
        type: "",
        description: "",
        address: {
          name: ""
        },
        detailedAddress: "",
        password: ""
      }
    };
  },
  methods: {
    editItem(item) {
      const vue = this;
      this.editedItem = item;
      this.dialog = true;
      axios
        .get("/api/shops", {
          params: {
            shopId: this.editedItem.shopId
          }
        })
        .then(res => {
          vue.shop = res.data;
        });
    },

    passItem(item) {
      const vue = this;
      item.status = "pass";
      axios.put("/api/notes", item).then(res => {
        if (res.data.status == "success") {
          alert("操作成功");
        } else {
          alert(res.data.message);
        }
      });
    },
    refuseItem(item) {
      item.status = "refused";
      axios.put("/api/notes", item).then(res => {
        if (res.data.status == "success") {
          alert("操作成功");
        } else {
          alert(res.data.message);
        }
      });
    }
  },
  created() {
    const app = this;
    axios.get("/api/notes").then(res => {
      app.notes = res.data;
    });
  }
};
</script>
          
          