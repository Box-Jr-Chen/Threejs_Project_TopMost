<template>
  <div  id="rightside_sort">
      <div class="rightside_sort">
        <div class="title">
                <p>棧板排列</p>
                
                <div class="add_block" >
                    <div @click="startAlgs" v-if="$store.state.isstart_sort ===0 ||$store.state.isstart_sort ===1 "  v-bind:class="[
                        $store.state.isstart_sort !==0? 'btn_active_panel_pallet_startsort':'btn_active_panel_pallet']">
                            <div class="word"  
                           v-if="$store.state.isstart_sort ===0"> 
                                開始排列 
                            </div>
                    </div>

                    <div  @click="pallet_HasSet"   v-if="$store.state.isstart_sort ===2"
                     class="btn_active_panel_pallet_move">
                            <div class="word"  
                           v-if="$store.state.isstart_sort ===2"> 
                                棧板已放置
                            </div>
                    </div>

                </div>
            </div>
            <div class="inner_outline">
                <div class="pallet_cell"  v-for="(item,index) in $store.state.pallet_sort"  :key="index">
                    <img src="@/assets/img/pallet.png" alt="">
                    <div class="context">
                        <div class="inner"><font color="black" class="inner">需排列棧板-{{index+1}}</font></div>
                    </div> 
                </div>
        </div> 
      </div>
   
  </div>
</template>
<script src="./rightside.js" />
<style lang="css" src="./rightside.css" scoped />