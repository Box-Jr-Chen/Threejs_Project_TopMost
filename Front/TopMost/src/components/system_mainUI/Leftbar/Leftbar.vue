<template>
      <div class="leftbar" >
          <div class="btn_left"  
          v-bind:class="{btn_left_active:$store.state.panel_select ==index || $store.state.area_show_afd,
          btn_left_cursor: !$store.state.area_show_afd}"
          v-for="(item, index) in $store.state.leftbtns" 
          :key="index"
          @click="select_panel(index)">
              <img class="img" :src="require('@/assets/img/'+item.img+'.png')"/>
              <p>{{item.title}}</p>
          </div>

      </div>
</template>

<script src="./Leftbar.js" />


<style lang="css" src="@/components/system_mainUI/system_mainUI.css" scoped />