<template>
   <div id="container" @mousemove = "mousemove" >
    <navbar :style="{width:this.$store.state.width_main+'px'}"></navbar>
    <system_mainUI class="system_mainUI" :style="{leftmargin,width:this.$store.state.width_main+'px',height:this.$store.state.height_main+'px'}"></system_mainUI>
    <system_drawMap></system_drawMap>
  </div>
 
</template>

<script src="./System_Main.js" />


<style lang="css" src="@/assets/css/System_Main.css"  scoped/>