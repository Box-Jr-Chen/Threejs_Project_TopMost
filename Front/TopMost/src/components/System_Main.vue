<template>
   <div>
        <div id="container" @mousemove = "mousemove"  style="z-index=0;"></div>
        <Leftbar />
        <system_mainUI ></system_mainUI>
        <navbar :style="{width:this.$store.state.width_main+'px'}"></navbar>
  
        <div class="tip_manual" v-if="$store.state.isPalletManual">
              點選區域選擇位置
        </div>

  </div>
 
</template>

<script src="./System_Main.js" />


<style lang="css" src="@/assets/css/System_Main.css"  scoped/>