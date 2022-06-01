# labeljay

> A GitHub App built with [Probot](https://github.com/probot/probot) that A label management bot based on Probot

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Configuration

Configuration of the bot is achieved by creating `.github/label-config.yml` in the repo where labeljay is installed. An example configuration is provided [here](./example-label-config.yml).

## Docker

```sh
# 1. Build container
docker build -t labeljay .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> labeljay
```

## Contributing

If you have suggestions for how labeljay could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2022 Josh Whetton <whetton.josh@gmail.com>
