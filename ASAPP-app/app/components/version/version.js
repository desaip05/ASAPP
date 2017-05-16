'use strict';

angular.module('asapp.version', [
  'asapp.version.interpolate-filter',
  'asapp.version.version-directive'
])

.value('version', '0.1');
