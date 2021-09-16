export default {
    name: 'rightside',
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
        show_addpanel(){
            this.$store.commit('Show_Panel_addProject');


            this.$store.state.project_add_fix.id =0;
            this.$store.state.project_add_fix.width =0;
            this.$store.state.project_add_fix.length =0;
            this.$store.state.project_add_fix.height =0;
            this.$store.state.project_error='';
        },
        show_fixpanel(item){
            this.$store.commit('Show_Panel_addProject');

            this.$store.state.project_add_fix.id =item.id;
            this.$store.state.project_add_fix.width =item.width;
            this.$store.state.project_add_fix.length =item.length;
            this.$store.state.project_add_fix.height =item.height;
        },
        show_deletepanel(index){
            this.$store.commit('Show_Panel_deleteProject');
            this.$store.state.project_delete.id =index;

        },
      }
}