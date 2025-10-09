/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

// [START maps_address_validation]
// DOM Refs
const addressForm = document.getElementById('address-form')
const validateButton = document.getElementById('validate-button')
const clearFormButton = document.getElementById('clear-form-button')
const resultDisplay = document.getElementById('result-display')
const loadingText = document.getElementById('loading-text')
// Input field refs
const streetAddress1Input = document.getElementById(
    'street-address-1'
) as HTMLInputElement
const streetAddress2Input = document.getElementById(
    'street-address-2'
) as HTMLInputElement
const cityInput = document.getElementById('city') as HTMLInputElement
const stateInput = document.getElementById('state') as HTMLInputElement
const zipCodeInput = document.getElementById('zip-code') as HTMLInputElement
const regionSelect = document.getElementById(
    'region-select'
) as HTMLSelectElement
const exampleSelect = document.getElementById(
    'example-select'
) as HTMLSelectElement

// Core Initialization
async function init() {
    // Load the Address Validation library.
    await google.maps.importLibrary('addressValidation')
    // Set event listeners
    addressForm!.addEventListener('submit', handleValidationSubmit)
    exampleSelect!.addEventListener('change', handleExampleSelectChange)
    clearFormButton!.addEventListener('click', handleClearForm)
}

// [START maps_address_validation_form_handler]
// Validation Handler
async function handleValidationSubmit(event) {
    event.preventDefault() // Prevent default form submission
    resultDisplay!.textContent = 'Validating...' // Clear previous results

    // Validate the address
    try {
        //@ts-ignore
        const result = await google.maps.addressValidation.AddressValidation.fetchAddressValidation(
                {
                    address: {
                        regionCode: regionSelect!.value.trim(),
                        languageCode: 'en',
                        addressLines: [
                            streetAddress1Input!.value.trim(),
                            streetAddress2Input!.value.trim(),
                        ].filter((line) => line), // Filter out empty lines
                        locality: cityInput!.value.trim(),
                        administrativeArea: stateInput!.value.trim(),
                        postalCode: zipCodeInput!.value.trim(),
                    },
                }
            )

        resultDisplay!.textContent =
            'Verdict summary\n================\n' +
            `Formatted address: ${result.address.formattedAddress}\n` +
            `Entered: ${result.verdict.inputGranularity}\n` +
            `Validated: ${result.verdict.validationGranularity}\n` +
            `Geocoded: ${result.verdict.geocodeGranularity}\n` +
            `Possible next action: ${result.verdict.possibleNextAction}\n\n` +
            `${getVerdictMessage(result.verdict, 'addressComplete')}\n` +
            `${getVerdictMessage(result.verdict, 'hasUnconfirmedComponents')}\n` +
            `${getVerdictMessage(result.verdict, 'hasInferredComponents')}\n` +
            `${getVerdictMessage(result.verdict, 'hasReplacedComponents')}\n\n` +
            `Raw JSON response\n=================\n` +
            JSON.stringify(result, null, '  ')
    } catch (error) {
        console.error('Validation failed:', error)
        if (error instanceof Error) {
            resultDisplay!.textContent = `Error: ${error.message}`
        }
    }
}
// [END maps_address_validation_form_handler]

// Verdict messages
const verdictMessages = {
    addressComplete: {
        trueMessage:
            '- The API found no unresolved, unexpected, or missing address elements.',
        falseMessage:
            '- At least one address element is unresolved, unexpected, or missing.',
    },
    hasUnconfirmedComponents: {
        trueMessage: "- The API can't confirm at least one address component.",
        falseMessage: '- The API confirmed all address components.',
    },
    hasInferredComponents: {
        trueMessage:
            '- The API inferred (added) at least one address component.',
        falseMessage: '- The API did not infer (add) any address components.',
    },
    hasReplacedComponents: {
        trueMessage: '- The API replaced at least one address component.',
        falseMessage: '- The API did not replace any address components.',
    },
}

// Helper function to get the verdict message for a given verdict key
function getVerdictMessage(verdict, key) {
    if (!verdict || !verdictMessages[key]) return 'Unknown'
    return verdict[key]
        ? verdictMessages[key].trueMessage
        : verdictMessages[key].falseMessage
}

// Handler for Dropdown Change
function handleExampleSelectChange(event) {
    const selectedValue = event.target.value
    if (selectedValue && examples[selectedValue]) {
        populateAddressFields(examples[selectedValue])
    } else if (!selectedValue) {
        populateAddressFields(null) // Pass null to clear fields
    }
}

// Clear Form Handler
function handleClearForm() {
    streetAddress1Input!.value = ''
    streetAddress2Input!.value = ''
    cityInput!.value = ''
    stateInput!.value = ''
    zipCodeInput!.value = ''
    regionSelect!.value = ''
    exampleSelect!.value = ''
    resultDisplay!.textContent = 'Result will appear here...'
    console.log('Cleared form')
}

// Example Address Data
const examples = {
    google: {
        streetAddress1: '1600 Amphitheatre Parkway',
        streetAddress2: '', // Explicitly empty
        city: 'Mountain View',
        state: 'CA',
        zipCode: '94043',
        region: 'US',
    },
    nonExistentSubpremise: {
        streetAddress1: '2930 Pearl St.',
        streetAddress2: 'Suite 100',
        city: 'Boulder',
        state: 'CO',
        zipCode: '', // Explicitly empty
        region: 'US',
    },
    missingSubpremise: {
        streetAddress1: '500 West 2nd Street',
        streetAddress2: null, // Can use null or undefined too
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        region: 'US',
    },
    misspelledLocality: {
        streetAddress1: '1600 Amphitheatre Pkwy',
        streetAddress2: '',
        city: 'Montan View',
        state: 'CA',
        zipCode: '94043',
        region: 'US',
    },
    missingLocality: {
        streetAddress1: 'Brandschenkestrasse 110 8002',
        streetAddress2: '',
        city: '',
        state: '',
        zipCode: '',
        region: '',
    },
    usPoBox: {
        streetAddress1: 'PO Box 1108',
        streetAddress2: '',
        city: 'Sterling',
        state: 'VA',
        zipCode: '20166-1108',
        region: 'US',
    },
}

// Helper function to populate form fields with example address data
function populateAddressFields(exampleAddress) {
    if (!exampleAddress) {
        console.warn('No example address data provided.')
        return
    }

    // Get values from example, providing empty string as default
    streetAddress1Input!.value = exampleAddress.streetAddress1 || ''
    streetAddress2Input!.value = exampleAddress.streetAddress2 || ''
    cityInput!.value = exampleAddress.city || ''
    stateInput!.value = exampleAddress.state || ''
    zipCodeInput!.value = exampleAddress.zipCode || ''
    regionSelect!.value = exampleAddress.region || ''

    // Clear previous results and errors
    resultDisplay!.textContent = 'Result will appear here...'

    console.log('Populated fields with example: ', exampleAddress)
}

init()
// [END maps_address_validation]
