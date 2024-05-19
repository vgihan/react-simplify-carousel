import path from 'path';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-onboarding",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-webpack5",
  },
  webpack: (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        src: path.resolve(__dirname, '..', 'src'),
        styles: path.resolve(__dirname, '..', 'src', 'styles'),
        slider: path.resolve(__dirname, '..', 'src', 'index.tsx'),
      }
    }
  })
};

export default config;
