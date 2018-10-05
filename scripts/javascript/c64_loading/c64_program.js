jQuery(() => {

	let program = [
	               
			{ command : "out",
				value : "\n     **** COMMODORE 64 BASIC V2 ****\n\n 64K RAM SYSTEM  38911 BASIC BYTES FREE\n\nREADY.\n",
				callbackSpeed : 10 },
			
			{ command : "cursor", value : "on" },
			
			{ command : "out", value : "LOAD" },						
			{ command : "executeCommand" }, // shortcut to turn off cursor and type "\n" 

			{ command : "print", value : "\nPRESS PLAY ON TAPE" },
			
			{ command : "wait", value : "2000" },
			{ command : "screen", value : "off" },
			
			{ command : "print", value : "\nOK"},

			{ command : "print", value : "\n\nSEARCHING"},
			{ command : "wait", value : "2000" },
			{ command : "screen", value : "off" },
			
			{ command : "wait", value : "2000" },
			{ command : "screen", value : "on" },
			
			{ command : "print", value : "\nFOUND GOOGLE" },
			{ command : "wait", value : "2000" },
			{ command : "print", value : "\nLOADING" },			
			
			{ command : "screen", value : "off" },
			{ command : "wait", value : "2000" },
			
			{ command : "screen", value : "on" },
			
			{ command : "print", value : "\nREADY.\n" },
			{ command : "cursor", value : "on" },
			
			{ command : "type", value: "RUN" },			
			{ command : "executeCommand" }, // shortcut to turn off cursor and type "\n" 

			{ command : "screen", value : "off" },
			{ command : "loading1", value: "", numberOfTimes: 256 },	        
			{ command : "screen", value : "on" },
	        { command : "loading1", value: "", numberOfTimes: 1024 },
			
			{ command : "print", value : "\n?SYNTAX ERROR  IN 10\nREADY.\n"},
			
			{ command : "cursor", value : "on" }
			
	];

	C64.runProgram(program);

});