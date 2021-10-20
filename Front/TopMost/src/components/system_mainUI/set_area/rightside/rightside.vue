<template>
  <div  id="rightside_area">
      <set_area />
      <div class="rightside_area">
        <div class="title">
                <p>區域設定</p>
                
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
                    <div class="inner"><font color="#FF0000" class="inner">區域{{index+1}}</font></div>
                </div> 

                <div class="pallet_cell_btn">
                    <div class="btn_fix_panel_pallet" @click="show_fixpanel(index,item)" v-if="check_area_can_fix(index)">
                        <div class="word" >
                        修改
                        </div>
                    </div> 

                    <div class="btn_delete_panel_pallet" @click="show_deletepanel(item.id)" v-if="check_area_can_fix(index)">
                        <div class="word" >
                        刪除
                        </div>
                    </div> 

                    <div class="pallet_cell_btn_tip" v-if="!check_area_can_fix(index)">
                        有貨物不可修改
                    </div>
                </div>

            </div>

        </div> 
      </div>
   
  </div>
</template>
<script src="./rightside.js" />
<style lang="css" src="./rightside.css" scoped />