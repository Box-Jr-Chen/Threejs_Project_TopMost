<template>
  <div  id="rightside_sort">
      <div class="rightside_sort">
        <div class="title">
                <p>棧板排列</p>
                
                <div class="add_block" @click="show_addpanel">
                <div   v-bind:class="[
                $store.state.show_afd? 'btn_active_panel_pallet_showadd':'btn_active_panel_pallet']">
                    <div class="cross_container">
                        <div id="cross"  v-if="!$store.state.show_afd"/>
                    </div>
                    <div class="word" v-bind:class="{show_addpanel_word:$store.state.show_afd}"> 新增 </div>
                </div>
            </div>
            </div>
            <div class="inner_outline">

            <div class="pallet_cell"  v-for="(item,index) in $store.state.areas"  :key="index">
                <img src="@/assets/img/pallet.png" alt="">
                <div class="context">
                    <div class="inner"><font color="#FF0000" class="inner">棧板{{index+1}}</font></div>
                </div> 


            </div>

        </div> 
      </div>
   
  </div>
</template>
<script src="./rightside.js" />
<style lang="css" src="./rightside.css" scoped />