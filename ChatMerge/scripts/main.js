import { CHTMRGSettings, CHTMRG_OPTIONS } from "./settings.js";
import { ChatResolver } from "./chat-resolver.js";

Hooks.once('init', () => {
	CHTMRGSettings.registerSettings();
    game.chtmrg_flag = true;
    game.chtmrg_lastmessage = {};
});

Hooks.on('preCreateChatMessage', ChatResolver.resolvePreCreateMessage);
Hooks.on('renderChatMessage', ChatResolver.onRenderChatMessage);
Hooks.on('chatBubble', ChatResolver.onChatBubble);
