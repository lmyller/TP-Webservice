const btn = document.querySelector('#btn');
const selectCountry = document.querySelector("#choose-country");
const selectIndicator = document.querySelector("#choose-indicator");
const start = 2000;
const end = 2020;
let resultado = document.querySelector('#resultado');
let jsonCountries;
let lista = [];

fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(json => createCountries(json));

for (let i = 1; i <= 50; i++) {
    fetch('http://api.worldbank.org/v2/indicator?page=' + i + '&format=json')
        .then(response => response.json())
        .then(json => createIndicator(json[1]))
}

function createCountries(countries) {
    jsonCountries = countries;

    let lista = [];

    for (let value of countries) {
        if (value['name']['common'] !== lista[0]) {
            lista[0] = value['name']['common']
            let option = document.createElement('option');
            option.text = value['name']['common'];
            selectCountry.add(option, null);
        }
    }
}

function createIndicator(indicators) {
    for (let value of indicators) {
        let option1 = document.createElement('option');
        option1.text = value['name'];
        selectIndicator.add(option1, null);
        lista.push({ 'nome': value['name'], 'id': value['id'] })
    }
}

btn.onclick = function () {
    removeButtons();
    removeTable();
    if(selectCountry.value !== '' && selectIndicator.value !== ''){
        verifyCountry(jsonCountries, selectCountry.value);
        createListCountries(jsonCountries);
    }

    if(selectCountry.value === '')
        selectCountry.style.borderColor = 'red';
    else
        selectCountry.style.borderColor = '#6c757d';

    if(selectIndicator.value === '')
        selectIndicator.style.borderColor = 'red';
    else
        selectIndicator.style.borderColor = '#6c757d';
}

function removeButtons(){
    const listCountries = document.querySelector('.list-group');

    if(listCountries.hasChildNodes()){
        while (listCountries.firstChild)
            listCountries.removeChild(listCountries.lastChild);
    }
}

function searchIndicatorCountry(btnCountry) {
    removeButtons();
    removeTable();
    verifyCountry(jsonCountries, btnCountry);
    createListCountries(jsonCountries);
    selectCountry.value = btnCountry;
}

function createListCountries(jsonCountries) {
    const listCountries = document.querySelector('.list-group');

    for (let i = 0; i < 18; i++) {
        const country = jsonCountries[getRandomNumber(0, jsonCountries.length)]['name']['common'];
        button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.setAttribute('data-index', 'i');
        button.setAttribute('class', 'list-group-item list-group-item-action');
        button.setAttribute('onclick', 'searchIndicatorCountry("' + country + '")');
        button.innerHTML = country;
        listCountries.appendChild(button);
    }
}

function verifyCountry(countries, country) { 
    for (let value of countries)
        if (value['name']['common'] === country)
            dataCountry(value['cca3'], country);
}

function dataCountry(code, country) {
    fetch('https://servicodados.ibge.gov.br/api/v1/paises/' + code)
        .then(response => response.json())
        .then(json => verifyIndicators(json[0]['unidades-monetarias'][0]['id']['ISO-4217-ALPHA'], code, country));
}

function verifyIndicators(money, code, country) {
    let id;

    if (money === 'VES')
        money = 'VEF';

    for (let value of lista) {
        if (value['nome'] === selectIndicator.value)
            id = { 'id': value['id'], 'name': selectIndicator.value };
    }

    fetch('http://api.worldbank.org/v2/country/' + code.toLowerCase() + '/indicator/' + id['id'] + '?date=' + start + ':' + end + '&format=json')
        .then(response => response.json())
        .then(json => verifyMoney(json[1], money, id['name'], country));
}

function verifyMoney(json, money, indicator, country) {
    let date = [];
    let data = [];
    const noGraph = document.querySelector('#graph');
    const chart = document.querySelector('#myChart');

    if (json !== null)
        for (let value of json)
            if (value['value'] !== null) {
                date.push(value['date']);
                data.push(value['value']);
            }

    date = date.sort();
    data = data.sort();

    if (data.length === 0 || date.length === 0) {
        chart.style.display = 'none';
        noGraph.style.display = 'block';
        noGraph.innerHTML = 'NO DATA AVAILABLE TO ' + indicator.toUpperCase() + ' TO ' + country.toUpperCase();
        return;
    }

    if (noGraph.style.display === 'block') {
        noGraph.style.display = 'none';
        chart.style.display = 'block';
    }

    fetch('http://127.0.0.1:2000/api/v1/money/' + money + '/' + 'start_time' + date[0] + ':end_time' + date[date.length - 1])
        .then(response => response.json())
        .then(json => createGraph(json, date, data, money, indicator));
}

function createGraph(json, date, data, money, indicator) {
    const myChart = document.querySelector('#myChart');
    let data_money = null;

    myChart.style.display = 'block';


    if (json.length !== 0) {
        data_money = average_money(json)

        new Chart('myChart', {
            type: 'line',
            data: {
                labels: date,
                datasets: [{
                    data: data,
                    label: indicator,
                    borderColor: 'red',
                    pointBackgroundColor: 'grey',
                    pointBorderColor: 'grey',
                    fill: false,
                }, {
                    data: data_money,
                    label: 'Average Price: USD - ' + money,
                    borderColor: "green",
                    pointBackgroundColor: 'grey',
                    pointBorderColor: 'grey',
                    fill: false
                }]
            },
            options: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: 'grey'
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: 'grey'
                        }
                    }]
                }
            }
        });

        createTable(data, date, data_money, money, indicator);
    }

    else {
        new Chart('myChart', {
            type: 'line',
            data: {
                labels: date,
                datasets: [{
                    data: data,
                    label: indicator,
                    borderColor: "red",
                    pointBackgroundColor: 'grey',
                    pointBorderColor: 'grey',
                    fill: false,
                }]
            },
            options: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                scales: {
                    xAxes: [{
                        gridLines: {
                            color: 'grey'
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            color: 'grey'
                        }
                    }]
                }
            }
        });

        createTable(data, date, data_money, money, indicator);
    }
}

function createTable(data, date, data_money, money, indicator) {
    const tableChart = document.querySelector('#table-chart');
    
    removeTable();

    if (data.length !== 0 || date.length !== 0) {
        let thead = document.createElement('thead');
        let tbody = document.createElement('tbody');
        let row_1 = document.createElement('tr');
        let heading_date = document.createElement('th');
        heading_date.innerHTML = 'Date';
        heading_date.setAttribute('scope', 'col');
        let heading_data = document.createElement('th');
        heading_data.innerHTML = indicator;
        heading_data.setAttribute('scope', 'col');

        tableChart.appendChild(thead);
        tableChart.appendChild(tbody);

        row_1.appendChild(heading_date);
        row_1.appendChild(heading_data);

        if (data_money !== null) {
            let heading_money = document.createElement('th');
            heading_money.innerHTML = 'USD - ' + money;
            heading_money.setAttribute('scope', 'col');
            row_1.appendChild(heading_money);
        }

        thead.appendChild(row_1);

        for (let i = date.length - 1; i >= 0; i--) {
            let row = document.createElement('tr');
            let heading_date = document.createElement('td');
            heading_date.innerHTML = date[i];
            heading_date.setAttribute('scope', 'row');
            let heading_data = document.createElement('td');
            heading_data.innerHTML = data[i].toFixed(4);
            heading_data.setAttribute('scope', 'row');

            row.appendChild(heading_date);
            row.appendChild(heading_data);

            if (data_money !== null) {
                let heading_money = document.createElement('td');
                heading_money.innerHTML = data_money[i];
                heading_money.setAttribute('scope', 'row');
                row.appendChild(heading_money);
            }

            tbody.appendChild(row);
        }

        tableChart.style.display = 'block';
    }
}

function removeTable(){
    const tableChart = document.querySelector('#table-chart');
    
    if(tableChart.hasChildNodes()){
        while(tableChart.firstChild)
            tableChart.removeChild(tableChart.lastChild);
    }
}

function average_money(json) {
    data_money = []

    for (let value of json)
        data_money.push(value['average-price'])

    return data_money.sort();
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}