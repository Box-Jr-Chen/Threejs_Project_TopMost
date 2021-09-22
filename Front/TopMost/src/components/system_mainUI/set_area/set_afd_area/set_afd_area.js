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
              zzz:0
          }
    },
    mounted(){
        //   var self= this;

    },
    methods:{
        hide_addpanel:function(){
            this.$store.state.area_show_afd = false;
            this.$store.state.show_afd = false;
        },
        add_project:function(){

        },
        fix_project:function(){

        },
        delete_project:function(){

        },
        oninput:function(value){
                console.log(value);
        },
        changepos:function(index,value){
            console.log(index);
            console.log(value);
            this.$store.state.threejs.areas_ins_add[0].geometry.attributes.position.array[0] =value;
            this.$store.state.threejs.areas_ins_add[0].geometry.attributes.position.array[1] =value;
            this.$store.state.threejs.areas_ins_add[0].geometry.attributes.position.array[2] =value;
            console.log(this.$store.state.threejs.areas_ins_add[0]);
        },
    }
}