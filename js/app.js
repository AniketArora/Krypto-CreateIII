let currencies = [];
let products = [];
let currencyids = [];
let stats = [];
let names = [];

let objects = [];

function getBoxes() {
	console.log(stats);
	// console.log(currencies);
	// console.log(currencyids);
	// console.log(currencyids.length);
	// console.log(currencyids[0]);

	console.log(currencies);

	// console.log(products);

	for (i = 0; i < currencyids.length; i++) {
		let currency;
		let currencyobject = currencies[`${i}`];
		console.log(currencyobject);
		// console.log(currencies.length);
		// console.log(stats[i]);

		// for (i = 0; i < currencies.length; i++) {
		// 	if (products[0].base_currency == currencies[i].id) {
		// 		currency = element;
		// 		console.log(currency);
		// 	}
		// }

		let obj = {
			id: currencyids[i],
			//name: currencies[products.quote_currency]
			price: stats[i]
		};
		objects.push(obj);
	}

	console.log(objects);

	let html = `<div class="c-app__card js-card">
		<div class="c-card__title js-title"></div>
		<div class="c-card__label--price">
			<div class="c-card__price js-price"></div>
			<div class="c-card__percentage js-percentage"></div>
		</div>
		<div class="c-card__graph">
			<canvas id="js-chart" width="240" height="260"></canvas>
		</div>
	</div>`;

	for (i = 0; i < 5; i++) {
		document.querySelector('.js-cards').innerHTML += html;
	}
}

let setcurrencyid = queryResponse => {
	let data = queryResponse;

	data.forEach(element => {
		if (element.quote_currency == 'EUR') {
			currencyids.push(element.id);
			products.push(element);
			getStats(element.id);
		}
	});
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

let showProducts = queryResponse => {
	const productsFilter = queryResponse.filter(x => x.quote_currency == 'EUR');
	const currency = currencies.filter(x => x.id == productsFilter[0].base_currency);

	let title = `${currency[0].name} (${productsFilter[0].base_currency})`;
	document.querySelector('.js-title').innerHTML = title;

	getStats(productsFilter[0].id);

	let color = setColors(productsFilter[0].base_currency);

	var style = document.createElement('style');
	document.head.appendChild(style);
	style.sheet.insertRule(`.js-card {border-bottom: 2px solid ${color}}`);

	getCandles(productsFilter[0].id);
};

let showChart = queryResponse => {
	let prices = [];
	let dates = [];
	let data = queryResponse;
	let element = document.querySelector('.js-card');
	let color = element.style.borderBottomColor;

	for (let item of data) {
		dates.push(_parseMillisecondsIntoReadableTime(item[0]));
		prices.push(item[4]);
	}

	let newdates = dates.reverse();
	let newprices = prices.reverse();

	var ctx = document.getElementById('js-chart').getContext('2d');
	var myChart = new Chart(ctx, {
		type: 'line',
		data: {
			labels: newdates,
			datasets: [
				{
					label: 'prices',
					data: newprices,
					borderWidth: 1,
					backgroundColor: color,
					borderColor: color
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
			}
		}
	});
};

let showStats = queryResponse => {
	let last = queryResponse.last;
	let open = queryResponse.open;

	let price = Math.round(last * 100) / 100;
	let pricelabel = `€ ${price}`;
	let percentage = Math.round(((last - open) / open) * 100 * 100) / 100;
	let percentagelabel = `(${percentage} %)`;

	document.querySelector('.js-price').innerHTML = pricelabel;
	document.querySelector('.js-percentage').innerHTML = percentagelabel;

	if (percentage <= 0) {
		var style = document.createElement('style');
		document.head.appendChild(style);
		style.sheet.insertRule('.js-percentage {color: #ff0000}');
	} else {
		var style = document.createElement('style');
		document.head.appendChild(style);
		style.sheet.insertRule('.js-percentage {color: #008000}');
	}
};

let setColors = function(currency) {
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

let getCandles = async function(id) {
	URL = `https://api.pro.coinbase.com/products/${id}/candles`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			//showChart(data);
		});
};

let getStats = async function(id) {
	URL = `https://api.pro.coinbase.com/products/${id}/stats`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			stats.push(data);
		});
};

let getCurrencies = async function() {
	URL = `https://api.pro.coinbase.com/currencies`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			data.forEach(element => {
				currencies.push(element);
			});
		});
};

let getProducts = async function() {
	URL = `https://api.pro.coinbase.com/products`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			setcurrencyid(data);
			getCurrencies();
		})
		.finally(function() {
			getBoxes();
		});
};

document.addEventListener('DOMContentLoaded', function() {
	//getCurrencies();
	getProducts();
});
