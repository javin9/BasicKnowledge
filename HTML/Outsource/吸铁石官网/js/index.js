  $(function () {
           $(".select-span").click(function () {
               /* body... */
               $(this).find('.select-list').toggleClass('hide');
           });
           $(".user-info").click(function () {
               $(".user-tools").toggleClass('hide');
           });
        });