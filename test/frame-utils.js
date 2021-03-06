/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const utils = module.exports = {
  /**
   * @param {!Page} page
   * @param {string} frameId
   * @param {string} url
   * @return {!Promise}
   */
  attachFrame: async function(page, frameId, url) {
    await page.evaluate(attachFrame, frameId, url);

    function attachFrame(frameId, url) {
      let frame = document.createElement('iframe');
      frame.src = url;
      frame.id = frameId;
      document.body.appendChild(frame);
      return new Promise(x => frame.onload = x);
    }
  },

  /**
   * @param {!Page} page
   * @param {string} frameId
   * @return {!Promise}
   */
  detachFrame: async function(page, frameId) {
    await page.evaluate(detachFrame, frameId);

    function detachFrame(frameId) {
      let frame = document.getElementById(frameId);
      frame.remove();
    }
  },

  /**
   * @param {!Page} page
   * @param {string} frameId
   * @param {string} url
   * @return {!Promise}
   */
  navigateFrame: async function(page, frameId, url) {
    await page.evaluate(navigateFrame, frameId, url);

    function navigateFrame(frameId, url) {
      let frame = document.getElementById(frameId);
      frame.src = url;
      return new Promise(x => frame.onload = x);
    }
  },

  /**
   * @param {!Frame} frame
   * @param {string=} indentation
   * @return {string}
   */
  dumpFrames: function(frame, indentation) {
    indentation = indentation || '';
    let result = indentation + frame.url();
    for (let child of frame.childFrames())
      result += '\n' + utils.dumpFrames(child, '    ' + indentation);
    return result;
  },
};
