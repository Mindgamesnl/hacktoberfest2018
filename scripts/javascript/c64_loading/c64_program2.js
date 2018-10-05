jQuery(() => {


  function getURLParameter(name) {

    var val = (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null]);

    if (val[1] == null) {
      return null;
    }

    return decodeURI(val[1]);
  }

  let server = getURLParameter("server");

  if (server == null) {
    server = "http://localhost:8080";
  }

  let serverNames = RegExp("(http|https):[/]{2}(.*)(([/].*/)|$)").exec(server);
  if (serverNames == null) {
    serverNames = ["", "", "Server"];
  }
  let serverName = serverNames[2];

  if (serverName == null) {
    serverName = "Server";
  }

  let program = [


    {
      command: "out",
      value: "\n     **** COMMODORE 64 BASIC V2 ****\n\n 64K RAM SYSTEM  38911 BASIC BYTES FREE\n\nREADY.\n",
      callbackSpeed: 10
    },

    {command: "cursor", value: "on"},

    {command: "out", value: "LOAD"},
    {command: "executeCommand"}, // shortcut to turn off cursor and type "\n"

    {command: "print", value: "\nPRESS PLAY ON TAPE"},

    {command: "wait", value: "200"},
    {command: "screen", value: "off"},

    {command: "print", value: "\nOK"},

    {command: "print", value: "\n\nSEARCHING"},
    {command: "wait", value: "200"},
    {command: "screen", value: "off"},

    {command: "wait", value: "200"},
    {command: "screen", value: "on"},

    {command: "print", value: "\nFOUND " + serverName},
    {command: "wait", value: "200"},
    {command: "print", value: "\nLOADING"},

    {command: "screen", value: "off"},
    {command: "wait", value: "200"},

    {command: "screen", value: "on"},

    {command: "print", value: "\nREADY.\n"},
    {command: "cursor", value: "on"},

    {command: "type", value: "RUN"},
    {command: "executeCommand"}, // shortcut to turn off cursor and type "\n"

    {command: "screen", value: "off"},
    {command: "loading1", value: "", numberOfTimes: 64},
    {command: "screen", value: "on"},

    {
      command: "customStep",

      makeRequest: function (data) {
        jQuery
          .get("http://javascript.jchatterton-linux.technophobia.int/proxy?url=" + server)
          .done(function () {

            console.log("success");
            data.success = true;

          }).fail(function () {

          if (!data.finished) {
            console.log("fail");
            window.setTimeout(function () {
              data.makeRequest.call(this, data);
            }, 1000);
          }
        });


      },

      value: {
        init: function (data) {
          data.fn = C64.stepTypes['loading1'];
          data.numberOfTimes = 256;
          data.finished = false;
          data.success = false;

          data.makeRequest.call(this, data);

          return data.fn.init.call(data.fn, data);
        },
        run: function (data) {

          if (!data.success) {
            // keep the thing from running out
            data.numberOfTimes = 2;
          }

          return data.fn.run.call(data.fn, data);
        },
        isFinished: function (data) {

          data.finished = data.fn.isFinished.call(data.fn, data);

          return data.finished;
        }
      }

    },

    {command: "print", value: "\nREADY.\n"},

    {command: "cursor", value: "on"}


  ];

  C64.runProgram(program);

});