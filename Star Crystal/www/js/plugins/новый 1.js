=begin
#===============================================================================
 Title: Unlimited FPS
 Author: Hime
 Date: Oct 17, 2014
--------------------------------------------------------------------------------
 ** Change log
 Oct 17, 2014
   - Initial release
--------------------------------------------------------------------------------   
 ** Terms of Use
 * Free to use in commercial or non-commercial projects
 * No real support. The script is provided as-is
 * Will do bug fixes, but no compatibility patches
 * Features may be requested but no guarantees, especially if it is non-trivial
 * Credits to Hime Works in your project
 * Preserve this header
--------------------------------------------------------------------------------
 ** Description
 
 By default, RPG Maker imposes a limit of 120 FPS on the game. This means that
 if you tried to go beyond 120, it would simply round it down to 120. 
 
 This script removes this limitation and allows you to run your game at speeds
 that your machine can handle.
 
--------------------------------------------------------------------------------
 ** Installation
 
 Place this below Materials and above Main.
 
--------------------------------------------------------------------------------
 ** Usage 
 
 Use the script call
 
   Graphics.frame_rate = 200
   
 Where x is the frame rate that you would like to change to, such as 60, 120,
 150, and so on.
  
#===============================================================================
=end
$imported = {} if $imported.nil?
$imported["TH_UnlimitedFPS"] = true
#===============================================================================
# ** Configuration
#===============================================================================
module Graphics
  #-----------------------------------------------------------------------------
  # Overwrite. Manually set the value. This is only for testing purposes
  #-----------------------------------------------------------------------------
  def self.frame_rate=(rate)
    val = [rate].pack("L")
    ptr = DL::CPtr.new(0x1025EB00) #0x10000000 base + 0x25EB00
    addr = ptr[0, val.size].unpack("L")[0]
    addr += 0x214
    ptr = DL::CPtr.new(addr)
    ptr[0,val.size] = val
    
  end
end