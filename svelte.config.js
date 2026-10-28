import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    paths: {
      base: process.argv.includes('dev') ? '' : '/polymer-clay-recipe-calculator'
    },
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      precompress: false
    })
  }
};
