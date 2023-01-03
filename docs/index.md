# Trabalho prático de webservice
Trabalho prático de webservice cujo objetivo é o desenvolvimento de uma página web usando dados de APIs. Neste trabalho foram usados três APIs, [API do banco mundial](https://datahelpdesk.worldbank.org/knowledgebase/topics/125589-developer-information), [API do IBGE](https://servicodados.ibge.gov.br/api/docs/paises) e uma terceira API que retorna o preço da moeda do país pesquisado.
A página web necessita que seja escolhido um país e um indicador socioeconômico, como consta abaixo:
![site](/TP-Webservice/assets/imagens/site.png)
Caso não seja informado o país ou o indicador socioeconômico, não será mostrado nada, mas as bordas inferiores dos dois inputs ficarão vermelhos:
![Não-Escolhidos](/TP-Webservice/assets/imagens/erro-pesquisa.png)
<p>Se for escolhido o país e o indicador, então será mostrado uma lista de botões com dezoito países aleatórios, um gráfico com o indicador socioeconômico do país e o preço de sua moeda, e uma tabela contendo o ano, o índicador socioeconômico e o preço da moeda nos anos na tabela.</p> 
![site-dados](/TP-Webservice/assets/imagens/dados-pesquisa.png)
Os países na lateral, caso seja clicado algum deles, então será mostrado o mesmo indicador socioeconômico para o país escolhido e os países na lateral serão alterados.
