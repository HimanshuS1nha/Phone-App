import {Contact} from 'react-native-contacts';
import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavouritesType = {
  favourites: Contact[];
  setFavourites: (newFavourites: Contact[]) => void;
  getFavourites: () => Promise<void>;
  deleteAllFavourites: () => Promise<boolean>;
};

export const useFavourites = create<FavouritesType>(set => ({
  favourites: [],
  setFavourites: newFavourites => {
    set({favourites: newFavourites});
  },
  getFavourites: async () => {
    const storedFavourites = await AsyncStorage.getItem('favourites');
    if (storedFavourites) {
      const favourites: Contact[] = JSON.parse(storedFavourites);
      favourites.sort((a, b) => (a.displayName > b.displayName ? 1 : -1));
      set({favourites});
    } else {
      set({favourites: []});
    }
  },
  deleteAllFavourites: async () => {
    try {
      await AsyncStorage.removeItem('favourites');
      return true;
    } catch (error) {
      return false;
    }
  },
}));
