# Quasar App (quasar-replit)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

### Icons

#### Favicon

```bash
icongenie generate -i src/assets/img/icon-octopus-ios.png --quality 12
icongenie generate -i src/assets/img/icon-octopus-android.png --quality 12
```

#### Splashscreen

```bash
icongenie generate -i src/assets/img/icon-insidr-splash.png --quality 12 --splashscreen-color 0E012E --splashscreen-icon-ratio 20
```

### Build

## iOS

```bash
quasar dev -m capacitor -T ios
quasar build -m capacitor -T ios -destination 'generic/platform=iOS'
```

## Android

```bash
quasar dev -m capacitor -T android
quasar build -m capacitor -T android --ide
```
