import './hxm.scss';
window.addEventListener('message',function(e){
   // console.log(e);
   if(e.data =="ok"){
       window.location.href=resultUrl;
   }
},false);
