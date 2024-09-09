# js-api-samples

## Description

Welcome to the js-api-samples repository, the home of Google Maps JavaScript API documentation samples.

## Important Note: Repository Migration in Progress

This repository (`js-api-samples`) is the new home for the Maps JavaScript API samples. 

We are currently migrating all samples from the old repository (`js-samples`). During this transition,
you may find some samples are still missing or under development.

* [**js-samples GitHub Repository:**](https://github.com/googlemaps/js-samples)
* [**Maps JavaScript API Documentation:**](https://developers.google.com/maps/documentation/javascript/)

We appreciate your patience as we complete this migration. Please check back regularly for updates.

Try the examples out at [Google Maps JavaScript API documentation](https://developers.google.com/maps/documentation/javascript/examples).

## Development

Each example is one atomic unit, for which dependencies must be individually set up.

### Build samples

1. Run `npm i` to install dependencies. You only need to do this once, and
thereafter only to update dependencies.
1. Navigate to the top level (`samples/`).

  - To build a single sample, run `npm run build --workspace=sample-name/`
  - To build all samples, run `npm run build-all`.

Build output is copied to the main `dist/` folder. Each individual sample folder
also contains a `dist/` folder, but this is only used by Vite for live preview.

### Run a single sample

1. Navigate to the folder for the sample you want to run (`cd samples/sample-name`).
1. Run `npm start` to start a server with that sample.

### Test

{# OLD STEPS FOR REFERENCE (we are NEVER doing snapshots testing FYI) #}
1. `npm test` Test outputs. {# !!! this assumes that we have a test command defined in package.json (right now to test, run `npx playwright test`) #}
1. (Optional) `npm run lint` Fix lint issues with `npm run format` {# TODO: Verify this (look at the commands on js-samples). #}

## Contributing

Contributions are welcome! Please see [contributing](../docs/contributing.md) for more information.

## Terms of Service

This library uses Google Maps Platform services. Use of Google Maps Platform services through this library is subject to the Google Maps Platform [Terms of Service](https://cloud.google.com/maps-platform/terms).

This library is not a Google Maps Platform Core Service. Therefore, the Google Maps Platform Terms of Service (e.g. Technical Support Services, Service Level Agreements, and Deprecation Policy) do not apply to the code in this library.

## Support

This library is offered via an open source [license](https://www.apache.org/licenses/LICENSE-2.0). It is not governed by the Google Maps Platform Support [Technical Support Services Guidelines](https://cloud.google.com/maps-platform/terms/tssg), the [SLA](https://cloud.google.com/maps-platform/terms/sla), or the [Deprecation Policy](https://cloud.google.com/maps-platform/terms) (however, any Google Maps Platform services used by the library remain subject to the Google Maps Platform Terms of Service).

This library adheres to [semantic versioning](https://semver.org/) to indicate when backwards-incompatible changes are introduced. Accordingly, while the library is in version 0.x, backwards-incompatible changes may be introduced at any time. 

If you find a bug, or have a feature request, please [file an issue]() on GitHub. If you would like to get answers to technical questions from other Google Maps Platform developers, ask through one of our [developer community channels](https://developers.google.com/maps/developer-community). If you'd like to contribute, please check the [Contributing guide]().

You can also discuss this library on our [Discord server](https://discord.gg/hYsWbmk).
