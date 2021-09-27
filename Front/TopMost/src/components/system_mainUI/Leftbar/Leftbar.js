
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
          
            if(this.$store.state.area_show_afd == true)
                  return;

            this.$store.state.panel_select = index;
        },

      }
}