<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-app>
        <Header></Header>
        <v-content>
            <v-container fluid>
                <v-layout justify-center>
                    <v-card style="width: 80%; justify-content: center">
                        <v-toolbar dark color="primary">
                            <v-toolbar-title>订单(共{{orders.length}}份)</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-text-field
                                v-model="search"
                                append-icon="search"
                                label="搜索"
                                color="white"
                                single-line
                                hide-details
                            ></v-text-field>
                        </v-toolbar>
                        <br>
                        <v-layout align-left style="background-color: #f0f0f0; width: auto">
                            <v-card-text
                                style="color: #494949; width: auto"
                                class="font-weight-bold"
                            >订单分类:</v-card-text>
                            <template>
                                <v-btn
                                    flat
                                    @click="searchState('all', '0')"
                                    style="width: auto;"
                                    :color="sortColor[0]"
                                >全部</v-btn>
                                <v-btn
                                    flat
                                    @click="searchState('paid', '1')"
                                    style="width: auto"
                                    :color="sortColor[1]"
                                >等待送达</v-btn>
                                <v-btn
                                    flat
                                    @click="searchState('notPaid', '2')"
                                    style="width: auto"
                                    :color="sortColor[2]"
                                >等待支付</v-btn>
                                <v-btn
                                    flat
                                    @click="searchState('canceled', '3')"
                                    style="width: auto"
                                    :color="sortColor[3]"
                                >订单取消</v-btn>
                                <v-btn
                                    flat
                                    @click="searchState('timeout', '4')"
                                    style="width: auto"
                                    :color="sortColor[4]"
                                >订单超时</v-btn>
                                <v-btn
                                    flat
                                    @click="searchState('got', '5')"
                                    style="width: auto"
                                    :color="sortColor[5]"
                                >订单完成</v-btn>
                            </template>
                        </v-layout>

                        <v-data-table
                            ref="table"
                            :headers="headers"
                            :items="filteredOrders"
                            :search="search"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.id }}</td>
                                <td>{{ props.item.shop.name }}</td>
                                <td class="text-xs-left">{{ props.item.createTime }}</td>
                                <td class="text-xs-left">{{ props.item.payTime }}</td>
                                <td class="text-xs-left">{{ props.item.originPrice }}元</td>
                                <td class="text-xs-left">{{ props.item.realPrice }}元</td>
                                <td class="text-xs-left">
                                    <v-chip
                                        color="white"
                                        :text-color="colorStatus(props.item.status)"
                                    >{{Status(props.item.status)}}</v-chip>
                                </td>
                                <td class="text-xs-left">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon v-on="on">
                                                <v-btn
                                                    small
                                                    icon
                                                    style="color: black ;"
                                                    v-on="on"
                                                    @click="chosenOrder=props.item;detailDialog=true;"
                                                >
                                                    <v-icon>info</v-icon>
                                                </v-btn>
                                            </v-btn>
                                        </template>
                                        <span>详情</span>
                                    </v-tooltip>

                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon v-on="on">
                                                <v-btn
                                                    v-if="props.item.status!=='got'&&props.item.status!=='canceled'&&props.item.status!=='timeout'"
                                                    small
                                                    icon
                                                    v-on="on"
                                                    @click="chosenOrder=props.item;cancel(chosenOrder)"
                                                >
                                                    <v-icon>delete</v-icon>
                                                </v-btn>
                                                <v-btn
                                                    v-else
                                                    small
                                                    icon
                                                    disabled
                                                    v-on="on"
                                                    @click="chosenOrder=props.item;cancel(chosenOrder)"
                                                >
                                                    <v-icon>delete</v-icon>
                                                </v-btn>
                                            </v-btn>
                                        </template>
                                        <span>取消</span>
                                    </v-tooltip>
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon v-on="on">
                                                <v-btn
                                                    v-if="props.item.status==='notPaid'"
                                                    small
                                                    icon
                                                    v-on="on"
                                                    @click="chosenOrder=props.item;showQRcode(props.item);"
                                                >
                                                    <v-icon>payment</v-icon>
                                                </v-btn>
                                                <v-btn
                                                    v-else
                                                    small
                                                    icon
                                                    disabled
                                                    v-on="on"
                                                    @click="chosenOrder=props.item;showQRcode(props.item);"
                                                >
                                                    <v-icon>payment</v-icon>
                                                </v-btn>
                                            </v-btn>
                                        </template>
                                        <span>支付</span>
                                    </v-tooltip>

                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn icon v-on="on">
                                                <v-btn
                                                    v-if="props.item.status==='sending'"
                                                    small
                                                    icon
                                                    v-on="on"
                                                    @click="chosenOrder=props.item;receive(chosenOrder);"
                                                >
                                                    <v-icon>shopping_basket</v-icon>
                                                </v-btn>
                                                <v-btn
                                                    v-else
                                                    small
                                                    icon
                                                    disabled
                                                    v-on="on"
                                                    @click="chosenOrder=props.item;receive(chosenOrder);"
                                                >
                                                    <v-icon>shopping_basket</v-icon>
                                                </v-btn>
                                            </v-btn>
                                        </template>
                                        <span>确认收货</span>
                                    </v-tooltip>
                                </td>
                            </template>
                            <template slot="footer">
                                <td>总计</td>
                                <td>共{{filteredOrders.length}}份订单</td>
                                <td class="text-xs-left"></td>
                                <td class="text-xs-left"></td>
                                <td class="text-xs-left">{{sumOriginPrice}}元</td>
                                <td class="text-xs-left">{{sumRealPrice}}元</td>
                                <td class="text-xs-left"></td>
                                <!--                <td class="text-xs-left">共{{sumGoods}}个商品</td>-->
                            </template>
                            <v-alert
                                :value="true"
                                color="error"
                                icon="warning"
                            >Sorry, nothing to display here.</v-alert>
                            <v-alert
                                slot="no-results"
                                :value="true"
                                color="error"
                                icon="warning"
                            >Your search for "{{ search }}" found no results.</v-alert>
                        </v-data-table>
                    </v-card>
                </v-layout>
                <v-dialog v-model="detailDialog" width="500">
                    <v-card>
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>订单详情</v-toolbar-title>
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
                                        <v-list-tile-sub-title
                                            class="text--primary"
                                        >单价：{{ item.combo.price }}</v-list-tile-sub-title>
                                        <v-list-tile-sub-title>{{ item.combo.description }}</v-list-tile-sub-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <span>{{ item.number+'份' }}</span>
                                    </v-list-tile-action>
                                </v-list-tile>
                                <v-divider
                                    v-if="index + 1 < chosenOrder.items.length"
                                    :key="`divider-${index}`"
                                ></v-divider>
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
                            <v-chip outline>总价 {{chosenOrder.originPrice}}元</v-chip>
                            <v-chip outline @click="promotionDialog=true" 
                              v-if="chosenOrder.promotion.benefit<1"
                            >
                                <v-icon small>info</v-icon>
                                优惠{{chosenOrder.promotion.benefit}}
                            </v-chip>
                            <v-chip outline> {{chosenOrder.status=='notPaid'||chosenOrder.status=='timeout'?'应付'+chosenOrder.realPrice:'付款'+chosenOrder.realPrice}}元</v-chip>
                            <v-spacer></v-spacer>
                            <v-layout justify-end>
                                <v-btn
                                    v-if="chosenOrder.status=='notPaid'"
                                    color="primary"
                                    @click="detailDialog = false;showQRcode(chosenOrder)"
                                >支付</v-btn>
                            </v-layout>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="promotionDialog" width="500">
                    <v-card>
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>优惠</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>
                            <v-form ref="form" lazy-validation>
                                <v-text-field
                                    prepend-icon="star"
                                    v-model="chosenOrder.promotion.id"
                                    required
                                    placeholder="自动生成"
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
                                    label="折扣"
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
                <v-dialog v-model="QRcode" width="500">
                    <v-card>
                        <v-toolbar color="primary" dark>
                            <v-toolbar-title>订单号: {{this.chosenOrder.id}}</v-toolbar-title>
                            <v-spacer></v-spacer>
                        </v-toolbar>
                        <v-card-text>实付: {{this.chosenOrder.realPrice}} 元</v-card-text>
                        <v-divider></v-divider>

                        <v-card-actions>
                            <v-btn color="primary" flat @click="QRcode=false">稍后再付</v-btn>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" flat @click="pay()">付款</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-container>
        </v-content>
    </v-app>
</template>
<script>
import Header from "@/components/HeaderC";
import axios from "@/plugins/axios";
export default {
    components: {
        Header
    },
    data() {
        return {
            search: "",
            chosenOrder: {
                receiveInfo: {
                    address: {}
                },
                promotion: {}
            },
            promotionDialog: false,
            detailDialog: false,
            QRcode: false,
            headers: [
                { text: "订单号", value: "id" },
                { text: "店铺", value: "shop.name" },
                { text: "订单时间", value: "createTime" },
                { text: "付款时间", value: "payTime" },
                { text: "原价", value: "originPrice" },
                { text: "实际支付", value: "realPrice" },
                { text: "状态", value: "status" },
                {
                    text: "操作",
                    value: "action",
                    sortable: false,
                    align: "center"
                }
            ],
            orders: [],
            filteredOrders: [],

            originOrders: [],

            sortColor: ["red", "black", "black", "black", "black", "black"]
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
        sumGoods() {
            let sum = 0;
            for (const order of this.filteredOrders) {
                for (const item of order.items) {
                    sum += item.number;
                }
            }
            return sum;
        }
    },
    methods: {
        searchState(status, index) {
            let vue = this;
            console.log(vue.filteredOrders);
            vue.filteredOrders.splice(0, vue.filteredOrders.length);
            if (status === "all") {
                //console.log("success");
                for (let i = 0; i < vue.originOrders.length; i++) {
                    vue.filteredOrders.push(vue.originOrders[i]);
                }
            } else {
                for (let i = 0; i < vue.originOrders.length; i++) {
                    if (vue.originOrders[i].status === status) {
                        console.log("su2");
                        vue.filteredOrders.push(vue.originOrders[i]);
                    }
                }
            }

            vue.sortColor = [
                "black",
                "black",
                "black",
                "black",
                "black",
                "black"
            ];
            vue.sortColor[index] = "red";
        },

        colorStatus(status) {
            let colorTable = {
                paid: "black",
                notPaid: "red",
                invalid: "black",
                canceled: "black",
                cooking: "black",
                sending: "black",
                got: "black"
            };
            return colorTable[status];
        },

        Status(status) {
            let statusTable = {
                paid: "等待发货",
                notPaid: "等待支付!!",
                invalid: "gray",
                canceled: "订单取消",
                cooking: "pink",
                sending: "等待送达",
                got: "完成订单",
                timeout: "订单超时"
            };
            return statusTable[status];
        },

        showQRcode(order) {
            if (order.status == "notPaid") this.QRcode = true;
        },
        pay() {
            this.QRcode = false;
            let vue = this;
            axios
                .get("/api/pay", {
                    params: {
                        orderId: this.chosenOrder.id
                    }
                })
                .then(res => {
                    if (res.data.status == "fail") {
                        alert(res.data.message);
                    } else if (res.data.status == "success") {
                        for (let order of vue.orders) {
                            if (order.id == vue.chosenOrder.id) {
                                order.status = vue.chosenOrder.status = "paid";
                                order.payTime = vue.chosenOrder.payTime =
                                    res.data.message;
                            }
                        }
                        alert("paid successfully");
                    }
                });
        },
        cancel(order) {
            const vue = this;
            axios
                .get("/api/orderStatus", {
                    params: {
                        orderId: this.chosenOrder.id
                    }
                })
                .then(res => {
                    let confirmMessage = "您确定要取消订单吗？";
                    switch (res.data.trim()) {
                        case "notPaid":
                            confirmMessage =
                                "订单尚未支付，您确定要取消订单吗？";
                            break;
                        case "paid":
                            confirmMessage =
                                "您已经支付，但商家未接单，可退全款，您确定要取消订单吗？";
                            break;
                        case "cooking":
                            confirmMessage =
                                "商家已接单，准备中，此时只可退款60%，您确定要取消订单吗？";
                            break;
                        case "sending":
                            confirmMessage = "骑手已在送货，不可取消订单。";
                            break;
                        default:
                            break;
                    }
                    const confirmResult = confirm(confirmMessage);
                    if (confirmResult && res.data.trim() != "sending") {
                        let vue = this;
                        axios
                            .get("/api/cancel", {
                                params: {
                                    orderId: this.chosenOrder.id
                                }
                            })
                            .then(res => {
                                if (res.data.status == "fail") {
                                    alert(res.data.message);
                                } else if (res.data.status == "success") {
                                    vue.chosenOrder.status = "canceled";
                                    alert(res.data.message);
                                }
                            });
                    }
                });
        },
        receive(order) {
            axios
                .put(
                    "/api/orderStatus",
                    {},
                    {
                        params: {
                            orderId: order.id,
                            status: "got"
                        }
                    }
                )
                .then(res => {
                    if (res.data.status == "success") {
                        order.status = "got";
                    } else {
                        alert(res.data.message);
                    }
                });
        }
    },
    created() {
        let app = this;
        //  for(let i = 0; i < app.orders.length; i++){
        //    app.orders[i].createTime = app.orders[i].createTime.substring(0, app.orders[i].createTime.length - 3);
        //    app.orders[i].payTime = app.orders[i].payTime.substring(0, app.orders[i].payTime.length - 3);
        //  }
        //
        // app.originOrders = app.orders;
        // for(let i = 0; i < app.originOrders.length; i++){
        //   app.filteredOrders.push(app.originOrders[i]);
        //
        // }
        axios.get("/api/orders").then(res => {
            app.orders = res.data;
            for (let i = 0; i < app.orders.length; i++) {
                app.orders[i].createTime = app.orders[i].createTime.substring(
                    0,
                    app.orders[i].createTime.length - 3
                );
                app.orders[i].payTime = app.orders[i].payTime.substring(
                    0,
                    app.orders[i].payTime.length - 3
                );
            }

            app.originOrders = app.orders;
            for (let i = 0; i < app.originOrders.length; i++) {
                app.filteredOrders.push(app.originOrders[i]);
            }
        });
    }
};
</script>
<style>
</style>

