const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const sectionsSchema = new Schema({
	building:{
		allCompleted:{
			type: Boolean,
			default: false,
			required: true,
		},
		dirty:{
			type: Boolean,
			default: false,
			required: true
		},
		affects:[
			"allotment"
		],
		dependsOn:[]
	},
	combinations:{
		allCompleted:{
			type: Boolean,
			default: false,
			required: true
		},
		dirty:{
			type: Boolean,
			default: false,
			required: true
		},
		affects:[
			"batches", "combisToSessions", "allotment"
		],
		dependsOn:[]
	},
	batches:{
		allCompleted:{
			type: Boolean,
			default: false,
			required: true
		},
		dirty:{
			type: Boolean,
			default: false,
			required: true
		},
		affects:[
			"combisToSessions", "allotment"
		],
		dependsOn:[
			"combinations"
		]
	},
	sessions:{
		allCompleted:{
			type: Boolean,
			default: false,
			required: true
		},
		dirty:{
			type: Boolean,
			default: false,
			required: true
		},
		affects:[
			"combisToSessions", "allotment"
		],
		dependsOn:[]
	},
	combisToSessions:{
		allCompleted:{
			type: Boolean,
			default: false,
			required: true
		},
		dirty:{
			type: Boolean,
			default: false,
			required: true
		},
		affects:[
			"allotment"
		],
		dependsOn:[
			"combinations", "batches", "sessions"
		]
	},
	allotment:{
		allCompleted:{
			type: Boolean,
			default: false,
			required: true
		},
		dirty:{
			type: Boolean,
			default: false,
			required: true
		},
		affected:[],
		dependsOn:[
			"building", "combinations", "batches", "sessions", "combisToSessions"
		]
	}
});

module.exports = sectionsSchema;