import { CHTMRGSettings, CHTMRG_OPTIONS } from "./settings.js";

export class ChatResolver {
    
    static resolvePreCreateMessage(messageData) {
        
        messageData.content = messageData.content.replace(/\*\*(.*)\*\*/g,"<b>$1</b>");
        messageData.content = messageData.content.replace(/\*(.*)\*/g,"<i>$1</i>");
        messageData.content = messageData.content.replace(/( )(?![^<]*>|[^<>]*<)/g,"&nbsp;");
        
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

	    if (messageData.type === 0) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }

        if (messageData.type !== game.chtmrg_lastmessage.data.type) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }

        if(messageData.whisper != undefined) {
            if(!messageData.whisper.equals(game.chtmrg_lastmessage.data.whisper) || messageData.user != game.chtmrg_lastmessage.data.user) {
                game.chtmrg_flag = true;
                game.chtmrg_lastmessage = {};
                return;
            }
        }
        else if (![].equals(game.chtmrg_lastmessage.data.whisper)) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }
        
        if(messageData.roll != undefined) {
            game.chtmrg_flag = true;
            game.chtmrg_lastmessage = {};
            return;
        }
        
        if(game.chtmrg_lastmessage.isRoll) {
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
        
        if(messageData.flags === undefined || messageData.flags === null) {
           messageData.flags = {"CHTMRG_APPEND" : true, "CHTMRG_ORIGINAL" : messageData.content};
        }
       else {
           messageData.flags = Object.assign(messageData.flags, {"CHTMRG_APPEND" : true, "CHTMRG_ORIGINAL" : messageData.content});
       }
        messageData.content = game.chtmrg_lastmessage.data.content + "<br>" + messageData.content;
           
        game.chtmrg_lastmessage.delete();
        
        return;
    }
    
    static onRenderChatMessage(chatMessage, html, messageData) {
        
        if(CHTMRGSettings.getSetting(CHTMRG_OPTIONS.DUP_CLEAN)) {
           var msg1 = Array.from(game.messages)[game.messages.size-1];
           var msg2 = Array.from(game.messages)[game.messages.size-2];
           if(msg1 != undefined && msg2 != undefined) {
               if(msg1.data.user == msg2.data.user) {
                   if(Math.abs(msg1.data.timestamp - msg2.data.timestamp) < 30) {
                        msg2.delete();
                   }
               }
           }
        }
           
        if(!CHTMRGSettings.getSetting(CHTMRG_OPTIONS.ENABLE_MERGE)) return;
        
        let message = messageData.message;
           
        if(game.chtmrg_flag) {
            game.chtmrg_lastmessage = chatMessage;
            game.chtmrg_flag = false;
            return;
        }
        
        game.chtmrg_lastmessage = chatMessage;

        return;
	}
           
   static onChatBubble(token, html, message, {emote=false}={}) {
       if(!CHTMRGSettings.getSetting(CHTMRG_OPTIONS.SINGLE_BUBBLE)) return true;
           
       if(game.chtmrg_lastmessage.data.flags["CHTMRG_APPEND"] === true) {
            if((message.match(/<br \/>/g) || []).length > 0) {
                var temp = game.chtmrg_lastmessage.data.content;
                game.chtmrg_lastmessage.data.content = game.chtmrg_lastmessage.data.flags["CHTMRG_ORIGINAL"];
                game.messages.sayBubble(game.chtmrg_lastmessage);
                game.chtmrg_lastmessage.data.content = temp;
                return false;
            }
       }
       return true;
   }

}
