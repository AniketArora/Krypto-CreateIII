function setTimer() {
	let enddate = new Date('dec 31, 2019 23:59:59').getTime();
	var x = setInterval(function() {
		let now = new Date().getTime();
		let t = enddate - now;
		let days = Math.floor(t / (1000 * 60 * 60 * 24));
		let hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((t % (1000 * 60)) / 1000);

		document.querySelector('.js-days').innerHTML = days;
		document.querySelector('.js-hours').innerHTML = hours;
		document.querySelector('.js-minutes').innerHTML = minutes;
		document.querySelector('.js-seconds').innerHTML = seconds;

		if (t < 0) {
			clearInterval(x);
			document.querySelector('.js-timer').innerHTML = 'LAUNCHED!';
			document.querySelector('.js-days').innerHTML = days;
			document.querySelector('.js-hours').innerHTML = hours;
			document.querySelector('.js-minutes').innerHTML = minutes;
			document.querySelector('.js-seconds').innerHTML = seconds;
		}
	}, 1000);
}

function handleFloatingLabel() {
	let input = document.querySelector('.js-floating-input'),
		label = document.querySelector('.js-floating-label');

	input.addEventListener('blur', function() {
		console.log(event);
		if (input.value) {
			label.classList.add('is-floating');
		} else {
			label.classList.remove('is-floating');
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	console.log('Script loaded!');
	handleFloatingLabel();
	setTimer();
});
