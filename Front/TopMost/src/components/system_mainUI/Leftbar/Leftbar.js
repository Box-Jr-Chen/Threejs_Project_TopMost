
export default {
    name: 'system_mainUI',
    components: {
      },
      computed:{

      },
      data(){
          return{

          }
      },
      mounted(){
  
      },
      methods:{
        select_panel(index){
          
            if(this.$store.state.area_show_afd === true)  //顯示區域新增或編輯模式
                  return;

            if(this.$store.state.isstart_sort === 2)  //顯示區域新增或編輯模式
                  return;


            this.$store.state.panel_select = index;




        },

      }
}