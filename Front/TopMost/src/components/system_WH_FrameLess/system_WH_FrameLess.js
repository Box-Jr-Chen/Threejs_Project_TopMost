export default {
    name: 'system_WH_FrameLess',
     components:{
   },
   computed:{

   },
   data() {
       return {
       }
   },
   mounted() {
        var self= this;

        //等待ThreeJs初始成功
        var waitSysInit =  setInterval(() => {
            if(self.$store.state.threejs.sysInit==true)
            {
                console.log(self.$store.state.Areas_borders);

                self.$store.state.threejs.WH_FrameLess.createMap(
                    self.$store.state.WH_borders,
                    self.$store.state.Areas_borders
                );
                clearInterval(waitSysInit);
            }
        }, 500);


   },
   methods: {


   },
 }