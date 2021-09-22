<template>
    <div class="BG" :style="{width:this.$store.state.width_main+'px',height:this.$store.state.height_main+'px'}">

            
            <div class="panel_readFactory">
                <div class="title">
                    選擇地圖
                </div>
                <div>
                    <div class="div_Factory">
                        <div  v-if="$store.state.factories !==null && $store.state.factories.length >0" style="wid">
                            <div  class="Factory_option"  v-bind:class="{Factory_option_select:$store.state.factory_select ===index}" v-for="(item,index) in $store.state.factories" :key="index" @click="selectIndex(index)">
                                    {{item}}
                            </div>
                        </div>
                    </div>
                    <div class="btn_block">
                            <div class="btn  btn_enter_disactive"
                             v-bind:class="{btn_enter:$store.state.factories !==null && $store.state.factories.length >0}" @click="Select_Map">確定</div>
                    </div>
                </div>
            </div>

            <div class="loading" v-if="isloading">
                    <img src="@/assets/img/loading.gif" alt="">
            </div>
    </div>
</template>

<script src="./system_readDXFMap.js" />


<style lang="css" src="./system_readDXFMap.css"  scoped/>