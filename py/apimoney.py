from bs4 import BeautifulSoup
import requests
import json
from flask import Flask
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, support_credentials=True)

def json_money(data):
    datas = []
    data_money = []

    data_json = []

    for value in data:
        datas.append(value.find_all('td'))

    for row in datas:
        data_year = []
        for column in row:
            column = str(column)
            column = column.replace('<td>', '').replace('</td>', '')
            data_year.append(column)

        data_money.append(data_year)

    for value in data_money:
        data_json.append({"year": value[0], "average-price": value[1]})

    return json.dumps(data_json)


@app.route('/api/v1/money/<string:money>/start_time<int:start_time>:end_time<int:end_time>', methods=['GET'])
def return_data_money(money, start_time, end_time):
    r = requests.get(
        'https://fxtop.com/pt/historico-das-taxas-de-cambio.php?YA=1&C1=USD&C2={}&A=1&YYYY1={}&MM1=01&DD1=01&YYYY2={}&MM2=12&DD2=30&LANG=en'.format(money, start_time, end_time))

    soup = BeautifulSoup(r.text, 'html.parser')
    
    table = soup.find("table", border="1")

    if table is None:
        return []

    table = table.find_all('tr')

    data = [d for d in table]

    data.pop(0)

    return json_money(data)


if __name__ == "__main__":
    app.run(port=2000, debug=True)
