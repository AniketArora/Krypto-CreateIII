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
	console.log(products);
	console.log(currencies);

	products.forEach(element => {
		if (element.quote_currency == 'EUR') {
			productsInEuro.push(element);
		}
	});

	console.log(productsInEuro);

	for (i = 0; i < productsInEuro.length; i++) {
		let currency;

		currencies.forEach(element => {
			if (productsInEuro[i].base_currency === element.id) {
				currency = element;
			}
		});

		await getStats(productsInEuro[i].id);

		console.log(currency);

		console.log(stat);

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

const makeContainers = async function(objectlist) {
	for (i = 0; i < 5; i++) {
		document.querySelector('.js-cards').innerHTML += `<div class="c-app__card js-card js-card-${i}">
		<div class="c-card__title js-title">${objectlist[i].name} (${objectlist[i].base_currency})</div>
		<div class="c-card__label--price">
			<div class="c-card__price js-price">€ ${Math.round(parseFloat(objectlist[i].price) * 100) / 100}</div>
			<div class="c-card__percentage js-percentage">(${Math.round(((objectlist[i].price - objectlist[i].open) / objectlist[i].open) * 100 * 100) / 100} %)</div>
		</div>
		<div class="c-card__graph">
			<canvas id="js-chart-${i}" width="240" height="260"></canvas>
		</div>
    </div>`;

		if (Math.round(((objectlist[i].price - objectlist[i].open) / objectlist[i].open) * 100 * 100) / 100 <= 0) {
			var style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule('.js-percentage {color: #ff0000}');
		} else {
			var style = document.createElement('style');
			document.head.appendChild(style);
			style.sheet.insertRule('.js-percentage {color: #008000}');
		}

		var style = document.createElement('style');
		document.head.appendChild(style);
		style.sheet.insertRule(`.js-card-${i} {border-bottom: 2px solid ${objectlist[i].color}}`);

		let prices = [];
		let dates = [];

		await getCandles(objectlist[i].id);

		console.log(candles);

		for (let item of candles) {
			dates.push(_parseMillisecondsIntoReadableTime(item[0]));
			prices.push(item[4]);
		}

		let newdates = dates.reverse();
		let newprices = prices.reverse();

		var ctx = document.getElementById(`js-chart-${i}`).getContext('2d');
		console.log(ctx);

		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: newdates,
				datasets: [
					{
						label: 'prices',
						data: newprices,
						borderWidth: 1,
						borderColor: objectlist[i].color,
						backgroundColor: objectlist[i].color
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
				}
			}
		});
	}
};

let getCandles = async function(id) {
	URL = `https://api.pro.coinbase.com/products/${id}/candles`;
	await fetch(URL)
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
			console.log(data);
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
			console.log(data);
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
