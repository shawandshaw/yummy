
<template>
    <v-app>
        <Header></Header>
        <v-content>
            <v-container fluid grid-list-lg>
                <v-layout row wrap fill-height>
                    <v-flex lg6 md6 xs12>
                        <div id="shopScatter" class="chart"></div>
                    </v-flex>
                    <v-flex lg6 md6 xs12>
                        <div id="orderScatter" class="chart"></div>
                    </v-flex>
                    <v-flex lg6 md6 xs12>
                        <div id="customerPie" class="chart"></div>
                    </v-flex>
                    <v-flex lg6 md6 xs12>
                        <div id="shopPie" class="chart"></div>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>
<style>
/**
 * 默认尺寸为 600px×400px，如果想让图表响应尺寸变化，可以像下面这样
 * 把尺寸设为百分比值（同时请记得为容器设置尺寸）。
 */
.chart {
    width: 100%;
    height: 400px;
}
</style>
<script>
import axios from "@/plugins/axios";
import echarts from "echarts";
import "echarts/lib/chart/pie";
import "echarts/lib/chart/scatter";
import "echarts/extension/bmap/bmap";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/legend";
import "echarts/lib/component/title";
import Header from "@/components/HeaderM";

export default {
    components: {
        Header: Header
    },
    data() {
        return {
            orders: [],
            customers: [],
            shops: []
        };
    },
    computed: {
        customerPieOption() {
            let levelBox = {};
            this.customers.forEach(customer => {
                if (levelBox[customer.level]) {
                    levelBox[customer.level]++;
                } else {
                    levelBox[customer.level] = 1;
                }
            });
            let data = [];
            let legendData = [];
            for (const level in levelBox) {
                if (levelBox.hasOwnProperty(level)) {
                    data.push({ name: level + "级", value: levelBox[level] });
                    legendData.push(level + "级");
                }
            }
            let customerPieOption = {
                title: {
                    text: "各等级会员饼图",
                    subtext: "共计" + this.customers.length + "人",
                    x: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: legendData,
                    formatter: function(params) {
                        let level = params.replace("级", "");
                        return params + ":" + levelBox[level] + "人";
                    }
                },
                series: [
                    {
                        name: "会员人数",
                        type: "pie",
                        radius: "55%",
                        center: ["50%", "60%"],
                        data: data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            };
            return customerPieOption;
        },
        shopPieOption() {
            let typeBox = {};
            this.shops.forEach(shop => {
                if (typeBox[shop.type]) {
                    typeBox[shop.type]++;
                } else {
                    typeBox[shop.type] = 1;
                }
            });
            let data = [];
            let legendData = [];
            for (const type in typeBox) {
                if (typeBox.hasOwnProperty(type)) {
                    data.push({ name: type, value: typeBox[type] });
                    legendData.push(type);
                }
            }
            let shopPieOption = {
                title: {
                    text: "各类型商店饼图",
                    subtext: "共计" + this.shops.length + "家商店",
                    x: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: "vertical",
                    left: "left",
                    data: legendData,
                    formatter: function(params) {
                        return params + ":" + typeBox[params] + "家";
                    }
                },
                series: [
                    {
                        name: "商店数量",
                        type: "pie",
                        radius: "55%",
                        center: ["50%", "60%"],
                        data: data,
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: "rgba(0, 0, 0, 0.5)"
                            }
                        }
                    }
                ]
            };
            return shopPieOption;
        },
        shopScatterOption() {
            let box = {};
            let data = [];
            let geoCoordMap = {};
            this.shops.forEach(shop => {
                let address = shop.address;
                if (box[address.name]) {
                    box[address.name]++;
                } else {
                    box[address.name] = 1;
                }
                geoCoordMap[address.name] = [address.lng, address.lat];
            });
            for (const addressName in box) {
                if (box.hasOwnProperty(addressName)) {
                    const value = box[addressName];
                    data.push({ name: addressName, value: value });
                }
            }
            var convertData = function(data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };
            const option = {
                title: {
                    text: "Yummy注册商店分布 - 百度地图",
                    subtext: "共计" + this.shops.length + "家商店",
                    left: "center"
                },
                tooltip: {
                    trigger: "item",
                    formatter: function(data) {
                        return (
                            data.name +
                            "<br/>" +
                            data.seriesName +
                            "：" +
                            data.value[2]
                        );
                    }
                },
                bmap: {
                    center: [104.114129, 36.550339],
                    zoom: 5,
                    roam: true,
                    mapStyle: {
                        styleJson: [
                            {
                                featureType: "water",
                                elementType: "all",
                                stylers: {
                                    color: "#d1d1d1"
                                }
                            },
                            {
                                featureType: "land",
                                elementType: "all",
                                stylers: {
                                    color: "#f3f3f3"
                                }
                            },
                            {
                                featureType: "railway",
                                elementType: "all",
                                stylers: {
                                    visibility: "off"
                                }
                            },
                            {
                                featureType: "highway",
                                elementType: "all",
                                stylers: {
                                    color: "#fdfdfd"
                                }
                            },
                            {
                                featureType: "highway",
                                elementType: "labels",
                                stylers: {
                                    visibility: "off"
                                }
                            },
                            {
                                featureType: "arterial",
                                elementType: "geometry",
                                stylers: {
                                    color: "#fefefe"
                                }
                            },
                            {
                                featureType: "arterial",
                                elementType: "geometry.fill",
                                stylers: {
                                    color: "#fefefe"
                                }
                            },
                            {
                                featureType: "poi",
                                elementType: "all",
                                stylers: {
                                    visibility: "off"
                                }
                            },
                            {
                                featureType: "green",
                                elementType: "all",
                                stylers: {
                                    visibility: "off"
                                }
                            },
                            {
                                featureType: "subway",
                                elementType: "all",
                                stylers: {
                                    visibility: "off"
                                }
                            },
                            {
                                featureType: "manmade",
                                elementType: "all",
                                stylers: {
                                    color: "#d1d1d1"
                                }
                            },
                            {
                                featureType: "local",
                                elementType: "all",
                                stylers: {
                                    color: "#d1d1d1"
                                }
                            },
                            {
                                featureType: "arterial",
                                elementType: "labels",
                                stylers: {
                                    visibility: "off"
                                }
                            },
                            {
                                featureType: "boundary",
                                elementType: "all",
                                stylers: {
                                    color: "#fefefe"
                                }
                            },
                            {
                                featureType: "building",
                                elementType: "all",
                                stylers: {
                                    color: "#d1d1d1"
                                }
                            },
                            {
                                featureType: "label",
                                elementType: "labels.text.fill",
                                stylers: {
                                    color: "#999999"
                                }
                            }
                        ]
                    }
                },
                series: [
                    {
                        name: "商店数量",
                        type: "scatter",
                        coordinateSystem: "bmap",
                        data: convertData(data),
                        symbolSize: function(val) {
                            return val[2] * 10;
                        },
                        label: {
                            normal: {
                                formatter: "{b}",
                                position: "right",
                                show: false
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: "purple"
                            }
                        }
                    }
                ]
            };
            return option;
        },
        orderScatterOption() {
            let gotOrders = this.orders.filter(o => o.status == "got");
            let cancelOrders = this.orders.filter(o => o.status == "canceled");
            let dataGot = [];
            let dataCancel = [];
            gotOrders.forEach(o => {
                dataGot.push([o.createTime, o.realPrice]);
            });
            cancelOrders.forEach(o => {
                dataCancel.push([o.createTime, o.realPrice]);
            });
            console.log(dataGot);
            console.log(dataCancel);
            const option = {
                backgroundColor: new echarts.graphic.RadialGradient(
                    0.3,
                    0.3,
                    0.8,
                    [
                        {
                            offset: 0,
                            color: "#f7f8fa"
                        },
                        {
                            offset: 1,
                            color: "#cdd0d5"
                        }
                    ]
                ),
                title: {
                    text: "订单分布散点图",
                    left: "center"
                },
                xAxis: {
                    type: "time",
                    splitLine: {
                        lineStyle: {
                            type: "dashed"
                        }
                    }
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: "dashed"
                        }
                    },
                    scale: true
                },
                series: [
                    {
                        name: "gotOrders",
                        data: dataGot,
                        type: "scatter",
                        symbolSize: function(data) {
                            return Math.sqrt(data[1]);
                        },
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function(param) {
                                    return param.data[1];
                                },
                                position: "top"
                            }
                        },
                        itemStyle: {
                            normal: {
                                shadowBlur: 10,
                                shadowColor: "rgba(120, 36, 50, 0.5)",
                                shadowOffsetY: 5,
                                color: new echarts.graphic.RadialGradient(
                                    0.4,
                                    0.3,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgb(251, 118, 123)"
                                        },
                                        {
                                            offset: 1,
                                            color: "rgb(204, 46, 72)"
                                        }
                                    ]
                                )
                            }
                        }
                    },
                    {
                        name: "cancelOrders",
                        data: dataCancel,
                        type: "scatter",
                        symbolSize: function(data) {
                            return Math.sqrt(data[1]);
                        },
                        label: {
                            emphasis: {
                                show: true,
                                formatter: function(param) {
                                    return param.data[1];
                                },
                                position: "top"
                            }
                        },
                        itemStyle: {
                            normal: {
                                shadowBlur: 10,
                                shadowColor: "rgba(50, 36, 120, 0.5)",
                                shadowOffsetY: 5,
                                color: new echarts.graphic.RadialGradient(
                                    0.4,
                                    0.3,
                                    1,
                                    [
                                        {
                                            offset: 0,
                                            color: "rgb(123, 118, 251)"
                                        },
                                        {
                                            offset: 1,
                                            color: "rgb(72, 46, 204)"
                                        }
                                    ]
                                )
                            }
                        }
                    }
                ]
            };
            return option;
        }
    },
    methods: {
        setCharts() {
            echarts
                .init(document.getElementById("shopScatter"))
                .setOption(this.shopScatterOption);
            echarts
                .init(document.getElementById("orderScatter"))
                .setOption(this.orderScatterOption);
            echarts
                .init(document.getElementById("shopPie"))
                .setOption(this.shopPieOption);
            echarts
                .init(document.getElementById("customerPie"))
                .setOption(this.customerPieOption);
        }
    },
    created() {
        const app = this;
        Promise.all([
            axios.get("http://localhost:8080/api/orders"),
            axios.get("http://localhost:8080/api/customers"),
            axios.get("http://localhost:8080/api/shops")
        ]).then(res => {
            app.orders = res[0].data;
            app.customers = res[1].data;
            app.shops = res[2].data;
            app.setCharts();
        });
        // let res1=await axios.get("api/orders")
        // app.orders = res1.data;
        // let res2=await axios.get("api/customers");
        // app.customers = res2.data;
        // let res3=await axios.get("api/shops");
        // app.shops = res3.data;
        // app.setCharts();
    }
};
</script>