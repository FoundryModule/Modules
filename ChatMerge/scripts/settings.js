export const CHTMRG_OPTIONS = {
	ENABLE_MERGE: "enableMerge",
    DUP_CLEAN: "dupClean",
    SINGLE_BUBBLE: "singleBubble",
	MERGE_TIME: "mergeTime",
    MERGE_LINE: "mergeLine"
}

export class CHTMRGSettings {
	static registerSettings() {
		game.settings.register("ChatMerge", CHTMRG_OPTIONS.ENABLE_MERGE, {
			name: "chtmrg.merge-on-s",
			hint: "chtmrg.merge-on-l",
			scope: "world",
			config: true,
			default: true,
			type: Boolean,
			onChange: enableMerge => window.location.reload()
		});
        
        game.settings.register("ChatMerge", CHTMRG_OPTIONS.DUP_CLEAN, {
            name: "chtmrg.dup-clean-s",
            hint: "chtmrg.dup-clean-l",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
            onChange: enableMerge => window.location.reload()
        });
        
        game.settings.register("ChatMerge", CHTMRG_OPTIONS.SINGLE_BUBBLE, {
            name: "chtmrg.single-bubble-s",
            hint: "chtmrg.single-bubble-l",
            scope: "world",
            config: true,
            default: true,
            type: Boolean,
            onChange: enableMerge => window.location.reload()
        });
		
		game.settings.register("ChatMerge", CHTMRG_OPTIONS.MERGE_TIME, {
			name: "chtmrg.merge-time-s",
			hint: "chtmrg.merge-time-l",
			scope: "world",
			config: true,
			default: 15,
			type: Number,
			onChange: mergeTime => window.location.reload()
		});
        
        game.settings.register("ChatMerge", CHTMRG_OPTIONS.MERGE_LINE, {
            name: "chtmrg.merge-line-s",
            hint: "chtmrg.merge-line-l",
            scope: "world",
            config: true,
            default: 5,
            type: Number,
            onChange: mergeTime => window.location.reload()
        });
	}

	static getSetting(option) {
		return game.settings.get("ChatMerge", option);
	}
}
