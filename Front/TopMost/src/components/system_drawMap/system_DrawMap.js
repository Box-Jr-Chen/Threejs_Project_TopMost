import MoveController from '@/components/system_drawMap/MoveController/MoveController.vue'
export default {
    name: 'system_DrawMap',
     components:{
        MoveController
   },
   computed:{

   },
   data() {
       return {
            addpoint:true,

       }
   },
   mounted() {
        var self= this;
        //測試
        setTimeout(()=>
         {
            self.$store.state.threejs.Active_PointMove();
         },2000);


   },
   methods: {

    // mousemove(event){
    //     if(this.mouse_x)
    //     {
    //         this.controls.enabled = false;
    //         var move =0;
    //         if(this.mouse_x_offsetX !=0)
    //         {
    //             move = event.offsetX - this.mouse_x_offsetX ;
    //            // console.log(move);
    //            move = this.normalize(move,0,10) *8;
    //            // console.log(move);
    //         }            

    //         this.mouse_x_offsetX = event.offsetX;

    //         this.spline_Object_select.pos.x = this.spline_Object_select.pos.x + move;
    //         var  ScreenToWorldPos =  this.ScreenToWorldPos(this.spline_Object_select.pos);
    //         this.spline_Object_select.main.position.x = ScreenToWorldPos.x;
    //         this.spline_Object_select.main.position.y = ScreenToWorldPos.y;
    //     }

    //     if(this.mouse_y)
    //     {
    //         this.controls.enabled = false;
    //         var move =0;
    //         if(this.mouse_x_offsetY !=0)
    //         {
    //             move = event.offsetY - this.mouse_x_offsetY ;
    //            move = this.normalize(move,0,10) *8;
    //         }            

    //         this.mouse_x_offsetY = event.offsetY;
    //         console.log(move);
    //         this.spline_Object_select.pos.y = this.spline_Object_select.pos.y + move;
    //         var  ScreenToWorldPos =  this.ScreenToWorldPos(this.spline_Object_select.pos);
    //         this.spline_Object_select.main.position.x = ScreenToWorldPos.x;
    //         this.spline_Object_select.main.position.z = ScreenToWorldPos.z;
    //     }
    // },
    // mouseleave(){
    //     this.mouse_x =false;
    //     this.mouse_y =false;
    //     this.controls.enabled = true;
    // },
   },
 }