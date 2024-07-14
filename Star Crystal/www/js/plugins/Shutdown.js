//=============================================================================
// This plugin adds a shutdown command to the main menu
//=============================================================================

/*:
 * @plugindesc Adds a Shutdown command to the Title screen
 * @author Schlangan
 *
 * @param Name
 * @desc The name displayed for the Shutdown command
 * @default Shutdown
 
 * @help No plugin command associated.
*/

Window_TitleCommand.prototype.makeCommandList = function() 
{
    var parameters = PluginManager.parameters('TitleShutdownCommand');
    var shutdown_name = parameters['Name'] || "Выйти";
    this.addCommand(TextManager.newGame,   'newGame');
    this.addCommand(TextManager.continue_, 'continue', this.isContinueEnabled());
    this.addCommand(TextManager.options,   'options');
    this.addCommand(shutdown_name,         'shutdown');
};

Scene_Title.prototype.createCommandWindow = function() 
{
    this._commandWindow = new Window_TitleCommand();
    this._commandWindow.setHandler('newGame',  this.commandNewGame.bind(this));
    this._commandWindow.setHandler('continue', this.commandContinue.bind(this));
    this._commandWindow.setHandler('options',  this.commandOptions.bind(this));
    this._commandWindow.setHandler('shutdown',  this.commandShutdown.bind(this));
    this.addWindow(this._commandWindow);
};

Scene_Title.prototype.commandShutdown = function() 
{
    this._commandWindow.close();
    window.close();
};