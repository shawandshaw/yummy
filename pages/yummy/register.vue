<template>
  <v-app id="register">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-tabs grow color="blue-grey darken-2" dark icons-and-text>
            <v-tabs-slider color="white"></v-tabs-slider>

            <v-tab href="#tab-customer" class="title">会员注册</v-tab>

            <v-tab href="#tab-shop" class="title">商家注册</v-tab>

            <v-tab-item value="tab-customer">
              <v-card class="elevation-12">
                <v-card-text>
                  <v-form ref="form_customer" lazy-validation>
                    <v-text-field
                      prepend-icon="email"
                      v-model="customer.email"
                      :rules="emailRules"
                      required
                      name="email"
                      label="邮箱"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="person"
                      v-model="customer.username"
                      :rules="notEmptyRules"
                      required
                      name="username"
                      label="用户名"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="customer.password"
                      :rules="passwordRules"
                      prepend-icon="lock"
                      name="password"
                      label="密码"
                      type="password"
                    ></v-text-field>
                    <v-text-field
                      @keyup.enter="submit"
                      prepend-icon="lock"
                      v-model="customer.passwordAgain"
                      :rules="customer.passwordAgainRules"
                      name="passwordAgain"
                      label="重复密码"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn to="/yummy/login" flat>
                    <v-icon>arrow_back</v-icon>登录
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="blue-grey darken-2"
                    @click="customerSignUP"
                    class="white--text"
                  >注册</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item value="tab-shop">
              <v-card class="elevation-12">
                <v-card-text>
                  <v-form ref="form_shop" lazy-validation>
                    <v-text-field
                      prepend-icon="email"
                      v-model="shop.email"
                      :rules="emailRules"
                      required
                      name="email"
                      label="邮箱"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="home"
                      v-model="shop.name"
                      :rules="notEmptyRules"
                      required
                      name="shopname"
                      label="商店名称"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="place"
                      v-model="shop.address.name"
                      required
                      readonly
                      name="address"
                      label="地址"
                      type="text"
                      @keyup.enter="showMap=true"
                      @click="showMap=true"
                    ></v-text-field>
                    <v-text-field
                      prepend-icon="house"
                      v-model="shop.detailedAddress"
                      required
                      name="address"
                      label="门牌号"
                      placeholder="详细地址，例：16号楼5层509室"
                      type="text"
                    ></v-text-field>
                    <v-select
                      prepend-icon="class"
                      v-model="shop.type"
                      :items="shopTypes"
                      label="类型"
                    ></v-select>
                    <v-text-field
                      prepend-icon="tag"
                      v-model="shop.description"
                      required
                      :rules="notEmptyRules"
                      name="description"
                      label="简介"
                      type="text"
                    ></v-text-field>
                    <v-text-field
                      v-model="shop.password"
                      :rules="passwordRules"
                      prepend-icon="lock"
                      name="password"
                      label="密码"
                      type="password"
                    ></v-text-field>
                    <v-text-field
                      @keyup.enter="submit"
                      prepend-icon="lock"
                      v-model="shop.passwordAgain"
                      :rules="shop.passwordAgainRules"
                      name="passwordAgain"
                      label="重复密码"
                      type="password"
                    ></v-text-field>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-btn to="/yummy/login" flat>
                    <v-icon>arrow_back</v-icon>登录
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-grey darken-2" @click="shopSignUP" class="white--text">注册</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-flex>
      </v-layout>
      <v-dialog v-model="showMap" width="800">
        <Map-search :initLocation="{name:'北京',lng: 116.23,lat:39.54}" @mapCancel="showMap=false" @mapConfirm="mapConfirm"></Map-search>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
import axios from "@/plugins/axios";
import MD5 from "crypto-js/md5";
import MapSearch from "@/components/MapSearch";

export default {
  components: {
    MapSearch
  },
  data() {
    const vue = this;
    return {
      showMap:false,
      shopTypes: ["烧烤", "甜点", "饮料", "主食"],
      customer: {
        email: "",
        username: "",
        password: "",
        passwordAgain: "",
        passwordAgainRules: [
          v => !!v || "密码不能为空",
          v =>
            (v && v === vue.customer.password) || "密码前后不一致"
        ]
      },
      shop: {
        email: "",
        name: "",
        type: "",
        address: {
          name: '',
          lng: 127,
          lat: 33,
        },
        detailedAddress: "",
        description: "",
        password: "",
        passwordAgain: "",
        passwordAgainRules: [
          v => !!v || "密码不能为空",
          v => (v && v === vue.shop.password) || "密码前后不一致"
        ]
      },
      notEmptyRules: [v => !!v || "此项不能为空"],
      emailRules: [
        v => !!v || "邮箱不能为空",
        v =>
          (v &&
            /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/.test(
              v
            )) ||
          "请输入正确的邮箱"
      ],
      passwordRules: [
        v => !!v || "密码不能为空",
        v => (v && v.length >= 6) || "密码必须超过六个字符"
      ]
    };
  },
  methods: {
    customerSignUP() {
      const vue = this;
      if (this.$refs.form_customer.validate()) {
        // Native form submission is not yet supported
        const salt = Math.floor(Math.random() * 10000);
        const passwordHash = MD5(vue.customer.password).toString();
        axios
          .post("/api/customers", {
            username: vue.customer.username,
            email: vue.customer.email,
            salt: salt,
            password: passwordHash
          })
          .then(res => {
            if (res.data.status === "success") {
              alert("注册成功，请前往邮箱认证后即可登录。");
            } else {
              alert(res.data.message);
            }
          });
      }
    },
    mapConfirm(address) {
      this.shop.address = address;
      this.showMap = false;
    },
    shopSignUP() {
      const vue = this;
      if (this.$refs.form_shop.validate()) {
        // Native form submission is not yet supported
        const salt = Math.floor(Math.random() * 10000);
        const passwordHash = MD5(vue.shop.password).toString();
        axios
          .post("/api/shops", {
            email: vue.shop.email,
            name: vue.shop.name,
            address: vue.shop.address,
            detailedAddress: vue.shop.detailedAddress,
            type: vue.shop.type,
            description: vue.shop.description,
            salt: salt,
            password: passwordHash
          })
          .then(res => {
            if (res.data.status === "success") {
              alert("注册成功，请前往邮箱认证后即可登录");
              this.$router.push("/yummy/login");
            } else {
              alert(res.data.message);
            }
          });
      }
    }
  }
};
</script>

<style>
</style>
