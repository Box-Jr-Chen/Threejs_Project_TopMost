export default {
    name: 'set_afd_area',
    components: {
 
    },
    computed:{        
        getAdd_Ins:function(){
            return  this.$store.state.threejs.areas_ins_add[0];
        },
    },

    data(){
          return{
              add:true,
              input_lx:0
          }
    },
    mounted(){
        //   var self= this;

    },
    methods:{
        hide_addpanel:function(){
            this.$store.state.area_show_afd = false;
            this.$store.state.show_afd = false;
            this.$store.state.threejs.CreateArea_Delete_01();
        },
        add_project:function(){
            var self =this;

            var borders ='['+
            '['+self.$store.state.addIns_pos.left.x+','+self.$store.state.addIns_pos.left.z  +'],'+
            '['+self.$store.state.addIns_pos.left.x+','+self.$store.state.addIns_pos.right.z +'],'+
            '['+self.$store.state.addIns_pos.right.x+','+self.$store.state.addIns_pos.right.z+'],'+
            '['+self.$store.state.addIns_pos.right.x+','+self.$store.state.addIns_pos.left.z +']'+']';

            var data={
                'id_warehouse' : self.$store.state.factory_id,
                'title' : "",
                'borders' : borders
            }

            self.$store.dispatch('A_PostArea',data).then(response =>{
                  if(response.result !=='error')
                  {
                    self.hide_addpanel();
                    self.$store.commit('LoadAreas');
                  }
                
              });
        },
        fix_project:function(){

        },
        delete_project:function(){

        },
        changeinput:function(index,index_2,index_set){
            var result = 0;
            
            if(index_set ==3)  //L_X
            {
                result = this.$store.state.addIns_pos.left.x;

                if(result >= this.getAdd_Ins.geometry.attributes.position.array[15])
                {
                    result = this.getAdd_Ins.geometry.attributes.position.array[15] -2;
                }

                this.$store.state.addIns_pos.left.x = result;
            }
            else if(index_set ==5) //L_Z
            {
                result = -this.$store.state.addIns_pos.left.z;
                if(result >= this.getAdd_Ins.geometry.attributes.position.array[17])
                {
                    result = this.getAdd_Ins.geometry.attributes.position.array[17] -2;
                }

                this.$store.state.addIns_pos.left.z = -result;

            }
            else if(index_set ==15)//R_X
            {
                result = this.$store.state.addIns_pos.right.x;

                if(result <= this.getAdd_Ins.geometry.attributes.position.array[3])
                {
                    result = this.getAdd_Ins.geometry.attributes.position.array[3] +2;
                }

                this.$store.state.addIns_pos.right.x = result;
            }
            else if(index_set ==17)//R_Z
            {
                result = -this.$store.state.addIns_pos.right.z;
                if(result <= this.getAdd_Ins.geometry.attributes.position.array[5])
                {
                    result = this.getAdd_Ins.geometry.attributes.position.array[5] +2;
                }

                this.$store.state.addIns_pos.right.z = -result;
            }

            this.getAdd_Ins.geometry.attributes.position.array[index_set] =  result;
            this.getAdd_Ins.geometry.attributes.position.array[index]     =  result;
            this.getAdd_Ins.geometry.attributes.position.array[index_2]   =  result;
            this.getAdd_Ins.geometry.attributes.position.needsUpdate      =  true;


        },
 

    }
}


// oninput="value=value.replace(/^\-?\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')" 