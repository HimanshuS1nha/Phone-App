import {Alert, Text} from 'react-native';
import React, {useState} from 'react';
import SafeView from '../components/SafeView';
import Header from '../components/Header';
import {useFavourites} from '../hooks/useFavourites';
import {FlashList} from '@shopify/flash-list';
import ContactPreview from '../components/ContactPreview';
import DropdownMenu from '../components/DropdownMenu';
import {useNavigation} from '@react-navigation/native';
import tw from 'twrnc';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamsList} from '../types';

const FavouritesScreen = () => {
  const {favourites, deleteAllFavourites, getFavourites} = useFavourites();
  const navigation =
    useNavigation<
      NativeStackNavigationProp<RootStackParamsList, 'Favourites'>
    >();

  const [isVisible, setIsVisible] = useState(false);
  return (
    <SafeView>
      <Header title="Favourites" setIsVisible={setIsVisible} />
      <DropdownMenu
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        options={[
          {
            title: 'Clear favourites',
            action: () => {
              Alert.alert('Warning', 'Do you want to remove all favourites?', [
                {
                  text: 'No',
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    if (favourites.length > 0) {
                      deleteAllFavourites().then(res => {
                        if (res) {
                          getFavourites();
                        } else {
                          Alert.alert('Error', 'Some error occured.');
                        }
                      });
                    }
                  },
                },
              ]);
            },
          },
          {title: 'Settings', action: () => navigation.navigate('Settings')},
        ]}
      />
      {favourites.length > 0 ? (
        <FlashList
          data={favourites}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({item}) => {
            return <ContactPreview contact={item} />;
          }}
          estimatedItemSize={75}
        />
      ) : (
        <Text style={tw`text-rose-600 text-base font-medium text-center`}>
          No data to show
        </Text>
      )}
    </SafeView>
  );
};

export default FavouritesScreen;
