Код:
//=============================================================================
// MessageHide.js                                                             
//=============================================================================
 
/*:
@plugindesc v1.3.1 Define buttons the player can press to toggle whether the message window is shown.
@author Jatopian

@param key
@desc Keys/buttons that toggle message window visibility when pressed. Separate values with a space. See help for list.
@default pageup h

@param right click
@desc Whether right click can toggle message window visibility. true / false
@default true

@param show on new page
@desc Whether the message window automatically becomes visible on a new page of dialogue. true / false
@default true

@help
Message window visibility is reset by pressing the key again, 
or resetting the game.
Game events can also make it happen with plugin command: ShowMessageWindow
With "show on new page" param true, visibility is reset for each new message window page.

"key" parameter takes multiple values separated by a space.
For example: "pageup h" will define H and PageUp keys (and keys synonymous with PageUp like gamepad side buttons).
Gamepad-compatible values:
ok       //      A
cancel   //      B
shift    //      X
menu     //      Y
pageup   //      LB
pagedown //      RB
up
down
left
right
Keyboard-only values: 
a-z
0-9
tab
enter
shift
ctrl
alt
space
semicolon
comma
period
quote

Installation:
Place after Yanfly Message Core, or NameBox hiding won't work.

Terms of Use:
- Free for commercial and non-commercial use.
- Please give credit in a trivially accessible place.
- OK to modify, but if you redistribute the modified version, 
  please make clear that you modified it, and how.
- If you add features that could be useful to others, 
  please at least consider sharing them with me and the community.

Changelog:
1.3.1:
Right-click fixes.
Compatibility note about Yanfly Message Core NameBox.
1.3.0: 
Parameter to hide window with right-click. (Thanks Magnus0808 || Magnus Rubin Peterson.)
1.2.0:
Ability to define multiple keys.
Defaults to "show on new page" behavior rather than undefined behavior if param not set.
Gamepad support fixes.
Yanfly Message Core NameBox compatibility. (Thanks mdqp!)
1.1.0: 
Show/hide now persists between maps and when bringing up the menu.
"show on new page" feature.
*/

(function() {
  var params = PluginManager.parameters("MessageHide");
  var pKey = String(params["key"]).toLowerCase().split(" ");
  var pRightClick = (function() {  
    var p = String(params["right click"]).toLowerCase();
    if (p.match(/false/i)) {
      return false;
    }
    return true;
  })();
  var pNewPage = (function() {  
    var p = String(params["show on new page"]).toLowerCase();
    if (p.match(/false/i)) {
      return false;
    }
    return true;
  })();
  
  var key_ids = {
    "tab":9,"enter":13,"shift":16,"ctrl":17,"alt":18,"space":32,
    "pageup":33,"pagedown":34,
    "0":48,"1":49,"2":50,"3":51,"4":52,"5":53,"6":54,"7":55,"8":56,"9":57,
    "a":65,"b":66,"c":67,"d":68,"e":69,"f":70,"g":71,"h":72,"i":73,"j":74,"k":75,"l":76,"m":77,
    "n":78,"o":79,"p":80,"q":81,"r":82,"s":83,"t":84,"u":85,"v":86,"w":87,"x":88,"y":89,"z":90,
    "semicolon":186,"comma":188,"period":190,"quote":222,
  };
  
  for (var p of pKey) {
    console.log("MessageHide button defined: " + p);
    if (key_ids[p]) { // if key is listed in key_ids
      if (!Input.keyMapper[key_ids[p]]) { // if key isn't already registered with keyMapper
        Input.keyMapper[key_ids[p]] = p; // add it to keyMapper, with label from key_ids
      }
    } else {
      if (!Input.keyMapper[p]) { // if key is not already registered with keyMapper and also not in key_ids
        console.log("Unrecognized MessageHide button defined - deleting: " + p);
        delete pKey[p]; // delete value from pKey so it isn't fruitlessly checked later
      }
    }
  }
  //global variables!
  MessageHide_messageWindowShowNext = false;
  MessageHide_messageWindowVisible = true; //global to persist between maps
  
  //=============================================================================
  // Window Message
  //=============================================================================
  
  Window_Message.prototype.isToggleHide = function() {
    for (var p of pKey) {
      if (Input.isTriggered(p)) return true;
    }
    return false;
  }
  
  var alias_wm_ud = Window_Message.prototype.update;
  Window_Message.prototype.update = function() {
    alias_wm_ud.call(this);
    if (MessageHide_messageWindowShowNext === true) {
      MessageHide_messageWindowVisible = true;
      MessageHide_messageWindowShowNext = false;
    } else if (this.isToggleHide()) {
      MessageHide_messageWindowVisible = !MessageHide_messageWindowVisible;
    }
    this.visible = MessageHide_messageWindowVisible;
  }
  
  if (pRightClick) { // conditional alias
    var mrp_hiderightclick_wm_update_old = Window_Message.prototype.update;
    Window_Message.prototype.update = function() {
      mrp_hiderightclick_wm_update_old.call(this);
      this.processRightClick();
    }
    
    Window_Message.prototype.processRightClick = function() {
      if (this.isOpen() && this.active && TouchInput.isCancelled()) {
        MessageHide_messageWindowVisible = !MessageHide_messageWindowVisible;
      }
    }
  }
  
  if (pNewPage) { // conditional alias
    var alias_wm_np = Window_Message.prototype.newPage;
    Window_Message.prototype.newPage = function(textState) {
      alias_wm_np.call(this, textState);
      MessageHide_messageWindowVisible = true;
    }
  }
  
  //=============================================================================
  // Game Interpreter
  //=============================================================================
  
  var alias_Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
      alias_Game_Interpreter_pluginCommand.call(this, command, args);
      if (command === "ShowMessageWindow") {
        MessageHide_messageWindowShowNext = true;
      }
  }
  
  //=============================================================================
  // Window NameBox (Yanfly Message Core compatibility)
  //=============================================================================
  
  if (Imported.YEP_MessageCore) { // conditional alias
    var alias_wm_nb = Window_NameBox.prototype.update;
    Window_NameBox.prototype.update = function() {
      alias_wm_nb.call(this);
      if ($gameMessage.isToggleHide) {
        this.visible = MessageHide_messageWindowVisible;
      }
    }
    
    if (pRightClick) { // conditional alias
      var mrp_hiderightclick_wnb_update = Window_NameBox.prototype.update;
      Window_NameBox.prototype.update = function() {
        mrp_hiderightclick_wnb_update.call(this);	
        if (this._parentWindow.isOpen() && this.isOpen()) {
          this.visible = this._parentWindow.visible;			
        } 
      }
    }
  }
  
})();