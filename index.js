let names = JSON.parse(FileLib.read("AutoTip", "names.json"))
let firstJoin = true
let checkForTipResponse = false
let responseFound = false
let massTip = false
let index;
let foundName = false


function tipper(name) {
  if (!massTip) {
    massTip = true
    new Thread(() => {
      ChatLib.command(`msg ${name} h/ Hey! I'm currently tipping you, please do not leave the server for the next minute! Thank you :cute:`);
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " sw");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " arcade");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " tnt");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " mw");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " blitz");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " uhc");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " cvc");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " war");
      Thread.sleep(5000);
      ChatLib.command("tip " + name + " smash");
      Thread.sleep(5000);
      ChatLib.command("tipall");
      Thread.sleep(1750000);
      massTip = false
      requestTip()
    }).start()
  }
}

function requestTip() {
  if (!massTip && !checkForTipResponse) {
    names.shift()
    if (typeof names[0] === 'undefined') {
      ChatLib.chat("&4Ran out of names, requesting new ones...");
      names = JSON.parse(FileLib.read("AutoTip", "names.json"))
    }
    let name = names[0]
    ChatLib.chat(`&dChecking if ${name} is online and can be tipped!`)
    if (!wasTipped(name)) {
      ChatLib.command("tip -a " + name + " classic");
      checkForTipResponse = true
      setTimeout(() => {
        checkForTipResponse = false
        if (!responseFound) {
          names.unshift("")
          requestTip()
        }
        else { responseFound = false }
      }, 5000);
    }
    else {
      //ChatLib.chat(`&4You already tipped ${name} in the past 24 hours! Skipping player.`);
      ChatLib.chat(`&4You already tipped ${name} today! Skipping player.`);
      names.shift()
      setTimeout(() => {
        requestTip()
      }, 10000)
    }
  }
}

function wasTipped(name) {
  let times = JSON.parse(FileLib.read("AutoTip", "times.json")).times
  for (i in times) {
    if (times[i][0].toLowerCase() == name.toLowerCase()) {
      //if (Date.now() - times[i][1] > 86400000) {
      if (Math.floor((Date.now() - 14400000) / 86400000) == Math.floor((times[i][1] - 14400000) / 86400000)) {
        return true
      }
      else {
        return false
      }
    }
  }
}

register("serverConnect", () => {
  if (Server.getIP().endsWith("hypixel.net")) {
    if (Player.getName() != 'mustangk') { names.unshift("mustangk") }
  }
});


register("serverConnect", () => {
  if (Server.getIP().endsWith("hypixel.net") && firstJoin) {

    let times = JSON.parse(FileLib.read("AutoTip", "times.json")).times
    for (i in times) {
      if (Math.floor((Date.now() - 14400000) / 86400000) > Math.floor((times[i][1] - 14400000) / 86400000)) {
        times.splice(i, 1)
      }
    }

    let newObject = {
      times: []
    }

    for (i in times) { newObject.times.push(times[i]) }

    let json = JSON.stringify(newObject)
    FileLib.write("./config/ChatTriggers/modules/AutoTip/times.json", json)

    setTimeout(() => {
      firstJoin = false
      names.unshift("")
      setTimeout(() => {
        requestTip()
      }, 10000)
    }, 1000)
  }
});



register("chat", (msg) => {
  if (checkForTipResponse && !responseFound) {
    if (
      msg.match(/You \(anonymously\) tipped (\w*) in Classic Games!/)) {
      responseFound = true
      let name = names[0]
      tipper(name);
    }
    else if (
      msg.startsWith("You've already tipped that person today in Classic Games! Try another user!")) {
      responseFound = true
      let randInt = 10 + Math.floor(Math.random() * 40)
      for (i = 0; i <= randInt; i++) { names.shift() }
      let name = names[0]
      tipper(name);
    }
    else if (
      msg.startsWith("You've already tipped someone in the past hour in Classic Games! Wait a bit and try again!")) {
      responseFound = true
      setTimeout(() => {
        requestTip()
      }, 900000);
    }
    else if (
      msg.startsWith("That player is not online, try another user!")
      || msg.startsWith('Can\'t find a player by the name of ')
      || msg.startsWith('You cannot give yourself tips!')
    ) {
      responseFound = true
      setTimeout(() => {
        requestTip()
      }, 10000);
    }
    else if (
      msg.startsWith("You have been blocked from using /tip for 5 minutes! Please don't spam the command!")) {
      responseFound = true
      setTimeout(() => {
        requestTip()
      }, 300000);
    }
  }
}).setCriteria("${msg}");




register("chat", (msg) => {
  if (
    msg.startsWith('Can\'t find a player by the name of ')
  ) {
    ChatLib.chat(`&4Invalid username in tipping list, please remove ${names[0]}!`)
  }
}).setCriteria("${msg}");


function add(name) {
  for (i = 0; i < names.length; i++) {
    if (names[i] == name) {
      index = i
      foundName = true
      break
    }
  }
  if (foundName) {
    names.splice(index, 1)
  }
  names.shift()
  names.unshift(name)
  names.unshift("")
}


register("command", (...args) => {
  if (typeof args[0] === 'undefined') { ChatLib.chat(`&4Please provide a name to add to the tipping queue!`) }
  else {
    add(args[0])
    if (foundName) {
      ChatLib.chat(`&4Removed &b${args[0]} &4from its old position in the tipping queue!`)
      foundName = false
    }
    ChatLib.chat(`&4Added &b${args[0]} &4to the tipping queue!`)
  }
}).setName("addtoqueue");


function remove(name) {
  for (i = 0; i < names.length; i++) {
    if (names[i].toLowerCase() == name.toLowerCase()) {
      index = i
      foundName = true
      break
    }
  }
  if (foundName) {
    names.splice(index, 1)
  }
}


register("command", (...args) => {
  if (typeof args[0] === 'undefined') { ChatLib.chat(`&4Please provide a name to remove from the tipping queue!`) }
  else {
    remove(args[0])
    if (foundName) {
      ChatLib.chat(`&4Removed &b${args[0]} &4from the tipping queue!`)
      foundName = false
    }
    else {
      ChatLib.chat(`&4Couldn't find &b${args[0]} &4in the tipping queue!`)
    }
  }
}).setName("removefromqueue");



register("command", (...args) => {
  if (typeof args[0] === 'undefined') { ChatLib.chat(`&4Please provide a number of how many names the queue you want to be shifted with!`) }
  else if (args[0] > 0) {
    for (i = 0; i < args[0]; i++) { names.shift() }
    ChatLib.chat(`&4Shifted queue by &b${args} &4places!`)
  }
  else if (args[0] < 0) {
    for (i = 0; i < args[0]; i--) { names.unshift('') }
    ChatLib.chat(`&4Shifted queue by &b${args} &4places!`)
  }
}).setName("shiftqueue");



register("command", () => {
  ChatLib.chat(names.toString())
}).setName("printqueue");


register("command", () => {
  requestTip()
}).setName("requesttip");




register("chat", (tippedName) => {
  let times = JSON.parse(FileLib.read("AutoTip", "times.json")).times


  for (i in times) {
    if (times[i][0] == tippedName) {
      times.splice(i, 1)
      break
    }
  }

  times.push([tippedName, Date.now()])

  let newObject = {
    times: []
  }

  for (i in times) { newObject.times.push(times[i]) }

  let json = JSON.stringify(newObject)
  FileLib.write("./config/ChatTriggers/modules/AutoTip/times.json", json)
}).setCriteria(/You \(anonymously\) tipped (\w*) in Classic Games!/);



register("chat", (tippedName) => {
  let times = JSON.parse(FileLib.read("AutoTip", "times.json")).times


  for (i in times) {
    if (times[i][0] == tippedName) {
      times.splice(i, 1)
      break
    }
  }

  times.push([tippedName, Date.now()])

  let newObject = {
    times: []
  }

  for (i in times) { newObject.times.push(times[i]) }

  let json = JSON.stringify(newObject)
  FileLib.write("./config/ChatTriggers/modules/AutoTip/times.json", json)
}).setCriteria(/You tipped (\w*) in Classic Games!/);





register("chat", (name) => {
  setTimeout(() => {
    if (!wasTipped(name)) {
      add(name)
      foundName = false
    }
  }, 5000);
}).setCriteria(/&aFriend > &r&[^c](\w*) &r&ejoined.&r/);
//}).setCriteria(/Friend > (\w*) joined./);

register("chat", (name) => {
  setTimeout(() => {
    if (!wasTipped(name)) {
      add(name)
      foundName = false
    }
  }, 5000);
}).setCriteria(/&2Guild > &r&[^c](\w*) &r&ejoined.&r/);  
//}).setCriteria(/Guild > (\w*) joined./);





register("chat", (name) => {
  remove(name)
  foundName = false
}).setCriteria(/Friend > (\w*) left./);

register("chat", (name) => {
  remove(name)
  foundName = false
}).setCriteria(/Guild > (\w*) left./);



register('chat', () => {
  new Thread(() => {
  ChatLib.command("home");
  Thread.sleep(5000);
  ChatLib.command("home");
}).start()
}).setCriteria("You are AFK. Move around to return from AFK.").setContains();