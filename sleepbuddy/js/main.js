$(document).ready(function() {
    // Global Varibles
    var arrAnchors = []; //Stores anchor strings for FullPage.js nav
    var sectionCount = $('.section').length; // Int of how many sections
    var simulation_bg_audio = $('#ambience-sound').get(0);

    console.log("JQuery Version: " + $.fn.jquery );

    //Nav Generator
    function GenerateNav() {
      for (i=0; i<sectionCount; i++) {
        var newElement = $('<li data-menuanchor="Section-' + (i+1) + '"><button type="button" value="' + (i+1) + '"></button></li>')
        $('nav ul').append(newElement);
        arrAnchors.push("Section-" + (i+1)) //Add to string array
        var navBtnColor = $('.section:nth-of-type(' + (i+1) + ')').attr('data-navcolour'); // get data attribute value
        if (navBtnColor) {
          newElement.css('border-color', navBtnColor) // add border color to the parent.
        }
        else {
          console.log("var navBtnColor undefined");
        }
      };
      $('nav li:first-of-type').addClass('active');
      $('nav ul').flexVerticalCenter(); // Vertically Centers the buttons. CSS Methods were being too much trouble
    }
    GenerateNav();


    // simulation
    var envio_object = $("#environment-svg")
    var svg_light;
    envio_object.load(function() { // Make sure the object has loaded
      envio_object.setSVGStyleLink('../css/main.css'); // apply main css file to svg
      var svg = envio_object.getSVG(); //get the svg tag within the object
      svg_light = svg.find('#light')
    });

    // Toggle button
    $('.toggle-button').click(function() {
        $(this).toggleClass('toggle-button-selected');
        var target = $(this).attr('data-target');
        if (target == "heart") {
            $('#simulation .environment-wrap .overlay-content .heart').toggleClass('stopanimation')
        }
        else if (target == "sound") {
          if (simulation_bg_audio.paused)
            simulation_bg_audio.play();
          else
            simulation_bg_audio.pause();
        }
        else if (target == "light") {
            $('.expandable-content').slideToggle(500, function () {
              svg_light.toggleClass('hidden');
            });
        }
    });

    //Colorpicker

    $('#picker').farbtastic(function callback(color) {
      if (svg_light) {
        svg_light.find('#light g g g stop').css({'stop-color': color})
      }
    });

    // Fullpage JS
    $('#fullpage').fullpage({
        lockAnchors: true,
        autoScrolling: false,
        menu: '#main-nav',
        anchors: arrAnchors,
        slidesNavigation: true,
        controlArrows: false,
        responsiveWidth: 550,
        onLeave: function(index, nextIndex, direction){
        if(index == sectionCount ){
          if (!simulation_bg_audio.paused)
          {
            simulation_bg_audio.pause();
            simulation_bg_audio.currentTime = 0;
            $('.sound-btn div').removeClass('toggle-button-selected')
          }
        }
      }
    });

    // Charts
    // Functions Used within
    var randomScalingFactor = function(min,max) {
      if (min & max) {
        return Math.round(Math.random(min,max));
      }
      else {
        return Math.round(Math.random() * 100);
      }
    };
    var generateColour = function(r, g, b, opacity) {
        return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
    };

    //Configs

    var sleeptimeConfig = {
      type: 'line',
      data: {
        labels: ["9pm", "10pm", "11pm", "12am", "1am", "2am", "3am", "4am", "5am", "6am"],
        datasets: [{
          label: "Level of Sleep",
          borderColor: generateColour(255,255,255,0.7),
          backgroundColor: generateColour(82,192,255,0.3),
          data: [0, 45, 88, randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),randomScalingFactor(),0],
          fill: true,
        }]
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'label'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
            display: true,
            labelString: 'Hour'
          },
          gridLines: {
              color: '#CCCCCC'
          },
          }],
          yAxes: [{
            display: true,
            gridLines: {
                color: '#262626'
            },
            scaleLabel: {
            display: true,
            labelString: 'Sleep Percentage'
            },
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100,
            }
          }]
        }
      }
    };

    var sleeptimeConfigComparison = {
      type: 'line',
      data: {
        labels: ["9pm", "10pm", "11pm", "12am", "1am", "2am", "3am", "4am", "5am", "6am"],
        datasets: [{
          label: "Level of Sleep",
          borderColor: generateColour(255,255,255,0.7),
          backgroundColor: generateColour(82,192,255,0.3),
          data: [0, 45, 88, randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(), randomScalingFactor(),randomScalingFactor(),0],
          fill: true,
          yaxisID: "y-axis-sleep",
        }, {
          label: "Heartbeat",
          borderColor: generateColour(255,87,87,1),
          data: [70, 50, 45, randomScalingFactor(45,50), randomScalingFactor(40,50), randomScalingFactor(40,50), randomScalingFactor(45,60), randomScalingFactor(45,60),randomScalingFactor(40,60),65],
          fill: false,
          yaxisID: "y-axis-heart",
      }]
      },
      options: {
        responsive: true,
        tooltips: {
          mode: 'label'
        },
        scales: {
          xAxes: [{
            scaleLabel: {
            display: true,
            labelString: 'Hour'
          },
          gridLines: {
              color: '#CCCCCC'
          },
          }],
          yAxes: [{
            display: true,
            position: "left",
            id: "y-axis-sleep",
            gridLines: {
                color: '#262626'
            },
            scaleLabel: {
            display: true,
            labelString: 'Sleep Percentage'
            },
            ticks: {
              beginAtZero: true,
              min: 0,
              max: 100,
            }
          }, {
            display: true,
            position: "right",
            id: "y-axis-heart",
            scaleLabel: {
            display: true,
            labelString: 'Heartbeat (BPM)'
            },
            ticks: {
              beginAtZero: false,
              min: 40,
              max: 80,
            }
          }]
        }
      }
    };

    // Draw Charts
    var chart_SleepCycle = new Chart($("#chart_SleepCycle"),sleeptimeConfig);
    var chart_SleepCycleComparison = new Chart($("#chart_SleepCycleComparison"),sleeptimeConfigComparison);

    // Slider Click Events
    $('.sliderbtn img').click(function(){
      var direction = $('.sliderbtn img').attr('data-direction');
      if (direction == "left") {
          $.fn.fullpage.moveSlideLeft();
      }
      else if (direction == "right") {
          $.fn.fullpage.moveSlideRight();
      }
    });


    // Events
    $('nav button').click(function(){
      $.fn.fullpage.moveTo($(this).val());
    });


    // SVG Access
    //Brain
    var brain_object = $("#brain-svg")
    brain_object.load(function() { // Make sure the object has loaded
      brain_object.setSVGStyleLink('../css/main.css'); // apply main css file to svg
      var svg = $("#brain-svg").getSVG(); //get the svg tag within the object
      var sections = ["Cerebellum", "SuprachiasmaticNucleus", "Medulla", "CerebralCortex"];

      // Funcitons to use within the scope
      function setBrainActives(target){
        for (i in sections) {
          var selector = "#"+sections[i]+" g"
          if (svg.find(selector).hasClass('active')) { svg.find(selector).removeClass('active')}
          if (svg.find(selector).hasClass('inactive')) { svg.find(selector).removeClass('inactive') }
          if (sections[i] == target) {
            svg.find(selector).addClass('active');
          }
          else if (sections[i] != target) {
            svg.find(selector).addClass('inactive');
          }
        }
      };

      function UpdateContent(id) {
        var text;
        var heading;
        switch(id) {
          case 'Cerebellum':
            text = 'The role of the cerebellum is to maintain motor control during wakefulness. During sleep, it regulates positions, movements and muscle tone on a subconscious level. It also participates in the production of activity of the eye muscles, especially during REM sleep. The cerebellum doesn’t actually control the sleeping state of the brain. ';
            heading = id;
            break;
          case 'SuprachiasmaticNucleus':
            text = 'The timing of transitions between sleep and wakefulness are also tied closely to the body’s internal biological clock located in the suprachiasmatic nucleus. This tiny structure—made up of approximately 50,000 brain cells—receives light signals directly from the eye, through the optic nerve. Light resets the clock to correspond to the day-night cycle. In turn, the clock regulates the timing of dozens of different internal functions, including temperature, hormone release, and sleep and wakefulness.'
            heading = 'Suprachiasmatic Nucleus';
            break;
          case 'Medulla':
            text = 'The Medulla contains majority of the cells that promote sleep or wakefulness. Several areas in the medulla and hypothalamus promote wakefulness by sending arousal signals to the cerebral cortex, the brain’s largest region.';
            heading = id;
            break;
          case 'CerebralCortex':
            text = 'Several areas in the medulla and hypothalamus promote wakefulness by sending arousal signals to the cerebral cortex, the brain’s largest region. These signals come in the form of chemicals called neurotransmitters. When neurons in the arousal areas are active, the cortex remains activated and we stay awake. The cerebral cortex is the arousal centre of the brain and is mostly responsible for maintaining wakefulness. '
            heading = 'Cerebral Cortex';
            break;
          default:
            text = ''
            heading = ''
        }
        $('#brain .info-container p').text(text);
        $('#brain .info-container h4').text('The ' + heading + '!');
      };

      // Click events
      svg.find("#Cerebellum").click(function(){
        setBrainActives("Cerebellum");
        UpdateContent('Cerebellum');
      });
      svg.find("#SuprachiasmaticNucleus").click(function(){
        setBrainActives("SuprachiasmaticNucleus");
        UpdateContent('SuprachiasmaticNucleus');
      });
      svg.find("#Medulla").click(function(){
        setBrainActives("Medulla");
        UpdateContent('Medulla');
      });
      svg.find("#CerebralCortex").click(function(){
        setBrainActives("CerebralCortex");
        UpdateContent('CerebralCortex');
      });
    });

    //Product Features
    $('.overlay-content .target').each(function(i) { // loop through each object
      $(this).load(function() { // Make sure the object has loaded
        var svg = $(this).getSVG();
        var colour = $(this).attr('data-bgcolour')
        svg.find('g path, g circle').attr('style', 'fill:'+colour+';');
      });
    });

    // Fittext
    $("h1").fitText(1);

    //Misc Verticle Centers
    $('#simulation .bg-phone .overlay-content .tile p').flexVerticalCenter();
    $('#simulation .bg-phone .overlay-content .tile span').flexVerticalCenter();
    $('#interfaces .sliderbtn img').flexVerticalCenter();

    // Tooltips
    $('.tooltip').tooltipster();

    // init wow. Such plugin, very cool, much interface
    new WOW().init();
});
