const demoDisk = () => ({
    roomId: 'arcade', // the ID of the room the player starts in
    rooms: [
        {
            id : 'maintenance',
            name: 'Maintenance Room',
            desc: `This room is a mess. Cables and wires everywhere. Fastfood wrappers, smashed soda cans, and bags of Doritos litter the floor. To the **NORTH** is the main Arcade floor. There is a small **LOCKBOX** on the cabinet.`,
            exits: [
                {dir: 'north', id: 'arcade'},   
    
            ],
            items:[
                {
                    name: 'lockbox',
                    desc: 'There is a keyhole in the front. You wonder what could be inside.'
                }
            ]
            
        },
      {
        id: 'arcade', // unique ID for this room
        img: `
=======================
     .-.   .-.                              
    | OO| | OO|       
    |   | |   |    
    '^^^' '^^^'                           
=======================     
        `,
        name: 'The arcade', // room name (shown when player enters the room)
        // room description (shown when player first enters the room)
        desc:  `The year is 1987, and you are in a video game arcade in the local mall.
  
        Type **LOOK** to have a look around.`,
        // optional callback when player issues the LOOK command
        // here, we use it to change the arcade's description
        onLook: () => {
          const room = getRoom('arcade');
          room.desc = `You are currently standing in the arcade. There's a **PACMAN** machine to your right, and rows of **PINBALL** machines to your left drowning the room in fluoroscent lights and chaotic sounds. 
  
          Type **ITEMS** to see a list of items in the arcade. Or type **HELP** to see what else you can do!`;
        },
        // optional list of items in the room
        items: [
          {
            name: ['pinball', 'pinball machine', 'pinball machines'], // the item's name
            desc: `A row of pinball machines. All are occupied.`, // description shown when player looks at the item
          },
          {
              name: ['CONTRA'], // the item's name
              desc: `A Contra machine. The screen keeps glitching and it appears unplayable.`, // description shown when player looks at the item
            },
          {
            name: ['PACMAN', 'pac-man'], // player can refer to this item by any of these names
            desc: `Classic pacman yellow cabinet. The screen flickers and the top 3 high scores belong to XKD. Suddenly the screen goes dark and reads WELCOME TO YOUR ADVENTURE. THERE IS A VIRUS THAT IS INFECTING ALL OF THE MACHINES AND IT IS YOUR MISSION TO STOP IT. 
  
            There's **SOMETHING SHINY** next to the joystick.`,
            block: `It's far too large for you to carry.`, // optional reason player cannot pick up this item
            // when player looks at the pacman, they discover a shiny object which turns out to be a key
            onLook: () => {
              if (getItem('shiny')) {
                // the key is already in the pot or the player's inventory
                return;
              }
  
              const arcade = getRoom('arcade');
              const maintenance = getRoom('maintenance');
              //put the key on the machine since player has observed it    
              arcade.items.push({
                name: ['shiny thing', 'something shiny'],
                onUse() {
                  const room = getRoom(disk.roomId);
                 if (room.id === 'maintenance') {
                    println(`You unlock the lockbox! Inside is a piece of **PAPER** with the arrows up up down down left right left right written on it. Could this be the key to destroying the virus?`);
                    maintenance.items.push({
                      name: ['paper','contra code'],
                      isTakeable:true,
                      onUse(){
                          const room = getRoom(disk.roomId);
                          if (room.id === 'arcade'){
                              enterRoom('gameover-win')
                          }
                      }
                      
                    })
                  } else {
                    println(`You can't use that here. There is nothing to unlock.`);
                  }
                },
                desc: `It's a silver **KEY**!`,
                onLook() {
                  const key = getItem('shiny');
  
                  // now that we know it's a key, place that name first so the engine calls it by that name
                  key.name.unshift('silver key');
  
                  // let's also update the description
                  //key.desc = `It has a blue cap with the word "LAB" printed on it.`;
  
                  // remove this method (we don't need it anymore)
                 // delete key.onLook;
                },
                isTakeable: true,
                onTake() {
                  println(`You took it.`);
                  // update the PACMAN's description, removing everything starting at the line break
                  const pacman = getItem('pacman');
                  pacman.desc = pacman.desc.slice(0, pacman.desc.indexOf('\n'));
                },
              });
            },
          },
          {
            name: 'dime',
            desc: `Wow, ten cents.`,
            isTakeable: true, // allow the player to TAKE this item
            onTake: () => println(`You bend down and pick up the tiny, shiny coin.
  
            *Now it's in your **inventory**, and you can use it at any time, in any room. (Don't spend it all in one place!)
  
            Type **INV** to see a list of items in your inventory.*`),
            // using the dime randomly prints HEADS or TAILS
            onUse() {
              const room = getRoom(disk.roomId);
                  if (room.id == 'snackbar'){
                println(`You put the dime in the jukebox and pick Time After Time by Cyndi Lauper. A girl starts weeping in the corner.`);
                  } else {
                      println(`You should probably hang on to that until you\'re in the snackbar.`)
                  }
              
            },
          },
          {
              name: 'quarter',
              desc: `A 1981 quarter.`,
              isTakeable: true, // allow the player to TAKE this item
              onTake: () => println(`You pick up the quarter.
    
              *Now it's in your **inventory**, and you can use it at any time, in any room. (Don't spend it all in one place!)
    
              Type **INV** to see a list of items in your inventory.*`),
              // using the quarter turns on pacman
              onUse() {
                  const room = getRoom(disk.roomId);
                if (room.id == 'arcade'){
                println(`You put the quarter in the Pac-Man machine. The screen flickers and you see a message: WELCOME TO ARCADE ADVENTURE. YOU ARE THE CHOSEN ONE. THERE IS A VIRUS OVERTAKING ONE OF THE GAMES AND IT IS YOUR JOB TO STOP IT BEFORE IT SPREADS.`);
                } else {
                  println(`You noticed earlier the **PAC-MAN** game costs a quarter to play...`)
                }
              
              },
            }
        ],
        // places the player can go from this room
        exits: [
          // GO NORTH command leads to the Reception Desk
          {dir: 'north', id: 'reception'},
          {dir: 'east', id: 'snackbar'},
          {dir: 'south', id: 'maintenance', block: `The door is locked, but you see an access keypad on the wall.`},
          {dir: 'west', id: 'billiards'},
        ],
      },
      {
        id: 'reception',
        name: 'Reception Desk',
        desc: `**BENJI** is here. 
  
        *You can speak with characters using the **TALK** command.*
  
        To the **SOUTH** is the arcade where you started your adventure.`,
        items: [
          {
            name: 'desk',
            desk: `It's a standard desk with a **COMPUTER**. Benji\'s **BADGE** is next to the computer.`
          },
          {
            name: 'computer',
            desc: `You check the computer and see that it is currently loaded with a game of **OREGON TRAIL**`,
            onUse() {
              /**const reception = getRoom('reception');
              const exit = getExit('east', reception.exits);
              if (exit.block) {
                println(`It's locked.`);
              } else {
                goDir('east');
              }**/
              enterRoom('gameover-lose')
            },
          },
          {
              name: 'employee badge',
              desc: `It has a photo of **BENJI** and has the digits 68110 printed on the back.`,
              isTakeable: true,
              onUse() {
                  const room = getRoom(disk.roomId);
                  if (room.id == 'reception' || room.id == 'billiards' || room.id == 'restroom' || room.id == 'staffroom') {
                      println(`There's nothing to unlock in this room of the arcade.`);
                    } else if (room.id === 'snackbar') {
                      println(`You push the digits 68110 on the keypad by the door to the **EAST** that says STAFF ONLY and the door unlocks!`);
                      // remove the block
                      const exit = getExit('east', room.exits);
                      delete exit.block;
                      }
                      else if (room.id == 'arcade'){
                          println(`You enter the digits 68110 in the keypad and unlock the door to the **SOUTH** that says **MAINTENANCE**!`);
                          // remove the block
                          const exit = getExit('south', room.exits);
                          delete exit.block;
                          }
                      }
              },
    
        ],
        exits: [
          // exits with a BLOCK cannot be used, but print a message instead
          //{dir: 'east', id: 'lab', block: `The door is locked.`},
         // {dir: ['upstairs', 'up'], id: 'advanced', block: `There's a locked GATE blocking your path.`},
          {dir: 'south', id: 'arcade'},
        ],
      },
      {
        id: 'snackbar',
        name: 'Snackbar and Concessions',
        desc: `There is a **POPCORN MACHINE** saturating the room with the smell of artificial butter. A **NERDY GIRL** is working behind the counter. (Type **TALK** to speak to the girl.)
  
        To the **WEST** is the main Arcade, and to the **EAST** is a door with a sign **STAFF ONLY** and a **KEYPAD** next to it.`,
        exits: [
          {dir: 'west', id: 'arcade'},
          {dir: 'east', id: 'staffroom'},
        ],
        items: [
          {
            name: ['popcorn', 'popcorn machine'], // the item's name
            desc: `The smell is intoxicating.`, 
            isTakeable: false,
          },
          {
              name: ['keypad'], // the item's name
              desc: `Digits 0-9 and a # symbol.`,
              isTakeable: false,
              onUse(){
                  println(`You need to use an **ACCESS BADGE** to get the code`)
              },
  
            },
  
      ]
  
      },
      {
        id: 'restroom',
        name: 'Restroom',
        desc: `A toilet, sink, and a mirror. Smells like Aquanet hairspray.
  
        **EAST** is the Billiards room.`,
        exits: [
          {dir: 'east', id: 'billiards'},
        ],
        items: [
          {name: 'toilet',
          desc: 'The toilet seat is up.',
          onUse(){
              println('Flush!')
          }
      },
          {name: 'sink',
          desc: 'Standard sink. Hot and cold are reversed.',
          onUse(){
            println('You wash your hands for 20 seconds.')
        }
      },
          
          {name: 'mirror',
          desc: 'You look in the mirror, stressed out but ready to finish this adventure and save the arcade.',
        onUse(){println('You look in the mirror, stressed out but ready to finish this adventure and save the arcade.')}
        }
        ]
  
      },
  
      {
          id : 'billiards',
          name: 'Billiards Room',
          desc: `There are 2 pool tables and 2 couples playing each other. To the **WEST** is the Restroom.`,
          exits: [
              {dir: ['east', 'right'], id: 'arcade'},
              {dir: ['west', 'leftt'], id: 'restroom'},
  
          ]
          
      },
  
     
      {
        id : 'staffroom',
        name: 'STAFF ONLY',
        desc: `There's a couch and a coffee table. You see a small tv and an NES is connected to it. There's a stack of games next to it.`,
        exits: [
            {dir: ['west'], id: 'snackbar'},   

        ],
        items:[
            {
                name: 'Chuck the Plant',
                desc: 'There is a large tentacle-like cactus plant.'
            }
        ]
        
    },
    {
        id : 'gameover-lose',
        name: '----- GAME OVER ------ ',
        desc: `You should not have touched Benji's computer. You die of cholera. All of the screens on the other games start flickering and shutting down. Please refresh to try again!
        
        Roll the credits:
        Game engine - https://github.com/okaybenji/text-engine
        ASCII art modified from - https://www.asciiart.eu/video-games/pacman`,
        exits: [
        ],
        
    },
    {
        id : 'gameover-win',
        name: '----- GAME OVER ------ ',
        desc: `You enter the code in Contra and the game starts up. The virus is wiped, and you've saved the day!
        
        Roll the credits:
        Game engine - https://github.com/okaybenji/text-engine
        ASCII art modified from - https://www.asciiart.eu/video-games/pacman
        `,
        exits: [
        ],
        
    },
  
  
  
  ],
    characters: [
      {
        name: ['Benji', 'Benj', 'receptionist'],
        roomId: 'reception',
        desc: 'He looks... helpful!', // printed when the player looks at the character
        // optional callback, run when the player talks to this character
        onTalk: () => println(`"Hi," he says, "How can I help you?"`),
        // things the player can discuss with the character
        topics: [
          {
            option: 'How am I supposed to defeat the **VIRUS**?',
            removeOnRead: true,
            // optional callback, run when the player selects this option
            onSelected() {
              println(`
              "It's dangerous to go alone, take this." he says. "Try typing **USE STYLE-CHANGER**."`)
  
              // add a special item to the player's inventory
              disk.inventory.push({
                name: ['style-changer', 'stylechanger'],
                desc: `This is a magical item. Type **USE STYLE-CHANGER** to try it out!`,
                onUse: () => {
                  const currentStylesheet = document.getElementById('styles').getAttribute('href');
                  const newName = currentStylesheet.includes('modern') ? 'retro' : 'modern';
                  println(`You changed the stylesheet to ${newName.toUpperCase()}.css.`);
                  selectStylesheet(`styles/${newName}.css`);
                }
              });
            },
          },
  
          {
            option: `Tell me about **EXITS**`,
            // text printed when the player selects this option by typing the keyword (EXITS)
            line: `"Sure! It looks like you've already figured out you can type **GO NORTH** to use an exit to the north. But did you know you can just type **GO** to get a list of exits from the room? If an exit leads you to a room you've been to before, it will even tell you the room's name.
  
            "There are also some shortcuts to make getting where you're going easier. Instead of typing **GO NORTH**, you can just type **NORTH** instead. Actually, for cardinal directions, you can shorten it to simply **N**.`,
            // instruct the engine to remove this option once the player has selected it
            removeOnRead: true,
          },
         
          {
            option: `How do I use **AUTOCOMPLETE**?`,
            line: `"If you type a few letters and press TAB, the engine will guess what you're trying to say."`,
            removeOnRead: true,
          },
          {
            option: `If I want to **REPEAT** a command, do I have to type it again?`,
            line: `"Wow, it's almost like you're reading my mind. No, you can just press the UP ARROW to see commands you've previously entered."`,
            removeOnRead: true,
          },
        ],
      },
      {
        name: 'nerdy girl',
        roomId: 'snackbar',
        onTalk: () => println(`"Hi, can I take your order?"`),
        topics: [
          {
            option: `Who caused this **VIRUS**?`,
            line: `I don't know who did this, but I bet the **MAINTENANCE** guy has something to do with it.`
          },
          {
            option: `Can I get some **POPCORN**?`,
            line: `Sure, here you go.`
          },
          {
            option: `What is the **MEANING OF LIFE**?`,
            line: `42`
          }
        ],
      },
      
        
      
    ],
  });
  
  // custom functions used by this disk
  // change the CSS stylesheet to the one with the passed name
  const selectStylesheet = filename => document.getElementById('styles').setAttribute('href', filename);
  
  // override commands to include custom UNLOCK command
  // create the unlock function
  const unlock = () => {
    disk.rooms.forEach(room => {
      if (!room.exits) {
        return;
      }
  
      // unblock all blocked exits in the room
      room.exits.forEach(exit => delete exit.block);
    });
  
    // update the description of the gate
    getItemInRoom('gate', 'reception').desc = `The guilded gate leads to the staircase.`;
  
    println(`All **exits** have been unblocked!`);
  };
  
  // attach it to the zero-argument commands object on the disk
  commands[0] = Object.assign(commands[0], {unlock});