<template>
<div class="BG" :style="{width:this.$store.state.width_main+'px',height:this.$store.state.height_main+'px'}">
    <div  id="panel_addpallet">
        <div class="title" v-if="$store.state.pillet_add_fix.id <=0">
            新增棧板
        </div>
         <div class="title" v-if="$store.state.pillet_add_fix.id >0">
            修改棧板
        </div>
        <div class="context">
            <p class="context_chinese">寬</p>
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" type="text" v-model="$store.state.pillet_add_fix.width" maxlength="4">
            <p class="context_chinese">長</p>
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');"  type="text"  v-model="$store.state.pillet_add_fix.length" maxlength="4">
            <p class="context_chinese">高</p>
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" type="text" v-model="$store.state.pillet_add_fix.height" maxlength="4">
            <p class="context_english">(mm)</p>
        </div>
        <div class="btn_block">
            <div class="btn btn_enter" @click="add_pillet"  v-if="$store.state.pillet_add_fix.id <=0">確認</div>
            <div class="btn btn_enter" @click="fix_pillet"  v-if="$store.state.pillet_add_fix.id >0">修改</div>
            <div class="btn btn_cancel" @click="hide_addpanel">取消</div>
        </div>
    </div>
   </div>
</template>
<script src="./panel_addpallet.js" />
<style lang="css" src="@/assets/css/panel_addpallet.css" scoped />