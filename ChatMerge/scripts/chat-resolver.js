import { CHTMRGSettings, CHTMRG_OPTIONS } from "./settings.js";

const CHAT_MESSAGE_TYPES = {
	DESCRIPTION: '#CGMP_DESCRIPTION'
}

export class ChatResolver {
    
    static resolvePreCreateMessage(messageData) {
        
        console.log(messageData.content);
        
        if(!CHTMRGSettings.getSetting(CHTMRG_OPTIONS.ENABLE_MERGE)) return;
        
        if(game.chtmrg_flag) return;
        
        if (!game.messages.has(game.chtmrg_lastmessage.id)) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }
        
        if (messageData.speaker === undefined) {
            if(game.users.get(messageData.user).name !== game.chtmrg_lastmessage.alias) {
                game.chtmrg_flag = true;
                game.chtmrg_lastmessage = {};
                return;
            }
        }
        else {
            if(messageData.speaker.alias !== game.chtmrg_lastmessage.alias) {
                game.chtmrg_flag = true;
                game.chtmrg_lastmessage = {};
                return;
            }
        }
        
        if(messageData.isRoll) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }
        
        if((Date.now() - game.chtmrg_lastmessage.data.timestamp) / 1000 > CHTMRGSettings.getSetting(CHTMRG_OPTIONS.MERGE_TIME)) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }
        
        let merge_linse = CHTMRGSettings.getSetting(CHTMRG_OPTIONS.MERGE_LINE);
        
        if(merge_linse > 1 && merge_linse - 2 < (game.chtmrg_lastmessage.data.content.match(/<br \/>/g) || []).length) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }
        
        messageData.content = game.chtmrg_lastmessage.data.content + "<br>" + messageData.content;
        
        game.chtmrg_lastmessage.delete();
        
        return;
    }
    
    static onRenderChatMessage(chatMessage, html, messageData) {
        
        if(CHTMRGSettings.getSetting(CHTMRG_OPTIONS.DUP_CLEAN)) {
           if(Math.abs(Array.from(game.messages)[game.messages.size-1].data.timestamp - Array.from(game.messages)[game.messages.size-2].data.timestamp) < 20) {
                Array.from(game.messages)[game.messages.size-2].delete();
           }
           
        }
           
        if(!CHTMRGSettings.getSetting(CHTMRG_OPTIONS.ENABLE_MERGE)) return;
        
        let message = messageData.message;
        
        if(chatMessage.isRoll) {
            game.chtmrg_lastmessage = {};
            game.chtmrg_flag = true;
            return;
        }
        
        if(game.chtmrg_flag) {
            game.chtmrg_lastmessage = chatMessage;
            game.chtmrg_flag = false;
            return;
        }
        
        if(game.chtmrg_lastmessage.alias != chatMessage.alias) {
            game.chtmrg_lastmessage = {};
            game.chtmrg_flag = true;
            return;
        }
        
        
        game.chtmrg_lastmessage = chatMessage;
        return;
	}

}
