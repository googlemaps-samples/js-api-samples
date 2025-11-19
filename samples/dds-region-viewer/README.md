# Google Maps JavaScript Sample

## dds-region-viewer

The dds-region-viewer sample demonstrates how to build a tool that lets you view all types of boundaries for every supported region.

Follow these instructions to set up and run dds-region-viewer sample on your local computer.

## Run the conversion scripts

The Region Viewer relies on Google-provided JSON coverage data files to populate
its menus. The Coverage data is periodically updated. Authors can generate new
coverage data from CSV files using the Python scripts located in `/scripts`.

The conversion scripts have specific sorting requirements for the input CSV files:

- `csv_to_html.py` requires the CSV to be sorted by the "Country Code" column. Used
  to generate the HTML table for the documentation page.
- `csv_to_json.py` requires the CSV to be sorted by the "Country Name En" column.
  Used to generate JSON data for menu logic.

To update coverage data:

1. Update the CSV files with ones containing the latest data.
2. From the `samples/dds-region-viewer/` folder, run the following commands:

    ```bash
    python3 scripts/csv_to_html.py
    python3 scripts/csv_to_json.py
    ```

## Setup

### Before starting run:

`npm i`

### Run an example on a local web server

`cd samples/dds-region-viewer`
`npm start`

### Build an individual example

`cd samples/dds-region-viewer`
`npm run build`

From 'samples':

`npm run build --workspace=dds-region-viewer/`

### Build all of the examples.

From 'samples':

`npm run build-all`

### Run lint to check for problems

`cd samples/dds-region-viewer`
`npx eslint index.ts`

## Feedback

For feedback related to this sample, please open a new issue on
[GitHub](https://github.com/googlemaps-samples/js-api-samples/issues).
