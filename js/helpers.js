// helper for filtering json by keys
var _SEARCH_KEYS = {
	'sad': {
		'key': 'mood_sad',
		'expected': 'sad'
	},
	'happy': {
		'key': 'mood_happy',
		'expected': 'happy'
	},
	'aggressive': {
		'key': 'mood_aggressive',
		'expected': 'aggressive'
	},
	'acoustic': {
		'key': 'mood_acoustic',
		'expected': 'acoustic'
	},
	'instrumental': {
		'key': 'voice_instrumental',
		'expected': 'instrumental'
	},
	'relaxed': {
		'key': 'mood_relaxed',
		'expected': 'relaxed'
	},
	'atonal': {
		'key': 'tonal_atonal',
		'expected': 'atonal'
	},
	'danceable': {
		'key': 'danceability',
		'expected': 'danceable'
	},
	'party': {
		'key': 'mood_party',
		'expected': 'party'
	},
	'dark': {
		'key': 'timbre',
		'expected': 'dark'
	},
	'bright': {
		'key': 'timbre',
		'expected': 'bright'
	},
	'electronic': {
		'key': 'mood_electronic',
		'expected': 'electronic'
	}
}