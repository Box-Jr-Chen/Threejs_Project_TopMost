<template>
  <div  id="rightside_project">
      <div class="title">
            <p>貨物設定</p>
            
            <div class="add_block" @click="show_addpanel">
              <div  class="btn_active_panel_pallet">
                <div class="cross_container">
                    <div id="cross"/>
                </div>
                  <div class="word"> 新增 </div>
              </div>
        </div>
    </div>
    <div class="inner_outline">

        <div class="pallet_cell"  v-for="(item,index) in $store.state.projects"  :key="index">
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
</template>
<script src="./rightside.js" />
<style lang="css" src="@/assets/css/rightside_project.css" scoped />