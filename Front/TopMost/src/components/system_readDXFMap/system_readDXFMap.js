
export default {
    name: 'system_readDXFMap',
    components: {
  
      },
      computed:{

      },
      data(){
          return{
            isloading: false,
          }
      },
      mounted(){
            this.getFactories_names();
      },
      methods:{
        getFactories_names(){
            var self = this;
            self.$store.dispatch('A_GetFactories').then(response =>{
               if(response.result !=='error')
                {
                    self.$store.state.factories = response.meg;
                }
            });
        },  
        selectIndex(index){
            this.$store.state.factory_select = index;
        },
        Select_Map(){
            var self = this;

            if(self.$store.state.factories.length <=0)
                    return;
            if(self.$store.state.threejs.sysInit==false) return;

            var index =  this.$store.state.factory_select ;
            self.$store.dispatch('A_GetJson', self.$store.state.factories[index]).then(response =>{
                if(response.result !=='error')
                    {
                        console.log(response);

                        if(response.meg ==='no Json')
                                return;
                        

                        self.$store.state.factory_id = response.index;
                        var dxf_json = JSON.parse(response.meg);

                        self.$store.state.threejs.DXFReader(dxf_json);

                        self.isloading = true;

                        setTimeout(()=>{
                            self.isloading = false;
                            self.$store.state.init_loadFactory =true;
                        },1000);

                    }
                });

        }
      }
}