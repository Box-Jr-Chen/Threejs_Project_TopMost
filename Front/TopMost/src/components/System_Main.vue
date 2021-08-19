<template>
   <div id="container" @mousemove = "mousemove" >
    <navbar :style="{width:this.$store.state.width_main+'px'}"></navbar>
    <system_mainUI class="system_mainUI" :style="{leftmargin,width:this.$store.state.width_main+'px',height:this.$store.state.height_main+'px'}"></system_mainUI>
    <system_WH_FrameLess v-if="$store.state.panel_select ==0"></system_WH_FrameLess>
    <system_drawMap v-if="$store.state.panel_select ==1"></system_drawMap>
  </div>
 
</template>

<script src="./System_Main.js" />


<style lang="css" src="@/assets/css/System_Main.css"  scoped/>