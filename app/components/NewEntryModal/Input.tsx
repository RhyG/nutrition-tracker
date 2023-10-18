import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { StyleSheet, TextInputProps } from 'react-native';

import { useThemedStyles } from '@app/hooks/useThemedStyles';
import { Theme } from '@app/theme';

import { Text } from '../Text';

export const Input = forwardRef(
  (
    {
      field,
      onChangeText,
      keyboardType = 'numeric',
    }: { field: string; onChangeText: (field: string, text: string) => void; keyboardType?: TextInputProps['keyboardType'] },
    ref,
  ) => {
    const { styles } = useThemedStyles(stylesFn);

    const lowercaseFieldName = field.toLowerCase();

    return (
      <>
        <Text preset="formHelper" style={styles.text}>
          {field}
        </Text>
        <BottomSheetTextInput
          style={styles.input}
          onChangeText={text => onChangeText(lowercaseFieldName, text)}
          // @ts-expect-error this type is gross, not sure how to fix
          ref={ref}
          testID={`${lowercaseFieldName}-input`}
          // defaultValue="0"
          keyboardType={keyboardType}
        />
      </>
    );
  },
);

const stylesFn = ({ colours, typography }: Theme) =>
  StyleSheet.create({
    text: {
      marginBottom: 1,
    },
    input: {
      backgroundColor: colours.palette.neutral200,
      borderRadius: 6,
      fontSize: typography.sizes.sm,
      padding: 8,
      color: '#000',
    },
  });
