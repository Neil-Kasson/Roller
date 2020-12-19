require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()
const queue = new Map()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
	if (msg.content.substr(0, 5) === '-roll') {
		var mess = msg.content.substr(5)
		msg.reply('```' + sort(mess) + '```')
	} else if (msg.content.substr(0, 7) === '-battle') {
		msg.reply(battle(msg))
	}
})

client.login(process.env.BOT_TOKEN)

function battle(msg) {
	var mess = msg.content.substr(7)
	const vc = msg.member.voice.channel
	const serverQueue = queue.get(msg.guild.id)
	if (!vc) {
		return 'You need to be in a voice channel'
	}

	var mems = vc.members;
	let keys = [...mems.values()]
	var names = []


	mess = mess.replace(/\s+/g, '')

	var commaIndex = 0;
	var temp = ''
	while (mess.length > 0) {
		if (mess.includes(',')) {
			commaIndex = mess.indexOf(',')
			names.push(mess.substr(0, commaIndex))
			mess = mess.substr(commaIndex + 1)
		} else {
			names.push(mess)
			mess = ''
		}
	}

	for (var i = 0; i < keys.length; i++) {
		if (keys[i].nickname != null) {
			names.push(keys[i].nickname)
		} else {
			names.push(keys[i].user.username)
		}
	}
	var out = '```\nBATTLE ORDER:\n\n'
	names = shuffle(names)
	for (var j in names) {
		out = out + j +') ' + names[j] + '\n'
	}
	out = out + '```'
	return out;
}

function shuffle(array) {
	var m = array.length,
		t, i;

	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m]
		array[m] = array[i];
		array[i] = t;
	}
	return array;

	return outArr;
}

function sort(mess) {
	mess = mess.replace(/\s+/g, '')
	var final = 0
	var rolls = []

	while (mess.length > 0) {
		if (mess.charAt(0) == '+') {
			mess = mess.substr(1)

		}
		if (mess.includes('d')) {
			var dLoc = mess.indexOf('d')
			var times = parseInt(mess.substr(0, dLoc))
			mess = mess.substr(dLoc + 1)
			var arr = getRest(mess)
			var die = arr[0]
			mess = mess.substr(arr[1])
			var temp = 0
			for (let i = 0; i < times; i++) {
				temp = (Math.floor(Math.random() * die)) + 1
				rolls.push(temp)
				final += temp
			}
		} else if (mess.length > 0) {
			rolls.push(parseInt(mess))
			final += parseInt(mess)
			mess = ''
		}
	}
	var out = ''
	while (rolls.length > 1) {
		out = out + rolls.shift() + ' + '
	}
	if (rolls.length == 1) {
		out = out + rolls.shift()
	}
	return (out + ' => ' + final)

}

// returns array [string up to '+' (if there's a '+'), and index of '+' (end of string if no '+')]
function getRest(mess) {
	if (mess.includes('+')) {
		var end = mess.indexOf('+')
	} else {
		var end = mess.length
	}
	return ([mess.substr(0, end), end])

}