'use strict';

describe('asapp.version module', function() {
  beforeEach(module('asapp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
