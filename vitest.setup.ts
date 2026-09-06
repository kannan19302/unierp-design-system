import "@testing-library/jest-dom/vitest";
import * as matchers from "vitest-axe/matchers";
import { cleanup } from "@testing-library/react";
import { expect, afterEach } from "vitest";

expect.extend(matchers);

/**
 * Unmount and remove every rendered tree between tests.
 *
 * React Testing Library registers this itself — but only if a global
 * `afterEach` exists at the moment `@testing-library/react` is first imported.
 * Here it did not, so nothing was ever torn down: each `render()` appended
 * another copy of the component to `document.body`, and the SECOND assertion in
 * any file that rendered twice hit "found multiple elements".
 *
 * That is the single cause of the long-standing 44-failure baseline in this
 * package — the failures read as component bugs (focus traps not arming, modals
 * "rendering when closed", buttons found twice) and were all the previous
 * test's DOM still being on the page. Registering it explicitly does not depend
 * on import order.
 */
afterEach(cleanup);

// JSDOM does not support HTMLDialogElement showModal and close methods natively.
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
    this.dispatchEvent(new Event("show"));
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}

// JSDOM does not implement HTMLCanvasElement.prototype.getContext natively without the native canvas package.
// Stubbing it provides axe-core and chart calculations a quiet fallback without stderr noise.
if (typeof HTMLCanvasElement !== "undefined") {
  HTMLCanvasElement.prototype.getContext = function () {
    return {
      fillRect: () => {},
      clearRect: () => {},
      getImageData: () => ({ data: new Array(4) }),
      putImageData: () => {},
      createImageData: () => [],
      setTransform: () => {},
      drawImage: () => {},
      save: () => {},
      fillText: () => {},
      restore: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      rotate: () => {},
      arc: () => {},
      fill: () => {},
      measureText: () => ({ width: 0 }),
      transform: () => {},
      rect: () => {},
      clip: () => {},
    } as unknown as RenderingContext;
  };
}

// JSDOM throws an error when getComputedStyle is called with a pseudoElt argument (e.g. ::before/::after).
// Calling without pseudoElt provides axe-core color contrast evaluations a silent fallback style declaration.
if (typeof window !== "undefined") {
  const origGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = function (elt: Element, pseudoElt?: string | null) {
    if (pseudoElt) {
      return origGetComputedStyle.call(this, elt);
    }
    return origGetComputedStyle.call(this, elt);
  };
}


