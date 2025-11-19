/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

class SimpleWeatherWidget extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot!.innerHTML = `
            <style>
                :host {
                    display: block;
                    position: relative; /* Needed for arrow pseudo-elements */
                    margin-top: -35px; /* Offset upwards to align arrow with marker */
                }
                .widget-container {
                    background-color: white; /* Light mode background */
                    color: #222222; /* Light mode text color */
                    padding: 4px 8px;
                    border-radius: 50px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* Black box shadow with 0.3 opacity for light mode */
                    font-family: 'Google Sans', Roboto, sans-serif;
                    width: auto; /* Allow width to adjust to content */
                    text-align: center;
                    position: relative; /* Needed to position arrow relative to this container */
                    min-width: 78px;
                    min-height: 35px; /* Ensure minimum height for stable layout */
                    display: flex; /* Use flexbox for centering */
                    flex-direction: column; /* Stack children vertically */
                    justify-content: center; /* Vertically center content */
                    align-items: center; /* Horizontally center content */
                    user-select: none; /* Prevent text selection */
                    overflow: visible; /* Allow arrow pseudo-element to be visible */
                    box-sizing: border-box; /* Include padding and border in the element's total width and height */
                    max-height: 50px; /* Set max-height for default state */
                    transform: translateY(-5px);
                }
                /* Arrow indent */
                .widget-container::after {
                    content: "";
                    position: absolute;
                    bottom: -5px; /* Position below the widget container */
                    left: 50%;
                    transform: translateX(-50%);
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-top: 5px solid white; /* Match background color of widget-container */
                    z-index: 1;
                }

                .weather-info-basic {
                    display: flex;
                    align-items: center;
                    justify-content: center; /* Center items */
                    gap: 4px; /* Add gap between temperature and icon */
                    margin-bottom: 0; /* Remove bottom margin */
                    width: 100%; /* Take full width */
                    min-height: 35px; /* Ensure minimum height for stable layout */
                }
                .weather-info-basic img {
                    width: 30px;
                    height: 30px;
                    filter: invert(0); /* Default filter for light mode */
                    flex-shrink: 0; /* Prevent shrinking */
                }
                #condition-icon {
                    display: none; /* Hide the image by default */
                }
                .temperature {
                    font-size: 1.5em;
                    font-weight: bold;
                    align:right;
                }
                .error-message {
                    font-size: 1.2em;
                    font-weight: normal; /* Not bold for error messages */
                    width:80px;
                 }
                .rain-details {
                    font-size: 0.9em; /* Match detail line font size */
                    display: none; /* Hide by default */
                    align-items: center;
                    justify-content: flex-start; /* Align rain info to the left */
                    flex-direction: row; /* Arrange rain details horizontally */
                    gap: 5px; /* Space between rain probability and qpf */
                    margin-top: 5px; /* Add space above rain details */
                    width: 100%; /* Take full width */
                }
                 .rain-details img {
                    width: 18px;
                    height: 18px;
                    margin-right: 5px;
                    /* No filter by default (light mode), icon is white */
                 }

                /* Dark mode styles */
                :host(.dark-mode) .widget-container {
                    background-color: #222222; /* Dark mode background */
                    color: white; /* Dark mode text color */
                    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3); /* White box shadow with 0.3 opacity for dark mode */
                }

                :host(.dark-mode) .widget-container::after {
                    border-top-color: #222222; /* Match dark mode background color */
                }

                :host(.dark-mode) .weather-info-basic img:not(#condition-icon) {
                  filter: none; /* Remove filter in dark mode */
               }

                /* In dark mode, the rain icon should be white, so no filter is needed as the default is white */

                /* Highlighted state styles (on click) */
                .widget-container.highlight {
                    border-radius: 8px; /* Match non-highlighted border-radius */
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* Keep the same box shadow */
                    max-height: 150px; /* Set a larger max-height for expanded state */
                    padding: 10px 15px; /* Keep the same padding */
                    width: auto; /* Allow width to expand */
                    min-height: 70px; /* Increase min-height for expanded state */
                    justify-content: center; /* Vertically center content */
                    transition: all 0.3s ease-out;
                }
                .widget-container.highlight .rain-details {
                    display: flex; /* Show rain details when highlighted */
                }

                /* Dark mode highlighted state */
                :host(.dark-mode) .widget-container.highlight {
                    box-shadow: 0 2px 6px rgba(255, 255, 255, 0.3); /* Keep the same box shadow */
                }



            </style>
            <style>
                :host(:not(.dark-mode)) .rain-details img {
                    filter: invert(1); /* Invert for light mode to make white icon black */
                }
            </style>
            <div class="widget-container">
                <div class="weather-info-basic">
                    <img id="condition-icon" src="" alt="Weather Icon">
                    <span id="temperature" class="temperature"></span>
                </div>
                <div id="rain-details" class="rain-details">
                    <img src="/icons/rain-probability-white.svg" alt="Rain Probability Icon">
                    <span id="rain-probability"></span>
                    <span id="rain-qpf"></span>
                </div>
            </div>
        `;
    }

    set data(weatherData: any) {
        const iconElement = this.shadowRoot!.getElementById(
            'condition-icon'
        ) as HTMLImageElement;
        const temperatureElement = this.shadowRoot!.getElementById(
            'temperature'
        ) as HTMLSpanElement;
        const rainProbabilityElement = this.shadowRoot!.getElementById(
            'rain-probability'
        ) as HTMLSpanElement;
        const rainQpfElement = this.shadowRoot!.getElementById(
            'rain-qpf'
        ) as HTMLSpanElement;
        const rainDetailsElement = this.shadowRoot!.getElementById(
            'rain-details'
        ) as HTMLDivElement;

        if (!weatherData || weatherData.error) {
            iconElement.style.display = 'none';
            rainDetailsElement.style.display = 'none';
            if (weatherData && weatherData.error) {
                temperatureElement.textContent = weatherData.error;
                temperatureElement.classList.add('error-message'); // Add error class
            } else {
                temperatureElement.textContent = 'N/A';
                temperatureElement.classList.remove('error-message'); // Remove error class
            }
            return;
        }

        // Check if the data is current conditions or forecast day structure
        const isForecastDay =
            weatherData.daytimeForecast || weatherData.nighttimeForecast;

        let temperature: number | undefined,
            iconBaseUri: string | undefined,
            rainProbability: number | undefined,
            rainQpf: number | undefined;

        if (isForecastDay) {
            // Data is a forecast day object
            const conditions = weatherData;
            temperature = conditions.maxTemperature?.degrees;
            iconBaseUri =
                conditions.daytimeForecast?.weatherCondition?.iconBaseUri ||
                conditions.nighttimeForecast?.weatherCondition?.iconBaseUri;
            rainProbability = conditions.precipitation?.probability?.percent;
            rainQpf = conditions.precipitation?.qpf?.quantity;
        } else {
            // Data is a current conditions object
            const conditions = weatherData;
            temperature = conditions.temperature?.degrees;
            iconBaseUri = conditions.weatherCondition?.iconBaseUri;
            rainProbability = conditions.precipitation?.probability?.percent;
            // For current conditions, prioritize qpf from history if available
            rainQpf =
                conditions.currentConditionsHistory?.qpf?.quantity !== undefined
                    ? conditions.currentConditionsHistory.qpf.quantity
                    : conditions.precipitation?.qpf?.quantity;
        }

        let iconSrc = ''; // Initialize iconSrc

        if (iconBaseUri) {
            // Use the full iconBaseUri and append .svg
            iconSrc = `${iconBaseUri}.svg`;
        } else {
            // Fallback to a default local icon if iconBaseUri is not available
            iconSrc = '/icons/cloud-cover-white.svg';
        }

        iconElement.style.display = 'none'; // Explicitly hide the icon before setting src
        iconElement.onload = () => {
            iconElement.style.display = 'inline-block'; // Show the icon after loading
        };
        iconElement.onerror = () => {
            console.error('Failed to load weather icon:', iconSrc);
            iconElement.style.display = 'none'; // Hide the icon if loading fails
        };
        iconElement.src = iconSrc;

        temperatureElement.textContent = `${temperature !== undefined ? temperature.toFixed(0) : 'N/A'}°C`; // Rounded temperature
        temperatureElement.classList.remove('error-message'); // Remove error class if data is valid

        if (rainProbability !== undefined && rainProbability !== null) {
            rainProbabilityElement.textContent = `${rainProbability}%`;
        } else {
            rainProbabilityElement.textContent = '0%';
        }

        if (rainQpf !== undefined && rainQpf !== null) {
            rainQpfElement.textContent = `${rainQpf.toFixed(1)}mm`; // Rounded QPF to 1 decimal place
        } else {
            rainQpfElement.textContent = '0.0mm'; // Display 0.0mm if data is not available
        }
    }

    /**
     * Sets the visual mode of the widget.
     * @param mode 'light' or 'dark'
     */
    setMode(mode: 'light' | 'dark') {
        if (mode === 'dark') {
            this.classList.add('dark-mode');
        } else {
            this.classList.remove('dark-mode');
        }
    }
}

customElements.define('simple-weather-widget', SimpleWeatherWidget);
