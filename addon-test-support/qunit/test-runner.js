import { module, test } from 'qunit';
import { Promise as EmberPromise } from 'rsvp';

// eslint-disable-next-line no-unused-vars
export default function testFeature(feature, yadda, yaddaAnnotations, library) {
  let featureAction = yaddaAnnotations.runFeature(feature.annotations);
  if (typeof featureAction === 'function') {
    featureAction.call(this, feature);
  } else {
    let featureTitle =
      typeof yaddaAnnotations.setupFeatureTitle === 'function'
        ? yaddaAnnotations.setupFeatureTitle(feature)
        : `Feature: ${feature.title}`;
    module(featureTitle, function (featureHooks) {
      let setupFeature =
        typeof yaddaAnnotations.setupFeature === 'function'
          ? yaddaAnnotations.setupFeature(feature.annotations)
          : undefined;
      if (typeof setupFeature === 'function') {
        setupFeature.call(this, featureHooks);
      }

      feature.scenarios.forEach(function (scenario) {
        let setupScenario =
          typeof yaddaAnnotations.setupScenario === 'function'
            ? yaddaAnnotations.setupScenario(
                feature.annotations,
                scenario.annotations
              )
            : undefined;

        let scenarioTitle = setupScenarioTitle(yaddaAnnotations, scenario);
        if (typeof setupScenario === 'function') {
          // if feature has custom setup, wrap it in another module to use its own beforeEach/afterEach hooks
          module(
            yaddaAnnotations.setupFeatureTitle(feature) ?? scenarioTitle,
            function (scenarioHooks) {
              setupScenario.call(this, scenarioHooks);
              testScenario(scenario, feature, yadda, yaddaAnnotations, library);
            }
          );
        } else {
          testScenario(scenario, feature, yadda, yaddaAnnotations, library);
        }
      });
    });
  }
}

function setupScenarioTitle(yaddaAnnotations, scenario) {
  return typeof yaddaAnnotations.setupScenarioTitle === 'function'
    ? yaddaAnnotations.setupScenarioTitle(scenario)
    : `Scenario: ${scenario.title}`;
}

function testScenario(scenario, feature, yadda, yaddaAnnotations, library) {
  let scenarioAction = yaddaAnnotations.runScenario(
    feature.annotations,
    scenario.annotations
  );
  if (typeof scenarioAction === 'function') {
    scenarioAction.apply(this, arguments);
  } else {
    let scenarioTitle = setupScenarioTitle(yaddaAnnotations, scenario);
    test(scenarioTitle, function (assert) {
      let self = this;
      return new EmberPromise(function (resolve, reject) {
        yadda
          .Yadda(library.default(assert), self)
          .yadda(scenario.steps, { ctx: {} }, function next(err, result) {
            if (err) {
              reject(err);
            }
            resolve(result);
          });
      });
    });
  }
}
