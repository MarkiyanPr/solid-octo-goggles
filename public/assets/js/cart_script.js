// «Липкий» код
$(function(){
    $.fn.followTo = function (pos) {
      var $this = this,
          $window = $(window);
  
      $window.scroll(function (e) {
          if ($window.scrollTop() > pos) {
              $this.css({
                  position: 'fixed',
                  bottom: 0
              });
          } else {
              $this.css({
                  position: 'absolute',
                  top: 900
              });
          }
      });
  };
  
  $('.cart-summary-box').followTo(140);
  });