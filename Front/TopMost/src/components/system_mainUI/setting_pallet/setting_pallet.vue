<template>
  <div class="setting_pallet">
      <rightside :style="rightpanel_pos" class="rightside_pos"></rightside>

      <panel_addpallet v-if="$store.state.panel_show_addPallet_inSetting_Pallet"></panel_addpallet>
  </div>
</template>
<script src="./setting_pallet.js" />
<style lang="css" src="@/assets/css/setting_pallet.css" scoped  />