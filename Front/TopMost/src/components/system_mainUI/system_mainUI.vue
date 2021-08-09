<template>
  <div class="leftbar">

      <div class="btn_left" v-for="(item, index) in $store.state.leftbtns" :key="index">
          <img class="img" :src="require('@/assets/img/'+item.img+'.png')"/>
          <p>{{item.title}}</p>
      </div>

  </div>
</template>

<script src="./system_mainUI.js" />


<style lang="css" src="@/assets/css/system_mainUI.css"  />