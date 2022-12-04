import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
// import styled from 'styled-components/native';

import { Text } from '@app/components/Text';

type Props = {
  currentIndex: number;
};

export const NewEntryTabs = ({ scrollToThing }: Props) => {
  const [index, setIndex] = React.useState(0);
  const [buttonWidth, setButtonWidth] = React.useState(0);

  return null;

  const animatedStyle = useAnimatedStyle(() => {
    const translateXValue = withSpring(buttonWidth * index, {
      damping: 15,
      velocity: 500,
    });

    return {
      height: 30,
      //   alignSelf: 'flex-start',
      borderRadius: 5,
      transform: [{ translateX: translateXValue }],
    };
  }, [index, buttonWidth]);

  return (
    <TabsContainer>
      <Container>
        <Animated.View style={[styles.currentTabBackground, animatedStyle]} />
        <Labels>
          <LabelContainer
            onPress={() => {
              setIndex(0);
              scrollToThing('new-entry');
            }}
            onLayout={({ nativeEvent }) => setButtonWidth(nativeEvent.layout.width)}>
            <Text fontSize="lg" bold>
              New
            </Text>
          </LabelContainer>
          <LabelContainer
            onPress={() => {
              setIndex(1);
              scrollToThing('saved-entry');
            }}>
            <Text fontSize="lg" bold>
              Saved
            </Text>
          </LabelContainer>
        </Labels>
      </Container>
    </TabsContainer>
  );
};

// const TabsContainer = styled.View`
//   padding: 10px;
//   width: 50%;
//   align-self: center;
//   background-color: ${({ theme }) => theme.colours.offWhite};
//   border-radius: 5px;
// `;

// const Container = styled.View`
//   justify-content: center;
// `;

// const LabelContainer = styled.TouchableOpacity`
//   flex: 1;
//   align-items: center;
//   justify-content: center;
// `;

// const Labels = styled.View`
//   flex-direction: row;

//   justify-content: space-between;
//   width: 100%;
// `;

const styles = StyleSheet.create({
  currentTabBackground: {
    backgroundColor: '#fff',
    width: '50%',
    position: 'absolute',
  },
});
