import { renderWithProviders } from "@tests/test-utils";
import React from "react";

import { AboutScreen } from "../AboutScreen";

/* Usually not fond of snapshots but this is a screen only rendering text */
describe("<AboutScreen />", () => {
  it.skip("Should match snapshot", () => {
    const component = renderWithProviders(<AboutScreen />);

    expect(component).toMatchSnapshot();
  });
});
