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
