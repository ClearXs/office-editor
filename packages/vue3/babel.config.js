module.exports = {
  presets: [
    [
      '@vue/cli-plugin-babel/preset',
      {
        targets: {
          esmodules: true,
          node: 'current',
        },
      },
    ],
    'vue',
    '@babel/preset-env',
    '@babel/preset-typescript',
  ],
}
