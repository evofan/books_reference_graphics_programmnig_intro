import * as PIXI from "pixi.js";

/**
 * Define the displayDateText() function using the export statement.
 * @param { object } app reference
 */
export const displayDateText = (app) => {
  
  // Date
  let dt = new Date();
  let year = dt.getFullYear();
  let month = dt.getMonth();
  let day = dt.getDate();
  let week_num = dt.getDay();
  let week_ary = ["Sun", "Mon", "Thu", "Wed", "Thu", "Fri", "Sat"];
  let week = week_ary[week_num];
  let dtText = `${year}.${month + 1}.${day}(${week})`;
  console.log("dtText", dtText); // dtText 2023.4.23.Mon

  // Text
  let textDate = new PIXI.Text(`Today: ${dtText}`, {
    fontFamily: "Arial",
    fontSize: 24,
    // fill: 0x3366cc,
    fill: 0x333333,
    align: "center",
    fontWeight: "bold",
    stroke: "#cccccc",
    strokeThickness: 4,
    dropShadow: false,
    dropShadowColor: "#666666",
    lineJoin: "round"
  });
  textDate.x = 110;
  textDate.y = 10;
  app.stage.addChild(textDate);
}

