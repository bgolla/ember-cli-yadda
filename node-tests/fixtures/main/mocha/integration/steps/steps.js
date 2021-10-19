import yadda from 'yadda';
import { expect } from 'chai';

export default function () {
  return yadda.localisation.default
    .library()
    .given('I type "Ember g feature make-feature"', function () {
      expect(true, this.step).to.be.true;
    })
    .when('I look in the folder', function () {
      expect(true, this.step).to.be.true;
    });
}
