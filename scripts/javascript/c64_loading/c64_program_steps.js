
jQuery(() => {
  'use strict';
  
  C64.stepTypes['type'] = {
    init: function (data) {
      data.typingBuffer = data.value;
      return true;
    },
    run: function (data) {
      if (data.typingBuffer !== "") {
        const c = data.typingBuffer.charAt(0);
        C64.outputToScreen(c);
      }
      data.callbackSpeed = 100 + 200 * Math.random();

      data.typingBuffer = data.typingBuffer.substring(1);
    },
    isFinished: function (data) {
      return data.typingBuffer === "";
    }
  };

  C64.stepTypes['out'] = {
    init: function (data) {
      C64.outputToScreen(data.value);
      return false;
    } // no run or isFinished needed, init returns false to stop it doing anything else
  };

  C64.stepTypes['print'] = {
    init: function (data) {
      const isCursorHidden = C64.isCursorHidden();

      if (!isCursorHidden) {
        C64.hideCursor();
      }

      C64.outputToScreen(data.value);

      if (!isCursorHidden) {
        C64.showCursor();
      }

      return false;
    } // no run or isFinished needed, init returns false to stop it doing anything else
  };

  C64.stepTypes['wait'] = {
    init: function (data) {
      data.callbackSpeed = data.value;
      return false;
    }
  };

  C64.stepTypes['executeCommand'] = {
    init: function () {
      C64.hideCursor();
      C64.outputToScreen("\n");
      return false;
    }
  };

  C64.stepTypes['screen'] = {
    init: function (data) {
      if (data.value === "off") {
        C64.$foreground.hide();
      } else {
        C64.$foreground.show();
      }
      return false;
    }
  };

  C64.stepTypes['cursor'] = {
    init: function (data) {
      if (data.value === "off") {
        C64.hideCursor();
      } else {
        C64.showCursor();
      }
      return false;
    }
  };

  C64.stepTypes['loading1'] = {

    getBarSize: function (data) {
      return (data.minSize + (Math.random() * data.avgSize)) * 4;
    },

    init: function (data) {

      data.tvHeight = C64.$tv.height();
      data.minSize = 2;
      data.maxSize = 8;
      data.avgSize = (data.minSize + data.maxSize) >> 1;
      data.offsetTop = this.getBarSize(data);
      data.finishTop = data.tvHeight + data.maxSize + data.offsetTop;

      data.numberOfTimes = data.numberOfTimes != null ? data.numberOfTimes : 2;

      data.counter = 0;
      data.color = 0;

      return true;
    },
    run: function (data) {

      var y = 0;


      C64.$tv.find("*").remove();

      while (y < data.finishTop) {

        var $bar = jQuery("<div />");

        var size = this.getBarSize(data);


        $bar.css("width", "100%")
          .css("height", size + "px")
          .css("background-color", C64.palette[data.color])
          .css("padding-top", "-" + data.offsetTop)
        ;

        $bar.appendTo(C64.$tv);

        data.color = data.color ^ 1;
        y += size;

      }

      data.numberOfTimes--;

      data.counter++;

      if (data.counter > 64) {
        data.counter = 0;
        data.color = (data.color + 2) & 15;
      }


    },
    isFinished: function (data) {
      if (data.numberOfTimes < 0) {
        C64.$tv.find("*").remove();
        return true;
      }
      return false;
    }

  };

  C64.stepTypes['customStep'] = {
    init: function (data) {
      return data.value.init.call(this, data);
    },
    run: function (data) {
      if (data.value.run) {
        return data.value.run.call(this, data);
      }
    },
    isFinished: function (data) {
      if (data.value.isFinished) {
        return data.value.isFinished.call(this, data);
      }
    }
  };
});
