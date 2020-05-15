import sketch from "sketch";
import * as React from "react";
import * as PropTypes from "prop-types";
import {
  render,
  Artboard,
  Document,
  Page,
  Text,
  View,
  TextStyles
} from "react-sketchapp";

// <Document> swrapper is required if you want to use multiple pages
const App = () => (
  <Page name="Theme">
    <Artboard
      name="Text styles"
      style={{
        width: 1024
      }}
    >
      <Header label="Text-styles" />
      <SampleText label="h1">Hello</SampleText>
    </Artboard>
  </Page>
);

const Header = ({ label }) => (
  <View
    name={label}
    style={{
      marginTop: 32,
      marginBotton: 32,
      marginLeft: 32,
      marginRight: 32
    }}
  >
    <Text
      name={"Size"}
      style={{
        fontSize: 64,
        fontFamily: "roboto",
        fontWeight: "bold",
        color: "#041322"
      }}
    >
      {label}
    </Text>
    <View
      name="Divider"
      style={{
        backgroundColor: "#041322",
        height: 1,
        marginTop: 16,
        marginBotton: 32
      }}
    ></View>
  </View>
);

const SampleText = ({ label, style }) => (
  <View
    name={"groupe " + label}
    style={{
      flexDirection: "row"
    }}
  >
    <Text name={"Size"}>{label}</Text>
    <Text
      name={"content"}
      style={{
        fontSize: 22,
        fontFamily: "roboto",
        fontWeight: "bold",
        color: "#123456",
        marginLeft: 16
      }}
    >
      This is a header
    </Text>
  </View>
);

export default () => {
  const document = sketch.getSelectedDocument();
  const sharedTextStyles = document.sharedTextStyles;
  console.log(sharedTextStyles.length);

  for (let style in sharedTextStyles) {
    console.log(style);
  }

  //const styles = StyleSheet.create(sharedTextStyles);
  //console.log(styles);

  render(<App />, sketch.getSelectedDocument().selectedPage);
};

// {Object.keys(token.fonts).map(style => (
//   <SampleText label={style} style={style}></SampleText>
// ))}
//
// <SampleText
//   name={Object.keys(token.fonts)[1]}
//   style={token.fonts.h6}
// ></SampleText>

// style={TextStyles.get("header")}
