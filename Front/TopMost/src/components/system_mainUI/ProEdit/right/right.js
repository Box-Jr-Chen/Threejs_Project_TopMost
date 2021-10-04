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
                self.$store.state.threejs.Threejs_Area.WaitAreaBorders(self.$store.state.threejs.WH_FrameLess.line_GROUP[index].borders);
            },
      }
}