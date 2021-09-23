<template>
   <div id="set_afd_area"  v-bind:class="{
       set_afd_area_color:$store.state.area_show_afd,
       set_afd_area_color_hide:!$store.state.area_show_afd}"
  >
  <div v-if="$store.state.area_show_afd">
       <div class="areatitle" v-if="add==true">新增區域</div>
        <div class="areatitle" v-if="add==false">修改區域</div>
       <div class="set_block">
           <div class="title_block">左上角</div>
           <div class="english">X:</div>
           <input  
            @change="changeinput(0,9,3)"
           @updated="true"
            type="text"  
            v-model="$store.state.addIns_pos.left.x">


           <div  class="english"  style="margin-left:0.5rem">Y:</div>
            <input  
            @change="changeinput(11,14,5)"
           type="text"  
           v-model="$store.state.addIns_pos.left.z" >
           
       </div>
       <div class="set_block">
           <div class="title_block">右下角</div>
           <div  class="english">X:</div>
            <input  
           type="text"  
            @change="changeinput(6,12,15)"
           v-model="$store.state.addIns_pos.right.x">

           <div  class="english" style="margin-left:0.5rem">Y:</div>
            <input  
           onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" 
           type="text"  
            @change="changeinput(2,8,17)"
            v-model="$store.state.addIns_pos.right.z">
       </div>
       <div class="btn_block">
                <div class="btn btn_enter" @click="add_project"  v-if="add==true">確認</div>
                <div class="btn btn_enter" @click="fix_project"  v-if="add==false">修改</div>
                <div class="btn btn_delete" @click="delete_project"  v-if="add==false">刪除</div>
                <div class="btn btn_cancel" @click="hide_addpanel">取消</div>
        </div>
  </div>

  </div>
</template>

<script src="./set_afd_area.js" />


<style lang="css" src="./set_afd_area.css" scoped />