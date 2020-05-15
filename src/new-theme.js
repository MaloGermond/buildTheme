import sketch from "sketch";
import * as React from "react";
import * as PropTypes from "prop-types";
import { render, Artboard, Text, View, TextStyles } from "react-sketchapp";

import theme from "./OI-theme.json";

const Document = ({ token }) => (
  <Artboard
    name="Logo"
    style={{
      width: 256,
      height: 64
    }}
  ></Artboard>
);

Document.propTypes = {
  token: PropTypes.objectOf(PropTypes.string).isRequired
};

export default () => {
  let textStyleFamily = {};
  let styles = {};

  const regexVar = RegExp("[$]((.*)[/](.*)[/](.*))", "g"); // Regex for variable on manifest.json
  const regexStyle = RegExp("on(.*)[/](.*)[/](.*)", "g"); // Regex for textSytle
  const regexHex = RegExp("#.{3,8}", "g"); // Regex for hexadecimal color

  console.info("");
  console.info("===========================================");
  console.info("");
  console.info("🚀 You are creating new text style from a json 🚀");
  console.info("");
  console.info("===========================================");

  const fontFamily = theme.fonts.__base__.fontFamily;
  //console.log(theme);

  console.info("📈 --- Create the text hiararchy ---");
  for (let categorie in theme) {
    if (categorie == "fonts") {
      for (let style in theme.fonts) {
        if (style != "__base__") {
          //console.log(style);
          //console.log(theme.fonts[style]);
          let textStyle = new Object();
          textStyle.fontFamily = fontFamily;
          textStyle.fontSize = theme.fonts[style].fontSize;
          textStyle.fontWeight = String(
            getSketchWeight(theme.fonts[style].fontWeight)
          );
          textStyle.lineHeight = theme.fonts[style].lineHeight;
          textStyle.letterSpacing = theme.fonts[style].letterSpacing;
          textStyleFamily[style] = textStyle;
        }
      }
    }
  }

  let textStyleGen = 0;

  console.info("📏 --- Create sketch text style ---");
  for (let categorie in theme) {
    if (categorie == "colors") {
      for (let color in theme.colors) {
        if (color != "__base__") {
          if (regexStyle.test(color)) {
            textStyleGen++;

            for (let text in textStyleFamily) {
              let textStyle = new Object();
              let textStyleLabel = String(text + "/" + color);
              //textStyle.color = theme.colors[style].lineHeight;

              if (theme.colors[color].__inherit__ != null) {
                let rawValue = theme.colors[color].__inherit__;
                let value = String(rawValue).substring(1);
                // console.log("The raw value :" + value);
                // console.log(getRawValue(value));
                value = getRawValue(value);

                if (regexStyle.test(color)) {
                  // console.log("refinement");
                  value = getRawValue(value);
                }
                // console.log("value : " + value);
                // console.log(regexHex.test(value));
                if (regexHex.test(value)) {
                  textStyle.color = value;
                } else {
                  textStyle.color = "#ff00ff";
                }
              }
              Object.assign(textStyle, textStyleFamily[text]);
              styles[textStyleLabel] = textStyle;
            }

            // if (regexVar.test(theme.colors[color].color)) {
            //   console.log("Found a variable");
            //   let rawvalue = theme.colors[color].color.match(regexVar);
            //   // let value = String(rawValue).substring(1);
            //   console.log(rawsvalue);
            // }
          }
          // console.log(regexStyle.test(color)); // without this line there's missing style and I don't no why  ...
        }
      }
    }
  }

  console.info(
    "✅ --- " + textStyleGen + " Text style has been generated --- "
  ); //wes should have 124 text  style generate

  if (textStyleGen != 124) {
    console.error(
      "🚫--- Some textStyle are missing. textStyleGen :" +
        textStyleGen +
        "/124  --- "
    );
  }

  console.info("📐 --- Create sketch layer style ---");
  // for (let categorie in theme) {
  //   if (categorie == "colors") {
  //     for (let color in theme.colors) {
  //       if (color != "__base__") {
  //         // if (regexHex.test(theme.colors[color].color)) {
  //         //   console.log("Found an hex");
  //         // }
  //         }
  //
  //       }
  //     }
  //   }
  // }
  console.info("☑️ --- Layer style not yet implemented ---");

  // console.log(getRawValue("$colors.surface900.color"));

  console.log(styles);
  TextStyles.create(styles, {
    // TextStyles.create(textStyleFamily, {
    context: Document,
    clearExistingStyles: true
  });

  console.log("✅ --- Layer style created ---");

  render(<Document token={theme} />, sketch.getSelectedDocument().selectedPage);
};

// textStyle.fontWeight = getSketchWeight("bold");
//theme.fonts[style].fontWeight

function getRawValue(value) {
  const regexHex = RegExp("#.{3,8}", "g");
  const regexVar = RegExp("[$].*", "g");

  let rawValue;
  // console.log("The value  is: " + value);

  if (regexHex.test(value)) {
    // console.log("This is a color");
    return value;
  }
  if (regexVar.test(value)) {
    // console.log("This is a json variable");
    value = value.match(regexVar);
    value = String(value[0]).substring(1, String(value[0]).length - 6); // Outch  that an ugly fonction sry
    // return getRawValue(value); // Doesn't work and I don't know why
  }
  if (RegExp("(.*[.])(.*)", "g").test(value)) {
    // console.log("This is a NESTED value ");
    // colors.onalias/default
    value = String(value).substring(7);
  }

  // console.log("This is a variable");
  // console.log(theme.colors[value]);
  rawValue = theme.colors[value].color;
  return rawValue;
}

function getSketchWeight(weight) {
  let sketchValue;
  switch (weight) {
    case "light":
      sketchValue = 3;
      break;
    case "regular":
      sketchValue = 5;
      break;
    case "medium":
      sketchValue = 7;
      break;
    case "semibold":
      sketchValue = 8;
      break;
    case "bold":
      sketchValue = 9;
      break;
    case "black":
      sketchValue = 11;
      break;
    default:
      console.log(
        "############ Font weight non connu, on remplace par regular"
      );
      sketchValue = 5;
      break;
  }
  return sketchValue;
}
// "h1/onSurfaceLow/default/high": {
//   fontSize: theme.fonts.h1.fontSize,
//   fontFamily: fontFamily,
//   lineHeight: theme.fonts[1].lineHeight,
//   fontWeight: theme.fonts.h1.fontWeight,
//   color: theme.colors.surface900.color
// },
// Body: {
//   fontSize: 16,
//   fontFamily: theme.fonts.__base__.fontFamily,
//   lineHeight: 22
// },
