class Helpers {
  static selectMuiDropdownOption(selectLocator, optionText, optionsContainerRole = "listbox") {
    cy.log(`Opening dropdown: ${selectLocator}`);
    cy.get(selectLocator)
      .should("be.visible")
      .and("not.have.class", "Mui-disabled")
      .click();

    const containerSelector = `ul[role='${optionsContainerRole}']`;
    cy.get(containerSelector, { timeout: 10000 }).should("be.visible");

    cy.get(containerSelector)
      .contains(".MuiMenuItem-root", optionText)
      .should("be.visible")
      .click();

    cy.get(containerSelector).should("not.exist");
    cy.log(`Selected "${optionText}" from ${selectLocator}`);
  }

  static selectOptionNearLabel(labelText, optionText, maxLevels = 6) {
  cy.contains(labelText).then(($label) => {
    let current = $label[0];
    let found = null;

    for (let i = 0; i < maxLevels && current; i++) {
      current = current.parentElement;
      if (!current) break;
      const trigger = current.querySelector("div[role='button'][aria-haspopup='listbox']");
      if (trigger) {
        found = trigger;
        break;
      }
    }

    expect(
      found,
      `Dropdown trigger near label "${labelText}" should be found within ${maxLevels} ancestor levels`
    ).to.not.be.null;
    cy.wrap(found).scrollIntoView().should("be.visible").click({ force: true });
  });

  cy.get("ul[role='listbox']", { timeout: 10000 }).should("exist");

  cy.get("ul[role='listbox']")
    .contains(".MuiMenuItem-root", optionText)
    .then(($el) => {
      $el[0].scrollIntoView({ block: "center" });
    });

  cy.get("ul[role='listbox']")
    .contains(".MuiMenuItem-root", optionText)
    .should("be.visible")
    .click({ force: true });

  cy.get("ul[role='listbox']").should("not.exist");
}

  static selectRandomMuiOption(selectLocatorOrElement, maxRetries = 3) {
    const getTrigger = () =>
      typeof selectLocatorOrElement === "string"
        ? cy.get(selectLocatorOrElement)
        : cy.wrap(selectLocatorOrElement);

    const normalize = (str) => str.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();

    const attemptSelect = (attempt) => {
      let placeholderText = "";

      getTrigger()
        .then(($trigger) => {
          placeholderText = normalize($trigger.text());
        })
        .scrollIntoView()
        .should("be.visible")
        .click({ force: true });

      // Assert the listbox itself appears, rather than waiting a fixed time
      cy.get("body").then(($body) => {
        const hasListbox = $body.find("ul[role='listbox']").length > 0;

        if (!hasListbox) {
          cy.log(`Listbox did not open (attempt ${attempt}) — retrying`);
          if (attempt < maxRetries) {
            attemptSelect(attempt + 1);
          }
          return;
        }

        cy.get("ul[role='listbox']", { timeout: 10000 })
          .find(".MuiMenuItem-root")
          .then(($allOptions) => {
            const allTexts = $allOptions.map((_, el) => normalize(Cypress.$(el).text())).get();

            const selectableIndexes = [];
            allTexts.forEach((text, idx) => {
              if (text === "") return;
              if (placeholderText !== "" && text === placeholderText) return;
              if (placeholderText === "" && /^select\b/i.test(text)) return;
              selectableIndexes.push(idx);
            });

            if (selectableIndexes.length === 0) {
              cy.log(`No non-placeholder options found (attempt ${attempt}) — retrying`);
              cy.get("body").type("{esc}");
              if (attempt < maxRetries) {
                attemptSelect(attempt + 1);
              }
              return;
            }

            const randomPick =
              selectableIndexes[Math.floor(Math.random() * selectableIndexes.length)];
            const selectedText = allTexts[randomPick];

            cy.log(`Trigger placeholder was: "${placeholderText || "(blank/invisible)"}"`);
            cy.log(`Randomly selecting (excluding placeholder): "${selectedText}"`);

            cy.wrap($allOptions.eq(randomPick)).click({ force: true });
          });
      });
    };

    attemptSelect(1);

    cy.get("ul[role='listbox']").should("not.exist");
  }

  static selectScrollableOptionByValue(
  triggerLocatorOrElement,
  value,
  maxScrollAttempts = 20,
  maxClickRetries = 5
) {
  const getTrigger = () =>
    typeof triggerLocatorOrElement === "string"
      ? cy.get(triggerLocatorOrElement)
      : cy.wrap(triggerLocatorOrElement);

  const attemptFullSelection = (clickAttempt) => {
    cy.get("body").then(($body) => {
      if ($body.find("ul[role='listbox']").length > 0) {
        cy.get("body").type("{esc}");
        cy.get("ul[role='listbox']").should("not.exist");
      }
    });

    getTrigger().then(($trigger) => {
      $trigger[0].scrollIntoView({ block: "center", inline: "center" });
    });

    getTrigger().should("be.visible").click({ force: true });

    cy.get("ul[role='listbox']", { timeout: 10000 }).should("exist");

    const attemptScroll = (attempt, lastScrollTop) => {
      if (attempt > maxScrollAttempts) {
        cy.log(`Reached max scroll attempts (${maxScrollAttempts}) for value "${value}"`);
        return;
      }

      cy.get("ul[role='listbox']").then(($listbox) => {
        const found = $listbox.find(`li[data-value='${value}']`).length > 0;
        if (found) {
          cy.log(`Option "${value}" found after ${attempt} scroll attempt(s)`);
          return;
        }

        const listboxEl = $listbox[0];
        const newScrollTop = listboxEl.scrollTop + listboxEl.clientHeight;
        listboxEl.scrollTop = newScrollTop;
        listboxEl.dispatchEvent(new Event("scroll", { bubbles: true }));

        if (listboxEl.scrollTop === lastScrollTop) {
          cy.log(`Reached bottom of listbox, option "${value}" not found`);
          return;
        }

        attemptScroll(attempt + 1, listboxEl.scrollTop);
      });
    };

    attemptScroll(0, -1);

    cy.get(`li[data-value='${value}']`, { timeout: 10000 }).then(($option) => {
      $option[0].scrollIntoView({ block: "center", inline: "center" });
    });

    cy.get(`li[data-value='${value}']`).should("be.visible").click({ force: true });

    // Give the close-state assertion its own retry window instead of a one-shot body check —
    // this correctly waits out the popup's close transition instead of misreading mid-animation state
    cy.get("body", { timeout: 5000 }).should(($body) => {
      const stillOpen = $body.find("ul[role='listbox']").length > 0;
      if (stillOpen && clickAttempt >= maxClickRetries) {
        throw new Error(
          `Failed to select value "${value}" after ${maxClickRetries} attempts — listbox would not close`
        );
      }
      expect(stillOpen, "listbox should close after selection").to.be.false;
    });

    cy.log(`Successfully selected value "${value}"`);
  };

  attemptFullSelection(1);
}
}

export default Helpers;