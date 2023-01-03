# Trabalho prático de webservice
<p>Trabalho prático de webservice cujo objetivo é o desenvolvimento de uma página web usando dados de APIs. Neste trabalho foram usados três APIs, [API do banco mundial](https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information), [API do IBGE](https://servicodados.ibge.gov.br/api/docs/paises) e uma terceira API que retorna o preço da moeda do país pesquisado.</p>
<p>O ínício do uso da api é condicionado a execução do arquivo python *apimoney.py* que vai retornar os preços das moedas em um determinado período, a execução do arquivo depende da instalação de três pacotes, o _beatifulSoup4_, o _requests_ e o _Flask-Cors_, a instalação dos pacotes é realizada através do pip como o arquivo requirements na pasta _py_:</p>
<p>`pip install -r py/requirements.txt`</p>
<p>A página web necessita que seja escolhido um país e um indicador socioeconômico, como consta abaixo:</p>
![site](/TP-Webservice/assets/imagens/site.png)
<p>Caso não seja informado o país ou o indicador socioeconômico, não será mostrado nada, mas as bordas inferiores dos dois inputs ficarão vermelhos:</p>
![Não-Escolhidos](/TP-Webservice/assets/imagens/erro-pesquisa.png)
<p>Se for escolhido o país e o indicador, então será mostrado uma lista de botões com dezoito países aleatórios, um gráfico com o indicador socioeconômico do país e o preço de sua moeda, e uma tabela contendo o ano, o índicador socioeconômico e o preço da moeda nos anos na tabela.</p> 
![site-dados](/TP-Webservice/assets/imagens/dados-pesquisa.png)
<p>Os países na lateral, caso seja clicado algum deles, então será mostrado o mesmo indicador socioeconômico para o país escolhido e os países na lateral serão alterados.</p>
<p>Se for escolhido um indicador que API não possui dados sobre ele, então será informado uma mensagem que não há esses dados disponíveis para o país escolhido</p>
![site-dados-indisponiveis](/TP-Webservice/assets/imagens/dados-indisponiveis.png)
<p>Se não for possível retornar os dados do preço da moeda e os dados do índicador for retornado, o gráfico é composto somente pela linha do indicador e a tabela sem a coluna do preço da moeda</p>
![site-dados-indisponiveis](/TP-Webservice/assets/imagens/dados-money-none.png)
