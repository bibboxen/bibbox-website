# Bibbox Website

Bibbox from a website.

## Description

This project a provides library self-service from a website. It consists of the
following parts:

- A frontend that exposes the library functions available to the user (React).
- An administration interface (for configuring machines) and website provider for the frontend (Symfony/PHP).
- An engine that handles communication between the frontend and FBS (Fælles bibliotekssystem) and handles state for each machine (Node.js).

A user can load a machine by a unique URL that is tied to a machine configuration.

![alt text](docs/architecture.png "Architecture")

The frontend communicates with the engine through a web socket.
The machine state flows from the engine to the frontend.
The frontend reflects the given machine state.
User actions passes from the frontend to the engine.
The engine then changes the machines state and sends it back to the frontend.

## Tech stack

* Node.js 14.x
* Symfony 5.x
* PHP 7.4
* React 16.x
* Docker

## Development setup

A docker based development setup is provided with the project.

Install composer packages.
```sh
docker-compose run phpfpm composer install
```

Edit engine configuration file(s).

```sh
cp engine/example_config.json engine/config.json
cp engine/plugins/ctrl/example_config.json engine/plugins/ctrl/config.json
```

Install dependencies for engine and frontend.

```
docker-compose run engine npm install
docker-compose run engine bash -c './scripts/install.sh'
docker-compose run frontend bash -c 'npm install'
```

This will start the engine and the frontend.
```sh
docker-compose up -d
```

*Install assets*
To install assets for the frontend we use Encore.

A docker container is started that watches for changes in the assets/js folder.

## Code Linting

When PRs are created towards the develop branch all coding styles are checked by Github Actions.

### Frontend

To check for coding standards, run the following:

```sh
docker-compose exec frontend bash -c 'npm run check-coding-standards'
```

To automatically apply coding standards, run:

```sh
docker-compose exec frontend bash -c 'npm run apply-coding-standards'
```

### Engine

The same commands apply as frontend, be should be run from the `engine/` folder.

### Symfony

@TODO: Setup coding standards for the Symfony/PHP code.

## Testing

All tests runs with Github Actions for each PR to develop.

### Frontend

Frontend tests runs with jest.

```
docker-compose exec frontend bash -c 'npm test'
```

### Engine

Engine tests runs with mocha from the `engine/` directory. The tests that
call FBS are mocked with nock recordings (see the `test/fixtures` folder).

```
docker-compose exec engine bash -c 'npm test'
```

### Symfony

@TODO: Setup tests for the Symfony/PHP code.

## Production

### Building production assets for the frontend

```
docker-compose exec frontend bash -c 'npm run build'
```


## UNI•Login

Download UNI•Login SAML IdP metadata for either

* production (cf. https://viden.stil.dk/display/OFFSKOLELOGIN/Tilslut+tjeneste):
  https://viden.stil.dk/download/attachments/63537201/broker-metadata.xml?version=1&modificationDate=1582728853000&api=v2
  or
* test (cf. https://viden.stil.dk/pages/viewpage.action?pageId=65503525):
  https://viden.stil.dk/download/attachments/65503525/et-broker-IdP-metadata.xml?version=7&modificationDate=1578661325000&api=v2

and store in `saml/idp/unilogin.xml`, say.

For test, create a key and a certificate (change `--subj` to match your actual
setup):

```sh
mkdir -p saml/{idp,sp}
openssl req -x509 -sha256 -nodes -days 1460 -newkey rsa:2048 \
    -keyout saml/sp/sp.key \
    -out saml/sp/sp.crt \
    -subj "/C=DK/L=Aarhus/O=Bibboxen/CN=bibboxen.example.com/emailAddress=info@bibbox.example.com"
```

Add environment variables in `.env.local` to point to your local IdP metadata,
key and certificate:

```sh
SAML_SP_CRT_FILE='%kernel.project_dir%/saml/sp/sp.crt'
SAML_SP_KEY_FILE='%kernel.project_dir%/saml/sp/sp.key'
SAML_IDP_CONFIG_FILE='%kernel.project_dir%/saml/idp/unilogin.xml'
```

See [config/services.yaml] for default values.

Set organization and contact information in `.env.local` as well:

```sh
SAML_CONTACT_PERSON_TECHNICAL_GIVEN_NAME='ITK Development'
SAML_CONTACT_PERSON_TECHNICAL_EMAIL_ADDRESS='itkdev@mkb.aarhus.dk'
SAML_CONTACT_PERSON_SUPPORT_GIVEN_NAME='ITK Development'
SAML_CONTACT_PERSON_SUPPORT_EMAIL_ADDRESS='itkdev@mkb.aarhus.dk'
SAML_ORGANIZATION_NAME='Bibbox'
SAML_ORGANIZATION_DISPLAY_NAME='Bibbox'
SAML_ORGANIZATION_URL='http://bibbox.local.computer'
```

If everything works, you should now be able to load your UNI•Login SAML metadata
on `/unilogin/metadata`.

To test the actual login go to `/unilogin`.
