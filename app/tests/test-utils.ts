import { render as rntlRender, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Platform } from 'react-native';

export const renderWithProviders = (component: React.ReactElement) => {
  const Wrapper = ({ children }: React.PropsWithChildren<Record<string, unknown>>) => {
    return children;
  };

  return { ...rntlRender(component, { wrapper: Wrapper }) };
};

export const setPlatform = function (platform: 'android' | 'ios' | 'emulator') {
  Object.defineProperty(Platform, 'OS', {
    get: jest.fn(() => platform),
  });
};

export const setPlatformVersion = function (version: string) {
  Object.defineProperty(Platform, 'Version', {
    get: jest.fn(() => version),
  });
};

export const waitForSideEffects = () => waitFor(() => true);
