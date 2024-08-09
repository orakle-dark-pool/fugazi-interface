/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */

const defaultTheme = require("tailwindcss/defaultTheme");

const plugin = require("tailwindcss/plugin");

// TODO: 개발하면서 spacing 추가
const spacing = [...[...Array(1001).keys()]];

const convertSpacing = (spacing) =>
  [...new Set(spacing)].reduce((res, space) => {
    res[space] = `${space}px`;
    return res;
  }, {});
const convertSpacingWithoutPx = (spacing) =>
  [...new Set(spacing)].reduce((res, space) => {
    res[space] = `${space}`;
    return res;
  }, {});

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    // TODO: 반응형 break point에 맞게 설정. sm은 항상 0
    screens: {
      sm: "0px",
      md: "848px",
      lg: "1280px",
    },

    extend: {
      colors: {
        ...defaultTheme.colors,

        white: "#ffffff",
        black: "#000000",

        green: {
          1: "#022137",
          2: "#0E3C49",
          3: "#2D6D67",
          4: "#1BC4C9",
          5: "#35EDD4",
          6: "#B8FFE1",
          7: "#F6FEEF",
        },
        gray: {
          0: "#EEEEEE",
          50: "#F8F9FA",
          100: "#F1F3F4",
          200: "#E8EAED",
          300: "#DADCE0",
          400: "#BDC1C6",
          500: "#9AA0A6",
          600: "#80868B",
          700: "#5F6368",
          800: "#3C4043",
          900: "#202124",
        },
        scarlet: "#FF6258",
        amber: "#FF9900",
        violet: "#9D50E5",
        blue: "#2E81FF",
        etc1: "#3384FF",
        logo: "#00FF00",
      },

      fontFamily: {
        sans: ["Spoqa Han Sans Neo", ...defaultTheme.fontFamily.sans],
      },

      fontSize: {
        ...convertSpacing([...Array(101).keys()]),
      },

      fontWeight: {
        thin: 100,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },

      spacing: {
        ...defaultTheme.spacing,
        ...convertSpacing(spacing),
      },

      width: (theme) => ({ ...defaultTheme.width, ...theme("spacing") }),
      height: (theme) => ({ ...defaultTheme.height, ...theme("spacing") }),

      minWidth: (theme) => ({ ...defaultTheme.minWidth, ...theme("spacing") }),
      maxWidth: (theme) => ({ ...defaultTheme.maxWidth, ...theme("spacing") }),

      minHeight: (theme) => ({
        ...defaultTheme.minHeight,
        ...theme("spacing"),
      }),
      maxHeight: (theme) => ({
        ...defaultTheme.maxHeight,
        ...theme("spacing"),
      }),

      lineHeight: (theme) => ({
        ...defaultTheme.lineHeight,
        ...convertSpacing([...Array(101).keys()]),
      }),

      borderRadius: (theme) => ({
        ...defaultTheme.lineHeight,
        ...convertSpacing([...Array(101).keys()]),
      }),
      borderWidth: (theme) => ({
        ...defaultTheme.borderWidth,
        ...convertSpacing([...Array(21).keys()]),
      }),

      animation: (theme) => ({
        ...defaultTheme.animation,
      }),
      keyframes: (theme) => ({
        ...defaultTheme.keyframes,
      }),

      boxShadow: (theme) => ({
        ...defaultTheme.boxShadow,
      }),

      zIndex: (theme) => ({
        ...defaultTheme.zIndex,
        ...convertSpacingWithoutPx([...Array(101).keys()]),
      }),
    },
  },
  truncate: {
    lines: { 2: "2", 3: "3", 4: "4" },
  },
  variants: {
    extend: {
      backgroundColor: ["disabled", "active"],
      borderColor: ["disabled", "active"],
      textColor: ["disabled", "active"],
    },
  },
  plugins: [
    plugin(function ({ addBase, addComponents, addUtilities, theme }) {
      addBase({});
      addComponents({
        ".flex-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        ".absolute-center": {
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        },
        ".absolute-center-x": {
          left: "50%",
          transform: "translateX(-50%)",
        },
        ".absolute-center-y": {
          top: "50%",
          transform: "translateY(-50%)",
        },

        ".clickable": {
          cursor: "pointer",
        },
        ".non-clickable": {
          cursor: "not-allowed",
          userSelect: "none",
        },

        ".transition-color": {
          transitionProperty: "background-color,border-color,color,fill,stroke",
          transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          transitionDuration: "150ms",
        },

        "text-gradient-blue-left": {
          background: "linear-gradient(180deg, #A9DFFC 0%, #A9DFFC 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },

        // TODO: font setting

        ".font-xxxxs-r": {
          fontSize: "8px",
          lineHeight: "10px",
          fontWeight: 400,
        },

        ".font-xxxs-r": {
          fontSize: "10px",
          lineHeight: "14px",
          fontWeight: 400,
        },

        ".font-xxs-r": {
          fontSize: "11px",
          lineHeight: "14px",
          fontWeight: 400,
        },
        ".font-xxs-m": {
          fontSize: "11px",
          lineHeight: "14px",
          fontWeight: 500,
        },
        ".font-xxs-b": {
          fontSize: "11px",
          lineHeight: "14px",
          fontWeight: 600,
        },

        ".font-xs-r": { fontSize: "12px", lineHeight: "15px", fontWeight: 400 },
        ".font-xs-2r": {
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 400,
        },
        ".font-xs-m": { fontSize: "12px", lineHeight: "15px", fontWeight: 500 },
        ".font-xs-b": { fontSize: "12px", lineHeight: "15px", fontWeight: 600 },

        ".font-s-r": { fontSize: "13px", lineHeight: "16px", fontWeight: 400 },
        ".font-s-2r": { fontSize: "16px", lineHeight: "26px", fontWeight: 400 },
        ".font-s-m": { fontSize: "16px", lineHeight: "20px", fontWeight: 500 },
        ".font-s-b": { fontSize: "16px", lineHeight: "20px", fontWeight: 600 },
        ".font-s-2b": { fontSize: "16px", lineHeight: "26px", fontWeight: 600 },

        ".font-m-r": { fontSize: "14px", lineHeight: "18px", fontWeight: 400 },
        ".font-m-2r": { fontSize: "14px", lineHeight: "22px", fontWeight: 400 },
        ".font-m-m": { fontSize: "14px", lineHeight: "18px", fontWeight: 500 },
        ".font-m-2m": { fontSize: "14px", lineHeight: "22px", fontWeight: 500 },
        ".font-m-b": { fontSize: "14px", lineHeight: "18px", fontWeight: 600 },

        ".font-l-r": { fontSize: "16px", lineHeight: "20px", fontWeight: 400 },
        ".font-l-2r": { fontSize: "16px", lineHeight: "26px", fontWeight: 400 },
        ".font-l-m": { fontSize: "16px", lineHeight: "20px", fontWeight: 500 },
        ".font-l-b": { fontSize: "16px", lineHeight: "20px", fontWeight: 700 },
        ".font-l-2b": { fontSize: "16px", lineHeight: "26px", fontWeight: 600 },

        ".font-xl-m": { fontSize: "20px", lineHeight: "25px", fontWeight: 500 },

        ".font-xxl-l": {
          fontSize: "22px",
          lineHeight: "30px",
          fontWeight: 400,
        },
        ".font-xxl-b": {
          fontSize: "22px",
          lineHeight: "30px",
          fontWeight: 600,
        },

        ".font-xxxl-b": {
          fontSize: "28px",
          lineHeight: "35px",
          fontWeight: 600,
        },

        ".font-xxxxl-b": {
          fontSize: "32px",
          lineHeight: "40px",
          fontWeight: 600,
        },
      });

      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    }),
  ],
};
