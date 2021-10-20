<template>
   <div class="container_area_BG" :style="area_3d_full_rect">
      <div  class="container_area_outline">
         <div id="container_area">
               <div class="area_cancel" @click="btn_cancel_3d_area">[X]</div>
                <div class="data_show_pallet">

                    <div v-if="$store.state.select_show_data_num >=0">
                        <div>
                            貨物資訊: {{data_project}}
                        </div>
                        <div>
                            棧板層數: {{data_layout}}
                        </div>
                        <div>
                            棧板高度: 等待開發
                        </div>
                        <div>
                            格位總高: 等待開發
                        </div>
                    </div>
                </div>
                 <div class="area_select" v-if="$store.state.threejs.Threejs_Area.pro_ins !=null &&  $store.state.threejs.Threejs_Area.pro_ins.length >0" >
                    <div class="area_select_select">
                              <div class="cell" v-bind:class="{cell_select:select_ToDelete(index)}" v-for="(item, index) in $store.state.area_pro_data" :key="index" 
                              @click="select_deleteFun(index)" @mouseenter="select_showdata(index)" @mouseleave="select_hidedata">
                                  <img v-if="select_ToDelete(index)===true "  class="img" :src="require('@/assets/img/chekbox.png')"/>
                                  <img v-if="select_ToDelete(index)===false"  class="img" :src="require('@/assets/img/chekbox_e.png')"/>
                                  <div>
                                    棧板  {{index+1}}
                                  </div>
                              </div>
                          </div>

                          <div class="area_select_delete">
                              <div class="btn_delete"  @click="btn_deletePallet">
                                      <p class="word">
                                          刪除
                                      </p>
                              </div>
                          </div>

              </div> 

          </div>
      </div>

  </div>
 
</template>

<script src="./3darea.js" />


<style lang="css" src="./3darea.css"  scoped/>