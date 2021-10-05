

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
            self.$store.state.threejs.Threejs_Area.CreateAreaIns();
            if(self.$store.state.threejs.Threejs_Area.id_area !==0)
            {
              var result = self.$store.state.threejs.WH_FrameLess.line_project_exit.filter(e =>{
                    if(e.area ===self.$store.state.threejs.Threejs_Area.id_area)
                    {
                      return e ;
                    }
              });

              //沒辦法透過在物件上做改變  轉換介面改變
              console.log(self.$store.state.area_pro_data.length);
              console.log(self.$store.state.pallet_exit.length);

              self.$store.state.area_pro_data = self.$store.state.pallet_exit.filter(e =>{
                if(e.id_areas ===self.$store.state.threejs.Threejs_Area.id_area)
                {
                  e.select_delete = false;
                  return e;
                }
              })

              self.$store.state.threejs.Threejs_Area.GetProject(result);
            }
            self.$store.state.threejs.UnActive_controls();
            });
  
      },
      methods:{
        cancel_3d_area()
        {
            this.$store.state.threejs.Threejs_Area.DeleteProject();
            this.$store.state.threejs.WH_FrameLess.ResetProject_exit(this.$store.state.threejs.Threejs_Area.id_area,this.$store.state.threejs.Threejs_Area.pro_ins);

            this.$store.state.is_3d_area = false;
            this.$store.state.threejs.Active_controls();
        },
        select_ToDelete:function (index){
          return this.$store.state.area_pro_data[index].select_delete ;
        },
        select_deleteFun(index)
        {
          this.$store.commit("selectPro_delete", index);
        },
        deletePallet()
        {

          var self = this;
          var pallet =[];
          self.$store.state.area_pro_data.forEach(element => {
                if(element.select_delete==true)
                {
                  var d={
                        'pallet':element.id
                    };
                    pallet.push(d);
                }
          });

          var  PalletData ={
            'pallet':JSON.stringify(pallet)
          }; 
          

          //將棧板位置跟新棧板資料庫
          self.$store.dispatch('A_RemovePallet_muliti',PalletData).then(response =>{
            if(response.result ==='update success')
              {
               // console.log("remove success");

                //刪除成功將資料刪除 in area_pro_data
                self.$store.state.area_pro_data= self.$store.state.area_pro_data.filter(e=>{
                  var check = false;

                  for(var i=0;i<pallet.length;i++)
                  {
                    if(pallet[i].pallet===e.id)
                    {
                      check = true;
                      break;
                    }
                  }
                  if(!check)
                      return e;
                });
              //刪除成功將資料刪除 in pallet_exit
                self.$store.state.pallet_exit= self.$store.state.pallet_exit.filter(e=>{
                  var check = false;

                  for(var i=0;i<pallet.length;i++)
                  {
                    if(pallet[i].pallet===e.id)
                    {
                      check = true;
                      break;
                    }
                  }
                  if(!check)
                      return e;
                });


                //刪除模型
                self.$store.state.threejs.Threejs_Area.pro_ins = self.$store.state.threejs.Threejs_Area.pro_ins.filter(e=>{
                  var check = false;

                  for(var i=0;i<pallet.length;i++)
                  {
                    if(pallet[i].pallet===e.name)
                    {
                      check = true;
                      break;
                    }
                  }

                  if(!check)
                    return e;
                  else
                    self.$store.state.threejs.Threejs_Area.scene.remove(e);

                });
              }
              else
                console.log(response);
          });
        }
      }
}