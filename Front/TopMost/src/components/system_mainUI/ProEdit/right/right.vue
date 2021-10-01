<template>
  <div  id="rightside_area">
      <div class="rightside_area">
        <div class="title">
                <p>區域選擇</p>
               
            </div>
            <div class="inner_outline">

            <div class="pallet_cell"  v-for="(item,index) in $store.state.areas"  :key="index">
                <img src="@/assets/img/pallet.png" alt="">
                <div class="context">
                    <div class="inner"><font color="#FF0000" class="inner">區域{{index+1}}</font></div>
                </div> 

                <div class="pallet_cell_btn">
                    <div class="btn_fix_panel_pallet" @click="show_3darea(index,item)">
                        <div class="word" >
                        開啟
                        </div>
                    </div> 
                </div>
            </div>
        </div> 
      </div>
   
  </div>
</template>
<script src="./right.js" />
<style lang="css" src="./right.css" scoped />