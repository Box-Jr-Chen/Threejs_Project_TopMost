<template>
  <div id="container" @mousemove = "mousemove" >
    <navbar :style="{width:this.$store.state.width_main+'px'}"></navbar>
    <system_mainUI :style="{leftmargin}"></system_mainUI>
    <system_drawMap></system_drawMap>
  </div>
</template>

<script src="./System_Main.js" />


<style lang="css" src="@/assets/css/System_Main.css"  />