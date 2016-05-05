const WebSocket = require('ws');
const Promise = require('bluebird');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const ws = new WebSocket('ws://cmc-tasklists.herokuapp.com/');
const Client = require('./libclient.js');

// cli
ws.on('open', function open() {

	ws.on('message', function(message) {
		message = JSON.parse(message);
		if ('type' in message) {
			switch (message.type) {
			case 'tasklists':
				for (tl of message.tasklists) {
					console.log(tl.name);
					console.log('\tOwner: ' + tl.owner);
					console.log('\tAllowed users: ' + tl.allowed);
					console.log('\tTasks:');
					for (task of tl.tasks) {
						console.log('\t\t' + task.description);
						console.log('\t\t\t' + task.status);
						console.log('\t\t\tDiscussion:');
						for (comment of task.comments) {
							console.log('\t\t\t\t' + comment.author + 
							' said at ' + comment.date.toString() + ':');
							console.log('\t\t\t\t\t' + comment.text);
						}
					}
					console.log();
				}
				break;
			default:
				console.log('Unsupported message ' + message.type);
			}
		}
		else
			console.log(message);
		rl.prompt();
	});


	rl.setPrompt('> ');
	rl.prompt();
	rl.on('line', line => {
		var cmd = line.split(' ');
		Client.p(ws, cmd);
	}).on('close', () => {
		rl.write('\n');
		process.exit(0);
	});
});