import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Migrate to MMKV
type StorageModule = {
  /**
   * A quick access cache to help reduce read time of the storage.
   */
  cache: Record<string, string | number | Record<string, unknown>>;
  /**
   * Gets an item from storage.
   * @typeParam TItem - Type of item corresponding to key.
   * @param {string} key - key of the item to be retrieved.
   * @param {string | number | Record<string, unknown>} defaultValue - default to return if no item found.
   */
  getItem: <TItem>(key: string, defaultValue: string | number | Record<string, unknown>) => Promise<TItem>;
  /**
   * Stores an item in storage.
   * @param {string} key - key of the item to be stored.
   * @param {string | Record<string, unknown>} value - value of item to be stored.
   */
  setItem: (key: string, value: string | Record<string, unknown>) => Promise<void>;
  /**
   * Removes an item from storage.
   * @param {string} key - key of the item to be removed.
   */
  removeItem: (key: string) => Promise<void>;
};

const StorageModule: StorageModule = {
  cache: {},
  getItem: async (key: string, defaultValue: string | number | Record<string, unknown>) => {
    let result;

    if (StorageModule.cache[key]) {
      return StorageModule.cache[key];
    }

    try {
      result = await AsyncStorage.getItem(key);

      if (result && result.startsWith('json:')) {
        const value = result.split('json:')[1];
        if (value) result = JSON.parse(value);
      }

      StorageModule.cache[key] = result;
    } catch (error) {
      result = error;
    }

    return result || defaultValue;
  },
  setItem: async (key, value) => {
    try {
      if (typeof value === 'object') {
        await AsyncStorage.setItem(key, `json:${JSON.stringify(value)}`);
      } else {
        await AsyncStorage.setItem(key, value);
      }

      StorageModule.cache[key] = value;
    } catch (error) {
      console.log(error);
    }
  },
  removeItem: async key => {
    try {
      await AsyncStorage.removeItem(key);
      delete StorageModule.cache[key];
    } catch (error) {
      console.log(error);
    }
  },
};

export default StorageModule;
