<template>
<div class="BG" :style="{width:this.$store.state.width_main+'px',height:this.$store.state.height_main+'px'}">
    <div  id="panel_delete">
        <div class="title">
           刪除棧板
        </div>
        <div class="btn_block">
            <div class="btn btn_enter" @click="delete_pillet">刪除</div>
            <div class="btn btn_cancel" @click="hide_deletepanel">取消</div>
        </div>
    </div>
   </div>
</template>
<script src="./panel_deletepallet.js" />
<style lang="css" src="@/assets/css/panel_delete.css" scoped />