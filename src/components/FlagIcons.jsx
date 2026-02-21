import React from 'react';

/**
 * East Turkestan flag (Kök Bayraq / Blue Flag)
 * Light blue field with white crescent moon and five-pointed star.
 * Used to represent the Uyghur people and East Turkestan.
 */
export const EastTurkestanFlag = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 30 20"
    className={className}
    role="img"
    aria-label="East Turkestan flag"
    {...props}
  >
    <rect width="30" height="20" fill="#75AADB" />
    <circle cx="11.5" cy="10" r="4.5" fill="white" />
    <circle cx="13" cy="10" r="3.5" fill="#75AADB" />
    <polygon
      points="19,6 20,8.8 23,9 20.8,11 21.5,14 19,12.2 16.5,14 17.2,11 15,9 18,8.8"
      fill="white"
    />
  </svg>
);

/**
 * Tibetan flag (Snow Lion flag)
 * Features a mountain with the sun above, red and blue rays,
 * and yellow border — the flag of the Tibetan people.
 */
export const TibetanFlag = ({ className = 'w-5 h-5', ...props }) => (
  <svg
    viewBox="0 0 30 20"
    className={className}
    role="img"
    aria-label="Tibetan flag"
    {...props}
  >
    {/* Yellow border */}
    <rect width="30" height="20" fill="#F4D03F" />
    <rect x="1" y="1" width="28" height="18" fill="#2E86C1" />
    {/* Alternating red and blue rays from bottom center */}
    <polygon points="15,19 0,1 5,1" fill="#C0392B" />
    <polygon points="15,19 5,1 10,1" fill="#2E86C1" />
    <polygon points="15,19 10,1 15,1" fill="#C0392B" />
    <polygon points="15,19 15,1 20,1" fill="#2E86C1" />
    <polygon points="15,19 20,1 25,1" fill="#C0392B" />
    <polygon points="15,19 25,1 30,1" fill="#2E86C1" />
    {/* White snow mountain */}
    <polygon points="8,19 15,10 22,19" fill="white" />
    {/* Sun above mountain */}
    <circle cx="15" cy="6" r="3" fill="#F4D03F" />
  </svg>
);
