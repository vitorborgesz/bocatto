# services/

Camada reservada para **regras de negócio** que não cabem diretamente em uma rota.

A ideia é que as rotas (`app/api/routes/`) cuidem apenas de HTTP: receber a requisição,
validar a entrada com os schemas, chamar a regra e devolver a resposta. Regras com mais de
um passo ou que envolvem várias tabelas ficam aqui, para poderem ser reutilizadas e
testadas separadamente.

Ainda não há nenhum serviço implementado. Os módulos serão criados conforme o
desenvolvimento do Bocatto avançar.
