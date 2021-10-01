<template>
   <div class="set_proedit">
      <rightside :style="rightpanel_pos" class="rightside_pos"></rightside>

      <area_3d v-if="$store.state.is_3d_area"></area_3d>
  </div>
</template>

<script src="./ProEdit.js" />


<style lang="css" src="./ProEdit.css" scoped />