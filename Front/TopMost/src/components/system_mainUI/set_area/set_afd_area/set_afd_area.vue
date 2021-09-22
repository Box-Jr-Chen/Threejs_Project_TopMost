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
            oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')" 
            @change="changepos(3,getAdd_Ins.geometry.attributes.position.array[3])" 
            type="text"  
            v-model="getAdd_Ins.geometry.attributes.position.array[3]">
           <div  class="english"  style="margin-left:0.5rem">Y:</div>
            <input  
            oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')" 
           onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" 
           type="text"  
           v-model="getAdd_Ins.geometry.attributes.position.array[5]" >
       </div>
       <div class="set_block">
           <div class="title_block">右下角</div>
           <div  class="english">X:</div>
            <input  
           oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')" 
           onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" 
           type="text"  
           v-model="getAdd_Ins.geometry.attributes.position.array[15]">
           <div  class="english" style="margin-left:0.5rem">Y:</div>
            <input  
           oninput="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')" 
           onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" 
           type="text"  
            v-model="getAdd_Ins.geometry.attributes.position.array[17]">
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