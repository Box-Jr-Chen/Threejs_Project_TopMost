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
                this.$store.commit('Show_Panel_addPallet');
            }
      }
}