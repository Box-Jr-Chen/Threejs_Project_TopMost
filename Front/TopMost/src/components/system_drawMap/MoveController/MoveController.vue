<template>
     <div class="axis_arraw" 
          :style="axis_center"
           v-if=" $store.state.threejs.mapDesign.spline_Object_select.main !=null"
          >
          <div class="axis_x" 
          @mousedown="mouseDown_x" 
          @mouseup="mouseUp_x" 
          @mouseenter="mouseenter_x" 
          @mouseleave="mouseleave_x"
          >
              <div class="x"  v-bind:class="{ 'x-hover': $store.state.threejs.mapDesign.mouseEnter_x }"></div>
              <div class="arrow-left" v-bind:class="{ 'arrow-left-hover': $store.state.threejs.mapDesign.mouseEnter_x }"></div>
          </div>

          <div class="axis_y" 
          @mousedown="mouseDown_y" 
          @mouseup="mouseUp_y" 
          @mouseenter="mouseenter_y" 
          @mouseleave="mouseleave_y"
          >
               <div class="y"  v-bind:class="{ 'y-hover': $store.state.threejs.mapDesign.mouseEnter_y }"></div>
               <div class="arrow-top" v-bind:class="{ 'arrow-top-hover': $store.state.threejs.mapDesign.mouseEnter_y }"></div>
          </div>
     </div>
</template>

<script src="./MoveController.js" />


<style lang="css" src="@/assets/css/MoveController.css"  />