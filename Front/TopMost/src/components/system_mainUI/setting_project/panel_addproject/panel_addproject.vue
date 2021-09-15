<template>
    <div  id="panel_addpallet">
        <div class="title">
            新增棧板
        </div>
        <div class="context">
            <p class="context_chinese">長</p>
            
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');"  type="text"  v-model="height" maxlength="3">
            <p  class="context_english">CM</p>
            <p  class="context_english">X</p>
            <p class="context_chinese">寬</p>
            <input  oninput="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" onchange="value=value.replace(/\D/g,''); value=value.replace(/^0+/,'');" type="text" v-model="width" maxlength="3">
            <p class="context_english">CM</p>
        </div>
        <div class="btn_block">
            <div class="btn btn_enter">確認</div>
            <div class="btn btn_cancel" @click="hide_addpanel">取消</div>
        </div>
    </div>
</template>
<script src="./panel_addproject.js" />
<style lang="css" src="@/assets/css/panel_addproject.css" scoped />