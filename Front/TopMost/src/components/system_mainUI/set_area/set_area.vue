<template>
   <div class="set_area">
      <rightside :style="rightpanel_pos" class="rightside_pos"></rightside>

      <panel_deletearea  v-if="$store.state.panel_show_deleteArea_inSet_Area"></panel_deletearea>
  </div>
</template>

<script src="./set_area.js" />


<style lang="css" src="./set_area.css" scoped />