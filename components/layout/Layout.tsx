import { View, ScrollView } from 'react-native';
import React, { FC } from 'react';
import tw from 'twrnc'

interface ILayout {
  children: React.ReactNode;
  isScrollView?: boolean;
}

const Layout: FC<ILayout> = ({ children, isScrollView = true }) => {
  const styleCenter = tw`h-full w-full pt-16`

  return (
    <View style={styleCenter}>
      {isScrollView ? <ScrollView>{children}</ScrollView> : children}
    </View>
  );
}

export default Layout;
