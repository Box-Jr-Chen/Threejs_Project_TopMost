export default {
    name: 'MoveController',
     components:{
   },
   computed:{
       axis_center: function() {
            return "top:50%;"+"left:50%;";
       }
   },
   data() {
       return {
            enter_X:false,
            enter_Y:false,
       }
   },
   mounted() {


   },
   methods: {
    mouseDown_x()
    {
        console.log("xxxxxx");
    },
    mouseDown_y()
    {
        console.log("yyyyy");
    },
    mouseenter_x()
    {
        this.enter_X = true;
    },
    mouseenter_y()
    {
        this.enter_Y = true;
    },
    mouseleave_x()
    {
        this.enter_X = false;
    },
    mouseleave_y()
    {
        this.enter_Y = false;
    }
   },
 }