var helper = require('sendgrid').mail;
var from_email = new helper.Email('secretsanta@tobyglover.com');
var subject = 'Your Secret Santa Assignment!';
var tracking_settings = new helper.TrackingSettings()
var open_tracking = new helper.OpenTracking(true)
tracking_settings.setOpenTracking(open_tracking)

function run(userList) {
	var d = getDerangement(userList.length)
	var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
	
	for (var i = 0; i < userList.length; i++) {
		var user = userList[i];
		var givesTo = userList[d[i]];

		var request = sg.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: writeMail(user, givesTo)
		});

		sg.API(request, function(error, response) {
			console.log("Sengrid status code: " + response.statusCode);
		});
	}
}

function getDerangement(n) {
	var derangement = false;
	while (!derangement) {
		var v = Array.from(Array(n).keys());
		shuffle(v);

		derangement = true;
		for (var i = 0; i < n; i++) {
			if (i == v[i]) {
				derangement = false;
				break;
			}
		}
	}
	return v;
}

function shuffle(a) {
	var tmp, r, i;
    for (i = 0; i < a.length; i++) {
        r = Math.floor(Math.random() * a.length);
        tmp  = a[r];
        a[r] = a[i];
        a[i] = tmp;
    }
}

function writeMail(user, givesTo) {
	var to_email = new helper.Email(user.email);
	var content = new helper.Content('text/html', writeContent(user.name, givesTo.name));
	var mail = new helper.Mail(from_email, subject, to_email, content);

  	mail.addTrackingSettings(tracking_settings)

	return mail.toJSON();
}

function writeContent(userName, givesToName) {
	return `<html>
			<body style="margin: 0">
				<div style="background-color: #25b241;">
					<img src="http://tobyglover.herokuapp.com/images/santa.png" alt="santa" style="height:7em; vertical-align: middle;"/>
					<h1 style="color: #FFFFFF; margin: auto 0; display: inline-block; vertical-align: middle";>Your Secret Santa Assignment</h1>
				</div>
				
				<div style="margin: 0 10px;">
					<p>Hi ${userName},</p>
					<p></p>
					<p>Its Christmas time again, and that means its time to give secret gifts. This year, you're giving to <b>${givesToName}</b>.</p>
					<p></p>
					<p>Merry Christmas!</p>
					<p style="border-top: 1px solid black">Sent via <a href="http://tobyglover.com" style="color: rgb(0, 0, 179)">tobyglover.com</a></p>
				</div>
			</body>
			</html>`
}

module.exports.run = run;