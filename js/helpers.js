// helper for filtering json by keys
var _SEARCH_KEYS = {
	'happy': {
		'key': 'mood_happy',
		'expected': 'happy',
		'minProb': 0.70,
		'description': 'sound happy in tone'
	},
	'sad': {
		'key': 'mood_sad',
		'expected': 'sad',
		'minProb': 0.70, // tuneable minimum search probability for this category,
		'description': 'sound sad in tone'
 	},
	'relaxed': {
		'key': 'mood_relaxed',
		'expected': 'relaxed',
		'minProb': 0.90,
		'description': 'have a relaxed groove'
	},
	'aggressive': {
		'key': 'mood_aggressive',
		'expected': 'aggressive',
		'minProb': 0.90,
		'description': 'may feel aggressive'
	},
	'danceable': {
		'key': 'danceability',
		'expected': 'danceable',
		'minProb': 0.90,
		'description': 'will make you want to dance'
	},
	'acoustic': {
		'key': 'mood_acoustic',
		'expected': 'acoustic',
		'minProb': 0.90,
		'description': 'likely feature acoustic instruments'
	},
	'electronic': {
		'key': 'mood_electronic',
		'expected': 'electronic',
		'minProb': 0.90,
		'description': 'likely feature electronic instruments'
	},
	// 'instrumental': {
	// 	'key': 'voice_instrumental',
	// 	'expected': 'instrumental',
	// 	'minProb': 0.95,
	// 	'description': 'may be instrumental'
	// },
	// 'atonal': {
	// 	'key': 'tonal_atonal',
	// 	'expected': 'atonal',
	// 	'minProb': 0.90,
	// 'description': ''
	// },
	'party': {
		'key': 'mood_party',
		'expected': 'party',
		'minProb': 0.90,
		'description': 'will put you in a partying mood'
	},
	'bright': {
		'key': 'timbre',
		'expected': 'bright',
		'minProb': 0.90,
		'description': 'are bright in timbre'
	},
	'dark': {
		'key': 'timbre',
		'expected': 'dark',
		'minProb': 0.90,
		'description': 'are dark in timbre'
	},
}