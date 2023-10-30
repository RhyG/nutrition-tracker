import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@app/theme';

import { Text } from '../../Text';

type Props = { field: string; onChangeText: (field: string, text: string) => void; keyboardType?: TextInputProps['keyboardType']; hideUnit?: boolean };

export const Input = forwardRef(({ field, onChangeText, keyboardType = 'numeric', hideUnit }: Props, ref) => {
  const {
    styles,
    theme: { colours },
  } = useThemedStyles(stylesFn);

  const lowercaseFieldName = field.toLowerCase();

  return (
    <>
      <Text preset="formHelper" style={styles.text}>
        {field}
      </Text>
      <View style={styles.inputContainer}>
        <BottomSheetTextInput
          style={styles.input}
          onChangeText={text => onChangeText(lowercaseFieldName, text)}
          // @ts-expect-error this type is gross, not sure how to fix
          ref={ref}
          testID={`${lowercaseFieldName}-input`}
          // defaultValue="0"
          keyboardType={keyboardType}
        />
        {!hideUnit ? (
          <Text colour={colours.palette.neutral500} style={styles.unit}>
            g
          </Text>
        ) : null}
      </View>
    </>
  );
});

const stylesFn = ({ colours, typography }: Theme) =>
  StyleSheet.create({
    text: {
      marginBottom: 1,
    },
    inputContainer: {
      backgroundColor: colours.palette.neutral200,
      borderRadius: 6,
      padding: 8,
      flexDirection: 'row',
    },
    input: {
      fontSize: typography.sizes.sm,
      color: colours.text,
      flex: 1,
      marginRight: 2,
    },
    unit: {
      marginLeft: 'auto',
    },
  });
