require('dotenv').config()

const Discord = require('discord.js')
const client = new Discord.Client()

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', msg => {
	if (msg.content.substr(0, 5) === '-roll') {
		var mess = msg.content.substr(5)
		msg.reply('```' + sort(mess) + '```')
	}
})

client.login(process.env.BOT_TOKEN)

function sort(mess) {
	mess = mess.replace(' ', '')
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