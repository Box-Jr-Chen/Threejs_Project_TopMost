<template>
     <div class="axis_arraw" 
          :style="axis_center">
          <div class="axis_x" 
          @mousedown="mouseDown_x" 
          @mouseenter="mouseenter_x" 
          @mouseleave="mouseleave_x"
          >
              <div class="x"  v-bind:class="{ 'x-hover': enter_X }"></div>
              <div class="arrow-left" v-bind:class="{ 'arrow-left-hover': enter_X }"></div>
          </div>

          <div class="axis_y" 
          @mousedown="mouseDown_y" 
          @mouseenter="mouseenter_y" 
          @mouseleave="mouseleave_y"
          >
               <div class="y"  v-bind:class="{ 'y-hover': enter_Y }"></div>
               <div class="arrow-top" v-bind:class="{ 'arrow-top-hover': enter_Y }"></div>
          </div>
     </div>
</template>

<script src="./MoveController.js" />


<style lang="css" src="@/assets/css/MoveController.css"  />