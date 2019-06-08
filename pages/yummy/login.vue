<template>
  <v-app id="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar dark color="blue-grey darken-2">
              <v-toolbar-title>登录</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon large>
                <v-icon large>code</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card-text>
              <v-form>
                <v-radio-group row prepend-icon="person"  v-model="userType">
                    <v-radio label="会员" value="customer"></v-radio>
                    <v-radio label="商店" value="shop"></v-radio>
                    <v-radio label="管理员" value="manager"></v-radio>
                </v-radio-group>
                <v-text-field
                  v-model="email"
                  :prepend-icon="userType=='customer'||userType=='manager'?'email':'home'"
                  name="email"
                  :label="userType=='customer'||userType=='manager'?'邮箱':'商店ID'"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  @keyup.enter="submit"
                  prepend-icon="lock"
                  name="password"
                  label="密码"
                  id="password"
                  type="password"
                ></v-text-field>
                
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn to="/yummy/register" flat>
                <v-icon>arrow_back</v-icon>注册
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue-grey darken-2" class="white--text" @click="submit">登录</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import axios from "@/plugins/axios";
import MD5 from "crypto-js/md5";
export default {
  data() {
    return {
      userType: "customer",
      email: "",
      password: ""
    };
  },
  methods: {
    submit: function() {
      const password = MD5(this.password).toString();
      const vue=this
      axios
        .post("/api/login", {
          userType:this.userType,
          email: this.email,
          password: password
        })
        .then(res => {
          const homePage = {
            customer: 'customer/mall',
            shop: 'shop/orders',
            manager:'manager/orders'
          }
          if (res.data.status === "success") {
            window.location.href = "/yummy/"+homePage[vue.userType];
          } else {
            alert(res.data.message);
          }
        });
    }
  }
};
</script>

<style>
</style>
