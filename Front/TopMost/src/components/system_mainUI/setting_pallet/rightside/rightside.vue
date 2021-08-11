<template>
  <div  id="rightside_pallet">
      <div class="title">
            <p>棧板設定</p>
            
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

        <div class="pallet_cell">
            <img src="@/assets/img/pallet.png" alt="">
             <div>
                 長120CM x 寬 120CM
             </div> 
        </div>

    </div>    
  </div>
</template>
<script src="./rightside.js" />
<style lang="css" src="@/assets/css/rightside_pallet.css" scoped />