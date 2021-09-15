<template>
  <div class="system_mainUI" >
      <setting_pallet v-if="$store.state.panel_select ==1"/>
      <setting_project  v-if="$store.state.panel_select ==2"/>
  </div>
</template>

<script src="./system_mainUI.js" />


<style lang="css" src="@/assets/css/system_mainUI.css" scoped />