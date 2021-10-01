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
            show_3darea(index,item){
                index
                item
                var self =this;
                self.$store.state.is_3d_area = true;
            },
      }
}