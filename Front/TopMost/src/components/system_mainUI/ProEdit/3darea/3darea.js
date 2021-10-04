

export default {
    name: 'setting_pallet',
    components: {

      },
      computed:{
            area_3d_full_rect:function (){

                    if(this.$store.state.contain_rightpanel !=null)
                    {
                        var x = this.$store.state.width_main;
                        var y = this.$store.state.height_main;
                        return "width:"+x+"px; height:"+y+"px;";
                    }

                return "left:0px; top:0px;";
            }
      },
      data(){
          return{
            afd_rightpanel:null,
          }
      },
      mounted(){
            var self =this;
            const container = document.getElementById('container_area');
            self.$store.state.threejs.Threejs_Area.init(container,()=>{
           // console.log("area init !!!!!!!!");
            self.$store.state.threejs.Threejs_Area.CreateAreaIns();

            self.$store.state.threejs.UnActive_controls();
            });
  
      },
      methods:{
        cancel_3d_area()
        {
                this.$store.state.is_3d_area = false;
                this.$store.state.threejs.Active_controls();
        }
  
      }
}