const WebSocket = require('ws');
const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

const ClientConnection = require('./libclient.js');

const c = new ClientConnection();

c.connect('ws://localhost:5678')
.then(function() {
	var ws = c.ws;
	
	if (process.argv[2] == '-v')
		ws.on('message', function(message) {
			console.log(message);
		});

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
		c.request(cmd);
	}).on('close', () => {
		rl.write('\n');
		process.exit(0);
	});
});