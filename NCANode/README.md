
![NCANode](docs/NCANode.png)


⭐ Приложение-сервер для работы с Электронно Цифровой Подписью (ЭЦП) РК

> Если Вам понравился проект, то поставьте ⭐

---

![License:MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Downloads](https://img.shields.io/github/downloads/malikzh/NCANode/total.svg)
![Docker Pulls](https://img.shields.io/docker/pulls/malikzh/ncanode)
[![HitCount](http://hits.dwyl.io/malikzh/ncanode.svg)](http://hits.dwyl.io/malikzh/ncanode)
[![Build Status](https://travis-ci.com/malikzh/NCANode.svg?branch=master)](https://travis-ci.com/malikzh/NCANode)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/malikzh/NCANode)

---

## Возможности

- Кроссплатформенный сервер (Windows, Mac OS, Linux)
- Подпись XML данных
- Проверка подписей
- Получение информации о сертификате
- Проверка цепочки сертификатов до КУЦ
- Поддержка OCSP и CRL
- Поддержка RabbitMQ
- Парсинг дополнительной информации из ИИН
- Работа с API посредством JSON
- Поддержка Docker
- Поддержка TSP
- Поддержка возможности подписи произвольных данных (не только XML)
- Поддержка работы с CMS ( [Cryptographic Message Syntax](https://en.wikipedia.org/wiki/Cryptographic_Message_Syntax) ) 
- Добавлена интеграция TSP-метки непосредственно в CMS
- Новая версия API
- Добавлена поддержка множественной подписи
- Добавлена поддержка извлечения оргинальных данных из CMS
- Добавлена поддержка алиасов
- Обратная совместимость с API v1.0
- KalkanCrypt v0.6
- Добавлены методы для работы со SmartBridge🆕
- Добавлена поддержка последовательной подписи🆕

## Кому надо?

Если Вам необходимо реализовать подпись данных будь формата XML или любом другом произвольном формате, при этом на стороне сервера,
Вы можете запустить NCANode на сервере и обращаться к нему посредством API (Http/RabbitMQ).

## Кто использует?

Исходя из полученных писем от программистов, NCANode используется как в стартапах, так и в крупных страховых компаниях

## СМИ об NCANode

https://profit.kz/news/56732/Otkritij-kod-Beeline-Hacktoberfest-v-Kazahstane/

## Пример

Пример запроса (запрос информации о ключе):

```json
{
	"version": "1.0",
	"method": "PKCS12.info",
	"params": {
		"p12":"MIINkwIBAzCCDU0GCSqGSIb3DQEHAaCCDTJ3i8pKvvVbY...",
		"password":"Qwerty12",
		"verifyOcsp": true
	}
}
```

Пример ответа:

```json
{
    "result": {
        "notAfter": "2019-08-22 18:11:36",
        "ocsp": {
            "revokationReason": 0,
            "revokationTime": null,
            "status": "ACTIVE"
        },
        "chain": [
            {
                "valid": true,
                "notAfter": "2019-08-22 18:11:36",
                "keyUsage": "AUTH",
                "serialNumber": "122684438670642568061334282296011886211357830154",
                "subject": {
                    "lastName": "ТЕСТОВИЧ",
                    "country": "KZ",
                    "commonName": "ТЕСТОВ ТЕСТ",
                    "gender": "",
                    "surname": "ТЕСТОВ",
                    "locality": "АЛМАТЫ",
                    "dn": "CN=ТЕСТОВ ТЕСТ,SURNAME=ТЕСТОВ,SERIALNUMBER=IIN123456789011,C=KZ,L=АЛМАТЫ,S=АЛМАТЫ,G=ТЕСТОВИЧ",
                    "state": "АЛМАТЫ",
                    "birthDate": "12-34-56",
                    "iin": "123456789011"
                },
                "signAlg": "SHA256WithRSAEncryption",
                "sign": "LLQvGPQP+rdLBTPRf0EgLIo/D9TqxeZ52pRyuCHN...",
                "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMII...",
                "issuer": {
                    "commonName": "ҰЛТТЫҚ КУӘЛАНДЫРУШЫ ОРТАЛЫҚ (RSA)",
                    "country": "KZ",
                    "dn": "C=KZ,CN=ҰЛТТЫҚ КУӘЛАНДЫРУШЫ ОРТАЛЫҚ (RSA)"
                },
                "notBefore": "2018-08-22 18:11:36",
                "keyUser": [
                    "INDIVIDUAL"
                ]
            }
        ],
        "serialNumber": "122684438670642568061334282296011886211357830154",
        "subject": {
            "lastName": "ТЕСТОВИЧ",
            "country": "KZ",
            "commonName": "ТЕСТОВ ТЕСТ",
            "gender": "",
            "surname": "ТЕСТОВ",
            "locality": "АЛМАТЫ",
            "dn": "CN=ТЕСТОВ ТЕСТ,SURNAME=ТЕСТОВ,SERIALNUMBER=IIN123456789011,C=KZ,L=АЛМАТЫ,S=АЛМАТЫ,G=ТЕСТОВИЧ",
            "state": "АЛМАТЫ",
            "birthDate": "12-34-56",
            "iin": "123456789011"
        },
        "signAlg": "SHA256WithRSAEncryption",
        "sign": "LLQvGPQP+rdLBTPRf0EgLIo/D9TqxeZ52pRyuCHNm5P2iOdSn3DuDid1k4pNFHFDIuJ...",
        "publicKey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtKWLOJf9qCqA6EO/SV...",
        "issuer": {
            "commonName": "ҰЛТТЫҚ КУӘЛАНДЫРУШЫ ОРТАЛЫҚ (RSA)",
            "country": "KZ",
            "dn": "C=KZ,CN=ҰЛТТЫҚ КУӘЛАНДЫРУШЫ ОРТАЛЫҚ (RSA)"
        },
        "notBefore": "2018-08-22 18:11:36",
        "keyUser": [
            "INDIVIDUAL"
        ],
        "valid": true,
        "keyUsage": "AUTH"
    },
    "message": "",
    "status": 0
}
```

## Документация

Документацию можно найти на http://ncanode.kz

## Авторы

- **Malik Zharykov** - Initial work

## Благодарности

<a href="https://github.com/malikzh/NCANode/graphs/contributors">
  <img src="https://contributors-img.web.app/image?repo=malikzh/NCANode" />
</a>

## Лицензия

Проект лицензирован под лицензией [MIT](LICENSE)

## Важно!!!

По требованию  АО «НИТ» | НУЦ РК. Библиотеки `kalkancrypt-0.6.jar` и `kalkancrypt_xmldsig-0.3.jar`
Были удалены из репозитория, поэтому для компиляции Вам необходимо подставить библиотеки
из комплекта разработчика (SDK) в директорию `/lib`.

### Docker & NCANode

В проекте вы увидите два докерфайла, это:

- `Dockerfile.build` - этот докерфайл используется для сборки NCANode из исходников. *Перед сборкой не забудьте добавить библиотеки KalkanCrypt в директорию /lib*
- `Dockerfile.run`   - этот докерфайл используется исключительно для запуска уже скомпилированного NCANode. При запуске, образ скачивает последнюю версию NCANode.

----

### Сборка проекта

Для сборки проекта необходимо:

1. Подставить бибилиотеки kalkancrypt (Их можно запросить [тут](https://pki.gov.kz/developers/))
2. `mvn clean package`

Собранный проект будет лежать: `target/ncanode-jar-with-dependencies.jar`

Сделано с ❤️
