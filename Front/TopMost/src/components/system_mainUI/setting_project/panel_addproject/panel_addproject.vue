<template>
    <div class="BG" :style="{width:$store.state.width_main+'px',height:$store.state.height_main+'px'}">
        <div  id="panel_addproject">
        <div class="title" v-if="$store.state.project_add_fix.id <=0">
            新增貨物
        </div>
         <div class="title" v-if="$store.state.project_add_fix.id >0">
            修改貨物
        </div>
           <div class="context">
            <p class="context_chinese">寬</p>
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" type="text" v-model="$store.state.project_add_fix.width" maxlength="4">
            <p class="context_chinese">長</p>
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');"  type="text"  v-model="$store.state.project_add_fix.length" maxlength="4">
            <p class="context_chinese">高</p>
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" type="text" v-model="$store.state.project_add_fix.height" maxlength="4">
            <p class="context_english">(mm)</p>
            </div>
            <div class="btn_block">
            <div class="btn btn_enter" @click="add_project"  v-if="$store.state.project_add_fix.id <=0">確認</div>
            <div class="btn btn_enter" @click="fix_project"  v-if="$store.state.project_add_fix.id >0">修改</div>
            <div class="btn btn_cancel" @click="hide_addpanel">取消</div>
            </div>
            <div  class="error_msg">
                {{$store.state.project_error}}
            </div>
        </div>
    </div>
</template>
<script src="./panel_addproject.js" />
<style lang="css" src="@/assets/css/panel_addproject.css" scoped />