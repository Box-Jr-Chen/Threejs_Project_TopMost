<template>
  <div class="system_mainUI" >
      <sort_panel v-if="$store.state.panel_select ==0"/>
      <set_area v-if="$store.state.panel_select ==1"/>
      <setting_pallet v-if="$store.state.panel_select ==2"/>
      <setting_project  v-if="$store.state.panel_select ==3"/>
      <ProEdit v-if="$store.state.panel_select ==4"/>
      <system_readDXFMap v-if="$store.state.init_loadFactory ===false" />
  </div>
</template>

<script src="./system_mainUI.js" />


<style lang="css" src="./system_mainUI.css" scoped />