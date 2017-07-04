$(function () { // wait for document ready
  // init
  var controller = new ScrollMagic.Controller();

  // define movement of panels
  var wipeAnimation = new TimelineMax()
    // animate to second panel
    .to("#slideContainer", 0.5, {z: -150})		// move back in 3D space
    .to("#slideContainer", 1,   {x: "-25%"})	// move in to first panel
    .to("#slideContainer", 0.5, {z: 0})				// move back to origin in 3D space
    // animate to third panel
    .to("#slideContainer", 0.5, {z: -150, delay: 2})
    .to("#slideContainer", 1,   {x: "-50%"})
    .to("#slideContainer", 0.5, {z: 0})
    // animate to forth panel
    .to("#slideContainer", 0.5, {z: -150, delay: 2})
    .to("#slideContainer", 1,   {x: "-75%"})
    .to("#slideContainer", 0.5, {z: 0});

  // create scene to pin and link animation
  new ScrollMagic.Scene({
      triggerElement: "#pinContainer",
      triggerHook: "onLeave",
      duration: "1000%"
    })
    .setPin("#pinContainer")
    .setTween(wipeAnimation)
    .addTo(controller);
});
// 
// $(function() {
//     // Init Controller
//     var scrollMagicController = new ScrollMagic.Controller();

    // var tween = TweenMax.to('#animation', 1.5, {
    //   backgroundColor: 'rgb(255, 39, 46)',
    //   scale: 6,
    //   rotation: 360
    // });
    //
    // var scene = new ScrollScene({
    // triggerElement: '#scene',
    // offset: 10 /* offset the trigger 150px below #scene's top */
    // })
    // .setTween(tween)
    // .addTo(scrollMagicController);

    // Duration ignored / replaced by scene duration now
//     var tween = TweenMax.to('#logo_ceuvel', 0.25, {
//         transform: 'translateY(1750px) scale(2.0)',
//     });
//
//     var scene = new ScrollMagic.Scene({
//         triggerElement: '#scene',
//         duration: 4000 /* How many pixels to scroll / animate */
//     })
//     .setTween(tween)
//     .addTo(scrollMagicController);
//
//
// });
//
