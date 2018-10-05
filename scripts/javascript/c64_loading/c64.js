const C64 = {};


jQuery(() => {

  const $cursor = jQuery("#cursor");
  const $foreground = jQuery("#foreground");

  C64.$foreground = $foreground;
  C64.$tv = jQuery("#tv");

  C64.palette = [
    "#000000", "#FFFFFF", "#68372B", "#70A4B2",
    "#6F3D86", "#588D43", "#352879", "#B8C76F",
    "#6F4F25", "#433900", "#9A6759", "#444444",
    "#6C6C6C", "#9AD284", "#6C5EB5", "#959595"
  ];

  let cursorVisibleCallback = null;

  let cursor = {x: 0, y: 6};

  const cursorBlinkFn = function () {
    if ($cursor.hasClass("hide")) {
      $cursor.removeClass("hide");
    } else {
      $cursor.addClass("hide");
    }
  };

  C64.isCursorHidden = function () {
    return $cursor.hasClass("hide");
  };

  C64.showCursor = function () {
    $cursor.removeClass("hide");

    cursorVisibleCallback = setInterval(cursorBlinkFn, 300);
  };

  C64.hideCursor = function () {
    $cursor.addClass("hide");

    if (cursorVisibleCallback != null) {
      clearInterval(cursorVisibleCallback);
    }

    cursorVisibleCallback = null;
  };

  C64.outputToScreen = function (text) {
    for (let i = 0; i < text.length; ++i) {
      const c = text.charAt(i);
      $cursor.before(c);
      ++cursor.x;
      if (cursor.x > 39 || c === '\n') {
        cursor.x = 0;
        ++cursor.y;

        if (c !== '\n') {
          $cursor.before("\n");
        }

        if (cursor.y > 24) {
          cursor.y = 24;

        }
      }
    }
  };

  C64.stepTypes = {};


  const programSteps = [];

  {
    let initialised = false;
    let data, stepType, curStep;

    data = {callbackSpeed: 10};
    stepType = {};


    const programFn = function () {

      if (programSteps.length > 0) {

        let getNextStep = false;

        if (!initialised) {
          curStep = programSteps[0];

          stepType = C64.stepTypes[curStep['command']];

          data = jQuery.extend({callbackSpeed: 10}, curStep);

          if (data.callbackSpeed == null) {
            data.callbackSpeed = 10;
          }

          if (stepType.init.call(stepType, data)) {
            initialised = true;
          } else {
            getNextStep = true;
          }

        } else {

          if (stepType.run != null) {
            stepType.run.call(stepType, data);
          }


          if (stepType.isFinished != null && stepType.isFinished.call(stepType, data)) {
            getNextStep = true;
          }

        }

        if (getNextStep) {
          programSteps.shift();
          initialised = false;
        }


        window.setTimeout(programFn, data.callbackSpeed);

      } else {
        window.setTimeout(programFn, 10);
      }

    };
    window.setTimeout(programFn, 10);
  }

  C64.runProgram = function (program) {
    for (let i = 0; i < program.length; ++i) {
      programSteps.push(program[i]);
    }
  };


});