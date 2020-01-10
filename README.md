Предполагается что у вас уже настроены [yc](https://cloud.yandex.ru/docs/cli/quickstart) и [s3cmd](https://cloud.yandex.ru/docs/storage/instruments/s3cmd). Они понадобятся для скрипта деплоя.

Дальше все просто.
1. Создать файл `.env` из шаблона из `.env.template` и заполнить
1. `npm install`
1. `npm run deploy`

Код функции не уровня production, но как отправная точка вполне ок.
