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
                    <font color="#FF0000">{{item.width}}</font><font color="#2E8B57">x</font><font color="#FF0000">{{item.length}}</font><font color="#2E8B57">x</font><font color="#FF0000">{{item.height}}</font>(mm)
                </div> 

                <div class="btn_fix_panel_pallet">
                    <div class="word" @click="show_fixpanel(item)">
                    修改
                    </div>
                </div> 

                <div class="btn_delete_panel_pallet">
                    <div class="word" @click="show_deletepanel(item.id)">
                    刪除
                    </div>
                </div> 
            </div>

        </div> 
      </div>
   
  </div>
</template>
<script src="./rightside.js" />
<style lang="css" src="./rightside.css" scoped />