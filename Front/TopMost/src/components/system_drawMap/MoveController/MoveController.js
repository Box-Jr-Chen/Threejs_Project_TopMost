export default {
    name: 'MoveController',
     components:{
   },
   computed:{
       axis_center: function() {

          if(this.$store.state.threejs.mapDesign.spline_Object_select.main ==null)
            return "top:50%;"+"left:50%;";
          else
          {
              var offset_x = ((this.$store.state.threejs.width_inner -this.$store.state.threejs.width))/2;
              var offset_y = ((this.$store.state.threejs.height_inner -this.$store.state.threejs.height))+5;
              var x = offset_x + this.$store.state.threejs.mapDesign.spline_Object_select.pos_screen.x;
              var y = offset_y + this.$store.state.threejs.mapDesign.spline_Object_select.pos_screen.y;


              return "top:"+y+"px;"+"left:"+x+"px;";
          }
       }
   },
   data() {
       return {
            // enter_X:false,
            // enter_Y:false,
       }
   },
   mounted() {


   },
   methods: {
    mouseDown_x(event)
    {
        event
        this.$store.state.threejs.mapDesign.mouseMove_x =true;
        // console.log("xxxxxx");
    },
    mouseUp_x(event)
    {
        event

    },
    mouseDown_y(event)
    {
        event
        this.$store.state.threejs.mapDesign.mouseMove_y =true;
    },
    mouseUp_y(event)
    {
        event

    },
    mouseenter_x()
    {
        if(this.$store.state.threejs.mapDesign.mouseMove_y==false)
            this.$store.state.threejs.mapDesign.mouseEnter_x = true;
    },
    mouseenter_y()
    {
        if(this.$store.state.threejs.mapDesign.mouseMove_x==false)
            this.$store.state.threejs.mapDesign.mouseEnter_y = true;
    },
    mouseleave_x()
    {
        if(this.$store.state.threejs.mapDesign.mouseMove_x==false)
                this.$store.state.threejs.mapDesign.mouseEnter_x = false;
    },
    mouseleave_y()
    {
        if(this.$store.state.threejs.mapDesign.mouseMove_y==false)
                this.$store.state.threejs.mapDesign.mouseEnter_y = false;
    }
   },
 }