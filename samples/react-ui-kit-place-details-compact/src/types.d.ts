import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-details-compact': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          orientation?: string;
          'truncation-preferred'?: boolean;
        },
        HTMLElement
      >;
      'gmp-place-details-place-request': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {place: string},
        HTMLElement
      >;
      'gmp-place-content-config': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'gmp-place-media': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {'lightbox-preferred'?: boolean},
        HTMLElement
      >;
      'gmp-place-rating': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'gmp-place-type': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'gmp-place-price': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'gmp-place-accessible-entrance-icon': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'gmp-place-open-now-status': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
      'gmp-place-attribution': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}