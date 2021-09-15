
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
            this.$store.state.panel_select = index;
        },

      }
}