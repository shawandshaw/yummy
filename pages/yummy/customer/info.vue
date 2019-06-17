<template>
  <v-app>
    <Header @located="setLocation"></Header>
    <v-content>
      <v-container>
        <v-tabs color="primary" dark icons-and-text v-model="activeTabs">
          <v-tabs-slider color="secondary"></v-tabs-slider>

          <v-tab href="#tab-address">
            收货地址
            <v-icon>place</v-icon>
          </v-tab>
          <v-tab href="#tab-info">
            个人信息
            <v-icon>person</v-icon>
          </v-tab>

          <v-tab-item value="tab-address">
            <v-card>
              <v-list>
                <template v-for="(item, index) in addressList">
                  <v-list-tile :key="index" avatar ripple>
                    <v-list-tile-avatar>
                      <v-icon>place</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-layout>
                        <v-flex xs12 md3>
                          <v-text-field v-model="item.address.name" label="收货地址" readonly required></v-text-field>
                        </v-flex>
                        <v-flex xs12 md3>
                          <v-text-field
                            v-model="item.detailedAddress"
                            label="门牌号"
                            readonly
                            required
                          ></v-text-field>
                        </v-flex>

                        <v-flex xs12 md3>
                          <v-text-field v-model="item.receiver" label="收货人" readonly required></v-text-field>
                        </v-flex>

                        <v-flex xs12 md3>
                          <v-text-field v-model="item.gender" readonly label="性别"></v-text-field>
                        </v-flex>
                        <v-flex xs12 md3>
                          <v-text-field v-model="item.phone" readonly label="号码"></v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-list-tile-content>
                    <v-list-tile-action>
                      <v-layout>
                        <v-btn icon @click="editItem(item)">
                          <v-icon>edit</v-icon>
                        </v-btn>
                        <v-spacer></v-spacer>
                        <v-btn icon @click="deleteItem(props.item)">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </v-layout>
                    </v-list-tile-action>
                  </v-list-tile>
                  <v-divider v-if="index < addressList.length" :key="index+'zz'"></v-divider>
                </template>
                <v-list-tile key="last" avatar ripple>
                  <v-layout justify-center>
                    <v-btn icon @click="editItem(defaultItem)">
                      <v-icon medium>add</v-icon>
                    </v-btn>
                  </v-layout>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-tab-item>
          <v-tab-item value="tab-info">
            <v-card>
              <v-container>
                <v-layout fill-height align-center justify-center>
                  <v-flex xs6 sm4 md3>
                    <v-avatar size="250px">
                      <img src="../../../assets/avatar.png" alt="Avatar">
                    </v-avatar>
                  </v-flex>
                  <v-layout column wrap justify-start>
                    <v-flex>
                      <label style="font-size:40px">
                        {{userInfo.username}}
                        <v-btn icon @click="infoDialog=true" large style="width:60px">
                          <v-icon>create</v-icon>修改
                        </v-btn>
                      </label>
                    </v-flex>
                    <v-divider></v-divider>
                    <br>
                    <v-layout row style="font-size:40px">
                      <v-layout column fill-height align-center>
                        <v-flex>
                          <label>{{userInfo.spend}}</label>
                        </v-flex>
                        <v-flex>
                          <v-subheader>总开销</v-subheader>
                        </v-flex>
                      </v-layout>
                      <v-layout column fill-height align-center>
                        <v-flex>
                          <label>{{userInfo.balance}}</label>
                        </v-flex>
                        <v-flex>
                          <v-subheader>余额</v-subheader>
                        </v-flex>
                      </v-layout>
                      <v-layout column fill-height align-center>
                        <v-flex>
                          <label>{{userInfo.level}}</label>
                        </v-flex>
                        <v-flex>
                          <v-subheader>会员等级</v-subheader>
                        </v-flex>
                      </v-layout>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                      <v-spacer></v-spacer>
                    </v-layout>
                    <br>
                    <v-flex>
                      <label style="font-size:20px">电子邮件：{{userInfo.email}}</label>
                    </v-flex>
                    <br>
                    <v-flex>
                      <label style="font-size:20px">密码：**********</label>
                      <v-btn icon @click="infoDialog=true" large style="width:60px">
                        <v-icon>create</v-icon>修改
                      </v-btn>
                    </v-flex>
                    <!-- <v-flex>
                      <v-text-field :value="userInfo.email" label="Email" readonly></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field :value="userInfo.spend" label="Spend" readonly></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field :value="userInfo.balance" label="Balance" readonly></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field :value="userInfo.level" label="会员等级" readonly></v-text-field>
                    </v-flex>
                    <v-flex>
                      <v-text-field
                        :value="userInfo.username"
                        label="Username"
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
                    </v-flex>-->
                  </v-layout>
                </v-layout>
              </v-container>
            </v-card>
          </v-tab-item>
        </v-tabs>

        <v-dialog v-model="infoDialog" width="500">
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>更改信息</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon large>
                <v-icon large>code</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" lazy-validation>
                <v-text-field
                  prepend-icon="person"
                  v-model="infoEditModel.username"
                  :rules="rules.nameRules"
                  required
                  name="username"
                  label="用户名"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="infoEditModel.password"
                  :rules="rules.passwordRules"
                  prepend-icon="lock"
                  name="password"
                  label="密码"
                  id="password"
                  type="password"
                ></v-text-field>
                <v-text-field
                  @keyup.enter="submit"
                  prepend-icon="lock"
                  v-model="infoEditModel.passwordAgain"
                  :rules="rules.passwordAgainRules"
                  name="passwordAgain"
                  label="确认密码"
                  id="passwordAgain"
                  type="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                @click="infoDialog=false;infoEditModel = JSON.parse(JSON.stringify(userInfo));"
                flat
              >
                <v-icon>arrow_back</v-icon>取消
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="submit" class="white--text">确定更改</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="addressDialog" width="500">
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Address</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon large>
                <v-icon large>code</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <v-form ref="formAddress" lazy-validation>
                <v-text-field
                  prepend-icon="place"
                  v-model="editedItem.address.name"
                  required
                  readonly
                  @keyup.enter="mapDialog=true"
                  @click="mapDialog=true"
                  name="address"
                  label="地址"
                  type="text"
                ></v-text-field>
                <v-text-field
                  prepend-icon="house"
                  v-model="editedItem.detailedAddress"
                  required
                  name="address"
                  placeholder="详细地址，例：16号楼5层509室"
                  label="门牌号"
                  type="text"
                ></v-text-field>
                <v-text-field
                  v-model="editedItem.receiver"
                  prepend-icon="person"
                  name="reciever"
                  label="收货人"
                ></v-text-field>
                <v-radio-group row prepend-icon="wc" v-model="editedItem.gender">
                  <v-radio label="先生" value="先生"></v-radio>
                  <v-radio label="女士" value="女士"></v-radio>
                </v-radio-group>
                <v-text-field
                  v-model="editedItem.phone"
                  prepend-icon="phone"
                  name="phone"
                  label="号码"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn @click="addressDialog=false" flat>
                <v-icon>arrow_back</v-icon>cancel
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="save" class="white--text">save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="mapDialog" width="800">
          <Map-search
            :initLocation="editedItem.address"
            @mapCancel="mapDialog=false"
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
import Header from "@/components/HeaderC";
import MapSearch from "@/components/MapSearch";

export default {
  components: {
    Header,
    MapSearch
  },
  data() {
    let vue = this;
    return {
      mapDialog: false,
      location: {
        name: "北京",
        lng: 127,
        lat: 33
      },
      activeTabs: "tab-address",

      addressList: [],
      userInfo: {
        avatar: "/logo.png",
        email: "hhh@qq.com",
        spend: 0,
        balance: 0,
        username: "pikaqiu",
        level: 0,
        password: "******",
        passwordAgain: "******"
      },
      infoEditModel: {},
      rules: {
        nameRules: [
          v => !!v || "Name is required",
          v => (v && v.length <= 10) || "Name must be less than 10 characters"
        ],
        passwordRules: [
          v => !!v || "password is required",
          v => (v && v.length >= 6) || "Password must be more than 6 characters"
        ],
        passwordAgainRules: [
          v => !!v || "password is required",
          v =>
            (v && v == vue.infoEditModel.password) ||
            "Passwords are not the same"
        ],
        addressRules: [v => true]
      },
      editedIndex: -1,
      editedItem: {
        address: {
          name: "北京",
          lng: 127,
          lat: 33
        },
        gender: "先生",
        detailedAddress: "",
        receiver: "",
        phone: ""
      },
      defaultItem: {
        address: {
          name: "北京",
          lng: 127,
          lat: 33
        },
        gender: "先生",
        detailedAddress: "",
        receiver: "",
        phone: ""
      },
      infoDialog: false,
      addressDialog: false
    };
  },
  watch: {
    addressDialog(val) {
      val || this.close();
    }
  },
  methods: {
    setLocation(address) {
      this.location = address;
      this.defaultItem.address = address;
    },
    mapConfirm(address) {
      this.mapDialog = false;
      this.editedItem.address = address;
    },
    editItem(item) {
      this.editedIndex = this.addressList.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.addressDialog = true;
    },
    deleteItem(item) {
      let app = this;
      const index = this.addressList.indexOf(item);
      confirm("Are you sure you want to delete this item?") &&
        axios
          .put("/api/customers", {
            username: this.infoEditModel.username,
            addressList: this.addressList,
            password: MD5(this.userInfo.password).toString()
          })
          .then(res => {
            if (res.data.status == "success") {
              alert("change successfully");
            } else {
              alert(res.data.message);
            }
          });
    },
    close() {
      this.addressDialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    },
    save() {
      const app = this;
      if (this.$refs.formAddress.validate()) {
        if (app.editedIndex > -1) {
          Object.assign(app.addressList[app.editedIndex], app.editedItem);
        } else {
          app.addressList.push(Object.assign({}, app.editedItem));
        }
        for (let receive of this.addressList) {
          receive.id = null;
          receive.address.id = null;
        }
        axios
          .put("/api/customers", {
            username: this.infoEditModel.username,
            addressList: this.addressList,
            password: MD5(this.userInfo.password).toString()
          })
          .then(res => {
            if (res.data.status == "success") {
              alert("更改成功");
            } else {
              alert(res.data.message);
            }
          });
        this.close();
      }
    },
    submit() {
      let app = this;
      if (this.$refs.form.validate()) {
        this.infoDialog = false;
        for (let receive of this.addressList) {
          receive.id = null;
          receive.address.id = null;
        }
        axios
          .put("/api/customers", {
            username: this.infoEditModel.username,
            addressList: this.addressList,
            password: MD5(this.infoEditModel.password).toString()
          })
          .then(res => {
            if (res.data.status == "success") {
              alert("change successfully");
              axios.get("/api/customers").then(res => {
                app.userInfo.email = res.data.email;
                app.userInfo.username = res.data.username;
                app.addressList = res.data.address;
                app.userInfo.level = res.data.level;
                app.userInfo.spend = res.data.spend;
                app.userInfo.balance = res.data.balance;
                app.infoEditModel = JSON.parse(JSON.stringify(app.userInfo));
              });
            } else {
              alert(res.data.message);
            }
          });
      }
    }
  },
  created() {
    let app = this;
    axios.get("/api/customers").then(res => {
      app.userInfo.email = res.data.email;
      app.userInfo.username = res.data.username;
      app.defaultItem.receiver = res.data.username;
      app.editedItem = Object.assign({}, app.defaultItem);
      app.addressList = res.data.addressList;
      app.userInfo.level = res.data.level;
      app.userInfo.spend = res.data.spend;
      app.userInfo.balance = res.data.balance;
      app.infoEditModel = JSON.parse(JSON.stringify(app.userInfo));
    });
  }
};
</script>
<style>
</style>

