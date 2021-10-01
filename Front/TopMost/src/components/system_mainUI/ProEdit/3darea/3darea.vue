<template>
   <div class="container_area_BG" :style="area_3d_full_rect">
    <div  class="container_area_outline">
        <div id="container_area">
            <div class="area_cancel" @click="cancel_3d_area">[X]</div>
        </div>
    </div>

  </div>
 
</template>

<script src="./3darea.js" />


<style lang="css" src="./3darea.css"  scoped/>