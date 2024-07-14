//=========================
// GRB_NonBattlerActors.js
//=========================
/*:
 * @target MV MZ
 * @plugindesc Allows to mark some actors as non-battlers
 * @author Garbata Team
 * @url https://рпг.укр/GRB_NonBattlerActors
 *
 * @help To mark some actor as unavailable in battle, add
 * <non-battler>
 * to their notes field.
 *
 * To use switch for determining actor availability in battle, add
 * <battler switch: 1>
 * to the actor’s notes field (replacing 1 with the switch number). The actor
 * will appear in battle only if the switch is ON.
 *
 * This plugin is placed into public domain according to the CC0 public domain
 * dedication. See https://creativecommons.org/publicdomain/zero/1.0/ for more
 * information.
 */
/*:ru
 * @target MV MZ
 * @plugindesc Позволяет исключить некоторых героев или героинь из боя.
 * @author Команда Гарбата
 * @url https://рпг.укр/GRB_NonBattlerActors
 *
 * @help Чтобы указать, что герой или героиня не должны участвовать в битве,
 * добавьте в поле «Заметки» такой текст:
 * <не в битве>
 *
 * Чтобы доступность героини или героя в битве определялась переключателем,
 * добавьте
 * <боевой переключатель: 1>
 * в поле «Заметки» персонажа (замените 1 на номер переключателя). Персонаж
 * будет доступен в битве лишь когда этот переключатель будет ВКЛючён.
 *
 * Этот плагин передан в общественное достояние согласно CC0. Подробнее см. на
 * странице https://creativecommons.org/publicdomain/zero/1.0/deed.ru
 */
 /*:uk
  * @target MV MZ
  * @plugindesc Дозволяє виключити деяких героїв чи героїнь з бою.
  * @author Команда Гарбата
  * @url https://рпг.укр/GRB_NonBattlerActors
  *
  * @help Щоб вказати, що герой чи героїня не мають брати участь в битві, треба
  * вказати в полі «Нотатки» такий текст:
  * <не в битві>
  *
  * Щоб доступність героїні чи героя в битві визначалася перемикачем, додайте
  * <бойовий перемикач: 1>
  * в поле «Нотатки» персонажа (замініть 1 на номер перемикача). Персонаж буде
  * доступний в битві тільки тоді, коли цей перемикач буде УВІМКнено.
  *
  * Цей плагін передано до суспільного надбання згідно з CC0. Детальніше див.
  * на сторінці https://creativecommons.org/publicdomain/zero/1.0/deed.uk
  */
 /*:be
  * @target MV MZ
  * @plugindesc Дазваляе выключыць некаторых герояў ці гераінь з бою.
  * @author Каманда Гарбата
  * @url https://рпг.укр/GRB_NonBattlerActors
  *
  * @help Каб паказаць, што герой ці гераіня не мусяць удзельнічаць у бітве,
  * дадайце ў поле «Нататкі» персанажа такі тэкст:
  * <не ў бітве>
  *
  * Каб даступнасць героя ці гераіні ў бітве вызначалася пераключальнікам,
  * дадайце
  * <баявы пераключальнік: 1>
  * у поле «Нататкі» персанажа (замяніце 1 на нумар пераключальніка). Персанаж
  * будзе даступны ў бітве толькі тады, калі гэты пераключальнік будзе
  * УКЛЮЧаны.
  *
  * Гэты плагін перададзены ў грамадскі набытак згодна з CC0. Падрабязней гл.
  * на старонцы https://creativecommons.org/publicdomain/zero/1.0/deed.be
  */
(function () {
 
var DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
 
function processActorNotetags() {
  var unconditionalRe = /<\s*(?:non-battler|не в битве|не ў бітве|не в битві)\s*>/i;
  var switchRe = /<\s*(?:battler switch|боевой переключатель|баявы пераключальнік|бойовий перемикач):\s*([0-9]+)\s*>/i;
  for (var i = 1; i < $dataActors.length; i++) {
    var actor = $dataActors[i];
    if (actor.note) {
      unconditionalMatch = actor.note.match(unconditionalRe);
      switchMatch = actor.note.match(switchRe);
 
      if (switchMatch) {
        actor.garbataBattlerSwitch = parseInt(switchMatch[1]);
      }
      else if (unconditionalMatch) {
        actor.garbataNonBattler = true;
      }
    }
  }
}
 
var notetagsProcessed = false;
 
DataManager.isDatabaseLoaded = function() {
  if (!DataManager_isDatabaseLoaded.call(this)) {
    return false;
  }
 
  if (!notetagsProcessed) {
    processActorNotetags();
    notetagsProcessed = true;
  }
  return true;
};
 
Game_Party.prototype.originalBattleMembers = Game_Party.prototype.battleMembers;
 
Game_Party.prototype.battleMembers = function() {
    return this.allMembers().filter(function (actor) {
      var actorData = actor.actor();
      if (actorData.garbataNonBattler) {
        return false;
      }
      if (actorData.garbataBattlerSwitch) {
        return $gameSwitches.value(actorData.garbataBattlerSwitch);
      }
 
      return true;
    }).slice(0, this.maxBattleMembers()).filter(function(actor) {
        return actor.isAppeared();
    });
};
 
Game_Party.prototype.leader = function() {
    return this.originalBattleMembers()[0];
};
 
Game_Follower.prototype.actor = function() {
    return $gameParty.originalBattleMembers()[this._memberIndex];
};
 
Game_Actor.prototype.isBattleMember = function() {
    return $gameParty.originalBattleMembers().contains(this);
};
 
})();