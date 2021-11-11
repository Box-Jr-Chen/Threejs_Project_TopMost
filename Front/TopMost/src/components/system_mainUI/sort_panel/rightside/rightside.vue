<template>
  <div  id="rightside_sort">

      <div class="rightside_sort">
        <div class="title">
              <div class="inner">
                  <div  class="context">
                        <p >
                            棧板排列
                        </p>
                        <select v-model="$store.state.sort_selected" v-if="
                        ($store.state.isstart_sort ===0 ||$store.state.isstart_sort ===1)">
                            <option value="0">平舖排列</option>
                            <option value="1">單格先排滿</option>
                        </select>

                        <div class="btn_clearsort" @click="btn_clear_algs" v-if="$store.state.isstart_sort ===2 && !$store.state.isPalletManual"  
                            v-bind:class="[
                                $store.state.isstart_sort !==0? 'btn_active_panel_pallet_startsort':'btn_active_panel_pallet']">
                                    <div class="word"  
                                        v-if="$store.state.isstart_sort ===2"> 
                                        清除排列 
                        </div>
                    </div>
                  </div>

                    <div class="err" v-if="$store.state.sort_err !==''">
                            {{$store.state.sort_err}})
                    </div>

              </div>

                <div class="add_block" >
                    <div @click="btn_algs" v-if="
                        ($store.state.isstart_sort ===0 ||$store.state.isstart_sort ===1)&& 
                        ($store.state.pallet_needsort.length>0 && $store.state.projects.length >0 && $store.state.pillets.length >0 && $store.state.areas.length >0)"  
                        v-bind:class="[
                            $store.state.isstart_sort !==0? 'btn_active_panel_pallet_startsort':'btn_active_panel_pallet']">
                                <div class="word"  
                                    v-if="$store.state.isstart_sort ===0"> 
                                    開始排列 
                                </div>
                    </div>

                    <div  @click="btn_pallet_HasSet"   v-if="$store.state.isstart_sort ===2 && !$store.state.isPalletManual"
                     class="btn_active_panel_pallet_move">
                            <div class="word"  
                                v-if="$store.state.isstart_sort ===2 "> 
                                棧板已放置
                            </div>
                    </div>

                </div>
            </div>
            <div class="inner_outline">
                <div class="pallet_cell"  v-for="(item,index) in $store.state.pallet_needsort"  :key="index">
                    <img src="@/assets/img/pallet.png" alt="">
                    <div class="context">
                        <div class="inner">
                            <font color="black" class="inner">{{type_sort(index,item)}}</font>
                            <div>{{result_sort(index)}}</div>
                        </div>
                    </div> 
                    <div class="btn_custom" v-if="active_manual(index)" @click="btn_manual_set(index)">
                        手動修改
                    </div>
                    <div class="btn_custom_cancel" v-if="$store.state.is_custom_enable && $store.state.isPalletManual && $store.state.Manual_index ==index" @click="btn_manual_cancel">
                        結束
                    </div>
                </div>
        </div> 
      </div>

  </div>
</template>
<script src="./rightside.js" />
<style lang="css" src="./rightside.css" scoped />