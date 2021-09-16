<template>
   <div class="setting_project">
      <rightside :style="rightpanel_pos" class="rightside_pos"></rightside>

      <panel_addproject v-if="$store.state.panel_show_addPallet_inSetting_Project"></panel_addproject>
      <panel_deleteproject  v-if="$store.state.panel_show_deletePallet_inSetting_Project"></panel_deleteproject>
  </div>
</template>

<script src="./setting_project.js" />


<style lang="css" src="@/assets/css/setting_project.css" scoped />