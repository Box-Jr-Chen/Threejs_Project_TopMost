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
                if( this.$store.state.show_afd) return;
                this.$store.state.show_afd = true;
                this.$store.state.afd_isAdd=true;
                this.$store.commit('Show_Panel_adfArea');
                this.$store.commit('Create_Ins_AddArea');
            },
            show_fixpanel(index,item){
                //  console.log(item);
                this.$store.state.addIns_pos.index = index;
                this.$store.state.addIns_pos.left.x = item.borders[0][0];
                this.$store.state.addIns_pos.left.z = item.borders[0][1];

                this.$store.state.addIns_pos.right.x = item.borders[2][0];
                this.$store.state.addIns_pos.right.z = item.borders[2][1];
                this.$store.state.show_afd = true;
                this.$store.state.afd_isAdd=false;

                
                this.$store.state.threejs.ModifyArea_01(
                this.$store.state.addIns_pos.left.x,
               -this.$store.state.addIns_pos.left.z,
                this.$store.state.addIns_pos.right.x,
               -this.$store.state.addIns_pos.right.z);
                this.$store.commit('Show_Panel_adfArea');
            },
            show_deletepanel(index){
                this.$store.commit('Show_Panel_deleteArea');
                this.$store.state.areas_delete.id =index;
            },
            sortProject_recommand()
            {
                  var self= this;

                  //停止計時器
                  clearInterval(self.$store.state.t_getpallet); 

                  self.$store.state.isstart_sort = 1;
                  self.$store.dispatch('A_Postsorting_project').then(response =>{
                      if(response.result ===undefined)
                      {
                        self.$store.state.isstart_sort = 0;
                        return;
                      }
  
                      if(response.result==="success")
                      {
                          console.log(response);
                           self.$store.state.pallet_sort_finish = response.cause;

                           //生成演算法出來的各棧板
                           self.$store.state.pallet_sort_finish.forEach(function(project,index){

                                if(project.pos.length >0)
                                {
                                    var init_pos = JSON.parse(project.init);
                                    self.$store.state.threejs.WH_FrameLess.CreateProject(index+1,project.pallet,init_pos,project.pos,'sort',project.area,project.layout);
                                } 
          
                           });

                           self.$store.state.is_custom_enable = true;
                           self.$store.state.isstart_sort = 2;
                      }
                      else if(response.result==="error")
                      {
                        self.$store.state.isstart_sort = 0;
                        self.$store.state.sort_err =response.cause;

                        if( self.$store.state.setTime_sort_err !==null)
                        {
                            clearTimeout(self.$store.state.setTime_sort_err);
                        }
                        self.$store.state.setTime_sort_err = setTimeout(()=>{
                            self.$store.state.sort_err ='';
                        },1000);

                        return;
                      }
                  });
            },
            type_sort:function(index,item)
            {
                var num = (index+1);
                if(num <10)
                    num = '0'+num;

                return num+'棧板' + '  種類:'+item.id_pallet+' 產品:'+item.id_project;
            },
            result_sort:function(index)
            {
                var  sort = this.$store.state.pallet_sort_finish;

               if(sort.length <=0)
               {
                   return "";
               }

               if( index >= sort.length )
               {
                   return "";
               }

               if(sort[index].pos.length <=0)
               {
                   return "(排列失敗)";
               }

                return '(區域 :'+sort[index].area +'高度 :'+ (parseInt(sort[index].layout)+1)+")";
            },
             //點擊開始演算法
            btn_algs()
            {
              var self = this;
              if(!self.$store.state.isstart_sort)
              {     
                  self.$store.state.isstart_sort = true;
      
                  self.sortProject_recommand();
                  //排列
              }
            },
            //點擊清除演算法
            btn_clear_algs()
            {
               // var self =this;
                //console.log(self.$store.state.pallet_sort_finish);
                this.$store.commit("sort_delete");
            },
            //托盤已放置
            btn_pallet_HasSet()
            {
                var self =this;
                self.$store.state.isstart_sort = 3;
                if(self.$store.state.pallet_sort_finish.length >0)
                {

                    var updatePallet =  self.$store.state.pallet_sort_finish.filter(e =>{
                        if(e !=null && e.pos !=null)
                        {
                            if(e.pos.length >0)
                                     return e;
                        }

                    });
                    
                    updatePallet =  updatePallet.map(e =>{
                            delete e['init'];
                            e.id_areas = e['area'];

                            var datatype= e['type'].split('-');

                            e.id_pallet =parseInt(datatype[0]);
                            e.id_project =parseInt(datatype[1]);

                            delete e['type'];
                            e['pos']=JSON.stringify(e['pos']);
                            return e;
                    });

                    //如果找不到可以更新的
                    if(updatePallet.length <=0)
                    {
                        self.$store.state.pallet_needsort =[];
                        self.$store.state.pallet_sort_finish=[];
                        updatePallet =null;
                        PalletData =null;
                        this.$store.state.Manual_index   = -1;
                        this.$store.state.isPalletManual = false;
                        //重新找需要排列的棧板
                        self.$store.dispatch('A_GetPallet_needSort').then(response =>{
                            if(response.result !=='error')
                             {
                               // console.log(response);

                                 self.$store.state.pallet_needsort = response;
                                 self.$store.commit('WaitToPallet_needSort');
                                 
                                if(self.$store.state.pallet_needsort.length >0)
                                {
                                    self.$store.state.isstart_sort = 0;
                                }
                                else
                                    self.$store.state.isstart_sort = 3;
                             }
                         });
                        return;
                    }

                    var  PalletData ={
                        'pallet':JSON.stringify(updatePallet)
                    }; 

                    //將棧板位置跟新棧板資料庫
                    self.$store.dispatch('A_UpdatePallet_muliti',PalletData).then(response =>{
                        if(response.result ==='update success')
                         {
                            self.$store.state.pallet_needsort =[];

                            self.$store.state.pallet_sort_finish=[];
                            
                            self.$store.state.pallet_exit.push(...updatePallet);
                            self.$store.state.threejs.WH_FrameLess.PutSortToExit();
                            updatePallet =null;
                            PalletData =null;
                            this.$store.state.Manual_index   = -1;
                            this.$store.state.isPalletManual = false;

                            //等待一秒，以防錯誤
                            setTimeout(()=>{
                                    //重新找需要排列的棧板
                                    self.$store.dispatch('A_GetPallet_needSort').then(response =>{
                                        if(response.result !=='error')
                                        {

                                            self.$store.state.pallet_needsort = response;
                                            self.$store.commit('WaitToPallet_needSort');
                                            
                                            if(self.$store.state.pallet_needsort.length >0)
                                            {
                                                self.$store.state.isstart_sort = 0;
                                            }
                                            else
                                                self.$store.state.isstart_sort = 3;
                                        }
                                    });
                            },200);

       
                         }
                     });

                }
            },
             //開啟手動模式
            btn_manual_set(index)
            {
               // console.log(index);
                this.$store.state.Manual_index   = index;
                this.$store.state.isPalletManual = true;

                //新增參數 高度原始
                this.$store.state.pallet_sort_finish.forEach(e=>{
                    e.layout_init =  e.layout ;
                });

                this.$store.state.threejs.WH_FrameLess.Mat_Active_SelectSortPallet(index);
              
                this.$store.state.threejs.WH_FrameLess.change_Material(index,this.$store.state.pallet_sort_finish)

                document.addEventListener( 'mousedown', this.onDocumentMouseDown, false );
            },
            //取消手動
            btn_manual_cancel()
            {
                this.$store.state.Manual_index   = -1;
                this.$store.state.isPalletManual = false;

                this.$store.state.threejs.WH_FrameLess.Mat_Enactive_SelectSortPallet();
               //移除參數 高度原始
               this.$store.state.pallet_sort_finish.forEach(e=>{
                  delete e.layout_init ;
                });


                document.removeEventListener("mousedown", this.onDocumentMouseDown, false); 
            },
             //確認手定模式按鈕是否顯示
            active_manual(index)
            {

                return this.$store.state.is_custom_enable 
                        && !this.$store.state.isPalletManual 
                        && this.$store.state.pallet_sort_finish.length         >0
                        && this.$store.state.pallet_sort_finish[index].pos !==null
                        && this.$store.state.pallet_sort_finish[index].pos.length >0
            },

            onDocumentMouseDown(event){
                var self =this;
                self.$store.state.threejs.WH_FrameLess.add_clickEvent(event,
                    self.$store.state.Manual_index,
                    self.$store.state.pallet_sort_finish,
                    self.$store.state.pallet_exit,
                    (e)=>{
                            console.log(e);

                            if( self.$store.state.setTime_manual_err !==null)
                                 clearTimeout( self.$store.state.setTime_manual_err);

                            self.$store.state.Manual_error = e;

                            self.$store.state.setTime_manual_err = setTimeout(()=>{
                                self.$store.state.Manual_error ='';
                            },1000);
                    });
            }

      }
}