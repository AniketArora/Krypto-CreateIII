let products;
let currencies;

let stats = [];

let productsInEuro = [];

let objectlist = [];

let stat;

let candles;

const setColors = function(currency) {
	switch (currency) {
		case 'BTC':
			return '#F7931A';

		case 'ETH':
			return '#82A3D1';

		case 'ETC':
			return '#17DE8D';

		case 'LTC':
			return '#A5A8A9';

		case 'BCH':
			return '#8EC352';

		case 'ZRX':
			return '#1D2227';

		case 'XLM':
			return '#DCF2F9';

		case 'EOS':
			return '#070707';

		default:
			return '#000000';
	}
};

const checkdata = async function() {
	products.forEach(element => {
		if (element.quote_currency == 'EUR') {
			productsInEuro.push(element);
		}
	});

	for (i = 0; i < productsInEuro.length; i++) {
		let currency;

		currencies.forEach(element => {
			if (productsInEuro[i].base_currency === element.id) {
				currency = element;
			}
		});

		await getStats(productsInEuro[i].id);

		let item = {
			id: productsInEuro[i].id,
			base_currency: productsInEuro[i].base_currency,
			quote_currency: productsInEuro[i].quote_currency,
			name: currency.name,
			price: stat.last,
			open: stat.open,
			color: setColors(productsInEuro[i].base_currency)
		};

		objectlist.push(item);
	}

	let sortedlist = objectlist.sort((a, b) => (parseFloat(a.price) < parseFloat(b.price) ? 1 : -1));

	console.log(sortedlist);

	await makeContainers(sortedlist);

	await makelist(sortedlist);
};

function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const makelist = async function(objectlist) {
	for (i = 5; i < objectlist.length; i++) {
		console.log(objectlist[i]);

		document.querySelector('.js-list').innerHTML += `<div class="c-app__listitem js-listitem">
		<div class="c-list__title">${objectlist[i].name} (${objectlist[i].base_currency})</div>
			<div class="c-list__label--price">
				<div class="c-list__price">€ ${Math.round(parseFloat(objectlist[i].price) * 100) / 100}</div>
				<div class="c-list__percentage js-percent-${i}"> (${Math.round(((objectlist[i].price - objectlist[i].open) / objectlist[i].open) * 100 * 100) / 100} %) </div>
			</div>
		</div>`;

		if (Math.round(((objectlist[i].price - objectlist[i].open) / objectlist[i].open) * 100 * 100) / 100 < 0) {
			var style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule(`.js-percent-${i} {color: #ff0000}`);
		} else {
			var style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule(`.js-percent-${i} {color: #008000}`);
		}
	}
};

const makeContainers = async function(objectlist) {
	for (i = 0; i < 5; i++) {
		document.querySelector('.js-cards').innerHTML += `<div class="c-app__card js-card js-card-${i}">
		<div class="c-card__title js-title">${objectlist[i].name} (${objectlist[i].base_currency})</div>
		<div class="c-card__label--price">
			<div class="c-card__price js-price">€ ${Math.round(parseFloat(objectlist[i].price) * 100) / 100}</div>
			<div class="c-card__percentage js-percentage js-percentage-${i}">(${Math.round(((objectlist[i].price - objectlist[i].open) / objectlist[i].open) * 100 * 100) / 100} %)</div>
		</div>
		<div class="c-card__graph js-card-graph-${i}">
			<canvas id="js-chart-${i}" width="200" height="240"></canvas>
		</div>
    	</div>`;

		if (Math.round(((objectlist[i].price - objectlist[i].open) / objectlist[i].open) * 100 * 100) / 100 < 0) {
			var style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule(`.js-percentage-${i} {color: #ff0000}`);
		} else {
			var style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule(`.js-percentage-${i} {color: #008000}`);
		}

		var style = document.createElement('style');
		document.head.appendChild(style);
		style.sheet.insertRule(`.js-card-${i} {border-bottom: 2px solid ${objectlist[i].color}}`);
	}

	document.querySelector('.c-loader').classList.add('u-hidden');
	document.querySelector('.c-app').classList.remove('u-hidden');

	await makechart1(objectlist);
	await makechart2(objectlist);
	await makechart3(objectlist);
	await makechart4(objectlist);
	await makechart5(objectlist);
};

let makechart1 = async function(objectlist) {
	let prices = [];
	let dates = [];

	await getCandles(objectlist[0].id);

	for (let item of candles) {
		dates.push(_parseMillisecondsIntoReadableTime(item[0]));
		prices.push(item[4]);
	}

	let newdates = dates.reverse();
	let newprices = prices.reverse();

	var ctx = document.getElementById(`js-chart-${0}`).getContext('2d');
	console.log(ctx);

	Chart.defaults.global.elements.point.radius = 0;

	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: newdates,
			datasets: [
				{
					data: newprices,
					borderWidth: 2,
					borderColor: objectlist[0].color,
					backgroundColor: 'rgba(255, 255, 255, 0.2)'
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: false
						}
					}
				]
			},
			legend: {
				display: false
			},
			bezierCurve: true
		}
	});
};

let makechart2 = async function(objectlist) {
	let prices = [];
	let dates = [];

	await getCandles(objectlist[1].id);

	for (let item of candles) {
		dates.push(_parseMillisecondsIntoReadableTime(item[0]));
		prices.push(item[4]);
	}

	let newdates = dates.reverse();
	let newprices = prices.reverse();

	var ctx = document.getElementById(`js-chart-${1}`).getContext('2d');
	console.log(ctx);

	Chart.defaults.global.elements.point.radius = 0;

	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: newdates,
			datasets: [
				{
					data: newprices,
					borderWidth: 2,
					borderColor: objectlist[1].color,
					backgroundColor: 'rgba(255, 255, 255, 0.2)'
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: false
						}
					}
				]
			},
			legend: {
				display: false
			},
			bezierCurve: true
		}
	});
};

let makechart3 = async function(objectlist) {
	let prices = [];
	let dates = [];

	await getCandles(objectlist[2].id);

	for (let item of candles) {
		dates.push(_parseMillisecondsIntoReadableTime(item[0]));
		prices.push(item[4]);
	}

	let newdates = dates.reverse();
	let newprices = prices.reverse();

	var ctx = document.getElementById(`js-chart-${2}`).getContext('2d');
	console.log(ctx);

	Chart.defaults.global.elements.point.radius = 0;

	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: newdates,
			datasets: [
				{
					data: newprices,
					borderWidth: 2,
					borderColor: objectlist[2].color,
					backgroundColor: 'rgba(255, 255, 255, 0.2)'
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: false
						}
					}
				]
			},
			legend: {
				display: false
			},
			bezierCurve: true
		}
	});
};

let makechart4 = async function(objectlist) {
	let prices = [];
	let dates = [];

	await getCandles(objectlist[3].id);

	for (let item of candles) {
		dates.push(_parseMillisecondsIntoReadableTime(item[0]));
		prices.push(item[4]);
	}

	let newdates = dates.reverse();
	let newprices = prices.reverse();

	var ctx = document.getElementById(`js-chart-${3}`).getContext('2d');
	console.log(ctx);

	Chart.defaults.global.elements.point.radius = 0;

	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: newdates,
			datasets: [
				{
					data: newprices,
					borderWidth: 2,
					borderColor: objectlist[3].color,
					backgroundColor: 'rgba(255, 255, 255, 0.2)'
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: false
						}
					}
				]
			},
			legend: {
				display: false
			},
			bezierCurve: true
		}
	});
};

let makechart5 = async function(objectlist) {
	let prices = [];
	let dates = [];

	await getCandles(objectlist[4].id);

	for (let item of candles) {
		dates.push(_parseMillisecondsIntoReadableTime(item[0]));
		prices.push(item[4]);
	}

	let newdates = dates.reverse();
	let newprices = prices.reverse();

	var ctx = document.getElementById(`js-chart-${4}`).getContext('2d');
	console.log(ctx);

	Chart.defaults.global.elements.point.radius = 0;

	var chart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: newdates,
			datasets: [
				{
					data: newprices,
					borderWidth: 2,
					borderColor: objectlist[4].color,
					backgroundColor: 'rgba(255, 255, 255, 0.2)'
				}
			]
		},
		options: {
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: false
						}
					}
				]
			},
			legend: {
				display: false
			},
			bezierCurve: true
		}
	});
};

let getCandles = async function(id) {
	URL = `https://api.pro.coinbase.com/products/${id}/candles`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			candles = data;
		});
};

let getStats = async function(id) {
	URL = `https://api.pro.coinbase.com/products/${id}/stats`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			stat = data;
		});
};

let getProducts = async function() {
	URL = `https://api.pro.coinbase.com/products`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			products = data;
		});
};

let getCurrencies = async function() {
	URL = `https://api.pro.coinbase.com/currencies`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			currencies = data;
		});
};

const getalldata = async function() {
	await getProducts();
	await getCurrencies();
	await checkdata();
};

document.addEventListener('DOMContentLoaded', function() {
	getalldata();
});
