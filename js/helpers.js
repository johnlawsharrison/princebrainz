// helper for filtering json by keys
var _SEARCH_KEYS = {
	'happy': {
		'key': 'mood_happy',
		'expected': 'happy',
		'minProb': 0.60
	},
	'sad': {
		'key': 'mood_sad',
		'expected': 'sad',
		'minProb': 0.60 // tuneable minimum search probability for this category
 	},
	'relaxed': {
		'key': 'mood_relaxed',
		'expected': 'relaxed',
		'minProb': 0.60
	},
	'aggressive': {
		'key': 'mood_aggressive',
		'expected': 'aggressive',
		'minProb': 0.60
	},
	'danceable': {
		'key': 'danceability',
		'expected': 'danceable',
		'minProb': 0.60
	},
	'acoustic': {
		'key': 'mood_acoustic',
		'expected': 'acoustic',
		'minProb': 0.60
	},
	'electronic': {
		'key': 'mood_electronic',
		'expected': 'electronic',
		'minProb': 0.60
	},
	'instrumental': {
		'key': 'voice_instrumental',
		'expected': 'instrumental',
		'minProb': 0.60
	},
	// 'atonal': {
	// 	'key': 'tonal_atonal',
	// 	'expected': 'atonal',
	// 	'minProb': 0.60
	// },
	'party': {
		'key': 'mood_party',
		'expected': 'party',
		'minProb': 0.60
	},
	'bright': {
		'key': 'timbre',
		'expected': 'bright',
		'minProb': 0.60
	},
	'dark': {
		'key': 'timbre',
		'expected': 'dark',
		'minProb': 0.60
	},
}