/*
 * @license
 * Copyright 2025 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

/* [START maps_ui_kit_place_details_customizer] */

interface SuggestionItem {
    placeId: string;
    mainText: string;
    mainMatches: Array<{ startOffset: number; endOffset: number }>;
    secondaryText?: string;
    distanceText?: string;
    fullText: string;
}

let sessionToken: google.maps.places.AutocompleteSessionToken | null = null;
let currentSuggestions: SuggestionItem[] = [];
let selectedSuggestionIndex = -1;
let debounceTimeout: number | undefined;

async function init(): Promise<void> {
    // 1. Request required Google Maps libraries
    const [, placesLib] = await Promise.all([
        google.maps.importLibrary('maps'),
        google.maps.importLibrary('places') as Promise<
            typeof google.maps.places
        >,
        google.maps.importLibrary('marker'),
    ]);

    const placeDetailsWidget = document.querySelector<HTMLElement>(
        '#place-details-widget'
    )!;
    const placeDetailsRequest = document.querySelector<HTMLElement>(
        '#place-details-request'
    )!;
    const addressInput = document.querySelector<HTMLInputElement>('#address')!;
    const autocompleteList =
        document.querySelector<HTMLElement>('#autocomplete-list')!;

    // --------------------------------------------------------------------------
    // Content Configuration Switching
    // --------------------------------------------------------------------------
    const contentConfigButtons = document.querySelectorAll<HTMLButtonElement>(
        '#content-config-buttons .segmented-button'
    );

    contentConfigButtons.forEach((button) => {
        button.addEventListener('click', () => {
            contentConfigButtons.forEach((btn) => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            const mode = button.getAttribute('data-value');
            applyContentConfig(mode);
        });
    });

    function applyContentConfig(mode: string | null) {
        // Preserve the place-request child element
        const currentPlace =
            placeDetailsRequest.getAttribute('place') ||
            'places/ChIJ5abCmkWHhYARH3zgiLVc_Ew';
        placeDetailsWidget.innerHTML = '';

        const newRequest = document.createElement(
            'gmp-place-details-place-request'
        );
        newRequest.id = 'place-details-request';
        newRequest.setAttribute('place', currentPlace);
        placeDetailsWidget.appendChild(newRequest);

        if (mode === 'standard') {
            const standardContent = document.createElement(
                'gmp-place-standard-content'
            );
            placeDetailsWidget.appendChild(standardContent);
        } else if (mode === 'all') {
            const allContent = document.createElement('gmp-place-all-content');
            placeDetailsWidget.appendChild(allContent);
        } else if (mode === 'custom') {
            const customConfig = document.createElement(
                'gmp-place-content-config'
            );

            const elementsToInclude = [
                { tag: 'gmp-place-media', attrs: { 'lightbox-preferred': '' } },
                { tag: 'gmp-place-summary' },
                { tag: 'gmp-place-address' },
                { tag: 'gmp-place-rating' },
                { tag: 'gmp-place-open-now-status' },
                { tag: 'gmp-place-price' },
                { tag: 'gmp-place-type' },
                { tag: 'gmp-place-website' },
                { tag: 'gmp-place-phone-number' },
                { tag: 'gmp-place-plus-code' },
                { tag: 'gmp-place-accessible-entrance-icon' },
            ];

            elementsToInclude.forEach(({ tag, attrs }) => {
                const el = document.createElement(tag);
                if (attrs) {
                    Object.entries(attrs).forEach(([key, val]) =>
                        el.setAttribute(key, val)
                    );
                }
                customConfig.appendChild(el);
            });

            placeDetailsWidget.appendChild(customConfig);
        }
    }

    // --------------------------------------------------------------------------
    // Theme Switching
    // --------------------------------------------------------------------------
    const themeButtons = document.querySelectorAll<HTMLButtonElement>(
        '#theme-buttons .segmented-button'
    );

    themeButtons.forEach((button) => {
        button.addEventListener('click', () => {
            themeButtons.forEach((btn) => {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-pressed', 'true');

            const theme = button.getAttribute('data-value');
            placeDetailsWidget.classList.remove(
                'theme-google',
                'theme-miami',
                'theme-redwood'
            );

            if (theme === 'example1') {
                placeDetailsWidget.classList.add('theme-miami');
            } else if (theme === 'example2') {
                placeDetailsWidget.classList.add('theme-redwood');
            } else {
                placeDetailsWidget.classList.add('theme-google');
            }
        });
    });

    // --------------------------------------------------------------------------
    // Autocomplete Search Logic
    // --------------------------------------------------------------------------
    function getSessionToken(): google.maps.places.AutocompleteSessionToken {
        if (!sessionToken && placesLib.AutocompleteSessionToken) {
            sessionToken = new placesLib.AutocompleteSessionToken();
        }
        return sessionToken!;
    }

    async function fetchSuggestions(query: string): Promise<void> {
        if (!query.trim()) {
            closeDropdown();
            return;
        }

        try {
            if (
                placesLib.AutocompleteSuggestion?.fetchAutocompleteSuggestions
            ) {
                const response =
                    await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions(
                        {
                            input: query,
                            sessionToken: getSessionToken(),
                        }
                    );

                if (response?.suggestions && response.suggestions.length > 0) {
                    currentSuggestions = response.suggestions
                        .filter((s) => s.placePrediction)
                        .map((s) => {
                            const pred = s.placePrediction!;
                            const mainText =
                                typeof pred.mainText === 'string'
                                    ? pred.mainText
                                    : (pred.mainText?.text ??
                                      pred.text?.text ??
                                      '');
                            const secondaryText =
                                typeof pred.secondaryText === 'string'
                                    ? pred.secondaryText
                                    : (pred.secondaryText?.text ?? '');
                            const fullText =
                                typeof pred.text === 'string'
                                    ? pred.text
                                    : (pred.text?.text ?? mainText);

                            let distanceText: string | undefined;
                            if (
                                pred.distanceMeters &&
                                pred.distanceMeters > 0
                            ) {
                                distanceText = `${(pred.distanceMeters / 1609.34).toFixed(1)} mi`;
                            }

                            const mainMatches = (
                                pred.mainText?.matches || []
                            ).map((m) => ({
                                startOffset: m.startOffset,
                                endOffset: m.endOffset,
                            }));

                            return {
                                placeId: pred.placeId,
                                mainText,
                                mainMatches,
                                secondaryText,
                                distanceText,
                                fullText,
                            };
                        });

                    renderDropdown();
                    return;
                }
            }
        } catch (err) {
            console.warn('Error fetching autocomplete suggestions:', err);
        }

        closeDropdown();
    }

    function renderDropdown(): void {
        if (currentSuggestions.length === 0) {
            closeDropdown();
            return;
        }

        autocompleteList.innerHTML = '';
        autocompleteList.removeAttribute('hidden');
        selectedSuggestionIndex = -1;

        currentSuggestions.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'autocomplete-list-item';
            itemEl.setAttribute('data-index', String(index));

            // Pin Icon Container
            const iconContainer = document.createElement('div');
            iconContainer.className = 'autocomplete-icon-container';
            iconContainer.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#5e5e5e" aria-hidden="true">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
      `;
            itemEl.appendChild(iconContainer);

            // Text Container
            const textContainer = document.createElement('div');
            textContainer.className = 'autocomplete-text-container';

            const titleEl = document.createElement('p');
            titleEl.className = 'autocomplete-item-title';
            titleEl.innerHTML = buildHighlightedText(
                item.mainText,
                item.mainMatches
            );
            textContainer.appendChild(titleEl);

            if (item.secondaryText || item.distanceText) {
                const subtitleEl = document.createElement('div');
                subtitleEl.className = 'autocomplete-item-subtitle';

                if (item.distanceText) {
                    const distSpan = document.createElement('span');
                    distSpan.className = 'autocomplete-distance';
                    distSpan.textContent = item.distanceText;
                    subtitleEl.appendChild(distSpan);

                    const dotSpan = document.createElement('span');
                    dotSpan.className = 'autocomplete-dot';
                    dotSpan.textContent = '·';
                    subtitleEl.appendChild(dotSpan);
                }

                if (item.secondaryText) {
                    const secSpan = document.createElement('span');
                    secSpan.className = 'autocomplete-secondary';
                    secSpan.textContent = item.secondaryText;
                    subtitleEl.appendChild(secSpan);
                }

                textContainer.appendChild(subtitleEl);
            }

            itemEl.appendChild(textContainer);

            itemEl.addEventListener('click', () => selectSuggestion(item));
            autocompleteList.appendChild(itemEl);
        });

        // Attribution Footer
        const footer = document.createElement('div');
        footer.className = 'autocomplete-attribution-footer';
        footer.innerHTML =
            '<span class="gmp-attribution-text">Google Maps</span>';
        autocompleteList.appendChild(footer);
    }

    function buildHighlightedText(
        text: string,
        matches: Array<{ startOffset: number; endOffset: number }>
    ): string {
        if (!matches || matches.length === 0) {
            return `<span class="autocomplete-unmatched">${escapeHtml(text)}</span>`;
        }

        let html = '';
        let lastIndex = 0;

        matches.forEach(({ startOffset, endOffset }) => {
            if (startOffset > lastIndex) {
                html += `<span class="autocomplete-unmatched">${escapeHtml(text.slice(lastIndex, startOffset))}</span>`;
            }
            html += `<span class="autocomplete-matched">${escapeHtml(text.slice(startOffset, endOffset))}</span>`;
            lastIndex = endOffset;
        });

        if (lastIndex < text.length) {
            html += `<span class="autocomplete-unmatched">${escapeHtml(text.slice(lastIndex))}</span>`;
        }

        return html;
    }

    function escapeHtml(str: string): string {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function selectSuggestion(item: SuggestionItem): void {
        addressInput.value = '';
        addressInput.placeholder = item.mainText || item.fullText;
        closeDropdown();

        // Update Place Request
        const activeRequest = document.querySelector<HTMLElement>(
            '#place-details-request'
        );
        if (activeRequest) {
            activeRequest.setAttribute('place', `places/${item.placeId}`);
        }

        // Reset session token after selection
        sessionToken = null;
    }

    function closeDropdown(): void {
        autocompleteList.setAttribute('hidden', '');
        autocompleteList.innerHTML = '';
        currentSuggestions = [];
        selectedSuggestionIndex = -1;
    }

    addressInput.addEventListener('input', () => {
        window.clearTimeout(debounceTimeout);
        debounceTimeout = window.setTimeout(() => {
            fetchSuggestions(addressInput.value);
        }, 150);
    });

    addressInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (currentSuggestions.length === 0) return;

        const items = autocompleteList.querySelectorAll<HTMLElement>(
            '.autocomplete-list-item'
        );

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedSuggestionIndex =
                (selectedSuggestionIndex + 1) % items.length;
            updateSelection(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedSuggestionIndex =
                (selectedSuggestionIndex - 1 + items.length) % items.length;
            updateSelection(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (
                selectedSuggestionIndex >= 0 &&
                selectedSuggestionIndex < currentSuggestions.length
            ) {
                selectSuggestion(currentSuggestions[selectedSuggestionIndex]);
            } else if (currentSuggestions.length > 0) {
                selectSuggestion(currentSuggestions[0]);
            }
        } else if (e.key === 'Escape') {
            closeDropdown();
        }
    });

    function updateSelection(items: NodeListOf<HTMLElement>): void {
        items.forEach((item, index) => {
            if (index === selectedSuggestionIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (
            !autocompleteList.contains(e.target as Node) &&
            e.target !== addressInput
        ) {
            closeDropdown();
        }
    });
}

void init();
/* [END maps_ui_kit_place_details_customizer] */
