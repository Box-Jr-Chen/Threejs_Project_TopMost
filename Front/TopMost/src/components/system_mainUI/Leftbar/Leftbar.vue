<template>
      <div class="leftbar" >
          <div class="btn_left"  v-bind:class="{btn_left_active:$store.state.panel_select ==index}" v-for="(item, index) in $store.state.leftbtns" :key="index" @click="select_panel(index)">
              <img class="img" :src="require('@/assets/img/'+item.img+'.png')"/>
              <p>{{item.title}}</p>
          </div>

      </div>
</template>

<script src="./Leftbar.js" />


<style lang="css" src="@/assets/css/system_mainUI.css" scoped />