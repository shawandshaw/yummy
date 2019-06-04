<template>
  <v-app>
    <Header></Header>
    <v-content>
      <v-container fluid>
        <v-card class="elevation-12">
          <v-toolbar dark color="cyan darken-2">
            <v-toolbar-title>商店(共{{shops.length}}家)</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>

          <!-- <v-layout justify-end>
            <v-dialog v-model="dialog" width="800">
              <v-layout>
                <v-card class="elevation-12" width="400">
                  <v-toolbar color="pink" dark>
                    <v-toolbar-title>商店原信息</v-toolbar-title>
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
                        v-model="shop.name"
                        readonly
                        required
                        name="shopname"
                        label="shopname"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="place"
                        v-model="shop.address.name"
                        readonly
                        name="address"
                        label="address"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="house"
                        v-model="shop.detailedAddress"
                        readonly
                        required
                        name="address"
                        label="门牌号"
                        placeholder="详细地址，例：16号楼5层509室"
                        type="text"
                      ></v-text-field>
                      <v-text-field prepend-icon="class" readonly v-model="shop.type" label="type"></v-text-field>
                      <v-text-field
                        prepend-icon="tag"
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
                    <v-toolbar-title>商店新信息</v-toolbar-title>
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
                        v-model="editedItem.address.name"
                        readonly
                        name="address"
                        label="address"
                        type="text"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="house"
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
                        readonly
                        v-model="editedItem.type"
                        label="type"
                      ></v-text-field>
                      <v-text-field
                        prepend-icon="tag"
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
          </v-layout> -->

          <v-data-table :headers="headers" :items="shops" :search="search">
            <template slot="items" slot-scope="props">
              <td>{{ props.item.id }}</td>
              <td class="text-xs-left">{{ props.item.name }}</td>
              <td class="text-xs-left">{{ props.item.email }}</td>
              <td class="text-xs-left">{{ props.item.type }}</td>
              <td class="text-xs-left">{{ props.item.description }}</td>
              <td class="text-xs-left">{{ props.item.address.name }}</td>
              <td class="text-xs-left">{{ props.item.detailedAddress }}</td>
              <td class="text-xs-left">{{ props.item.earn }}</td>
              <td class="text-xs-left">{{ props.item.balance }}</td>
              <!-- <td class="text-xs-left">
                <v-btn small icon @click="editItem(props.item)">
                  <v-icon>info</v-icon>
                </v-btn>
              </td> -->
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
        { text: "ID", value: "id" },
        { text: "Name", value: "name" },
        { text: "Email", value: "email" },
        { text: "Type", value: "type" },
        { text: "Description", value: "description" },
        { text: "Address", value: "address.name" },
        { text: "DetailedAddress", value: "detailedAddress" },
        { text: "Earn", value: "earn" },
        { text: "Balance", value: "balance" },
        // { text: "Actions", value: "action", sortable: false, align: "left" }
      ],
      shops: [
      ],
    //   editedItem: {
    //     id: 0,
    //     email: '',
    //     name: "",
    //     type: "",
    //     description: "",
    //     address: {
    //       name: ""
    //     },
    //     detailedAddress: "",
    //     balance: ""
    //   }
    };
  },
  methods: {
    editItem(item) {
      this.editedItem = item;
      this.dialog = true;
    },

    passItem(item) {
      
    },
    refuseItem(item){

    },
  },
  created() {
    const app = this;
    axios.get("/api/shops").then(res => {
      app.shops = res.data;
    });
  }
};
</script>
          
          