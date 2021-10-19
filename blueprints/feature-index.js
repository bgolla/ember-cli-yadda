'use strict';

const annotationMap = {
  acceptance: '@setupApplicationTest',
  integration: '@setupRenderingTest',
  unit: '@setupTest',
};

module.exports = {
  description: 'Adds a feature to the project',
  availableOptions: [
    { name: 'type', type: String, aliases: ['t'], default: 'acceptance' },
  ],

  locals(options) {
    return {
      // normalizedEntityName has been dasherized, featureName removes the dashes.
      featureName: options.entity.name.replace(/-/g, ' '),
      // lose the last section of the path /folder1/folder2/featureName
      // dasherize if path contains any spaces
      // do not forget the trailing slash
      folder:
        options.args[1].split('/').slice(0, -1).join('/').replace(/\s/g, '-') +
        '/',
      // relative path to go back up to the tests/acceptance/steps folder
      foldersUp: (function () {
        let path = options.args[1].split('/').slice(0, -1).join('/');
        if (path === '') {
          return './';
        }
        return (path + '/').replace(/.+?\//g, '../');
      })(),
      type: options.type,
      annotation: annotationMap[options.type] || '',
    };
  },

  normalizeEntityName(name) {
    // use the last section of the path /folder1/folder2/featureName
    // featureName can contain spaces when the arg is enclosed by quotes
    return name.split('/').pop().replace(/\s/g, '-');
  },

  fileMapTokens() {
    return {
      __folder__: function (options) {
        return options.locals.folder;
      },
      __type__: function (options) {
        return options.locals.type;
      },
    };
  },
};
