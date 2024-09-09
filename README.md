# js-api-samples

## Description

Samples to demonstrate features and usage of the Google Maps JavaScript API.

Try the examples out at [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript/examples).

## Development

Each example is one atomic unit, for which dependencies must be individually set up.

{# TODO: Write up a description of how these are set up (single example, don't have to build the entire collection, yadda yadda yadda) #}

### Build

1. Run `npm i` to install dependencies; this runs TSC, which compiles the JavaScript.
1. Run `npm start` to test a single example locally.

### Test

{# TODO: verify these test steps #}
1. `npm test` Test outputs.
1. (Optional) `npm run lint` Fix lint issues with `npm run format`
1. (Optional) `npm run test:playwright:playground:update-snapshots` Update snapshots. This uses an custom env var to only to only update screenshots that differ from the previous ones (Playwright only supports `none`, `all`, or `missing`). To update all screenshots, use `npm run test:playwright:playground:update-snapshots -- --update-snapshots`. It's possible to target a single sample by using `-g <sample-name>`.

### Run

1. Start a server with a single sample using `npm start`.

## Contributing

Contributions are welcome! Please see [contributing](../docs/contributing.md) for more information.

## Terms of Service

This library uses Google Maps Platform services. Use of Google Maps Platform services through this library is subject to the Google Maps Platform [Terms of Service](https://cloud.google.com/maps-platform/terms).

This library is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (e.g. Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this library.

## Support

This library is offered via an open source [license](). It is not governed by the Google Maps Platform Support [Technical Support Services Guidelines](https://cloud.google.com/maps-platform/terms/tssg), the [SLA](https://cloud.google.com/maps-platform/terms/sla), or the [Deprecation Policy](https://cloud.google.com/maps-platform/terms) (however, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service).

This library adheres to [semantic versioning](https://semver.org/) to indicate when backwards-incompatible changes are introduced. Accordingly, while the library is in version 0.x, backwards-incompatible changes may be introduced at any time. 

If you find a bug, or have a feature request, please [file an issue]() on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels](https://developers.google.com/maps/developer-community). If you'd like to contribute, please check the [Contributing guide]().

You can also discuss this library on our [Discord server](https://discord.gg/hYsWbmk).
