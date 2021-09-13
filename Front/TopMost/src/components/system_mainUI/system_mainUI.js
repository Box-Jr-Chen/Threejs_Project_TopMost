import setting_pallet from '@/components/system_mainUI/setting_pallet/setting_pallet.vue'
import setting_project from '@/components/system_mainUI/setting_project/setting_project.vue'

import {DxfParser} from'dxf-parser';

export default {
    name: 'system_mainUI',
    components: {
        setting_pallet,
        setting_project
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
        select_panel(index){
            this.$store.state.panel_select = index;
        },
        onFileChange(e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length)
              return;

            var reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = function(e) {
              var fileText = e.target.result;
              var parser =new DxfParser;
              var dxf = null;
              try {
                  console.log(fileText);

                  dxf = parser.parseSync(fileText);

                  console.log(dxf);
              } catch(err) {
                  return console.error(err.stack);
              }
              console.log('Success!');
              //outputElement.innerHTML = JSON.stringify(dxf, null, 4);
          };
        },
      }
}