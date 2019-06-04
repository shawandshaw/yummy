<template>
  <v-app>
    <Header></Header>
    <v-content>
      <v-container>
        <v-card>
          <v-toolbar color="cyan darken-2" dark>
            <v-toolbar-title>Info</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-layout column wrap>
              <v-flex>
                <v-text-field :value="shopInfo.id" label="Id" readonly></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field :value="shopInfo.email" label="Email" readonly></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field :value="shopInfo.earn" label="Earn" readonly></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field :value="shopInfo.balance" label="Balance" readonly></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  :value="shopInfo.name"
                  label="Name"
                  readonly
                  append-icon="create"
                  @click:append="infoDialog=true"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  :value="shopInfo.address.name"
                  label="address"
                  readonly
                  append-icon="create"
                  @click:append="infoDialog=true"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  :value="shopInfo.detailedAddress"
                  label="doorNumber"
                  readonly
                  append-icon="create"
                  @click:append="infoDialog=true"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  :value="shopInfo.description"
                  label="description"
                  readonly
                  append-icon="create"
                  @click:append="infoDialog=true"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  :value="shopInfo.type"
                  label="type"
                  readonly
                  append-icon="create"
                  @click:append="infoDialog=true"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field
                  value="***********"
                  label="Password"
                  readonly
                  append-icon="create"
                  @click:append="infoDialog=true"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
        <v-dialog v-model="infoDialog" width="500">
          <v-card class="elevation-12">
            <v-toolbar dark color="blue-grey darken-2">
              <v-toolbar-title>Info Edit</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon large>
                <v-icon large>code</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-text-field
                  prepend-icon="home"
                  v-model="infoEditModel.name"
                  :rules="notEmptyRules"
                  required
                  name="shopname"
                  label="shopname"
                  type="text"
                ></v-text-field>
                <v-text-field
                  prepend-icon="place"
                  v-model="infoEditModel.address.name"
                  required
                  readonly
                  name="address"
                  label="address"
                  type="text"
                  @keyup.enter="showMap=true"
                  @click="showMap=true"
                ></v-text-field>
                <v-text-field
                  prepend-icon="house"
                  v-model="infoEditModel.detailedAddress"
                  required
                  name="address"
                  label="门牌号"
                  placeholder="详细地址，例：16号楼5层509室"
                  type="text"
                ></v-text-field>
                <v-select
                  prepend-icon="class"
                  v-model="infoEditModel.type"
                  :items="shopTypes"
                  label="type"
                ></v-select>
                <v-text-field
                  prepend-icon="tag"
                  v-model="infoEditModel.description"
                  required
                  :rules="notEmptyRules"
                  label="description"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="infoEditModel.password"
                  :rules="passwordRules"
                  prepend-icon="lock"
                  label="Password"
                  id="password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="submit"
                  prepend-icon="lock"
                  v-model="infoEditModel.passwordAgain"
                  :rules="passwordAgainRules"
                  name="passwordAgain"
                  label="Password Again"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="infoDialog=false;infoEditModel=JSON.parse(JSON.stringify(shopInfo))"
                flat
              >
                <v-icon>arrow_back</v-icon>cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue-grey darken-2" @click="submit" class="white--text">Change</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="showMap" width="800">
          <Map-search
            :initLocation="infoEditModel.address"
            @mapCancel="showMap=false"
            @mapConfirm="mapConfirm"
          ></Map-search>
        </v-dialog>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import axios from "@/plugins/axios";
import MD5 from "crypto-js/md5";
import MapSearch from "@/components/MapSearch";
import Header from "@/components/HeaderS";

export default {
  components: {
    MapSearch,
    Header
  },
  data() {
    let vue = this;
    return {
      shopTypes: ["烧烤", "甜点", "饮料", "主食"],
      shopInfo: {
        avatar: "/logo.png",
        id: "",
        name: "",
        earn: 0,
        balance: 0,
        email: "",
        type: "",
        address: {
          name: "",
          lng: 127,
          lat: 33
        },
        detailedAddress: "",
        description: "",
        password: "******",
        passwordAgain: "******"
      },
      infoEditModel: {
        address: {
          name: "",
          lng: 127,
          lat: 33
        }
      },
      notEmptyRules: [v => !!v || "此项不能为空"],
      infoDialog: false,
      showMap: false,
      passwordRules: [
        v => !!v || "password is required",
        v => (v && v.length >= 6) || "Password must be more than 6 characters"
      ],
      passwordAgainRules: [
        v => !!v || "password is required",
        v =>
          (v && v === vue.infoEditModel.password) ||
          "Passwords are not the same"
      ]
    };
  },
  methods: {
    mapConfirm(location) {
      this.infoEditModel.address = location;
      this.showMap = false;
    },
    submit() {
      const vue = this;
      this.infoDialog = false;
      if (this.$refs.form.validate()) {
        // Native form submission is not yet supported
        vue.infoEditModel.address.id = null;
        const passwordHash = MD5(vue.infoEditModel.password).toString();
        vue.infoEditModel.password = passwordHash;
        vue.infoEditModel.shopId = vue.shopInfo.id;
        axios.post("/api/notes", vue.infoEditModel).then(res => {
          if (res.data.status == "success") {
            alert("您的修改申请已经提交,管理员审批后系统自动更改。");
            window.location.href='/yummy/waiting'
          } else {
            alert(res.data.message);
          }
        });
      }
    }
  },
  created() {
    let vue = this;
    axios.get("/api/shops").then(res => {
      vue.shopInfo = res.data;
      vue.shopInfo.password = "******";
      vue.shopInfo.passwordAgain = "******";
      vue.infoEditModel = JSON.parse(JSON.stringify(vue.shopInfo));
    });
  }
};
</script>
<style>
</style>

